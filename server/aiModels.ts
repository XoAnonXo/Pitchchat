import OpenAI from "openai";
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenAI } from "@google/genai";

// OpenAI setup
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

// Anthropic setup
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Google Gemini setup  
const gemini = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatResponse {
  content: string;
  tokenCount: number;
  citations?: Array<{
    source: string;
    content: string;
    page?: number;
  }>;
}

export type AIModel = 'gpt-4o' | 'gpt-4' | 'gpt-3.5-turbo' | 'o3-mini' | 'claude-3-sonnet' | 'claude-3-haiku' | 'claude-3-opus' | 'claude-sonnet-4' | 'gemini-pro' | 'gemini-flash';

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: text,
    });
    return response.data[0].embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw new Error("Failed to generate embedding");
  }
}

export async function chatWithAI(
  messages: ChatMessage[],
  context: Array<{
    content: string;
    source: string;
    page?: number;
  }> = [],
  model: AIModel = 'gpt-4o'
): Promise<ChatResponse> {
  try {
    const contextText = context.map(c => 
      `Source: ${c.source}${c.page ? `, page ${c.page}` : ""}\nContent: ${c.content}`
    ).join("\n\n");

    const systemMessage: ChatMessage = {
      role: "system",
      content: `You are an AI assistant helping investors understand a startup's pitch. Use the provided context to answer questions accurately. If the information isn't in the context, say so clearly.

Context from documents:
${contextText}

Guidelines:
- Answer based primarily on the provided context
- Be concise but comprehensive
- Include relevant citations when referencing specific information
- If asked about information not in the context, acknowledge the limitation
- Maintain a professional, investor-focused tone`
    };

    const allMessages = [systemMessage, ...messages];

    // Route to appropriate AI model
    if (model.startsWith('gpt-') || model.startsWith('o3-')) {
      return await chatWithOpenAI(allMessages, model);
    } else if (model.startsWith('claude-')) {
      return await chatWithClaude(allMessages, model);
    } else if (model.startsWith('gemini-')) {
      return await chatWithGemini(allMessages, model);
    } else {
      throw new Error(`Unsupported model: ${model}`);
    }
  } catch (error) {
    console.error("Error in AI chat:", error);
    throw new Error("Failed to get AI response");
  }
}

async function chatWithOpenAI(messages: ChatMessage[], model: AIModel): Promise<ChatResponse> {
  const openaiModel = model === 'o3-mini' ? 'o3-mini' : model;
  
  const response = await openai.chat.completions.create({
    model: openaiModel,
    messages: messages,
    temperature: 0.3,
    max_tokens: 1000,
  });

  const content = response.choices[0].message.content || "";
  const tokenCount = response.usage?.total_tokens || 0;

  return { content, tokenCount };
}

async function chatWithClaude(messages: ChatMessage[], model: AIModel): Promise<ChatResponse> {
  const claudeModel = model === 'claude-sonnet-4' ? 'claude-sonnet-4-20250514' : 
                     model === 'claude-3-sonnet' ? 'claude-3-5-sonnet-20241022' :
                     model === 'claude-3-haiku' ? 'claude-3-5-haiku-20241022' :
                     model === 'claude-3-opus' ? 'claude-3-opus-20240229' :
                     'claude-sonnet-4-20250514';

  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');

  const response = await anthropic.messages.create({
    model: claudeModel,
    max_tokens: 1000,
    system: systemMessage?.content || "",
    messages: userMessages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    })),
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : "";
  const tokenCount = response.usage?.input_tokens + response.usage?.output_tokens || 0;

  return { content, tokenCount };
}

async function chatWithGemini(messages: ChatMessage[], model: AIModel): Promise<ChatResponse> {
  const geminiModel = model === 'gemini-pro' ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
  
  const systemMessage = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');
  
  const prompt = userMessages.map(m => `${m.role}: ${m.content}`).join('\n');

  const response = await gemini.models.generateContent({
    model: geminiModel,
    config: {
      systemInstruction: systemMessage?.content || "",
    },
    contents: prompt,
  });

  const content = response.text || "";
  const tokenCount = Math.ceil(content.length / 4); // Rough estimate

  return { content, tokenCount };
}
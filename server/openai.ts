import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
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
  }> = []
): Promise<ChatResponse> {
  try {
    // Prepare context from retrieved chunks
    const contextText = context.map(c => 
      `Source: ${c.source}${c.page ? `, page ${c.page}` : ""}\nContent: ${c.content}`
    ).join("\n\n");

    // System message with context
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

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: allMessages,
      temperature: 0.3,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content || "";
    const tokenCount = response.usage?.total_tokens || 0;

    // Extract citations from context that were likely referenced
    const citations = context.filter(c => 
      content.toLowerCase().includes(c.source.toLowerCase().split('.')[0])
    ).map(c => ({
      source: c.source,
      content: c.content.substring(0, 200) + "...",
      page: c.page,
    }));

    return {
      content,
      tokenCount,
      citations: citations.length > 0 ? citations : undefined,
    };
  } catch (error) {
    console.error("Error in chat completion:", error);
    throw new Error("Failed to generate AI response");
  }
}

export async function summarizeDocument(text: string, filename: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that creates concise summaries of business documents. Focus on key points that would be relevant to investors."
        },
        {
          role: "user",
          content: `Please summarize the following document "${filename}":\n\n${text.substring(0, 4000)}`
        }
      ],
      temperature: 0.3,
      max_tokens: 300,
    });

    return response.choices[0].message.content || "Summary not available";
  } catch (error) {
    console.error("Error summarizing document:", error);
    return "Summary not available";
  }
}

import fs from "fs/promises";
import path from "path";
import XLSX from "xlsx";
import { storage } from "./storage";
import { generateEmbedding, summarizeDocument } from "./openai";
import type { InsertDocument, InsertChunk } from "@shared/schema";
import { calculatePlatformCost } from "./pricing";
import { sendDocumentProcessed } from "./brevo";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

// Ensure upload directory exists
async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR);
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  }
}

export async function saveUploadedFile(
  buffer: Buffer,
  originalName: string,
  mimeType: string
): Promise<string> {
  await ensureUploadDir();
  
  const filename = `${Date.now()}-${originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  const filepath = path.join(UPLOAD_DIR, filename);
  
  await fs.writeFile(filepath, buffer);
  return filename;
}

export async function processDocument(documentId: string): Promise<void> {
  try {
    const document = await storage.getDocument(documentId);
    if (!document) {
      throw new Error("Document not found");
    }

    // Update status to processing
    await storage.updateDocument(documentId, { status: "processing" });

    const filepath = path.join(UPLOAD_DIR, document.filename);
    const content = await extractTextFromFile(filepath, document.mimeType);
    
    if (!content || content.trim().length === 0) {
      await storage.updateDocument(documentId, { 
        status: "failed",
      });
      return;
    }

    // Split content into chunks
    const chunks = splitIntoChunks(content, 1000); // ~1000 characters per chunk
    
    console.log(`Processing ${document.originalName}: ${chunks.length} chunks from ${content.length} chars`);
    if (chunks.length > 0) {
      console.log("First chunk preview:", chunks[0].substring(0, 200));
    }
    
    // Process each chunk
    let totalTokens = 0;
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await generateEmbedding(chunk);
      
      const chunkData: InsertChunk = {
        documentId,
        content: chunk,
        embedding,
        metadata: {
          filename: document.originalName,
          chunkIndex: i,
        },
        tokenCount: estimateTokens(chunk),
        chunkIndex: i,
      };
      
      await storage.createChunk(chunkData);
      totalTokens += chunkData.tokenCount;
    }

    // Calculate platform cost for embeddings
    const platformCost = calculatePlatformCost(totalTokens, 'embedding');
    
    // Update document with completion status
    await storage.updateDocument(documentId, {
      status: "completed",
      tokens: totalTokens,
      pageCount: estimatePageCount(content),
      // Store cost for tracking (optional, but useful for analytics)
    });

    // Send document processed notification email
    try {
      const project = await storage.getProject(document.projectId);
      if (project) {
        const user = await storage.getUser(project.userId);
        if (user?.email) {
          sendDocumentProcessed(user.email, {
            fileName: document.originalName,
            projectName: project.name,
            pagesProcessed: estimatePageCount(content),
            tokensUsed: totalTokens,
            projectId: document.projectId,
          }).catch(err => console.error('Failed to send document processed email:', err));
        }
      }
    } catch (emailError) {
      console.error('Error sending document processed email:', emailError);
    }

  } catch (error) {
    console.error("Error processing document:", error);
    await storage.updateDocument(documentId, { 
      status: "failed",
    });
    throw error;
  }
}

async function extractTextFromFile(filepath: string, mimeType: string): Promise<string> {
  try {
    // For MVP, we'll handle text files and basic extraction
    // In production, you'd use libraries like pdf-parse, mammoth, etc.
    
    if (mimeType === "text/plain" || mimeType === "text/markdown") {
      const buffer = await fs.readFile(filepath);
      return buffer.toString("utf-8");
    }
    
    if (mimeType === "application/pdf") {
      try {
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
        const dataBuffer = await fs.readFile(filepath);
        
        // Convert Buffer to Uint8Array as required by pdfjs-dist
        const uint8Array = new Uint8Array(dataBuffer);
        
        // Load the PDF document
        const loadingTask = pdfjsLib.getDocument({ data: uint8Array });
        const pdfDocument = await loadingTask.promise;
        
        let fullText = '';
        const numPages = pdfDocument.numPages;
        
        // Extract text from each page
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdfDocument.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n\n';
        }
        
        return fullText.trim();
      } catch (error) {
        console.error("Error parsing PDF:", error);
        throw new Error("Failed to extract text from PDF");
      }
    }
    
    if (mimeType.includes("spreadsheet") || mimeType.includes("excel")) {
      try {
        console.log("Processing Excel file:", { filepath, mimeType });
        const buffer = await fs.readFile(filepath);
        const workbook = XLSX.read(buffer, { type: "buffer" });
        
        let fullText = '';
        
        // Iterate through all sheets
        workbook.SheetNames.forEach((sheetName) => {
          fullText += `\n=== Sheet: ${sheetName} ===\n\n`;
          
          const worksheet = workbook.Sheets[sheetName];
          // Convert sheet to CSV format for text extraction
          const csvData = XLSX.utils.sheet_to_csv(worksheet, {
            blankrows: false,
            skipHidden: true,
          });
          
          fullText += csvData + '\n';
        });
        
        console.log("Excel extraction complete. Text length:", fullText.length);
        console.log("First 500 chars:", fullText.substring(0, 500));
        
        return fullText.trim();
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        throw new Error("Failed to extract text from Excel file");
      }
    }
    
    if (mimeType.includes("word") || mimeType.includes("document")) {
      // For MVP, return placeholder - in production use mammoth
      return "Word document extraction not yet implemented in MVP. Please use text files for testing.";
    }
    
    throw new Error(`Unsupported file type: ${mimeType}`);
  } catch (error) {
    console.error("Error extracting text from file:", error);
    throw error;
  }
}

function cleanTextForDatabase(text: string): string {
  // Remove null bytes and other invalid UTF-8 sequences
  return text
    .replace(/\0/g, '') // Remove null bytes
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ' ') // Replace control characters with space except \t, \n, \r
    .replace(/[^\x00-\x7F\u0080-\uFFFF]/g, '') // Remove invalid Unicode
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function splitIntoChunks(text: string, chunkSize: number): string[] {
  // Clean the text first to remove invalid bytes
  const cleanedText = cleanTextForDatabase(text);
  const chunks: string[] = [];
  const sentences = cleanedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  let currentChunk = "";
  
  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim();
    
    if (currentChunk.length + trimmedSentence.length > chunkSize) {
      if (currentChunk.length > 0) {
        chunks.push(cleanTextForDatabase(currentChunk.trim()));
        currentChunk = trimmedSentence;
      } else {
        // Single sentence is too long, split it
        chunks.push(cleanTextForDatabase(trimmedSentence.substring(0, chunkSize)));
        currentChunk = trimmedSentence.substring(chunkSize);
      }
    } else {
      currentChunk += (currentChunk.length > 0 ? ". " : "") + trimmedSentence;
    }
  }
  
  if (currentChunk.length > 0) {
    chunks.push(cleanTextForDatabase(currentChunk.trim()));
  }
  
  return chunks;
}

function estimateTokens(text: string): number {
  // Rough estimation: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
}

function estimatePageCount(text: string): number {
  // Rough estimation: 500 words per page, 5 characters per word
  const wordCount = text.length / 5;
  return Math.ceil(wordCount / 500);
}

export async function deleteUploadedFile(filename: string): Promise<void> {
  try {
    const filepath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(filepath);
  } catch (error) {
    console.error("Error deleting file:", error);
    // Don't throw - file might already be deleted
  }
}

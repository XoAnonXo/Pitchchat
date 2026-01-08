import fs from "fs/promises";
import path from "path";

export const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

export async function deleteUploadedFile(filename: string): Promise<void> {
  try {
    const filepath = path.join(UPLOAD_DIR, filename);
    await fs.unlink(filepath);
  } catch (error) {
    console.error("Error deleting file:", error);
    // Don't throw - file might already be deleted
  }
}

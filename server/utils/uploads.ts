import fs from "fs/promises";
import path from "path";

export const UPLOAD_DIR = process.env.UPLOAD_DIR || "./uploads";

export function sanitizeFilename(filename: string): string {
  const base = path.basename(filename);
  const sanitized = base.replace(/[^a-zA-Z0-9._-]/g, "_");
  return sanitized.length > 0 ? sanitized : "file";
}

export function resolveUploadPath(filename: string): string {
  const uploadRoot = path.resolve(UPLOAD_DIR);
  const safeName = sanitizeFilename(filename);
  const resolvedPath = path.resolve(uploadRoot, safeName);

  if (resolvedPath === uploadRoot || resolvedPath.startsWith(`${uploadRoot}${path.sep}`)) {
    return resolvedPath;
  }

  throw new Error("Invalid upload path");
}

export async function deleteUploadedFile(filename: string): Promise<void> {
  try {
    const filepath = resolveUploadPath(filename);
    await fs.unlink(filepath);
  } catch (error) {
    console.error("Error deleting file:", error);
    // Don't throw - file might already be deleted
  }
}

import fs from "fs/promises";
import path from "path";
import { deleteUploadedFile, UPLOAD_DIR } from "../server/utils/uploads";

const DRY_RUN = process.argv.includes("--dry-run");

async function main() {
  if (!process.env.DATABASE_URL && !process.env.DATABASE_URL_POOLER) {
    console.error("DATABASE_URL or DATABASE_URL_POOLER must be set to inspect uploads.");
    process.exitCode = 1;
    return;
  }

  const { db, pool } = await import("../server/db");
  const { documents } = await import("@shared/schema");

  try {
    const uploadsDir = path.resolve(process.cwd(), UPLOAD_DIR);

    let entries: fs.Dirent[];
    try {
      entries = await fs.readdir(uploadsDir, { withFileTypes: true });
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code === "ENOENT") {
        console.log(`Upload directory not found: ${uploadsDir}`);
        return;
      }
      throw error;
    }

    const filesOnDisk = entries.filter((entry) => entry.isFile()).map((entry) => entry.name);
    const rows = await db.select({ filename: documents.filename }).from(documents);
    const referenced = new Set(rows.map((row) => row.filename));
    const orphaned = filesOnDisk.filter((name) => !referenced.has(name));

    console.log(`Upload directory: ${uploadsDir}`);
    console.log(`Files on disk: ${filesOnDisk.length}`);
    console.log(`Files in DB: ${referenced.size}`);
    console.log(`Orphaned files: ${orphaned.length}${DRY_RUN ? " (dry run)" : ""}`);

    for (const filename of orphaned) {
      if (DRY_RUN) {
        console.log(`Would delete: ${filename}`);
        continue;
      }

      await deleteUploadedFile(filename);
      console.log(`Deleted: ${filename}`);
    }
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Orphaned upload cleanup failed:", error);
  process.exitCode = 1;
});

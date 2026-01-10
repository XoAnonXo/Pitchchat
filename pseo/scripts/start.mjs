import { spawn, execSync } from "node:child_process";

const port = process.env.PORT || "3000";

// Run database migrations and seeding at startup (when internal network is available)
async function runMigrationsAndSeed() {
  const hasDatabase = process.env.DATABASE_URL || process.env.PSEO_DATABASE_URL;

  if (!hasDatabase) {
    console.log("[start] No DATABASE_URL set, skipping migrations and seeding");
    return;
  }

  try {
    console.log("[start] Running database migrations...");
    execSync("npm run db:migrate", { stdio: "inherit" });
    console.log("[start] Migrations complete");

    console.log("[start] Running database seeding...");
    execSync("npm run pseo:seed", { stdio: "inherit" });
    console.log("[start] Seeding complete");
  } catch (error) {
    console.error("[start] Migration/seeding failed:", error.message);
    // Continue starting the server even if migrations fail
    // The app may still work with fallback data
  }
}

await runMigrationsAndSeed();

const child = spawn(
  "next",
  ["start", "-p", port],
  {
    stdio: "inherit",
    shell: true,
  }
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});

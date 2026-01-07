import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const matrixPath = path.join(__dirname, "../data/pilot_matrix.json");
const outputPath = path.join(__dirname, "../data/pilot_seed.json");

const matrixRaw = await fs.readFile(matrixPath, "utf8");
const matrix = JSON.parse(matrixRaw);

const defaultQuestions = [
  {
    category: "Problem",
    question: "What is the wedge problem and why does it matter now?",
    answer:
      "Investors want a clear, painful problem and a timing advantage. Anchor the answer in a market shift, regulation, or platform change.",
  },
  {
    category: "Market",
    question: "Who is the primary buyer and how do you reach them efficiently?",
    answer:
      "Name the buyer role, the first channel you dominate, and the path from pilot to paid account.",
  },
  {
    category: "Moat",
    question: "What makes this defensible beyond execution speed?",
    answer:
      "Highlight proprietary data, workflow lock-in, regulatory approvals, or supply chain advantages.",
  },
  {
    category: "Traction",
    question: "What early signals prove pull from the market?",
    answer:
      "Share the strongest signal of demand and how it translates into repeatable pipeline.",
  },
  {
    category: "Economics",
    question: "How will unit economics improve as you scale?",
    answer:
      "Explain how margins improve with learning curves, automation, or better procurement.",
  },
  {
    category: "Roadmap",
    question: "What milestones unlock the next round?",
    answer:
      "Define technical, revenue, and compliance milestones tied to Series A readiness.",
  },
];

const defaultMetrics = [
  {
    label: "Sales cycle length",
    value: "Document pilot to paid conversion timeline",
    note: "Seed and Series A investors expect evidence of repeatability.",
  },
  {
    label: "Pilot conversion rate",
    value: "Track pilots that convert to paid agreements",
    note: "Show the leading indicator that validates the go-to-market motion.",
  },
  {
    label: "Gross margin plan",
    value: "Explain margin expansion levers",
    note: "Investors look for improving margins at scale.",
  },
  {
    label: "Capital intensity",
    value: "Outline capital needs per unit of growth",
    note: "Highlight how automation or scale reduces capital burden.",
  },
];

const defaultObjections = [
  {
    objection: "Adoption cycles are too long for this market.",
    response:
      "Show short-cycle pilots and a path to land-and-expand with reference customers.",
  },
  {
    objection: "The product requires heavy upfront investment.",
    response:
      "Detail staged milestones and how funds unlock measurable de-risking.",
  },
];

const seedPages = matrix.items.map((item) => {
  const base = {
    industry: item.industry,
    stage: item.stage,
    pageType: item.pageType,
    slug: item.path,
    title: item.title,
  };

  if (item.pageType === "investor-questions") {
    return {
      ...base,
      summary: `Key investor questions ${item.stage} ${item.industry} founders should prepare for.`,
      questions: defaultQuestions,
      metrics: defaultMetrics,
      objections: defaultObjections,
      ctaText: "Create your PitchChat room",
    };
  }

  return base;
});

await fs.writeFile(
  outputPath,
  JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      items: seedPages,
    },
    null,
    2
  ),
  "utf8"
);

console.log(`Seeded ${seedPages.length} records -> ${outputPath}`);

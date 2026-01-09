import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const configPath = path.join(__dirname, "../src/data/pilot-config.json");
const outputDir = path.join(__dirname, "../data/projected");

const projectedNote = "Projected target range; update with real data.";
const summarySuffix = {
  investorQuestions:
    "Includes metrics, objections, and preparation notes for the round.",
  pitchDeck:
    "Includes section goals, proof points, and investor expectations for this stage.",
  metricsBenchmarks:
    "Includes target ranges, contextual notes, and what to measure before outreach.",
  diligenceChecklist:
    "Includes a checklist and rationale aligned to investor diligence.",
  investorUpdate:
    "Includes structured sections, KPIs, and asks to keep investors aligned.",
};

const baseQuestions = [
  {
    category: "Problem",
    question: "What is the wedge problem and why does it matter now?",
    answer:
      "Anchor the answer in a clear pain point and a timing advantage tied to market shifts or regulation.",
  },
  {
    category: "Buyer",
    question: "Who is the buyer and how do you reach them efficiently?",
    answer:
      "Name the buyer role, the first channel you win, and the path from pilot to paid.",
  },
  {
    category: "Moat",
    question: "What makes the business defensible beyond speed?",
    answer:
      "Highlight proprietary data, approvals, workflow lock-in, or hard-to-replicate operations.",
  },
  {
    category: "Traction",
    question: "What early signals prove pull from the market?",
    answer:
      "Share the strongest signal of demand and how it translates into repeatable pipeline.",
  },
  {
    category: "Economics",
    question: "How will margins improve as you scale?",
    answer:
      "Explain how unit economics improve with learning curves, automation, or procurement.",
  },
  {
    category: "Roadmap",
    question: "What milestones unlock the next round?",
    answer:
      "Define technical, revenue, and compliance milestones tied to Series A readiness.",
  },
];

const stageQuestions = {
  seed: [
    {
      category: "Validation",
      question: "What proof shows the market will pay for this?",
      answer:
        "Use pilot commitments, LOIs, or usage signals tied to revenue potential.",
    },
    {
      category: "Risk",
      question: "What is the single biggest technical or regulatory risk?",
      answer:
        "Explain the plan to de-risk it within the seed runway.",
    },
    {
      category: "Capital",
      question: "How will the seed round extend runway to key proof points?",
      answer:
        "Tie the round to milestones that unlock Series A readiness.",
    },
  ],
  "series-a": [
    {
      category: "Scale",
      question: "What growth motion will scale after Series A?",
      answer:
        "Show the conversion path and how pipeline scales with repeatable channels.",
    },
    {
      category: "Retention",
      question: "What retention or expansion signals prove durability?",
      answer:
        "Share usage, renewal, or expansion metrics that signal long-term value.",
    },
    {
      category: "Efficiency",
      question: "How will capital efficiency improve post-Series A?",
      answer:
        "Explain how margins and payback improve as operations scale.",
    },
  ],
};

const industryQuestions = {
  aerospace: [
    {
      category: "Regulatory",
      question: "Which certifications or safety milestones unlock commercialization?",
      answer:
        "List the required certifications and the path to achieve them within the runway.",
    },
    {
      category: "Procurement",
      question: "How will you navigate long procurement cycles?",
      answer:
        "Describe pilots, integration strategy, and stakeholder alignment tactics.",
    },
  ],
  hardware: [
    {
      category: "Manufacturing",
      question: "How will you scale manufacturing and manage supply chain risk?",
      answer:
        "Outline partners, tooling plans, and cost-down milestones.",
    },
    {
      category: "Margins",
      question: "How do margins improve after initial production?",
      answer:
        "Show unit cost curves and economies of scale targets.",
    },
  ],
  robotics: [
    {
      category: "Reliability",
      question: "How will you prove reliability at scale?",
      answer:
        "Share field test data, uptime goals, and support strategy.",
    },
    {
      category: "Deployment",
      question: "What is the deployment playbook for new environments?",
      answer:
        "Explain integration steps and time-to-value benchmarks.",
    },
  ],
  chemistry: [
    {
      category: "Scale-up",
      question: "What is the path from lab results to production scale?",
      answer:
        "Define pilot plant milestones and yield targets.",
    },
    {
      category: "Regulatory",
      question: "What approvals or compliance steps are required?",
      answer:
        "List approvals and expected timelines for each phase.",
    },
  ],
  finance: [
    {
      category: "Compliance",
      question: "How will you meet regulatory requirements without slowing growth?",
      answer:
        "Detail compliance roadmap, audits, and risk controls.",
    },
    {
      category: "Distribution",
      question: "What is the go-to-market wedge in a regulated environment?",
      answer:
        "Explain a focused entry segment and partner strategy.",
    },
  ],
  blockchain: [
    {
      category: "Risk",
      question: "How do you manage regulatory uncertainty?",
      answer:
        "Describe legal posture, jurisdiction strategy, and risk mitigation.",
    },
    {
      category: "Security",
      question: "How do you prove protocol or product security?",
      answer:
        "Share audit plans and monitoring systems.",
    },
  ],
  ai: [
    {
      category: "Data",
      question: "What data advantage will compound over time?",
      answer:
        "Explain data sources, collection strategy, and quality controls.",
    },
    {
      category: "Model",
      question: "How will model performance improve as you scale?",
      answer:
        "Outline evaluation metrics, feedback loops, and cost controls.",
    },
    {
      category: "Costs",
      question: "How will inference costs decline with scale?",
      answer:
        "Show optimization plans and unit cost targets tied to growth.",
    },
  ],
};

const baseObjections = [
  {
    objection: "Adoption cycles are too long for this market.",
    response:
      "Show short-cycle pilots and a land-and-expand plan with reference customers.",
  },
  {
    objection: "The product requires heavy upfront investment.",
    response:
      "Detail staged milestones and how capital de-risks the core thesis.",
  },
];

const industryObjections = {
  aerospace: [
    {
      objection: "Regulatory approvals will delay revenue.",
      response:
        "Show a staged certification plan and interim revenue channels.",
    },
  ],
  hardware: [
    {
      objection: "Hardware margins are too low to scale.",
      response:
        "Show cost-down plans and service revenue expansion.",
    },
  ],
  robotics: [
    {
      objection: "Reliability in real-world environments is unproven.",
      response:
        "Highlight field trials and uptime targets with supporting data.",
    },
  ],
  chemistry: [
    {
      objection: "Scale-up from lab to production is risky.",
      response:
        "Define pilot plant milestones and yield improvement plans.",
    },
  ],
  finance: [
    {
      objection: "Compliance overhead will slow growth.",
      response:
        "Show compliance automation and partner-led distribution.",
    },
  ],
  blockchain: [
    {
      objection: "Regulatory uncertainty creates long-term risk.",
      response:
        "Define jurisdiction strategy and compliance safeguards.",
    },
  ],
  ai: [
    {
      objection: "Model moat is weak without proprietary data.",
      response:
        "Explain data strategy and feedback loops that deepen the moat.",
    },
  ],
};

const profiles = {
  deepTech: {
    seed: {
      salesCycle: "6-12 months",
      pilotConversion: "20-35%",
      grossMargin: "40-60%",
      capitalIntensity: "High; 18-24 mo runway",
    },
    "series-a": {
      salesCycle: "4-9 months",
      pilotConversion: "30-45%",
      grossMargin: "55-70%",
      capitalIntensity: "Moderate-High; 18-30 mo runway",
    },
  },
  finance: {
    seed: {
      salesCycle: "4-9 months",
      pilotConversion: "25-40%",
      grossMargin: "50-70%",
      capitalIntensity: "Moderate; compliance 6-12 mo",
    },
    "series-a": {
      salesCycle: "3-6 months",
      pilotConversion: "35-50%",
      grossMargin: "60-75%",
      capitalIntensity: "Moderate; compliance 6-9 mo",
    },
  },
  blockchain: {
    seed: {
      salesCycle: "2-6 months",
      pilotConversion: "20-40%",
      grossMargin: "60-80%",
      capitalIntensity: "Moderate; audits 3-6 mo",
    },
    "series-a": {
      salesCycle: "2-5 months",
      pilotConversion: "30-50%",
      grossMargin: "65-85%",
      capitalIntensity: "Moderate; audits 3-6 mo",
    },
  },
  ai: {
    seed: {
      salesCycle: "1-4 months",
      pilotConversion: "30-50%",
      grossMargin: "65-85%",
      capitalIntensity: "Low-Moderate; infra 20-40% of revenue",
    },
    "series-a": {
      salesCycle: "2-5 months",
      pilotConversion: "35-55%",
      grossMargin: "70-90%",
      capitalIntensity: "Low-Moderate; infra 15-30% of revenue",
    },
  },
};

const industryProfileMap = {
  aerospace: "deepTech",
  hardware: "deepTech",
  robotics: "deepTech",
  chemistry: "deepTech",
  finance: "finance",
  blockchain: "blockchain",
  ai: "ai",
};

const baseDeckSections = [
  {
    title: "Problem",
    goal: "Show the pain and why now matters.",
    guidance: "Quantify the problem with a clear market shift or constraint.",
  },
  {
    title: "Solution",
    goal: "Explain the product in one sentence.",
    guidance: "Focus on the core workflow and the wedge you own.",
  },
  {
    title: "Market",
    goal: "Define the reachable initial market.",
    guidance: "Start with the first buyer segment and a realistic wedge.",
  },
  {
    title: "Traction",
    goal: "Prove early demand signals.",
    guidance: "Highlight pilots, LOIs, or early revenue.",
  },
  {
    title: "Business model",
    goal: "Explain how money is made.",
    guidance: "Show pricing logic tied to value delivered.",
  },
  {
    title: "Moat",
    goal: "Defensibility beyond execution speed.",
    guidance: "Data, IP, approvals, or operational scale.",
  },
  {
    title: "Team",
    goal: "Why this team can win.",
    guidance: "Emphasize domain expertise and execution history.",
  },
];

const industryDeckSections = {
  aerospace: {
    title: "Certification roadmap",
    goal: "Explain safety and certification milestones.",
    guidance: "Show the path to regulatory approval and commercialization.",
  },
  hardware: {
    title: "Manufacturing plan",
    goal: "Describe production and supply chain readiness.",
    guidance: "Highlight partners, tooling, and cost targets.",
  },
  robotics: {
    title: "Reliability validation",
    goal: "Prove system reliability in the field.",
    guidance: "Share testing, uptime goals, and support strategy.",
  },
  chemistry: {
    title: "Scale-up strategy",
    goal: "Demonstrate lab-to-production plan.",
    guidance: "Show yield targets and pilot plant milestones.",
  },
  finance: {
    title: "Compliance strategy",
    goal: "Show regulatory readiness.",
    guidance: "Outline licensing, audits, and risk controls.",
  },
  blockchain: {
    title: "Protocol security",
    goal: "Show security and governance readiness.",
    guidance: "Detail audits, monitoring, and token economics.",
  },
  ai: {
    title: "Data and model strategy",
    goal: "Explain data advantage and model improvements.",
    guidance: "Show evaluation metrics and cost control plan.",
  },
};

const baseChecklist = [
  {
    item: "Current cap table and option pool plan",
    rationale: "Investors validate ownership, dilution, and incentives.",
  },
  {
    item: "Customer pipeline with next steps",
    rationale: "Proves commercial momentum and a clear path to revenue.",
  },
  {
    item: "Product roadmap and milestone plan",
    rationale: "Shows the path to de-risk the core technical thesis.",
  },
  {
    item: "Security or compliance posture",
    rationale: "Critical for regulated or enterprise-heavy markets.",
  },
];

const industryChecklist = {
  aerospace: {
    item: "Certification evidence and safety documentation",
    rationale: "Confirms regulatory progress and risk mitigation.",
  },
  hardware: {
    item: "Manufacturing partners and BOM cost model",
    rationale: "Shows readiness to scale production margins.",
  },
  robotics: {
    item: "Field reliability results and support plan",
    rationale: "Proves uptime targets and deployment readiness.",
  },
  chemistry: {
    item: "Pilot plant scale-up plan and yields",
    rationale: "Validates the path from lab to production.",
  },
  finance: {
    item: "Compliance audits and licensing status",
    rationale: "Demonstrates regulatory readiness for launch.",
  },
  blockchain: {
    item: "Security audits and governance policies",
    rationale: "Mitigates protocol risk and regulatory exposure.",
  },
  ai: {
    item: "Data provenance and model evaluation results",
    rationale: "Supports model reliability and defensibility.",
  },
};

const baseUpdateSections = [
  {
    section: "Highlights",
    content: "Summarize the most meaningful wins since the last update.",
  },
  {
    section: "Key metrics",
    content: "Share the handful of metrics that show momentum and retention.",
  },
  {
    section: "Product",
    content: "List major product milestones and what they unlock next.",
  },
  {
    section: "Go-to-market",
    content: "Explain pipeline progress and conversion velocity.",
  },
  {
    section: "Help needed",
    content: "Ask for specific customer intros or domain expertise.",
  },
];

const industryUpdateSections = {
  aerospace: {
    section: "Regulatory milestones",
    content: "Share certification progress and upcoming approvals.",
  },
  hardware: {
    section: "Manufacturing readiness",
    content: "Summarize production milestones and cost improvements.",
  },
  robotics: {
    section: "Field reliability",
    content: "Report uptime, deployment progress, and support insights.",
  },
  chemistry: {
    section: "Scale-up progress",
    content: "Detail yield improvements and pilot plant milestones.",
  },
  finance: {
    section: "Compliance updates",
    content: "Share regulatory audits and licensing status.",
  },
  blockchain: {
    section: "Security updates",
    content: "Share audit results and protocol health metrics.",
  },
  ai: {
    section: "Model performance",
    content: "Share evaluation results and cost efficiency gains.",
  },
};

function buildMetrics(industry, stage, industryLabel, stageLabel) {
  const profileKey = industryProfileMap[industry] ?? "ai";
  const stageProfile = profiles[profileKey][stage];

  return [
    {
      label: "Sales cycle length",
      value: stageProfile.salesCycle,
      note: `${projectedNote} ${industryLabel} ${stageLabel}.`,
    },
    {
      label: "Pilot conversion rate",
      value: stageProfile.pilotConversion,
      note: `${projectedNote} ${industryLabel} ${stageLabel}.`,
    },
    {
      label: "Gross margin trajectory",
      value: stageProfile.grossMargin,
      note: `${projectedNote} ${industryLabel} ${stageLabel}.`,
    },
    {
      label: "Capital intensity",
      value: stageProfile.capitalIntensity,
      note: `${projectedNote} ${industryLabel} ${stageLabel}.`,
    },
  ];
}

function buildInvestorQuestions(industry, stage, industryLabel, stageLabel) {
  const questions = [
    ...baseQuestions,
    ...(stageQuestions[stage] ?? []),
    ...(industryQuestions[industry] ?? []),
  ].map((item) => {
    if (industryQuestions[industry]?.includes(item)) {
      return {
        ...item,
        question: `${item.question} (${industryLabel} ${stageLabel})`,
        answer: `${item.answer} Focus on ${industryLabel} at the ${stageLabel} stage.`,
      };
    }
    return item;
  });

  const objections = [
    ...baseObjections,
    ...(industryObjections[industry] ?? []),
  ].map((item) => {
    if (industryObjections[industry]?.includes(item)) {
      return {
        ...item,
        objection: `${item.objection} (${industryLabel} ${stageLabel})`,
        response: `${item.response} Tie it to ${industryLabel} ${stageLabel} milestones.`,
      };
    }
    return item;
  });

  return { questions, objections };
}

async function run() {
  const raw = await fs.readFile(configPath, "utf8");
  const config = JSON.parse(raw);

  await fs.mkdir(outputDir, { recursive: true });

  const generated = [];

  for (const industry of config.industries) {
    for (const stage of config.stages) {
      const industryLabel = industry.label;
      const stageLabel = stage.label;

      for (const pageType of config.pageTypes) {
        const slug = `/investor-questions/${industry.slug}/${stage.slug}/${pageType.slug}/`;
        const fileName = `${industry.slug}_${stage.slug}_${pageType.slug}.json`;
        const filePath = path.join(outputDir, fileName);

        const base = {
          industry: industry.slug,
          stage: stage.slug,
          pageType: pageType.slug,
          slug,
          ctaText: "Create your PitchChat room",
          dataOrigin: "projected",
          sourceTags: ["projected"],
        };

        if (pageType.slug === "investor-questions") {
          const { questions, objections } = buildInvestorQuestions(
            industry.slug,
            stage.slug,
            industryLabel,
            stageLabel
          );
          const metrics = buildMetrics(
            industry.slug,
            stage.slug,
            industryLabel,
            stageLabel
          );

          const payload = {
            ...base,
            title: `Investor questions for ${industryLabel} ${stageLabel} startups`,
            summary: `Projected investor questions and preparation guidance for ${industryLabel} founders raising a ${stageLabel} round. ${summarySuffix.investorQuestions}`,
            questions,
            metrics,
            objections,
          };

          await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
          generated.push(fileName);
          continue;
        }

        if (pageType.slug === "pitch-deck") {
          const stageSection = {
            title: `${stageLabel} milestones`,
            goal: `Highlight proof points for ${stageLabel}.`,
            guidance: `Detail the specific milestones investors expect for ${industryLabel} ${stageLabel}.`,
          };
          const industryStageSection = {
            title: `${industryLabel} go-to-market wedge (${stageLabel})`,
            goal: `Explain your entry point for ${industryLabel}.`,
            guidance: `Show a focused wedge that fits ${industryLabel} buyers at the ${stageLabel} stage.`,
          };
          const proofSection = {
            title: `${industryLabel} proof points`,
            goal: `Show evidence tailored to ${industryLabel}.`,
            guidance: `Use data or pilots specific to ${industryLabel} to prove momentum at ${stageLabel}.`,
          };

          const payload = {
            ...base,
            title: `Pitch deck outline for ${industryLabel} ${stageLabel} startups`,
            summary: `Projected deck structure for ${industryLabel} founders raising a ${stageLabel} round. ${summarySuffix.pitchDeck}`,
            sections: [
              ...baseDeckSections,
              industryDeckSections[industry.slug],
              stageSection,
              industryStageSection,
              proofSection,
            ],
          };

          await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
          generated.push(fileName);
          continue;
        }

        if (pageType.slug === "metrics-benchmarks") {
          const payload = {
            ...base,
            title: `${industryLabel} ${stageLabel} fundraising metrics benchmarks`,
            summary: `Projected fundraising benchmarks for ${industryLabel} ${stageLabel} startups. ${summarySuffix.metricsBenchmarks}`,
            metrics: buildMetrics(
              industry.slug,
              stage.slug,
              industryLabel,
              stageLabel
            ),
          };

          await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
          generated.push(fileName);
          continue;
        }

        if (pageType.slug === "diligence-checklist") {
          const stageItem = {
            item: `${stageLabel} readiness summary for ${industryLabel}`,
            rationale: `Signals you can close a ${stageLabel} round in ${industryLabel}.`,
          };

          const industryItem = {
            item: `${industryChecklist[industry.slug].item} (${stageLabel})`,
            rationale: `${industryChecklist[industry.slug].rationale}`,
          };

          const payload = {
            ...base,
            title: `${industryLabel} ${stageLabel} diligence checklist`,
            summary: `Projected diligence checklist for ${industryLabel} founders raising a ${stageLabel} round. ${summarySuffix.diligenceChecklist}`,
            items: [...baseChecklist, industryItem, stageItem],
          };

          await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
          generated.push(fileName);
          continue;
        }

        if (pageType.slug === "investor-update") {
          const stageSection = {
            section: `${stageLabel} milestones`,
            content: `Summarize the milestone progress expected for ${industryLabel} founders at ${stageLabel}.`,
          };
          const industrySection = {
            section: `${industryUpdateSections[industry.slug].section} (${stageLabel})`,
            content: industryUpdateSections[industry.slug].content,
          };

          const payload = {
            ...base,
            title: `${industryLabel} ${stageLabel} investor update template`,
            summary: `Projected update format for ${industryLabel} founders raising a ${stageLabel} round. ${summarySuffix.investorUpdate}`,
            sections: [...baseUpdateSections, industrySection, stageSection],
          };

          await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
          generated.push(fileName);
        }
      }
    }
  }

  console.log(`Generated ${generated.length} projected source files.`);
}

run().catch((error) => {
  console.error("Projected source generation failed:", error.message);
  process.exitCode = 1;
});

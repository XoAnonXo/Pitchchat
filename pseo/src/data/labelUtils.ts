const stageLabels: Record<string, string> = {
  seed: "Seed",
  "series-a": "Series A",
};

const industryLabels: Record<string, string> = {
  aerospace: "Aerospace",
  hardware: "Hardware",
  robotics: "Robotics",
  chemistry: "Chemistry",
  finance: "Finance",
  blockchain: "Blockchain",
  ai: "AI",
  saas: "SaaS",
  healthcare: "Healthcare",
  fintech: "Fintech",
};

/**
 * Industry-specific descriptions for hub pages to provide substantive content
 * and avoid thin page penalties. Each includes context about fundraising focus areas.
 */
const industryDescriptions: Record<string, { intro: string; focus: string[]; keyMetrics: string[] }> = {
  aerospace: {
    intro: "Aerospace startups face unique fundraising challenges including long development cycles, regulatory hurdles, and capital-intensive hardware requirements. Investors evaluate technical milestones, government contracts, and path to commercial viability.",
    focus: ["Technical milestones and flight heritage", "Regulatory pathway (FAA, FCC certifications)", "Contract pipeline and LOIs", "Manufacturing scalability"],
    keyMetrics: ["Time to first flight", "Contract backlog value", "Cost per launch/unit", "Technical risk reduction milestones"],
  },
  hardware: {
    intro: "Hardware companies require investors who understand bill of materials economics, supply chain complexity, and longer paths to profitability. Key focus areas include unit economics, manufacturing partnerships, and inventory management.",
    focus: ["Bill of materials cost trajectory", "Manufacturing partner relationships", "Inventory and supply chain strategy", "Product-market fit validation"],
    keyMetrics: ["Gross margin by unit", "Time from order to delivery", "Return rate", "NPS and repeat purchase rate"],
  },
  robotics: {
    intro: "Robotics startups blend hardware and software challenges, requiring deep technical differentiation and clear go-to-market strategies. Investors assess autonomy levels, safety certifications, and deployment scalability.",
    focus: ["Level of autonomy and AI capabilities", "Safety and compliance certifications", "Deployment model (sale vs RaaS)", "Integration complexity"],
    keyMetrics: ["Mean time between failures", "Deployment time per unit", "Robot uptime percentage", "Cost savings delivered to customers"],
  },
  chemistry: {
    intro: "Chemistry and materials startups require significant R&D validation before commercialization. Investors focus on IP moats, scale-up feasibility, and regulatory approval timelines for novel compounds or processes.",
    focus: ["Patent portfolio and freedom to operate", "Lab to pilot scale validation", "Regulatory pathway (EPA, FDA if applicable)", "Sustainable manufacturing approach"],
    keyMetrics: ["Yield at production scale", "Cost per unit vs incumbents", "Time to regulatory approval", "IP protection timeline"],
  },
  finance: {
    intro: "Fintech startups must navigate complex regulatory environments while demonstrating product-market fit and sustainable unit economics. Investors evaluate compliance infrastructure, customer acquisition costs, and net revenue retention.",
    focus: ["Regulatory compliance and licensing", "Unit economics and LTV/CAC", "Risk management infrastructure", "Partnership with incumbent institutions"],
    keyMetrics: ["Net revenue retention", "Take rate", "Default/loss rate", "Customer acquisition payback period"],
  },
  blockchain: {
    intro: "Blockchain and Web3 companies face unique investor scrutiny around token economics, decentralization roadmaps, and regulatory positioning. Strong technical teams and clear use cases beyond speculation are essential.",
    focus: ["Token utility and economics model", "Decentralization vs performance tradeoffs", "Regulatory strategy and jurisdiction", "Developer ecosystem and adoption"],
    keyMetrics: ["Transaction volume and velocity", "Active wallet addresses", "Developer activity (commits, contributors)", "Token velocity and lock-up rates"],
  },
  ai: {
    intro: "AI startups must demonstrate defensible moats beyond model performance, including proprietary data, distribution advantages, and clear paths to enterprise adoption. Investors assess model differentiation and build vs buy dynamics.",
    focus: ["Data moats and flywheel effects", "Model performance vs cost tradeoffs", "Enterprise sales motion readiness", "Build vs API dependency risk"],
    keyMetrics: ["Model accuracy benchmarks", "Inference cost per query", "Enterprise pipeline and ACV", "Net retention and expansion revenue"],
  },
  saas: {
    intro: "SaaS startups operate subscription business models with recurring revenue. Investors evaluate SaaS companies on growth efficiency, retention metrics, and path to profitability. The bar has risen significantly -- demonstrating strong unit economics early is now expected.",
    focus: ["Unit economics (CAC, LTV, payback)", "Net revenue retention and expansion", "Product-led vs sales-led GTM", "Scalable customer acquisition"],
    keyMetrics: ["MRR/ARR growth rate", "Net Revenue Retention", "CAC Payback Period", "Gross Margin", "Burn Multiple"],
  },
  healthcare: {
    intro: "Healthcare startups navigate complex regulatory requirements, reimbursement dynamics, and long sales cycles. Investors evaluate clinical validation, regulatory pathways, and the ability to work within existing healthcare infrastructure while driving meaningful outcomes.",
    focus: ["Regulatory pathway (FDA, HIPAA compliance)", "Clinical validation and evidence generation", "Reimbursement strategy and payer relationships", "Provider adoption and workflow integration"],
    keyMetrics: ["Clinical outcomes data", "Regulatory milestone progress", "Payer coverage decisions", "Provider adoption rate", "Patient engagement metrics"],
  },
  fintech: {
    intro: "Fintech startups must balance growth with regulatory compliance and risk management. Investors evaluate licensing status, banking partnerships, and unit economics that account for fraud and credit losses. Trust and security are fundamental to customer acquisition.",
    focus: ["Regulatory licensing and compliance", "Banking partnership stability", "Fraud prevention and risk management", "Sustainable unit economics"],
    keyMetrics: ["Transaction volume", "Take rate and revenue per user", "Loss rates and fraud metrics", "Regulatory status", "Net revenue retention"],
  },
};

const stageDescriptions: Record<string, { intro: string; typical: string[]; expectations: string[] }> = {
  seed: {
    intro: "Seed stage focuses on validating product-market fit and building the foundation for scale. Investors evaluate founding team strength, early traction signals, and market opportunity size.",
    typical: ["$1-4M round size", "12-24 months runway", "Pre-revenue to early revenue", "Team of 2-10 people"],
    expectations: ["Clear problem-solution hypothesis", "Early customer validation", "Technical MVP or prototype", "Defined go-to-market strategy"],
  },
  "series-a": {
    intro: "Series A requires demonstrated product-market fit and a repeatable go-to-market motion. Investors expect consistent growth metrics, clear unit economics, and a path to category leadership.",
    typical: ["$8-20M round size", "18-30 months runway", "$500K-$3M ARR typical", "Team of 15-40 people"],
    expectations: ["Proven product-market fit", "Repeatable sales/growth motion", "Strong unit economics", "Clear competitive differentiation"],
  },
};

export function labelForStage(stage: string) {
  return stageLabels[stage] ?? stage;
}

export function labelForIndustry(industry: string) {
  return industryLabels[industry] ?? industry;
}

export function descriptionForIndustry(industry: string) {
  return industryDescriptions[industry] ?? null;
}

export function descriptionForStage(stage: string) {
  return stageDescriptions[stage] ?? null;
}

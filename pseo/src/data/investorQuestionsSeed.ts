import type { InvestorQuestionsPageData } from "@/components/pseo/InvestorQuestionsTemplate";
import { labelForIndustry, labelForStage } from "@/data/labelUtils";
import { getInvestorQuestionsContent } from "@/data/content/contentMatrix";

const baseQuestions = [
  {
    category: "Problem",
    question: "What is the wedge problem and why does it matter now?",
    answer:
      "Start with a specific, quantifiable pain point that your target customers experience today. Explain why existing solutions fail to address this problem adequately—whether due to cost, complexity, or capability gaps. Then articulate the timing advantage: what market shift, regulatory change, or technology breakthrough makes your solution viable now when it wasn't before? Strong answers combine urgency ('customers are losing $X per month') with inevitability ('this trend is accelerating because...'). Investors want to see that you've identified a wedge that's narrow enough to win but expandable into a larger market.",
  },
  {
    category: "Buyer",
    question: "Who is the buyer and how do you reach them efficiently?",
    answer:
      "Identify the specific job title and company profile of your economic buyer—the person with budget authority and urgency to solve the problem. Explain your primary acquisition channel and why it's defensible: Is it content marketing, outbound sales, partnerships, or product-led growth? Describe your pilot-to-paid motion: How long does a typical evaluation take? What does the decision process look like? Show that you understand the buying committee dynamics (champion vs. decision-maker vs. blocker) and have a repeatable playbook for navigating enterprise sales cycles or consumer funnels.",
  },
  {
    category: "Moat",
    question: "What makes the business defensible beyond speed?",
    answer:
      "Speed to market is not a moat—competitors can catch up. Articulate structural advantages that compound over time: proprietary datasets that improve with usage, network effects where each user makes the product more valuable, regulatory approvals or certifications that create barriers to entry, deep integrations that increase switching costs, or brand trust in high-stakes decisions. The best moats combine multiple defensibility layers. Explain how your advantage widens rather than narrows as you scale, and why a well-funded competitor couldn't simply replicate your position within 18-24 months.",
  },
  {
    category: "Traction",
    question: "What early signals prove pull from the market?",
    answer:
      "Share concrete evidence of customer demand beyond vanity metrics. Strong signals include: paying customers (even at small scale), signed LOIs or pilots with recognizable logos, organic inbound demand, usage metrics showing retention and engagement, waitlists with conversion intent, or revenue growth rates. Quantify the signal and explain what it proves about product-market fit. If pre-revenue, demonstrate demand through customer discovery depth—how many interviews, what you learned, and how it shaped the product. Show that you can translate early traction into a repeatable acquisition and expansion motion.",
  },
  {
    category: "Economics",
    question: "How will margins improve as you scale?",
    answer:
      "Walk through your unit economics today versus at scale. If gross margins are currently low, explain the specific levers that improve them: technology automation reducing labor costs, volume discounts on COGS, shifting from services to software revenue, or AI replacing manual processes. Show the path from current contribution margin to target gross margin (typically 70%+ for software, 40%+ for hardware-enabled businesses). Address any margin headwinds honestly and explain mitigation strategies. Investors need confidence that scale creates operating leverage, not just more complexity.",
  },
  {
    category: "Roadmap",
    question: "What milestones unlock the next round?",
    answer:
      "Define 3-5 concrete milestones that would make you an obvious Series A candidate (or next-stage ready). These typically span: technical milestones (product launches, platform capabilities), commercial milestones (revenue targets, customer logos, retention metrics), and strategic milestones (key hires, partnerships, regulatory clearances). Be specific about targets and timelines. Explain the logical sequence—which milestones de-risk the business and unlock subsequent ones? Show you understand what Series A investors in your space typically require, and that your plan creates a compelling narrative of progress.",
  },
  {
    category: "Team",
    question: "Why is this team uniquely positioned to win this market?",
    answer:
      "Explain the specific experiences, relationships, or insights that give your founding team an unfair advantage in this market. This might include: deep domain expertise from years in the industry, technical breakthroughs you've personally developed, relationships with early customers or distribution partners, or previous startup experience relevant to the challenges ahead. Address any obvious gaps in the team and your plan to fill them. The best answers show founder-market fit—why you specifically are compelled to solve this problem and have unique advantages in doing so.",
  },
  {
    category: "Competition",
    question: "Who else is solving this problem and why will you win?",
    answer:
      "Acknowledge direct competitors, adjacent solutions, and the status quo (often your biggest competitor). Avoid dismissing competitors—investors will have already researched them. Instead, articulate your differentiated positioning: What specific customer segment or use case are you winning? What technical or go-to-market approach gives you advantage? Show you understand the competitive landscape deeply and have chosen a defensible position. Explain scenarios where you win versus lose, and why your strategy maximizes winning probability given your team and resources.",
  },
  {
    category: "Market",
    question: "How big is the market opportunity and how do you size it?",
    answer:
      "Present a bottom-up market sizing that investors can validate. Start with your specific target segment: How many potential customers exist? What's their willingness to pay based on the value you deliver? Calculate your serviceable addressable market (SAM) before jumping to total addressable market (TAM). Explain the expansion path—how you move from initial wedge to broader market. Reference comparable companies' market sizes where relevant. Investors discount top-down TAM numbers; they credit founders who understand their specific entry point and expansion trajectory.",
  },
  {
    category: "Ask",
    question: "How much are you raising and how will you deploy the capital?",
    answer:
      "State your raise amount and target runway (typically 18-24 months). Break down use of funds across major categories: team expansion (which roles), product development (which capabilities), and go-to-market (which channels). Connect spending to milestones—show how this capital gets you to a significantly de-risked position. Explain your valuation expectations and how they benchmark against comparable companies at your stage. Be prepared to discuss what you'd do with more or less capital, and what milestones would trigger additional fundraising.",
  },
];

const baseMetrics = [
  {
    label: "Monthly Recurring Revenue (MRR)",
    value: "Varies by stage",
    note: "Pre-seed: $0-10K MRR is acceptable with strong technical differentiation. Seed: $10K-100K MRR typical range. Series A: $100K-500K+ MRR expected. Focus on growth rate (15-20% month-over-month is strong) rather than absolute numbers at early stages.",
  },
  {
    label: "Customer Acquisition Cost (CAC)",
    value: "Track per channel",
    note: "Calculate fully-loaded CAC including marketing spend, sales salaries, and tools divided by new customers acquired. Early-stage CAC is often high and that's acceptable—investors want to see a clear path to efficiency through channel optimization, product-led growth, or sales process improvements.",
  },
  {
    label: "Lifetime Value (LTV)",
    value: "LTV:CAC ratio target 3:1+",
    note: "LTV = Average Revenue Per Account × Gross Margin × Customer Lifetime (1/churn rate). At early stages, use cohort analysis to project LTV even with limited history. A 3:1 LTV:CAC ratio is the minimum threshold for sustainable unit economics.",
  },
  {
    label: "Net Revenue Retention (NRR)",
    value: "Target 100%+ for B2B SaaS",
    note: "NRR above 100% means existing customers grow faster than churn—the holy grail of SaaS economics. Calculate: (Starting MRR + Expansion - Contraction - Churn) / Starting MRR. Best-in-class companies achieve 120-150% NRR through upsells and usage-based pricing.",
  },
  {
    label: "Gross Margin",
    value: "70%+ for software, 40%+ for hardware",
    note: "Gross margin = (Revenue - COGS) / Revenue. Software companies should target 70-80%+ margins. Hardware-enabled software typically runs 40-60%. If margins are lower today, clearly articulate the path to target margins through automation, scale economies, or product mix shift.",
  },
  {
    label: "Burn Multiple",
    value: "Target under 2x",
    note: "Burn Multiple = Net Burn / Net New ARR. A burn multiple under 1.5x indicates efficient growth; 1.5-2x is acceptable for early-stage companies investing in growth. Above 3x raises concerns about capital efficiency. Track this monthly to understand the cost of acquiring each dollar of ARR.",
  },
];

const baseObjections = [
  {
    objection: "The market is too early—customers aren't ready to buy yet.",
    response:
      "Acknowledge the timing concern and counter with evidence of urgency: regulatory deadlines forcing action, competitive pressure making inaction costly, or pilot customers already paying for early access. Explain your 'bowling pin' strategy—the specific segment that's buying today and how success there creates momentum for adjacent segments. Show how you can build a sustainable business with early adopters while the broader market matures.",
  },
  {
    objection: "This market is dominated by incumbents with deep resources.",
    response:
      "Don't compete on incumbents' terms—articulate your asymmetric advantage. This might be: a new technology paradigm they can't adopt without cannibalizing existing revenue, a customer segment too small for them to prioritize, or a business model that doesn't fit their structure. Show specific examples of incumbent weaknesses (slow innovation cycles, legacy technical debt, misaligned incentives) and how you exploit them.",
  },
  {
    objection: "Your team lacks industry experience in this market.",
    response:
      "Turn this into an advantage: fresh perspective enables rethinking assumptions that industry veterans take for granted. Supplement with evidence of rapid learning (customer discovery depth, advisory relationships, key hires). If relevant, highlight analogous experience from adjacent industries. Show specific examples of how your outsider perspective has already led to insights that industry insiders missed.",
  },
  {
    objection: "Unit economics don't work at this price point.",
    response:
      "Break down the path to profitability: Which costs decrease with scale (volume discounts, automation, efficiency)? Which revenue levers improve (upsells, usage expansion, price increases as value is proven)? Show comparable companies that faced similar economics early and achieved strong margins at scale. Be honest about timeline—investors prefer realistic projections over optimistic assumptions.",
  },
  {
    objection: "This could be a feature, not a company.",
    response:
      "Demonstrate why this is a platform opportunity, not a point solution. Articulate the expansion path: What adjacent problems can you solve? What network effects or data advantages compound over time? Show customer research indicating willingness to consolidate with a trusted vendor. Reference comparable companies that started narrow and expanded into large platforms.",
  },
];

export function getInvestorQuestionsSeed(
  industry: string,
  stage: string
): InvestorQuestionsPageData {
  const industryLabel = labelForIndustry(industry);
  const stageLabel = labelForStage(stage);

  // Try to get industry/stage-specific content
  const specificContent = getInvestorQuestionsContent(industry, stage);

  if (specificContent) {
    return {
      title: `Top ${specificContent.questions.length} Investor Questions for ${industryLabel} ${stageLabel} Startups`,
      summary: specificContent.summary,
      questions: specificContent.questions,
      metrics: specificContent.metrics,
      objections: specificContent.objections,
      ctaText: "Practice with Pitchchat AI",
      context: {
        industry,
        stage,
        pageType: "investor-questions",
      },
    };
  }

  // Fallback to base content
  return {
    title: `Top 10 Investor Questions for ${industryLabel} ${stageLabel} Startups`,
    summary: `Founders raising a ${stageLabel} round in ${industryLabel} must prepare thorough answers to these critical investor questions. This guide covers the essential areas investors evaluate: problem definition, market opportunity, competitive positioning, team strength, unit economics, and funding strategy. Each question includes detailed guidance on how to structure your response for maximum impact.`,
    questions: baseQuestions,
    metrics: baseMetrics,
    objections: baseObjections,
    ctaText: "Create your PitchChat room",
    context: {
      industry,
      stage,
      pageType: "investor-questions",
    },
  };
}

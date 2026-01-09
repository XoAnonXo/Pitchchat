import type { IndustryStageContent } from "../types";

export const healthcareSeriesAContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Series A healthcare companies must demonstrate regulatory progress (typically cleared or submitted), clinical validation, and early commercial traction. Investors evaluate your ability to scale in a complex market—reimbursement, health system adoption, and operational readiness become central. The bar has risen: investors expect proof of product-market fit through paying customers or contracted pilots, not just clinical enthusiasm.",
    questions: [
      {
        category: "Regulatory",
        question: "What's your regulatory status and post-market strategy?",
        answer:
          "Present your regulatory achievements and remaining work. For cleared products, explain any labeling limitations and expansion plans (additional indications, international clearances). For products in review, provide timeline and contingency plans. Address post-market requirements: surveillance, adverse event reporting, quality systems maintenance. Show you've built regulatory operations to scale, not just achieve initial clearance. Reference any FDA feedback that supports your path.",
      },
      {
        category: "Clinical Evidence",
        question: "What clinical evidence supports your efficacy claims and what's the publication strategy?",
        answer:
          "Series A requires robust clinical evidence. Present your evidence portfolio: pivotal data, real-world evidence, outcomes studies. Explain how evidence supports regulatory claims, reimbursement, and sales. Show your publication strategy—peer-reviewed papers build credibility with clinical buyers. Address evidence gaps and plans to fill them. Reference KOL relationships and their role in evidence generation and dissemination.",
      },
      {
        category: "Reimbursement",
        question: "What's your reimbursement status and payer strategy?",
        answer:
          "Reimbursement determines commercial viability. Present your current coverage: which payers, what codes, what rates. Explain your payer engagement strategy and any coverage wins. Address the Medicare vs. commercial payer dynamic in your category. Show health economics data supporting reimbursement. For new technology categories, explain the NTAP, coverage with evidence development, or alternative pathways you're pursuing. Reference any medical policy decisions or coverage momentum.",
      },
      {
        category: "Commercial Traction",
        question: "What's your commercial traction and sales efficiency?",
        answer:
          "Series A expects commercial proof points. Present revenue, contracted customers, and pipeline. Show sales metrics: cycle length, win rate, deal size. Explain your sales motion: who sells, to whom, how. Address health system procurement complexity and how you navigate it. Show unit economics on customer acquisition. Reference lighthouse customers and their expansion potential. Demonstrate you've found a repeatable commercial motion.",
      },
      {
        category: "Health System Strategy",
        question: "How do you land and expand within health systems?",
        answer:
          "Health systems buy slowly but expand if products deliver value. Explain your land strategy: initial entry point, champion development, pilot-to-purchase conversion. Show expansion playbook: additional units, use cases, or products within accounts. Present evidence from existing customers: utilization growth, departmental expansion, contract renewals. Address account management approach and success metrics. Reference specific expansion examples.",
      },
      {
        category: "Clinical Workflow",
        question: "How deeply integrated is your product in clinical workflows?",
        answer:
          "Workflow integration creates stickiness and switching costs. Present your integration approach: EHR integration status, clinical workflow embedding, training requirements. Show adoption metrics within accounts: daily active users, utilization rates, workflow penetration. Address barriers to adoption you've encountered and how you've solved them. Reference clinical user feedback on workflow fit. Show you understand the change management required for clinical adoption.",
      },
      {
        category: "Competitive Position",
        question: "How has your competitive position evolved and what's defensible?",
        answer:
          "Series A investors assess long-term defensibility. Present your competitive landscape with honest positioning. Show evidence of differentiation: clinical outcomes, workflow advantages, customer preference data. Address how you win against specific competitors—reference actual deals. Explain what's defensible: clinical evidence moat, integration depth, network effects, regulatory barriers. Address emerging competitors and your response strategy.",
      },
      {
        category: "Operations Scale",
        question: "What operational capabilities have you built to scale?",
        answer:
          "Scaling healthcare requires operational maturity. Present your quality management system and regulatory operations. Address manufacturing or service delivery capacity. Show customer success and implementation capabilities. Explain your technology infrastructure for scaling. Reference any operational challenges you've faced and how you've resolved them. Healthcare investors know operations are hard—show you've built foundations.",
      },
      {
        category: "Team",
        question: "How has your team evolved for Series A scale?",
        answer:
          "Series A requires a more complete team. Present key hires since seed: commercial leadership, regulatory depth, clinical expertise. Show your organizational structure and functional coverage. Address remaining gaps and hiring plan. Reference team experience scaling healthcare companies. Show your ability to recruit senior healthcare talent. Explain how you've evolved from founder-led sales to scalable commercial operations.",
      },
      {
        category: "Milestones",
        question: "What does this round achieve and what triggers Series B?",
        answer:
          "Present concrete milestones: revenue targets ($3-10M ARR typical for healthcare Series A→B), market penetration goals, product expansion, team growth. Show you understand Series B requirements in healthcare: typically $10M+ ARR, strong unit economics, and a clear path to profitability or category leadership. Explain the 18-24 month plan and key de-risking events. Be realistic about healthcare's longer timelines and what this capital achieves.",
      },
    ],
    metrics: [
      {
        label: "Annual Recurring Revenue",
        value: "$1M - $5M ARR",
        note: "Series A healthcare companies typically show $1-5M in ARR or contracted revenue, with clear path to $10M+.",
      },
      {
        label: "Revenue Growth Rate",
        value: "100-200% YoY",
        note: "Year-over-year revenue growth. Healthcare growth is often non-linear—may be lower than SaaS benchmarks due to sales cycles.",
      },
      {
        label: "Customer Count",
        value: "10-30 health systems",
        note: "Active paying customers. Mix of academic medical centers and community health systems shows broad applicability.",
      },
      {
        label: "Net Revenue Retention",
        value: "110-130%",
        note: "Expansion within accounts through broader deployment, additional use cases, or price increases.",
      },
      {
        label: "Sales Cycle",
        value: "6-12 months",
        note: "Average time from first meeting to signed contract. Shortening cycles indicate go-to-market maturity.",
      },
      {
        label: "Regulatory Status",
        value: "FDA cleared/CE marked",
        note: "Primary market regulatory clearance achieved. International expansion may be in progress.",
      },
    ],
    objections: [
      {
        objection: "Your sales cycles are too long to build a venture-scale business.",
        response:
          "Address with evidence and strategy: 'Our initial sales cycles were 15 months. Through our refined approach, we've reduced to 8 months for new accounts. Key changes: earlier economic buyer engagement, standardized ROI analysis, and pilot-to-purchase conversion playbook. More importantly, our expansion within accounts averages 3 months with 140% NRR. Our model is land efficiently, then expand significantly. We're now seeing inbound from health system networks that accelerate the process further.'",
      },
      {
        objection: "Reimbursement coverage is too limited to scale.",
        response:
          "Present your reimbursement progress: 'We've achieved coverage with 4 major commercial payers representing 40% of covered lives in our initial markets. Our health economics data shows $X savings per patient, which supports our coverage expansion. We have active coverage reviews with 3 additional payers and expect decisions in the next 6 months. Our pricing strategy works across reimbursed and cash-pay channels, providing multiple paths to revenue while coverage expands.'",
      },
      {
        objection: "The market is being consolidated by larger players.",
        response:
          "Address market dynamics directly: 'Consolidation actually benefits us. Large players acquire capabilities rather than build—we're a logical acquisition target. In the meantime, we win because we're focused: our clinical outcomes and workflow integration exceed what consolidated players offer. Our recent competitive wins against [named competitor] demonstrate this. We're building a company that's valuable standalone but also strategically positioned for consolidation scenarios.'",
      },
      {
        objection: "Your unit economics don't support the sales and implementation costs.",
        response:
          "Present the economics trajectory: 'Our current CAC payback is 24 months, which is typical for enterprise healthcare at our stage. Here's our path to 18 months: implementation automation reducing costs 30%, inside sales for smaller accounts, and customer success efficiency improvements. Our LTV is strong—90%+ retention with 140% NRR gives us 5+ year customer relationships. At scale, we project CAC payback under 18 months with gross margins exceeding 75%.'",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Series A healthcare decks must demonstrate regulatory achievement, clinical validation, commercial traction, and operational readiness to scale. Investors expect proof of product-market fit through revenue and customer engagement, not just clinical potential. Lead with your commercial momentum and evidence of repeatability.",
    sections: [
      {
        title: "Executive Summary",
        goal: "Capture the opportunity and your position in 60 seconds",
        guidance:
          "Lead with your commercial traction and clinical differentiation. State your regulatory status (cleared, CE marked). Present the market opportunity size. Show the key metrics that prove product-market fit. Series A decks should immediately establish credibility—don't bury your achievements.",
      },
      {
        title: "Problem & Market",
        goal: "Frame the clinical problem and economic opportunity",
        guidance:
          "Deepen the problem definition with market data. Quantify the clinical burden and economic cost. Show market size with bottom-up rigor. Present market dynamics: growing incidence, shifting care settings, policy tailwinds. Reference comparable company valuations or exits. Healthcare investors want to see venture-scale opportunity.",
      },
      {
        title: "Solution & Clinical Value",
        goal: "Demonstrate your product and clinical differentiation",
        guidance:
          "Show the product at scale—not just prototype. Present clinical evidence supporting your value proposition. Include real customer deployments and outcomes. Address how you're differentiated: clinical superiority, workflow advantage, or economic value. Show evidence from the field, not just controlled studies.",
      },
      {
        title: "Commercial Traction",
        goal: "Prove product-market fit through revenue and customers",
        guidance:
          "This is the most important section for Series A. Present revenue and growth trajectory. Show customer logos and deployment scale. Include retention and expansion metrics. Present pipeline and conversion rates. Reference customer testimonials and case studies. Make clear you've found a repeatable go-to-market motion.",
      },
      {
        title: "Regulatory & Clinical Evidence",
        goal: "Show regulatory achievement and evidence portfolio",
        guidance:
          "Present regulatory status: clearances achieved, submissions pending, international progress. Show clinical evidence portfolio: pivotal data, real-world evidence, publications. Address any ongoing evidence generation. Reference KOL relationships. Show regulatory operations capability for ongoing compliance.",
      },
      {
        title: "Business Model & Unit Economics",
        goal: "Demonstrate sustainable economics at scale",
        guidance:
          "Present your business model with healthcare-specific clarity. Show reimbursement status and coverage expansion plan. Present unit economics: customer acquisition cost, lifetime value, payback period. Explain gross margin structure. Show path to improved economics at scale. Healthcare often has complex revenue models—demonstrate mastery.",
      },
      {
        title: "Go-to-Market & Scale Plan",
        goal: "Show repeatable sales motion and expansion strategy",
        guidance:
          "Present your sales model with evidence it works: conversion rates, cycle times, win rates. Explain your expansion strategy: geographic, segment, or product line. Show channel strategy if applicable. Address operational requirements for scale: sales team, implementation, customer success. Present the path from current traction to Series B milestones.",
      },
      {
        title: "Competition & Moat",
        goal: "Demonstrate defensible position in market",
        guidance:
          "Present comprehensive competitive landscape. Show your differentiation with evidence: clinical outcomes, customer preference, win rates. Address how you sustain advantage: evidence moat, integration depth, network effects. Be honest about competitive threats and your response. Show you've thought deeply about long-term positioning.",
      },
      {
        title: "Team & Organization",
        goal: "Show team capability to execute at scale",
        guidance:
          "Present full leadership team with healthcare credentials. Show organizational evolution since seed. Address key hires planned with this round. Reference advisors and board. Healthcare requires specialized talent—demonstrate you can recruit and retain it. Show the team can scale beyond founder-led operations.",
      },
      {
        title: "Financials & Ask",
        goal: "Present clear plan and capital needs",
        guidance:
          "Show 24-36 month financial plan with explicit assumptions. Present key milestones and timeline. State raise amount and use of funds. Connect capital to Series B readiness: typical requirements are $10M+ ARR, strong retention, clear path to profitability or market leadership. Be clear about what this round achieves.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Series A healthcare benchmarks focus on commercial traction, customer metrics, and operational readiness. Revenue expectations are adjusted for healthcare's longer sales cycles, but investors expect clear evidence of product-market fit and a repeatable go-to-market motion.",
    metrics: [
      {
        label: "Annual Recurring Revenue",
        value: "$1M - $5M",
        note: "ARR range for Series A healthcare. Higher end for digital health, lower for medical devices with implementation complexity.",
      },
      {
        label: "Revenue Growth Rate",
        value: "100-200% YoY",
        note: "Year-over-year growth. Healthcare may have lumpy revenue due to long sales cycles—momentum and pipeline matter.",
      },
      {
        label: "Net Revenue Retention",
        value: "110-140%",
        note: "Expansion through broader deployment, additional use cases, or pricing. Strong NRR indicates product-market fit.",
      },
      {
        label: "Logo Retention",
        value: "90%+",
        note: "Annual customer retention. Healthcare customers are sticky when products work—retention below 90% signals issues.",
      },
      {
        label: "Customer Count",
        value: "10-30 accounts",
        note: "Active paying health systems or enterprises. Mix of customer types demonstrates broad applicability.",
      },
      {
        label: "Average Contract Value",
        value: "$50K - $250K",
        note: "Annual contract value. Varies significantly by product type and health system size.",
      },
      {
        label: "Sales Cycle",
        value: "6-12 months",
        note: "Time from first meeting to signed contract. Shortening cycles indicate GTM maturity.",
      },
      {
        label: "Gross Margin",
        value: "65-80%",
        note: "Varies by delivery model. Software higher, services-intensive lower. Path to 70%+ expected.",
      },
      {
        label: "CAC Payback",
        value: "18-24 months",
        note: "Healthcare has higher CAC due to sales complexity. Path to under 18 months expected at scale.",
      },
      {
        label: "Reimbursement Coverage",
        value: "2+ major payers",
        note: "Coverage with meaningful commercial payers. Medicare coverage often critical for scale.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Series A healthcare diligence focuses on commercial traction, regulatory compliance, and operational scalability. Investors verify your ability to scale a healthcare business—expect deep dives on customer relationships, reimbursement economics, and quality systems.",
    items: [
      {
        item: "Customer and revenue detail with cohort analysis",
        rationale:
          "Complete customer list with contract details: revenue, contract dates, expansion history. Cohort analysis showing retention and expansion patterns. Reference customer contacts for diligence calls.",
      },
      {
        item: "Sales metrics and pipeline analysis",
        rationale:
          "Sales funnel with conversion rates by stage. Pipeline with probability weighting. Win/loss analysis with reasons. Sales cycle analysis by customer segment. Sales team performance data.",
      },
      {
        item: "Regulatory filings and clearance documentation",
        rationale:
          "510(k) clearance letters, CE certificates, other regulatory approvals. Submission history and FDA correspondence. Post-market surveillance data. Quality system certifications.",
      },
      {
        item: "Clinical evidence portfolio",
        rationale:
          "All clinical studies with protocols, results, and publications. Real-world evidence data. Evidence generation plan for expansion. KOL relationships and advisory agreements.",
      },
      {
        item: "Reimbursement and payer documentation",
        rationale:
          "Coverage determinations and medical policies. Payer contracts or attestations. Health economics model with supporting data. Reimbursement expansion strategy and progress.",
      },
      {
        item: "Quality management system audit",
        rationale:
          "QMS documentation: design controls, CAPA, complaint handling, supplier quality. Recent audit results (internal, customer, or regulatory). Quality metrics and trends.",
      },
      {
        item: "Customer case studies and outcomes data",
        rationale:
          "Detailed case studies from key accounts. Outcomes data demonstrating value delivered. Customer ROI analyses. Testimonials and reference documentation.",
      },
      {
        item: "Technology and integration documentation",
        rationale:
          "Technical architecture and security documentation. EHR integration status and certifications. Data handling and HIPAA compliance. Product roadmap and technical debt assessment.",
      },
      {
        item: "Financial model with scenario analysis",
        rationale:
          "Detailed financial model with assumptions. Historical accuracy analysis. Scenario modeling for key variables. Unit economics build-up. Capital efficiency metrics.",
      },
      {
        item: "Team and organizational assessment",
        rationale:
          "Org chart with all roles. Background on leadership team. Employee retention data. Hiring plan with key roles identified. Compensation benchmarking.",
      },
      {
        item: "Legal and IP review",
        rationale:
          "Patent portfolio with prosecution status. Freedom to operate analysis. Material contracts. Litigation or regulatory issues. Corporate structure and cap table.",
      },
      {
        item: "Competitive intelligence",
        rationale:
          "Competitive landscape analysis. Head-to-head clinical data if available. Win/loss analysis by competitor. Competitive positioning and differentiation evidence.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Series A healthcare updates should emphasize commercial momentum, key account progress, and operational scaling. Investors expect to see consistent growth with evidence of repeatable GTM motion. Be transparent about challenges in a complex market.",
    sections: [
      {
        section: "Key Metrics Dashboard",
        content:
          "Lead with core commercial metrics: ARR, growth rate, NRR, pipeline. Show month-over-month and year-over-year trends. Include customer count and average deal size. Use consistent formatting for easy comparison. Healthcare metrics may be lumpy—show trailing averages alongside monthly figures.",
      },
      {
        section: "Commercial Progress",
        content:
          "New customers and expansions with context. Pipeline development and major opportunities. Sales cycle improvements. Channel partner progress. Reimbursement wins or coverage expansions. Reference specific deals and their significance.",
      },
      {
        section: "Customer Success & Outcomes",
        content:
          "Utilization and adoption metrics within accounts. Clinical outcomes or value delivered. Customer case studies or testimonials. Renewal and expansion pipeline. Implementation velocity improvements. Customer feedback themes.",
      },
      {
        section: "Regulatory & Clinical",
        content:
          "Regulatory filings, clearances, or international progress. Clinical evidence generation: studies, publications, real-world data. Quality system developments. Adverse events or regulatory issues (be transparent). KOL engagement.",
      },
      {
        section: "Product & Technology",
        content:
          "Product releases and roadmap progress. Customer-requested features delivered. Integration expansions. Technical infrastructure scaling. Security or compliance achievements.",
      },
      {
        section: "Team & Operations",
        content:
          "Key hires and organizational changes. Sales capacity and productivity. Implementation and customer success scaling. Operational improvements. Culture and retention indicators.",
      },
      {
        section: "Financial Position",
        content:
          "Revenue vs. plan. Cash position and runway. Burn rate and efficiency metrics. Path to Series B milestones. Any financing considerations or timeline updates.",
      },
      {
        section: "Priorities & Asks",
        content:
          "Top priorities for next quarter. Specific asks: customer introductions, expertise, strategic guidance. Key decisions where board input is valuable. Healthcare investors often have valuable networks—leverage them.",
      },
    ],
  },
};

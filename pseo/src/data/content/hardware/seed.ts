import type { IndustryStageContent } from "../types";

export const hardwareSeedContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Seed-stage hardware startups face unique investor scrutiny around manufacturing feasibility, unit economics at scale, and the capital intensity of physical product development. Investors evaluate your Bill of Materials trajectory, First Pass Yield on prototypes, and realistic timelines to production. Hardware is hard—demonstrating you understand the manufacturing challenges is as important as the technology itself.",
    questions: [
      {
        category: "Manufacturing Readiness",
        question:
          "What's your current BOM cost and path to target production cost?",
        answer:
          "Hardware economics live or die by Bill of Materials trajectory. At seed stage, prototype BOM is typically 2-5x eventual production cost. Investors want to see: current BOM breakdown by component, identified cost reduction opportunities (volume pricing, component redesign, supplier negotiations), and realistic timeline to target cost. Show you understand the cost drivers and have a specific plan, not just assumptions that 'volume will fix it.'",
      },
      {
        category: "Production Quality",
        question:
          "What's your First Pass Yield and how do you plan to improve it?",
        answer:
          "First Pass Yield—the percentage of units that pass testing without rework—indicates manufacturing maturity. Seed-stage companies often see 60-70% FPY on early prototypes, targeting 90%+ for production. Present your current FPY with root cause analysis for failures. Show your quality improvement roadmap: design for manufacturability changes, process improvements, and testing refinements. Investors understand FPY improves but want evidence you're systematically addressing it.",
      },
      {
        category: "Supply Chain",
        question:
          "How resilient is your supply chain and what are the critical dependencies?",
        answer:
          "Hardware supply chains have proven fragile. Identify your critical components: single-source dependencies, long lead-time items, and components with supply risk. Show your mitigation strategy: dual-sourcing plans, inventory buffering, or design alternatives. Investors have been burned by supply chain surprises—demonstrate you've mapped risks and have contingency plans. Reference any supplier relationships or commitments.",
      },
      {
        category: "Design Maturity",
        question:
          "How many design iterations to production-ready and what's the timeline?",
        answer:
          "Hardware iteration cycles are long and expensive. Present your design maturity: current prototype generation, known issues, and planned iterations. Show your engineering change order (ECO) rate trending down as you approach production readiness. Include certification requirements (UL, FCC, CE) and their timeline. Investors want to see a realistic path to design freeze with contingency for discoveries.",
      },
      {
        category: "Capital Intensity",
        question:
          "How much capital do you need to reach production scale and positive unit economics?",
        answer:
          "Hardware is capital-intensive by nature. Map your funding requirements through production scale: tooling investment, initial inventory, working capital for production ramp. Be honest about total capital needs—hardware founders often underestimate. Show your funding strategy including non-dilutive sources (Kickstarter, grants, strategic investment). Investors appreciate founders who've done the real math on hardware capital requirements.",
      },
      {
        category: "Manufacturing Strategy",
        question:
          "Will you manufacture in-house or use contract manufacturing, and why?",
        answer:
          "Manufacturing strategy significantly impacts capital needs and control. Present your approach with clear rationale: contract manufacturing reduces capital but limits control; in-house provides quality control but requires facility investment. For CM approach, show your supplier evaluation and relationship development. For in-house, show facility plans and equipment requirements. Address how the strategy might evolve with scale.",
      },
      {
        category: "Customer Validation",
        question:
          "What evidence do you have that customers will pay your target price?",
        answer:
          "Hardware pricing is constrained by BOM plus margin targets. Validate that your target price works in the market: customer interviews, pilot pricing tests, competitive positioning. Show willingness-to-pay research and how it maps to your cost structure. For B2B hardware, include ROI analysis customers have validated. Investors have seen too many hardware startups with great technology but unworkable economics.",
      },
      {
        category: "Certification & Compliance",
        question:
          "What certifications are required and what's your compliance timeline?",
        answer:
          "Hardware certifications (UL, FCC, CE, industry-specific) are often gating to sales. Map your certification requirements with realistic timelines and costs. Show any preliminary testing or pre-certification work completed. Include regulatory compliance requirements for your target markets. Certification delays are common—show you've planned appropriately and built buffer into your timeline.",
      },
      {
        category: "Field Performance",
        question:
          "How have prototypes performed in real-world conditions?",
        answer:
          "Field testing reveals issues that lab testing misses. Present your field deployment experience: number of units deployed, environments tested, runtime accumulated. Show failure mode data and how you've addressed issues discovered. Include customer feedback from pilot users. If limited field data, acknowledge it and present your validation plan. Investors want evidence the product works outside the lab.",
      },
      {
        category: "Team Capability",
        question:
          "Does your team have the hardware development and manufacturing experience needed?",
        answer:
          "Hardware teams need different skills than software teams. Highlight relevant experience: prior hardware product development, manufacturing engineering, supply chain management, quality systems. Be honest about gaps and your hiring or advisory plan to fill them. Investors look for teams who've shipped physical products before—the challenges of hardware are learned through experience.",
      },
    ],
    metrics: [
      {
        label: "Bill of Materials Cost",
        value: "Within 2-3x of target",
        note: "Seed-stage BOM is typically higher than production target but should be in reasonable range with clear path to target through volume and design optimization.",
      },
      {
        label: "First Pass Yield",
        value: "60-75%",
        note: "Initial prototype FPY showing improvement trend. Demonstrates manufacturing process is stabilizing with root cause analysis on failures.",
      },
      {
        label: "Prototype Units Deployed",
        value: "20-100 units",
        note: "Enough field deployment to validate real-world performance. Quality of deployment (diverse conditions, active monitoring) matters as much as quantity.",
      },
      {
        label: "Design Iteration Status",
        value: "Gen 2-3 prototype",
        note: "Multiple prototype generations showing design convergence. ECO rate should be declining as you approach production readiness.",
      },
      {
        label: "Customer Pre-orders or LOIs",
        value: "$100K - $1M",
        note: "Evidence of customer willingness to pay, even if conditional. Kickstarter success, pilot commitments, or B2B LOIs provide validation.",
      },
      {
        label: "Certification Progress",
        value: "Planning complete, testing initiated",
        note: "Clear understanding of required certifications with preliminary testing or pre-certification work underway.",
      },
    ],
    objections: [
      {
        objection:
          "Hardware is hard—how do we know you can actually ship a product?",
        response:
          "Acknowledge the challenge directly and show evidence of capability. Present team hardware experience: products shipped, manufacturing scaled, problems solved. Show your prototype progress and the systematic approach to development. Reference advisory relationships with hardware experts. Demonstrate you understand the specific challenges (supply chain, manufacturing, certification) and have realistic plans to address them.",
      },
      {
        objection:
          "Your unit economics don't work at your current cost structure.",
        response:
          "Present your cost reduction roadmap with specific initiatives. Show component-by-component analysis of cost reduction opportunities: volume pricing curves from suppliers, design-for-cost changes identified, manufacturing process improvements. Reference industry benchmarks for cost reduction from prototype to production. Be honest about what's proven vs. assumed, but show a credible path to workable economics.",
      },
      {
        objection:
          "What happens if a key component becomes unavailable or prices spike?",
        response:
          "Demonstrate supply chain risk awareness and mitigation. Show your critical component analysis: single-source items, long lead-time components, price-volatile materials. Present mitigation strategies: dual-source qualification in progress, design alternatives identified, safety stock plans. Reference any supply commitments or strategic supplier relationships. Show you've learned from industry supply chain disruptions.",
      },
      {
        objection:
          "The timeline to production seems aggressive for hardware development.",
        response:
          "Present a detailed development timeline with realistic buffers. Reference comparable hardware products and their development timelines. Acknowledge common delay risks: certification surprises, supplier issues, design changes. Show your contingency planning and how you'd handle delays. If you have reasons for faster development (experienced team, simpler design, proven platform), explain them specifically.",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Hardware seed pitch decks must demonstrate both technical capability and manufacturing awareness. Investors evaluate whether you can build a product AND build a business around it. Show prototype progress, unit economics potential, and a realistic path to production scale.",
    sections: [
      {
        title: "Product Vision",
        goal: "Open with the product opportunity and your unique approach",
        guidance:
          "Show the product: images, video, or live demo if possible. Explain what it does and why it matters. Hardware investors want to see and touch—make the product tangible. Open with the user benefit, not the technology. Show the form factor and industrial design direction.",
      },
      {
        title: "Problem & Market",
        goal: "Frame the problem your hardware solves and the market opportunity",
        guidance:
          "Identify specific pain points your hardware addresses. Size the market bottom-up: target customers, their budgets, purchase frequency. Show why existing solutions are inadequate. For B2B, include ROI analysis. Hardware markets are often smaller than software—be realistic about TAM.",
      },
      {
        title: "Product & Technology",
        goal: "Demonstrate technical differentiation and current prototype status",
        guidance:
          "Present the technology that enables your product: what's innovative, what's proven. Show current prototype with specifications. Include comparison to alternatives on key performance dimensions. Address technical risks and your approach to solving them. Hardware credibility comes from specific technical details.",
      },
      {
        title: "Manufacturing Strategy",
        goal: "Show you understand the path from prototype to production",
        guidance:
          "Present your manufacturing approach: contract manufacturing vs. in-house, and why. Show BOM breakdown and cost trajectory to production. Include key supplier relationships and sourcing strategy. Address manufacturing risks and mitigation. This slide separates real hardware companies from projects.",
      },
      {
        title: "Unit Economics",
        goal: "Demonstrate path to viable product margins",
        guidance:
          "Show current prototype cost and target production cost with the path between them. Present target pricing and resulting gross margin. Include volume assumptions for cost improvements. For B2B, show customer ROI that supports your pricing. Investors need confidence in eventual margin structure.",
      },
      {
        title: "Traction & Validation",
        goal: "Prove customer interest and product-market fit potential",
        guidance:
          "Present evidence of demand: pre-orders, pilot deployments, customer feedback. Include any revenue or commitments. Show field testing results and customer testimonials. For crowdfunding products, show campaign performance. Hardware traction is harder than software—quality of evidence matters.",
      },
      {
        title: "Go-to-Market",
        goal: "Show how you'll reach customers and scale distribution",
        guidance:
          "Hardware distribution has unique challenges: channel relationships, logistics, support. Present your GTM strategy: direct vs. channel, geographic priorities, partnership approach. Include customer acquisition cost benchmarks if available. Address inventory and fulfillment strategy.",
      },
      {
        title: "Competitive Landscape",
        goal: "Position against existing solutions and potential competitors",
        guidance:
          "Map competitors: incumbent products, other startups, potential entrants. Show differentiation on axes that matter to customers. Include your moat: IP, manufacturing capability, customer relationships. Address why incumbents won't simply copy your approach.",
      },
      {
        title: "Team",
        goal: "Demonstrate hardware development and manufacturing capability",
        guidance:
          "Hardware teams need specific skills: mechanical/electrical engineering, manufacturing, supply chain. Highlight relevant experience on the team. Address gaps with hiring plan or advisors. Show you've shipped hardware before if applicable—this is highly valued.",
      },
      {
        title: "Funding & Milestones",
        goal: "Present capital needs and what this round achieves",
        guidance:
          "Show your raise amount and use of funds: development, tooling, initial production. Present milestones this capital achieves: design freeze, certification, first production run. Be realistic about total capital to scale—hardware investors appreciate honesty about the journey ahead.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Seed-stage hardware metrics focus on manufacturing readiness, cost trajectory, and customer validation. Unlike software, hardware companies are measured on physical product development milestones. These benchmarks help investors assess your progress toward production viability.",
    metrics: [
      {
        label: "Bill of Materials Cost",
        value: "2-3x production target",
        note: "Prototype BOM is higher than production but should show clear path to target. Component-level cost reduction plan should be documented.",
      },
      {
        label: "First Pass Yield",
        value: "60-75%",
        note: "Early production FPY showing improvement trend. Root cause analysis on failures with clear remediation plan.",
      },
      {
        label: "Prototype Generation",
        value: "Gen 2-4",
        note: "Multiple iterations showing design convergence. Each generation should address issues from previous with declining ECO rate.",
      },
      {
        label: "Field Units Deployed",
        value: "20-100 units",
        note: "Enough deployment to validate real-world performance. Runtime hours and environment diversity matter.",
      },
      {
        label: "Customer Commitments",
        value: "$100K - $1M",
        note: "Pre-orders, LOIs, or pilot commitments showing willingness to pay. Quality of commitment (binding vs. soft) matters.",
      },
      {
        label: "Gross Margin Target",
        value: "40-60% at scale",
        note: "Target gross margin at production volume. Current margin may be negative but path should be clear.",
      },
      {
        label: "Development Team Size",
        value: "3-8 engineers",
        note: "Core team with mechanical, electrical, and firmware capability. Manufacturing engineering expertise is valuable.",
      },
      {
        label: "Capital Raised",
        value: "$500K - $3M",
        note: "Hardware seed rounds tend larger than software given capital intensity. Includes non-dilutive (grants, crowdfunding).",
      },
      {
        label: "Certification Status",
        value: "Requirements identified, testing planned",
        note: "Clear understanding of required certifications (UL, FCC, CE) with timeline and budget.",
      },
      {
        label: "Time to Production",
        value: "12-24 months",
        note: "Realistic timeline from current state to production shipments. Include certification and manufacturing ramp.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Hardware seed diligence focuses on manufacturing feasibility, cost structure, and team capability. Investors will evaluate your physical prototypes and manufacturing plan in detail. Prepare comprehensive documentation on your product development and supply chain strategy.",
    items: [
      {
        item: "Detailed Bill of Materials with supplier quotes",
        rationale:
          "Component-level BOM with current costs and volume pricing from suppliers. Show cost reduction path from prototype to production quantities. Include critical component analysis.",
      },
      {
        item: "Prototype demonstration and technical specifications",
        rationale:
          "Working prototype for investor evaluation. Complete technical specifications showing performance against requirements. Be prepared for hands-on demonstration.",
      },
      {
        item: "Manufacturing strategy and supplier documentation",
        rationale:
          "Detailed manufacturing plan: approach, supplier relationships, facility requirements. Include CM quotes or partnership discussions. Show DFM analysis if completed.",
      },
      {
        item: "Quality data including First Pass Yield analysis",
        rationale:
          "FPY data with failure mode analysis and improvement plan. Show testing procedures and quality metrics. Document any field failures and corrective actions.",
      },
      {
        item: "Certification requirements and compliance roadmap",
        rationale:
          "Complete list of required certifications for target markets. Timeline and cost estimates for certification process. Any pre-certification testing completed.",
      },
      {
        item: "Field deployment data and customer feedback",
        rationale:
          "Documentation of field deployments: units, environments, runtime. Customer feedback compilation. Issue log and resolution status.",
      },
      {
        item: "IP documentation including patents and trade secrets",
        rationale:
          "Patent applications filed, trade secrets documented, freedom-to-operate analysis. Hardware IP extends beyond patents to manufacturing know-how.",
      },
      {
        item: "Team backgrounds with hardware experience",
        rationale:
          "Detailed resumes highlighting hardware development experience. Prior products shipped, manufacturing scaled. Be prepared for technical reference calls.",
      },
      {
        item: "Customer pipeline and pre-order documentation",
        rationale:
          "Evidence of customer interest: LOIs, pre-orders, pilot agreements. Include customer contacts for reference calls. Show pricing validation.",
      },
      {
        item: "Capital plan and financial model",
        rationale:
          "Detailed use of funds including tooling, inventory, and production ramp costs. Financial model with unit economics at scale. Show total capital path to profitability.",
      },
      {
        item: "Supply chain risk assessment",
        rationale:
          "Critical component analysis with risk assessment. Single-source items, long lead-time components, supply constraints. Mitigation strategies documented.",
      },
      {
        item: "Competitive analysis with technical benchmarking",
        rationale:
          "Detailed competitive landscape with performance comparisons. Pricing analysis and market positioning. Include potential competitive responses.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Seed-stage hardware investor updates focus on development progress and manufacturing readiness. Given the tangible nature of hardware, investors want to see physical progress—prototypes advancing, field testing expanding, and manufacturing challenges being solved.",
    sections: [
      {
        section: "Development Progress Summary",
        content:
          "Lead with the most significant product development achievement this period. Show tangible progress: prototype generations completed, testing milestones hit, design improvements made. Include photos or video of progress. Hardware investors want to see physical advancement.",
      },
      {
        section: "Manufacturing Readiness",
        content:
          "Report on manufacturing progress: BOM cost trajectory, FPY improvements, supplier relationships. Include any DFM changes or manufacturing process developments. Show you're systematically preparing for production scale.",
      },
      {
        section: "Customer & Market Validation",
        content:
          "Update on customer engagement: new pilots, pre-orders, feedback received. Include field deployment expansion and performance data. Report on pricing validation and market response. Show demand building alongside product development.",
      },
      {
        section: "Technical Milestones",
        content:
          "Detail engineering progress: features completed, performance improvements, issues resolved. Report on certification progress if applicable. Include any technical pivots or learning with impact on timeline.",
      },
      {
        section: "Quality & Reliability",
        content:
          "Report on quality metrics: FPY trends, field failure rates, MTBF data if available. Include root cause analysis on issues and corrective actions. Show quality improving as you approach production.",
      },
      {
        section: "Team & Operations",
        content:
          "Update on team: key hires, capability additions, any departures. Include facility or equipment developments. Report on any operational challenges and solutions.",
      },
      {
        section: "Financial Status",
        content:
          "Cash position, burn rate, and runway. Performance against budget with variance explanation. Include any non-dilutive funding (grants, pre-orders). Show capital efficiency in hardware development.",
      },
      {
        section: "Priorities & Asks",
        content:
          "Next period priorities with specific milestones. Areas where investor help is valuable: manufacturing introductions, customer connections, technical advisors. Flag any decisions needing board input.",
      },
    ],
  },
};

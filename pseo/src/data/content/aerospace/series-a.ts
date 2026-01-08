import type { IndustryStageContent } from "../types";

export const aerospaceSeriesAContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Series A aerospace companies must demonstrate they've retired significant technical risk and have clear commercial traction. Investors evaluate your path from prototype to production, customer commitments, and ability to execute against major milestones. The bar has risen—Series A aerospace rounds now require meaningful technical validation and customer evidence.",
    questions: [
      {
        category: "Technical Validation",
        question:
          "What technical milestones have you achieved and what risks remain?",
        answer:
          "Series A aerospace companies should be TRL 6-7 minimum: system prototype demonstrated in relevant environment. Present your technical accomplishments with evidence: test results, performance data, demonstration outcomes. Be transparent about remaining risks—investors respect honesty. Show your risk retirement roadmap and how this capital advances you toward production readiness (TRL 8-9).",
      },
      {
        category: "Commercial Traction",
        question:
          "What customer commitments do you have and what's the path to production contracts?",
        answer:
          "Series A requires more than LOIs—investors want to see binding commitments, pilot programs, or government contracts. Present your customer pipeline: confirmed orders, paid pilots, government awards. For government-focused companies, show contract backlog and pipeline. Quantify total customer commitment value and timeline to revenue recognition. Address customer concentration if applicable.",
      },
      {
        category: "Manufacturing Scale",
        question:
          "How will you scale from prototype to production manufacturing?",
        answer:
          "The prototype-to-production gap kills many aerospace companies. Present your manufacturing strategy: in-house vs. contract manufacturing, facility requirements, capital equipment needs. Show your MRL progression plan and key manufacturing milestones. Reference manufacturing partnerships, supplier qualifications, and production cost targets. Demonstrate you understand the manufacturing challenges as well as the technology.",
      },
      {
        category: "Unit Economics",
        question:
          "What are your unit economics at production scale and path to profitability?",
        answer:
          "Aerospace unit economics differ by segment. Show your current prototype costs, target production costs at various volumes, and the path between them. Include learning curve assumptions based on industry benchmarks. Present gross margin trajectory and break-even analysis. For service models, show customer lifetime value and acquisition costs. Investors need confidence in eventual profitability.",
      },
      {
        category: "Regulatory Progress",
        question:
          "What's your regulatory status and timeline to full certification?",
        answer:
          "Series A aerospace companies should have significant regulatory progress: certifications in progress, launch licenses advancing, or spectrum secured. Present your regulatory timeline with milestones achieved and remaining. Show any conditional approvals or regulatory engagement that reduces uncertainty. Address regulatory risks and mitigation strategies. This is often gating to revenue—show the critical path clearly.",
      },
      {
        category: "Capital Efficiency",
        question:
          "How much capital do you need to reach production and revenue, and what's the funding strategy?",
        answer:
          "Aerospace Series A investors need to understand total capital requirements. Present your funding plan through production: this round's milestones, subsequent rounds, and non-dilutive sources. Show capital efficiency: cost per milestone compared to industry benchmarks. Include sensitivity analysis—what if things take longer or cost more? Demonstrate you've planned for aerospace timeline realities.",
      },
      {
        category: "Team Scaling",
        question:
          "How will you scale the team for production and operations?",
        answer:
          "Series A is when aerospace teams scale significantly. Present your hiring plan: key roles, timeline, compensation benchmarks. Show organizational structure evolution. Address talent competition—how do you attract engineers from primes and other startups? Include manufacturing talent strategy if building production capability. Demonstrate you've thought through the organizational challenges of scaling.",
      },
      {
        category: "Competitive Position",
        question:
          "How has your competitive position evolved and how do you maintain advantage?",
        answer:
          "At Series A, you should have clearer competitive differentiation. Present win/loss data against competitors. Show technology or market advantages that have deepened. Address new entrants or incumbent moves into your space. Demonstrate customer feedback on why they chose you. Your moat should be strengthening as you progress—show evidence of this.",
      },
      {
        category: "Government vs Commercial Mix",
        question:
          "What's your revenue mix strategy between government and commercial?",
        answer:
          "Most aerospace companies serve both markets but with different emphasis. Present your current mix and evolution strategy. For government: contract types, margin profiles, competitive positioning for major programs. For commercial: market size, sales cycles, pricing power. Show how the mix affects your capital needs and growth trajectory. Address concentration risk in either segment.",
      },
      {
        category: "Exit Path",
        question:
          "What's the realistic exit timeline and likely path for aerospace in your segment?",
        answer:
          "Aerospace exits typically take longer than software. Present realistic exit scenarios: strategic acquisition by primes or tech giants, PE roll-up, or eventual IPO. Reference comparable transactions and valuation multiples. Show strategic interest you've attracted or could attract. Investors need to see liquidity path given the long journey—demonstrate you've mapped this thoughtfully.",
      },
    ],
    metrics: [
      {
        label: "Technology Readiness Level",
        value: "TRL 6-8",
        note: "Series A aerospace companies should have system prototype demonstrated in relevant operational environment, progressing toward qualification.",
      },
      {
        label: "Customer Commitments",
        value: "$5M - $50M pipeline",
        note: "Binding orders, government contracts, or firm commitments. LOIs alone are insufficient at Series A—need evidence of customer willingness to pay.",
      },
      {
        label: "Government Contract Value",
        value: "$2M - $10M awarded",
        note: "SBIR Phase II, NASA/DoD contracts, or other government funding provides both capital and validation. Larger awards demonstrate program-of-record potential.",
      },
      {
        label: "Manufacturing Progress",
        value: "MRL 5-7",
        note: "Capability to produce prototype in pilot line environment with path to production representative manufacturing.",
      },
      {
        label: "Regulatory Progress",
        value: "Certifications in progress",
        note: "Significant regulatory advancement: type certification applications filed, launch licenses in review, or spectrum allocated.",
      },
      {
        label: "Team Size",
        value: "15-40 people",
        note: "Scaled team with depth in engineering, manufacturing, and business development. Key functional leads in place.",
      },
    ],
    objections: [
      {
        objection:
          "Your production costs seem too optimistic given where you are in development.",
        response:
          "Present your cost breakdown with evidence: current prototype costs, identified cost reduction opportunities, and industry learning curve data. Show analogous programs and their cost trajectories. Reference supplier quotes for production volumes. Be prepared to defend assumptions with specific analysis. If costs are uncertain, acknowledge it and show range scenarios with your confidence levels.",
      },
      {
        objection:
          "The timeline to meaningful revenue is very long—why should we invest now?",
        response:
          "Aerospace investing requires long time horizons, but Series A should show accelerating progress. Present milestone-based value creation: what this capital achieves and how it changes the company's value. Show revenue ramp once production begins—aerospace companies often have steep revenue growth post-production start. Reference strategic acquisition premiums for companies at your stage. Demonstrate why this timing offers attractive entry point.",
      },
      {
        objection:
          "You're dependent on a few large customers—what's your concentration risk mitigation?",
        response:
          "Customer concentration is common in aerospace given large contract sizes. Present your diversification strategy over time. Show contract structures that provide some protection: multi-year terms, termination provisions. Demonstrate multiple customer opportunities in pipeline. Address the strategic value of anchor customers in aerospace: validation, production learning, reference value. Show path to broader customer base.",
      },
      {
        objection:
          "The primes could decide to build this themselves or acquire a competitor.",
        response:
          "Analyze prime contractor build-vs-buy calculus for your solution. Show why building internally is unattractive: capability gaps, timeline, opportunity cost. Reference primes' acquisition history in your space. Demonstrate relationship building with potential strategic acquirers. Show customer relationships that provide some insulation. The best answer shows you're positioned as an attractive acquisition target while building independent value.",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Series A aerospace pitch decks must demonstrate meaningful progress from seed while presenting a credible path to production and revenue. Lead with technical accomplishments and customer traction. Show you've de-risked the business and have a clear execution plan.",
    sections: [
      {
        title: "Accomplishments & Traction",
        goal: "Open with your strongest proof points",
        guidance:
          "Lead with what you've achieved since seed: TRL advancement, customer commitments, regulatory progress, team scaling. Show momentum and milestone achievement. Include key metrics: contract value, technical performance, cost improvements. This slide should demonstrate you execute.",
      },
      {
        title: "Technology & Product",
        goal: "Demonstrate technical maturity and differentiation",
        guidance:
          "Present your technology with evidence of validation: test data, demonstration results, performance specifications. Show competitive advantage with technical specificity. Address remaining technical risks and mitigation plans. Include development roadmap to production readiness.",
      },
      {
        title: "Market & Opportunity",
        goal: "Frame the market opportunity with customer evidence",
        guidance:
          "Size your market bottom-up based on specific customer segments and validated willingness to pay. Show market timing drivers: why customers need this now. Include customer quotes and evidence of demand. Address market evolution and your positioning as it develops.",
      },
      {
        title: "Customer Traction",
        goal: "Prove commercial demand with concrete evidence",
        guidance:
          "Present your customer pipeline: contracts signed, orders committed, pilots in progress. Show customer logos and commitment values. Include testimonials on why customers chose you. Address sales cycle dynamics and pipeline conversion. This is critical for Series A credibility.",
      },
      {
        title: "Business Model & Economics",
        goal: "Demonstrate path to profitable unit economics",
        guidance:
          "Present your pricing model and unit economics at scale. Show cost trajectory from prototype to production. Include gross margin evolution and break-even analysis. Address working capital dynamics given aerospace payment cycles. Show you understand the business, not just the technology.",
      },
      {
        title: "Manufacturing & Operations",
        goal: "Show credible path from prototype to production",
        guidance:
          "Present manufacturing strategy: approach, facility plans, supplier relationships. Show MRL progression and key manufacturing milestones. Address production cost targets and capital requirements. Include operational readiness plan. This differentiates real companies from science projects.",
      },
      {
        title: "Regulatory Status",
        goal: "Demonstrate regulatory progress and clear path forward",
        guidance:
          "Present regulatory achievements and timeline to completion. Show any certifications obtained or in progress. Address regulatory risks and mitigation. Include any government relationships that support regulatory progress. This is often gating to revenue—show you've made real progress.",
      },
      {
        title: "Competitive Landscape",
        goal: "Position against a more developed competitive field",
        guidance:
          "Updated competitive analysis showing evolution since seed. Include win/loss data against specific competitors. Show technical benchmarking where you have advantages. Address new entrants or incumbent moves. Demonstrate deepening moat.",
      },
      {
        title: "Team & Organization",
        goal: "Show team scaling and organizational capability",
        guidance:
          "Present team growth since seed and current organizational structure. Highlight key hires and their impact. Show hiring plan for this round with specific roles. Address organizational challenges of scaling. Include advisors and board if relevant.",
      },
      {
        title: "Financial Plan & Ask",
        goal: "Present clear path to Series B milestones",
        guidance:
          "Show financial projections through production ramp. Present this round's milestones and use of funds. Define Series B bar and your plan to exceed it. Include total capital path estimate. Show capital efficiency compared to industry benchmarks. Close with clear ask and conviction.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Series A aerospace benchmarks focus on technical and commercial de-risking. Investors compare your progress against industry timelines and capital efficiency standards. These metrics help demonstrate you're on track for production and revenue.",
    metrics: [
      {
        label: "Technology Readiness Level",
        value: "TRL 6-8",
        note: "System prototype demonstrated in relevant environment (TRL 6) progressing toward full system qualification (TRL 8).",
      },
      {
        label: "Manufacturing Readiness Level",
        value: "MRL 5-7",
        note: "Capability to produce prototype in production-representative environment with clear path to low-rate production.",
      },
      {
        label: "Contract Backlog",
        value: "$5M - $50M",
        note: "Binding customer commitments: government contracts, firm orders, or committed pilots. Higher is better for aerospace Series A.",
      },
      {
        label: "Government Funding",
        value: "$3M - $15M total awarded",
        note: "Cumulative non-dilutive government funding provides validation and extends runway. Major SBIR/STTR or prime contracts.",
      },
      {
        label: "Customer Count",
        value: "3-10 committed customers",
        note: "Enough customers to prove market interest without over-diversification. Quality and commitment level matter more than count.",
      },
      {
        label: "Team Size",
        value: "15-40 people",
        note: "Scaled team with engineering depth, manufacturing capability building, and business development presence.",
      },
      {
        label: "Monthly Burn Rate",
        value: "$200K - $800K",
        note: "Burn varies significantly by aerospace segment. Hardware-intensive development requires higher burn than software-centric.",
      },
      {
        label: "Time to Production Revenue",
        value: "18-36 months",
        note: "Realistic timeline from Series A to production-level revenue. Aerospace timelines are longer than software—plan accordingly.",
      },
      {
        label: "Capital Efficiency",
        value: "$3M - $8M per TRL level",
        note: "Rough benchmark for capital required per TRL advancement. Varies by system complexity and test requirements.",
      },
      {
        label: "Regulatory Completion",
        value: "50-75% of path completed",
        note: "Significant progress toward required certifications and licenses. Major regulatory risks should be reduced.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Series A aerospace diligence is comprehensive, covering technical depth, commercial validation, manufacturing readiness, and team capability. Prepare for deep technical reviews and extensive customer references. Documentation quality reflects company quality.",
    items: [
      {
        item: "Complete technical data package with test results and analysis",
        rationale:
          "Technical diligence will be thorough. Prepare system specifications, test reports, performance analysis, and failure mode documentation. Be ready for extended technical deep-dives with investor engineering advisors.",
      },
      {
        item: "Customer contracts and commitment documentation",
        rationale:
          "Investors verify commercial traction carefully. Prepare contracts, LOIs, purchase orders, and pilot agreements. Include customer reference contacts willing to take diligence calls.",
      },
      {
        item: "Manufacturing strategy and supplier documentation",
        rationale:
          "Detailed manufacturing plan including make-vs-buy analysis, supplier relationships, facility requirements, and capital equipment needs. Include supplier quotes for production quantities.",
      },
      {
        item: "Financial model with detailed cost assumptions",
        rationale:
          "Bottom-up financial model with component-level cost builds, manufacturing learning curve assumptions, and sensitivity analysis. Include working capital model given aerospace payment cycles.",
      },
      {
        item: "Regulatory compliance documentation and certification progress",
        rationale:
          "Comprehensive regulatory file: certifications obtained, applications in progress, agency correspondence, and compliance testing results. Include regulatory advisor relationships.",
      },
      {
        item: "IP portfolio with freedom-to-operate analysis",
        rationale:
          "Complete IP documentation: patents granted, applications pending, trade secrets, and comprehensive FTO analysis. Aerospace IP landscape is complex—show thorough analysis.",
      },
      {
        item: "Team evaluation and organizational documentation",
        rationale:
          "Detailed organizational chart, key employee backgrounds, employment agreements, and hiring plan. Be prepared for extensive reference checks on key team members.",
      },
      {
        item: "Competitive analysis with technical benchmarking",
        rationale:
          "Detailed competitive landscape including technical performance comparisons, pricing analysis, and market positioning. Include win/loss analysis against specific competitors.",
      },
      {
        item: "Government contract documentation and compliance status",
        rationale:
          "For companies with government revenue: contract documentation, compliance certifications, and contracting officer references. Include ITAR/EAR compliance documentation if applicable.",
      },
      {
        item: "Quality management system documentation",
        rationale:
          "AS9100 certification status or roadmap, quality procedures, and nonconformance tracking. Aerospace customers and investors expect rigorous quality systems.",
      },
      {
        item: "Facility and equipment assessment",
        rationale:
          "Current facility capabilities, planned expansions, equipment inventory, and capital equipment needs for production. Include lease agreements and expansion options.",
      },
      {
        item: "Cap table, prior investment terms, and corporate documentation",
        rationale:
          "Clean cap table, all prior investment documents, board composition, and corporate governance. Address any complex provisions or structure issues.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Series A aerospace investor updates demonstrate execution against plan and progress toward production and revenue milestones. Given the capital intensity and long timelines, maintaining investor confidence through transparent, substantive updates is essential for future fundraising.",
    sections: [
      {
        section: "Executive Summary",
        content:
          "Lead with overall status: on track, ahead, or behind plan with key highlights. Summarize biggest accomplishments and challenges. Include dashboard of critical metrics: TRL/MRL, contract value, cash position. This should be readable in 60 seconds and convey company trajectory.",
      },
      {
        section: "Technical & Product Progress",
        content:
          "Detailed update on technical milestones: tests completed, TRL advancement, design progress. Include performance data and comparison to targets. Address technical challenges and mitigation. Show development timeline status with any adjustments and rationale.",
      },
      {
        section: "Customer & Commercial Progress",
        content:
          "Update on customer pipeline: new contracts, pilot progress, proposal status. Include government program engagement and competitive outcomes. Report on customer feedback and product evolution. Show commercial momentum toward production revenue.",
      },
      {
        section: "Manufacturing & Operations",
        content:
          "Progress on manufacturing readiness: MRL advancement, supplier qualification, facility development. Report on production cost trajectory and unit economics evolution. Include any operational challenges and solutions.",
      },
      {
        section: "Regulatory Progress",
        content:
          "Update on certification and licensing progress: milestones achieved, applications advanced, agency feedback received. Include timeline status and any delays or accelerations. Address regulatory risks and mitigation.",
      },
      {
        section: "Team & Organization",
        content:
          "Report on team scaling: key hires, organizational changes, capability additions. Address any departures and mitigation. Share culture and engagement indicators. Include hiring priorities and recruiting pipeline.",
      },
      {
        section: "Financial Status",
        content:
          "Cash position, burn rate, and runway. Performance against budget with variance analysis. Include non-dilutive funding status and any changes to capital plan. Address fundraising timeline and preparation if approaching next round.",
      },
      {
        section: "Asks & Forward Look",
        content:
          "Specific areas where investor help is valuable: introductions, strategic advice, technical expertise. Preview next quarter priorities and key milestones. Flag any board decisions or strategic input needed.",
      },
    ],
  },
};

import type { IndustryStageContent } from "../types";

export const roboticsSeriesAContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Series A robotics companies must demonstrate production-grade reliability and a scalable deployment model. Investors evaluate whether you've solved the demo-to-production challenge and can scale customer deployments efficiently. The bar has risen—Series A now requires proven performance metrics from significant deployment hours and a clear path to positive unit economics.",
    questions: [
      {
        category: "Production Performance",
        question:
          "What's your task success rate across your deployed fleet?",
        answer:
          "Series A robotics companies should achieve 95%+ task success rates in production. Present fleet-wide performance data: aggregate success rate, distribution across sites, improvement trajectory. Show how success rate varies by task type, environment complexity, or site maturity. Address outlier sites with lower performance and your approach to improvement. Fleet-wide data is more credible than cherry-picked sites.",
      },
      {
        category: "Fleet Operations",
        question:
          "How do you manage and support your deployed fleet?",
        answer:
          "Scaling robotics requires fleet management capability. Present your operations infrastructure: remote monitoring, diagnostic capabilities, intervention support, software updates. Show metrics: support tickets per robot, remote resolution rate, average downtime. Include your team structure for supporting the fleet. Demonstrate you can support 10x more robots without proportional team scaling.",
      },
      {
        category: "Deployment Scalability",
        question:
          "How have you systematized deployment and what's the timeline now?",
        answer:
          "Series A should show deployment process maturity. Present current deployment timeline vs. early pilots—should be significantly improved. Show the systematization: playbooks, tooling, customer onboarding process. Include deployment success rate and common issues. Address how deployment scales with team size. Your deployment model is as important as your robot capability.",
      },
      {
        category: "Unit Economics",
        question:
          "What are your unit economics and how do they improve with scale?",
        answer:
          "Robotics unit economics include hardware margin, deployment costs, and ongoing support costs. Present current economics with trajectory: hardware gross margin, fully-loaded cost per deployment, support cost per robot. Show how economics improve with fleet scale. For RaaS models, show customer unit economics including churn. Investors need confidence that scaling improves—not just grows—the business.",
      },
      {
        category: "Customer Retention",
        question:
          "What's your customer retention and expansion pattern?",
        answer:
          "Customer retention proves the robot delivers lasting value. Present retention metrics: customer churn, robot utilization over time, expansion within accounts. Show why customers retain: ROI realization, integration depth, switching costs. For expansion, show pattern of customers adding robots or sites. Long-term customer relationships indicate product-market fit in robotics.",
      },
      {
        category: "Market Penetration",
        question:
          "How are you penetrating your target market and what's the growth trajectory?",
        answer:
          "Series A should show market traction beyond early adopters. Present your customer base: number of customers, fleet size, market segment distribution. Show growth trajectory and pipeline. Address how you're reaching customers: direct sales, partners, word-of-mouth. Include win/loss analysis against alternatives. Demonstrate you're building a sales motion that can scale.",
      },
      {
        category: "Manufacturing & Hardware",
        question:
          "How will you scale hardware production to meet demand?",
        answer:
          "Growing robot fleet requires production capability. Present your hardware strategy: in-house vs. CM, current capacity, scaling plan. Show hardware cost trajectory with volume. Address supply chain maturity and risks. Include quality metrics from production. Demonstrate you can build robots at the rate you need to sell them.",
      },
      {
        category: "Technology Roadmap",
        question:
          "How does your technology evolve to expand capabilities and markets?",
        answer:
          "Robotics platforms should expand over time. Present your technology roadmap: new capabilities, expanded task types, new environments. Show how you leverage deployed fleet data for improvement. Include next-generation hardware plans if relevant. Address how roadmap enables market expansion while maintaining focus. Show you're building a platform, not a point solution.",
      },
      {
        category: "Competition",
        question:
          "How do you win against competitors and potential large company entrants?",
        answer:
          "Robotics markets attract attention from large companies. Present competitive positioning: where you win, why customers choose you, competitive moat. Show win/loss data against specific competitors. Address the threat of Amazon, Google, or major automation players entering your space. Your answer should demonstrate durable differentiation, not just current features.",
      },
      {
        category: "Path to Profitability",
        question:
          "What's the path to profitability and how much capital is required?",
        answer:
          "Robotics is capital-intensive—investors need to see the path to self-sustaining economics. Present your profitability model: scale required, margin improvement trajectory, operating leverage. Show capital required to reach profitability. Include scenario analysis: faster growth requiring more capital vs. capital-efficient path. Demonstrate you understand the journey and have a realistic plan.",
      },
    ],
    metrics: [
      {
        label: "Fleet Size",
        value: "50-200+ deployed robots",
        note: "Total robots deployed in production operation. Fleet size indicates deployment scalability and market traction.",
      },
      {
        label: "Task Success Rate",
        value: "95%+",
        note: "Fleet-wide task success rate in production. Consistency across sites is as important as average.",
      },
      {
        label: "Customer Count",
        value: "15-50+ customers",
        note: "Active customers with deployed robots. Diversity across segments reduces concentration risk.",
      },
      {
        label: "Annual Recurring Revenue",
        value: "$2M - $10M ARR",
        note: "For RaaS models. Includes hardware lease and software/support components. Growth trajectory critical.",
      },
      {
        label: "Net Revenue Retention",
        value: "110-130%",
        note: "Revenue retention including expansion. Shows customers finding increasing value over time.",
      },
      {
        label: "Deployment Time",
        value: "3-7 days per site",
        note: "Time from arrival to production operation. Should show significant improvement from early pilots.",
      },
    ],
    objections: [
      {
        objection:
          "Your customer acquisition cost seems high for the contract values you're showing.",
        response:
          "Robotics sales often have higher CAC due to complexity of sale. Present your CAC breakdown and improvement trajectory. Show how CAC decreases with deployment systematization and market maturity. Include LTV analysis showing attractive LTV:CAC ratio. Reference expansion revenue that improves customer economics. Address sales efficiency improvements as you scale.",
      },
      {
        objection:
          "Your gross margins are lower than software—can this ever be a high-margin business?",
        response:
          "Robotics margins are lower than pure software but can be attractive. Present your margin structure: hardware, software/services split. Show trajectory toward target margins with scale. Include operating leverage that improves as fleet grows. Reference comparable robotics companies with mature margins. Demonstrate you understand the margin profile and are optimizing appropriately.",
      },
      {
        objection:
          "Large companies like Amazon are building similar robotics capabilities.",
        response:
          "Address the large company threat directly. Show why your focus gives you advantages: speed of iteration, customer intimacy, specialized capability. Present evidence that large company efforts aren't succeeding in your segment. Reference your customer relationships as moat. Demonstrate you're positioned where large companies are disadvantaged. Show how you'd partner vs. compete if appropriate.",
      },
      {
        objection:
          "Your deployment still seems to require too much customization per site.",
        response:
          "Present your deployment standardization progress. Show how customization requirements have decreased over time. Include tooling and process improvements that reduce site-specific work. Address remaining customization drivers and your plan to address them. Demonstrate that deployment is systemized and becoming more efficient with scale.",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Series A robotics pitch decks must demonstrate production-scale operation and a scalable business model. Lead with fleet performance data and customer evidence. Show you've solved deployment scalability and have a path to attractive unit economics.",
    sections: [
      {
        title: "Fleet Performance",
        goal: "Open with production-scale proof points",
        guidance:
          "Lead with fleet metrics: deployed robots, task success rate, runtime hours. Show trajectory over time. Include geographic and customer diversity. This slide should demonstrate you're operating at scale, not running extended pilots.",
      },
      {
        title: "Market & Problem",
        goal: "Frame the market opportunity with customer evidence",
        guidance:
          "Size the market based on deployed customer segments. Show why robotics is winning: labor dynamics, productivity demands, proven ROI. Include customer quotes on the problem. Address market timing and adoption trajectory.",
      },
      {
        title: "Robot Capability",
        goal: "Demonstrate production-grade technical capability",
        guidance:
          "Present robot capabilities with fleet-wide data. Show task types, environment range, and performance consistency. Include technology differentiation and moat. Address capability roadmap and expansion plans.",
      },
      {
        title: "Customer Evidence",
        goal: "Let customers prove value",
        guidance:
          "Present customer testimonials and case studies. Show retention and expansion patterns. Include customer ROI data—payback realized, not forecast. Address any customer churn with learnings.",
      },
      {
        title: "Unit Economics",
        goal: "Demonstrate viable business economics",
        guidance:
          "Present complete unit economics: hardware margin, deployment cost, support cost. Show trajectory toward target economics at scale. Include customer LTV and CAC analysis. Address working capital for hardware business.",
      },
      {
        title: "Fleet Operations",
        goal: "Show scalable operations capability",
        guidance:
          "Present operations infrastructure: monitoring, support, updates. Show support efficiency metrics and improvement. Include team structure and how it scales. Demonstrate you can operate a much larger fleet efficiently.",
      },
      {
        title: "Go-to-Market",
        goal: "Show scalable customer acquisition",
        guidance:
          "Present sales strategy and team. Show pipeline and conversion metrics. Include channel strategy if relevant. Address sales efficiency and how it improves with scale.",
      },
      {
        title: "Manufacturing & Hardware",
        goal: "Show production scalability",
        guidance:
          "Present hardware production strategy and current capability. Show cost trajectory with volume. Address supply chain maturity. Include quality metrics. Demonstrate you can build robots at growth rate.",
      },
      {
        title: "Competition",
        goal: "Position against evolved competitive landscape",
        guidance:
          "Updated competitive analysis with win/loss data. Address large company threat. Show deepening moat with scale. Include technology comparisons where advantaged.",
      },
      {
        title: "Team & Organization",
        goal: "Show organizational capability for scale",
        guidance:
          "Present team growth and structure. Highlight key hires and their impact. Show hiring plan for this round. Address organizational evolution required for 10x scale.",
      },
      {
        title: "Financial Plan & Ask",
        goal: "Present clear path to profitability",
        guidance:
          "Show revenue projections and path to break-even. Present this round's milestones and use of funds. Include scenario analysis for different growth rates. Close with clear ask and confidence in the opportunity.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Series A robotics benchmarks focus on fleet-scale performance, deployment efficiency, and business metrics. Investors evaluate whether you've proven the model works at scale and can achieve sustainable unit economics. These benchmarks demonstrate production maturity.",
    metrics: [
      {
        label: "Fleet Size",
        value: "50-200+ deployed robots",
        note: "Total robots in production operation. Indicates deployment scalability and market acceptance.",
      },
      {
        label: "Task Success Rate",
        value: "95%+",
        note: "Fleet-wide success rate with consistency across sites. Production-grade reliability is required.",
      },
      {
        label: "Runtime Hours",
        value: "100,000+ total fleet hours",
        note: "Cumulative operation hours demonstrating reliability and real-world validation.",
      },
      {
        label: "Customer Count",
        value: "15-50+",
        note: "Active customers with deployed robots. Segment diversity reduces concentration risk.",
      },
      {
        label: "Annual Revenue",
        value: "$2M - $10M",
        note: "Revenue from robot deployments including hardware, software, and services.",
      },
      {
        label: "Net Revenue Retention",
        value: "110-130%",
        note: "Revenue retention including expansion. Proves customers finding increasing value.",
      },
      {
        label: "Gross Margin",
        value: "40-60%",
        note: "Blended margin across hardware and services. Should show improvement trajectory.",
      },
      {
        label: "Deployment Time",
        value: "3-7 days",
        note: "Time to production operation at new site. Should show systematic improvement.",
      },
      {
        label: "Support Ratio",
        value: "50-100 robots per support person",
        note: "Fleet coverage efficiency. Should improve with better tooling and processes.",
      },
      {
        label: "Customer Churn",
        value: "<10% annual",
        note: "Customer retention rate. Low churn validates lasting value delivery.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Series A robotics diligence is comprehensive, covering fleet performance, operations scalability, unit economics, and team capability. Prepare for deep operational review including customer site visits and fleet data analysis.",
    items: [
      {
        item: "Fleet performance data with detailed analytics",
        rationale:
          "Comprehensive fleet metrics: success rates by site, task, and time period. Intervention data with categorization. Uptime and reliability statistics. Be prepared for detailed data analysis.",
      },
      {
        item: "Customer references across deployment types",
        rationale:
          "References from diverse customers: different sizes, environments, deployment maturity. Prepare 8-10 references willing to take diligence calls. Investors may request site visits.",
      },
      {
        item: "Unit economics model with supporting data",
        rationale:
          "Complete unit economics: hardware costs, deployment costs by type, support costs per robot. Customer LTV analysis. Working capital model. All with supporting data.",
      },
      {
        item: "Operations documentation and metrics",
        rationale:
          "Fleet operations infrastructure documentation. Support efficiency metrics. Remote monitoring capabilities. Software update process. Team structure and capacity.",
      },
      {
        item: "Deployment process documentation",
        rationale:
          "Systematized deployment process with playbooks. Time and cost data by deployment type. Success rate and issue categorization. Scaling plan.",
      },
      {
        item: "Sales and pipeline data",
        rationale:
          "Sales process documentation. Pipeline data with stage analysis. Win/loss analysis. Customer acquisition cost breakdown. Sales efficiency metrics.",
      },
      {
        item: "Manufacturing and supply chain documentation",
        rationale:
          "Hardware production process and capacity. Supply chain structure and risks. Quality metrics from production. Cost trajectory with volume.",
      },
      {
        item: "Financial statements and projections",
        rationale:
          "Audited or reviewed financials. Detailed projections with unit economics model. Cash flow analysis with working capital requirements. Scenario analysis.",
      },
      {
        item: "Technology and IP documentation",
        rationale:
          "System architecture and differentiation documentation. Patent portfolio. Freedom-to-operate analysis. Technology roadmap.",
      },
      {
        item: "Safety documentation and compliance",
        rationale:
          "Safety framework and testing results. Compliance status for relevant standards. Incident history and response. Insurance coverage.",
      },
      {
        item: "Competitive analysis",
        rationale:
          "Detailed competitive landscape with win/loss data. Technical comparisons. Large company threat assessment. Market positioning analysis.",
      },
      {
        item: "Team and organization documentation",
        rationale:
          "Organizational chart covering all functions. Key employee backgrounds. Hiring plan and budget. Culture and retention metrics.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Series A robotics investor updates focus on fleet growth, operational efficiency, and progress toward sustainable economics. Demonstrate you're scaling effectively while improving unit economics. Maintain transparency on challenges—robotics at scale surfaces new issues.",
    sections: [
      {
        section: "Executive Summary",
        content:
          "Lead with key metrics: fleet size, ARR/revenue, success rate, runway. Summarize biggest wins and challenges. Include customer and team highlights. This should convey company trajectory in 60 seconds.",
      },
      {
        section: "Fleet Performance",
        content:
          "Detailed fleet metrics: deployed robots, task success rate, uptime. Show trajectory and consistency across sites. Address any performance issues and remediation. Include new capabilities deployed.",
      },
      {
        section: "Customer & Revenue",
        content:
          "Revenue performance with breakdown. New customers and deployments. Retention and expansion metrics. Pipeline and bookings if applicable. Customer feedback themes.",
      },
      {
        section: "Operations Scaling",
        content:
          "Deployment velocity and efficiency. Support metrics and team productivity. Remote operations capability. Process improvements and tooling. Demonstrate operational leverage.",
      },
      {
        section: "Unit Economics Progress",
        content:
          "Current unit economics with trends. Cost reduction initiatives and results. Margin improvement trajectory. Working capital management.",
      },
      {
        section: "Product & Technology",
        content:
          "Technology roadmap progress. New capabilities shipped or in development. Fleet software updates and impact. Hardware evolution if relevant.",
      },
      {
        section: "Team & Organization",
        content:
          "Team growth and key hires. Organizational evolution. Any departures and mitigation. Culture and engagement indicators.",
      },
      {
        section: "Financial Status & Forward Look",
        content:
          "Cash position and runway. Performance vs. budget. Fundraising timing if relevant. Next quarter priorities and milestones. Specific investor asks.",
      },
    ],
  },
};

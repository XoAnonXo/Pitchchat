import type { IndustryStageContent } from "../types";

export const financeSeedContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Seed-stage fintech startups face intense scrutiny around regulatory pathways, unit economics, and the challenge of building trust in financial services. Investors evaluate your compliance infrastructure, banking relationships, and path to sustainable customer economics. The fintech playbook of 'grow now, profit later' has been discredited—seed stage investors now want to see efficient customer acquisition and clear paths to profitability.",
    questions: [
      {
        category: "Regulatory Strategy",
        question:
          "What licenses do you need and what's your regulatory strategy?",
        answer:
          "Fintech regulatory requirements vary dramatically by product type and geography. Present your regulatory map: which licenses you need (money transmitter, lending, banking charter, broker-dealer), current status, and timeline. Show your compliance approach: in-house expertise, regulatory counsel, compliance technology. Address your path to operating legally—investors have seen too many fintechs delayed or shut down by regulatory issues. Be specific about what you can and cannot do today.",
      },
      {
        category: "Banking Partnership",
        question:
          "Who are your banking partners and how stable are those relationships?",
        answer:
          "Most fintechs operate through banking partnerships (BaaS providers, sponsor banks). Present your partnership structure: who you're working with, contract terms, dependency risks. Address the recent banking partner challenges in fintech—show why your relationships are stable. If pursuing your own charter, explain the timeline and interim strategy. Investors want to understand your infrastructure dependencies and risks.",
      },
      {
        category: "Unit Economics",
        question:
          "What are your unit economics and customer acquisition costs?",
        answer:
          "Post-fintech bubble, unit economics scrutiny is intense. Present your customer acquisition cost with channel breakdown. Show customer lifetime value based on actual behavior, not projections. Calculate LTV:CAC ratio and payback period. Address cohort economics—do early customers behave differently than recent ones? Show path to improving economics at scale. Investors need confidence your growth is profitable, not just fast.",
      },
      {
        category: "Fraud & Risk",
        question:
          "How do you manage fraud and credit risk?",
        answer:
          "Financial services carry inherent fraud and credit risk. Present your risk framework: identity verification, fraud detection, credit underwriting (if applicable). Show your loss rates and how they compare to industry benchmarks. Address your risk infrastructure: vendor stack, proprietary models, human review. Include any early warning indicators you track. Risk management capability is essential for fintech credibility.",
      },
      {
        category: "Market Focus",
        question:
          "Why this market segment and what's your right to win?",
        answer:
          "Fintech is crowded—justify your market choice. Explain your target segment: who they are, why they're underserved, why existing solutions fail them. Show your unique advantages: distribution, product differentiation, cost structure, or trust. Present evidence of segment fit: early traction, customer feedback, segment-specific metrics. Your right to win should be specific and defensible.",
      },
      {
        category: "Revenue Model",
        question:
          "How do you make money and what's the revenue trajectory?",
        answer:
          "Fintech revenue models vary: interchange, interest margin, subscriptions, transaction fees, or premium features. Present your revenue model clearly: primary sources, margin structure, and trajectory. Show revenue you've generated or clear evidence of willingness to pay. Address how revenue model scales with customer base. Investors want to understand the economics engine, not just customer growth.",
      },
      {
        category: "Trust & Brand",
        question:
          "How do you build trust with customers for their financial services?",
        answer:
          "Financial services require deep customer trust. Present your trust-building approach: brand positioning, security communication, customer support quality. Show evidence of trust: NPS scores, customer testimonials, retention rates. Address any trust challenges your segment faces. Include security posture and how you communicate it. Trust is harder to build in finance—show you understand this.",
      },
      {
        category: "Technology Stack",
        question:
          "What's your technology architecture and what do you build vs. buy?",
        answer:
          "Fintech requires sophisticated technology across payments, compliance, and security. Present your architecture: core systems, vendor dependencies, proprietary components. Explain build vs. buy decisions with rationale. Address technology scalability and reliability requirements. Show security architecture given financial data sensitivity. Investors evaluate whether your tech foundation supports scale.",
      },
      {
        category: "Competitive Differentiation",
        question:
          "How do you compete against established banks and other fintechs?",
        answer:
          "Fintech faces competition from incumbents and well-funded startups. Present your competitive positioning: how you win against banks (experience, cost, access) and other fintechs (differentiation, segment focus). Show customer acquisition in competitive context. Address barriers to entry in your segment. Demonstrate sustainable differentiation, not just feature parity.",
      },
      {
        category: "Team Experience",
        question:
          "What financial services experience does your team have?",
        answer:
          "Fintech requires domain expertise in regulation, risk, and operations. Highlight team backgrounds: prior fintech or banking experience, compliance expertise, relevant domain knowledge. Be honest about gaps and plans to fill them. Show advisors who add credibility. Investors value teams who understand financial services complexity—it's different from general tech.",
      },
    ],
    metrics: [
      {
        label: "Monthly Active Users",
        value: "5,000 - 50,000",
        note: "Active customers using the product monthly. Quality of engagement matters as much as count.",
      },
      {
        label: "Monthly Transaction Volume",
        value: "$500K - $5M",
        note: "Total transaction volume processed monthly. Shows scale of financial activity.",
      },
      {
        label: "Customer Acquisition Cost",
        value: "$20 - $100",
        note: "Fully loaded CAC including marketing, sales, and onboarding costs. Varies significantly by segment.",
      },
      {
        label: "LTV:CAC Ratio",
        value: "2:1 - 3:1 (early)",
        note: "Lifetime value to acquisition cost ratio. Should show improvement trajectory toward 4:1+.",
      },
      {
        label: "Net Revenue Retention",
        value: "100-110%",
        note: "Revenue retention including expansion. Shows customers increasing usage over time.",
      },
      {
        label: "Gross Margin",
        value: "50-70%",
        note: "Gross margin on revenue after direct costs. Varies by model—interchange lower, SaaS higher.",
      },
    ],
    objections: [
      {
        objection:
          "Fintech customer acquisition costs are too high to build a profitable business.",
        response:
          "Address CAC concerns with specific analysis. Show your acquisition channels and efficiency by channel. Present CAC trajectory as you scale and optimize. Show LTV that justifies acquisition investment. Reference successful fintech models with your unit economics profile. If CAC is high, show the path to improvement with specific initiatives. Acknowledge the challenge while demonstrating your approach.",
      },
      {
        objection:
          "Banking partner risk is too high after recent fintech banking shutdowns.",
        response:
          "Acknowledge banking partner risks directly—they're real. Present your partnership structure and stability indicators: contract terms, relationship history, diversification. Show compliance posture that makes you attractive to banking partners. Address contingency plans if partner changes. Reference your specific situation vs. fintechs that faced issues. Demonstrate proactive risk management.",
      },
      {
        objection:
          "The big banks are investing heavily in digital—how do you compete?",
        response:
          "Address incumbent competition specifically. Show why banks struggle in your segment: organizational inertia, technology debt, conflicting incentives. Present your advantages: speed, focus, modern infrastructure, customer experience. Reference areas where fintechs have won despite bank investment. Demonstrate you're building in segments where banks are disadvantaged, not just competing on features.",
      },
      {
        objection:
          "Regulatory changes could shut down your business model.",
        response:
          "Regulatory risk is inherent in fintech. Present your regulatory strategy and how you've positioned for compliance. Show scenario analysis for regulatory changes in your space. Reference regulatory relationships and any proactive engagement. Demonstrate understanding of regulatory direction and how you're aligned. Show that regulation could also benefit you by raising barriers to entry.",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Fintech seed pitch decks must balance growth opportunity with regulatory and operational credibility. Lead with the customer problem and your unique approach to solving it. Address regulatory and risk management early—these are existential concerns. Show unit economics that work, not just growth metrics.",
    sections: [
      {
        title: "Problem & Market",
        goal: "Frame the financial services gap you're filling",
        guidance:
          "Identify specific financial pain points your segment faces. Show why existing solutions fail: banks too slow, expensive, or exclusive; other fintechs missing the mark. Size the market bottom-up based on your target segment. Include regulatory and market timing that enables your solution.",
      },
      {
        title: "Solution & Product",
        goal: "Demonstrate your product and differentiation",
        guidance:
          "Present your product with customer benefit focus. Show the experience vs. alternatives. Demonstrate key differentiators: speed, cost, access, experience. Include product screenshots or demo. Make it tangible how you improve customers' financial lives.",
      },
      {
        title: "Customer Traction",
        goal: "Prove early product-market fit",
        guidance:
          "Show traction metrics: users, volume, revenue, retention. Include customer testimonials and NPS. Demonstrate organic growth and word-of-mouth. Show cohort behavior indicating product-market fit. Quality of traction matters—engaged customers who love the product.",
      },
      {
        title: "Business Model",
        goal: "Explain how you make money sustainably",
        guidance:
          "Present revenue model clearly: interchange, interest, subscriptions, fees. Show current revenue or clear path to monetization. Present unit economics: CAC, LTV, payback period. Address margin structure and improvement trajectory. Demonstrate sustainable economics, not just growth.",
      },
      {
        title: "Regulatory Strategy",
        goal: "Address the compliance elephant in the room",
        guidance:
          "Present your regulatory requirements and current status. Show licensing roadmap and timeline. Include compliance infrastructure: team, technology, counsel. Address banking partnership structure if applicable. This slide shows you understand the regulatory landscape—essential for fintech credibility.",
      },
      {
        title: "Risk Management",
        goal: "Show you can manage financial services risk",
        guidance:
          "Present your risk framework: fraud prevention, identity verification, credit risk (if applicable). Show early loss rate data if available. Include your risk infrastructure and monitoring. Demonstrate you understand financial services risk—this differentiates serious fintechs from tech companies in finance.",
      },
      {
        title: "Competitive Landscape",
        goal: "Position against banks and other fintechs",
        guidance:
          "Map competitive landscape: incumbent banks, other fintechs, emerging players. Show differentiation axes that matter to customers. Address why customers choose you over alternatives. Include barriers to entry in your segment. Show sustainable competitive advantage.",
      },
      {
        title: "Team",
        goal: "Demonstrate fintech expertise and execution capability",
        guidance:
          "Highlight team financial services experience: prior fintech, banking, or relevant domain. Show technical capability for fintech infrastructure. Include compliance expertise. Address gaps with hiring plan or advisors. Fintech requires domain expertise—demonstrate yours.",
      },
      {
        title: "Go-to-Market",
        goal: "Show scalable customer acquisition",
        guidance:
          "Present acquisition strategy: channels, partnerships, viral loops. Show early channel performance and CAC by channel. Address how acquisition scales efficiently. Include any unique distribution advantages. Demonstrate you can acquire customers profitably.",
      },
      {
        title: "Funding & Milestones",
        goal: "Present capital needs and path to Series A",
        guidance:
          "Show raise amount and use of funds: product, compliance, growth, team. Present milestones this capital achieves: user targets, regulatory progress, revenue goals. Include runway and path to next round. Be realistic about fintech capital requirements and timelines.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Seed-stage fintech metrics focus on early product-market fit and sustainable unit economics. Post-bubble, investors heavily weight efficiency metrics alongside growth. These benchmarks help demonstrate you're building a business, not just acquiring users.",
    metrics: [
      {
        label: "Monthly Active Users",
        value: "5,000 - 50,000",
        note: "Active users with meaningful engagement. Quality matters—active users who transact regularly are more valuable than sign-ups.",
      },
      {
        label: "Monthly Transaction Volume",
        value: "$500K - $5M",
        note: "Total volume processed monthly. Shows financial activity scale and trust.",
      },
      {
        label: "Monthly Revenue",
        value: "$20K - $200K",
        note: "Revenue from all sources. Early revenue demonstrates willingness to pay and business model viability.",
      },
      {
        label: "Customer Acquisition Cost",
        value: "$20 - $100",
        note: "Fully loaded CAC. Varies by segment and model. Should show improvement trajectory.",
      },
      {
        label: "LTV:CAC Ratio",
        value: "2:1 - 3:1",
        note: "Early stage ratio showing path to 4:1+. Based on actual customer behavior, not projections.",
      },
      {
        label: "Net Promoter Score",
        value: "40+",
        note: "High NPS indicates product-market fit and supports organic growth critical in fintech.",
      },
      {
        label: "Gross Margin",
        value: "50-70%",
        note: "Varies by model. Interchange-based lower, subscription higher. Should be clear path to target.",
      },
      {
        label: "Monthly User Growth",
        value: "15-30%",
        note: "Month-over-month user growth. Quality of growth matters—organic preferred over paid.",
      },
      {
        label: "Regulatory Status",
        value: "Core licenses in progress",
        note: "Key licenses identified and application process underway. Banking partners secured or in discussion.",
      },
      {
        label: "Team Size",
        value: "5-15 people",
        note: "Core team with product, engineering, and compliance capability. Lean but sufficient for regulatory requirements.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Fintech seed diligence focuses on regulatory positioning, unit economics, and risk management capability. Investors conduct thorough review of compliance infrastructure and banking relationships. Prepare comprehensive documentation—quality reflects operational maturity.",
    items: [
      {
        item: "Regulatory licenses and compliance documentation",
        rationale:
          "Complete regulatory assessment: licenses required, current status, applications in progress. Compliance policies and procedures. Legal opinions on regulatory positioning. Compliance counsel relationships.",
      },
      {
        item: "Banking partner agreements and relationship documentation",
        rationale:
          "Banking partner contracts and terms. Relationship history and stability indicators. Diversification or backup plans. BaaS provider agreements if applicable.",
      },
      {
        item: "Unit economics analysis with cohort data",
        rationale:
          "Detailed CAC breakdown by channel. LTV analysis based on actual customer behavior. Cohort analysis showing economics evolution. Payback period calculation with supporting data.",
      },
      {
        item: "Risk management framework and loss data",
        rationale:
          "Fraud prevention approach and vendor stack. Identity verification process. Loss rate data if available. Risk monitoring and early warning indicators. Credit underwriting if applicable.",
      },
      {
        item: "Customer data and engagement metrics",
        rationale:
          "User metrics: actives, engagement patterns, retention. Transaction data: volume, frequency, value. Customer feedback and NPS data. Customer reference contacts.",
      },
      {
        item: "Technology architecture and security documentation",
        rationale:
          "System architecture overview. Security framework and certifications. Data protection approach. Vendor dependencies and risks. Scalability assessment.",
      },
      {
        item: "Financial model with revenue breakdown",
        rationale:
          "Revenue model documentation with assumptions. Margin analysis by product/segment. Path to profitability analysis. Scenario modeling for different growth rates.",
      },
      {
        item: "Competitive analysis",
        rationale:
          "Competitive landscape mapping. Differentiation documentation. Win/loss analysis if available. Market positioning strategy.",
      },
      {
        item: "Team backgrounds with fintech experience",
        rationale:
          "Detailed team backgrounds highlighting financial services experience. Compliance expertise assessment. Key person dependencies. Advisory relationships.",
      },
      {
        item: "Legal and corporate documentation",
        rationale:
          "Corporate structure optimized for regulated activity. Pending or threatened litigation. Customer agreements and terms of service. Privacy policy and data handling.",
      },
      {
        item: "Insurance coverage",
        rationale:
          "Cyber insurance, E&O coverage, D&O insurance. Coverage limits and exclusions. Fidelity bond if applicable.",
      },
      {
        item: "Cap table and prior funding",
        rationale:
          "Complete cap table. Prior funding terms. Any unusual provisions or structure issues.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Seed-stage fintech investor updates should balance growth metrics with unit economics and regulatory progress. Given the scrutiny on fintech profitability, emphasize sustainable growth and improving economics. Keep investors informed on regulatory developments—these are material to the business.",
    sections: [
      {
        section: "Key Metrics Summary",
        content:
          "Lead with core metrics: active users, transaction volume, revenue, key unit economics. Show trajectory over time. Include regulatory status and any updates. This dashboard should convey business health at a glance.",
      },
      {
        section: "Customer Growth & Engagement",
        content:
          "Detail user metrics: new users, active users, retention by cohort. Show engagement depth: transaction frequency, feature usage. Include customer feedback and NPS trends. Address any concerning patterns.",
      },
      {
        section: "Unit Economics Progress",
        content:
          "Report on CAC and channel performance. Show LTV evolution based on cohort behavior. Present payback period trajectory. Include margin trends. Demonstrate improving economics, not just growth.",
      },
      {
        section: "Product Development",
        content:
          "Update on product progress: features launched, improvements made, customer-driven changes. Include roadmap status and priorities. Address any technical challenges or infrastructure improvements.",
      },
      {
        section: "Regulatory & Compliance",
        content:
          "Update on licensing progress and timeline. Report any regulatory developments affecting the business. Include compliance infrastructure improvements. Banking partner relationship status. This section is critical for fintech.",
      },
      {
        section: "Risk & Operations",
        content:
          "Report on loss rates and fraud metrics. Include any risk events and response. Show operational improvements and scaling. Address any banking partner or infrastructure issues.",
      },
      {
        section: "Team & Organization",
        content:
          "Key hires and team changes. Compliance team development. Any departures and mitigation. Culture and retention indicators.",
      },
      {
        section: "Priorities & Asks",
        content:
          "Next period priorities with specific targets. Areas where investor help is valuable: introductions, regulatory expertise, strategic advice. Flag any significant decisions needing input.",
      },
    ],
  },
};

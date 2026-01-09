import type { IndustryStageContent } from "../types";

export const fintechSeedContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Fintech seed-stage startups face intense scrutiny on regulatory positioning, unit economics, and risk management fundamentals. Investors evaluate your understanding of financial services complexity, banking partnerships, and the ability to build trust with customers. The bar has risen—investors expect evidence of regulatory viability and sustainable economics, not just growth at any cost.",
    questions: [
      {
        category: "Regulatory",
        question: "What's your regulatory strategy and current licensing status?",
        answer:
          "Present your regulatory approach with specificity. Explain which licenses you need (state MTLs, federal banking charter, broker-dealer, etc.) and your path to obtaining them. If using a bank partnership or BaaS provider, explain the relationship structure and your compliance responsibilities. Address how regulations differ by state/market and your expansion strategy. Show you understand the regulatory landscape: 'We're pursuing money transmission licenses in 10 states covering 80% of our target market. We've secured licenses in NY, CA, and TX. Our compliance infrastructure is built for multi-state operation with automated state-specific reporting.'",
      },
      {
        category: "Banking Partnerships",
        question: "Who is your banking partner and how stable is that relationship?",
        answer:
          "Banking partnerships are critical infrastructure for most fintechs. Present your partner bank and BaaS provider (if applicable). Explain the relationship structure: program management, compliance responsibilities, economic terms. Address concentration risk and backup plans. Show evidence of partnership stability: contract duration, relationship tenure, expansion into new products. Reference any regulatory examinations the partner has passed. Acknowledge recent industry turbulence and how you've mitigated partner risk.",
      },
      {
        category: "Unit Economics",
        question: "What are your unit economics and path to profitability?",
        answer:
          "Fintech economics are under intense scrutiny. Present your unit economics clearly: customer acquisition cost by channel, revenue per user, lifetime value, payback period. Show the revenue model: interchange, subscription, interest margin, transaction fees. Address loss rates, fraud costs, and operational expenses that often surprise new fintech founders. Be honest about current economics and the path to improvement. Show you understand that growth without sustainable economics destroyed value in prior fintech cohorts.",
      },
      {
        category: "Risk Management",
        question: "How do you manage fraud, credit, and operational risk?",
        answer:
          "Risk management separates successful fintechs from failures. Present your risk framework: fraud prevention (identity verification, transaction monitoring), credit risk (if lending), operational risk (system reliability, vendor management). Show early metrics: fraud rates, dispute rates, loss rates. Explain your approach to risk modeling and how it improves with scale. Address specific risk vectors for your product type. Reference team experience in risk management from prior financial services roles.",
      },
      {
        category: "Customer Acquisition",
        question: "How do you acquire customers cost-effectively in a crowded market?",
        answer:
          "Fintech customer acquisition is expensive and competitive. Present your CAC by channel with realistic assumptions. Explain your differentiated acquisition strategy: product-led growth, viral mechanics, community, partnerships, or underserved segment focus. Show early evidence of what's working and what isn't. Address customer quality—not just volume—since bad customers create losses. Reference your target customer and why they choose you over alternatives.",
      },
      {
        category: "Competition",
        question: "How do you differentiate from neobanks, incumbents, and well-funded competitors?",
        answer:
          "Fintech is crowded. Present your competitive positioning honestly. Explain your specific differentiation: underserved segment, product capability, distribution advantage, or economics. Show evidence from customer conversations and competitive wins. Address the 'why now' question—what's changed that enables you to compete? Reference specific competitors and how you position against them. Acknowledge you can't compete on every dimension and explain where you win.",
      },
      {
        category: "Trust & Security",
        question: "How do you build trust and ensure security?",
        answer:
          "Trust is foundational for financial services. Present your security infrastructure: data encryption, access controls, SOC 2 compliance (or path to it), PCI compliance if handling cards. Explain your approach to earning customer trust: transparent communication, responsive support, FDIC/SIPC insurance messaging. Address how you handle security incidents and customer disputes. Show you understand that trust takes years to build and seconds to destroy.",
      },
      {
        category: "Team",
        question: "What financial services experience does your team have?",
        answer:
          "Fintech requires domain expertise. Present your team's financial services credentials: banking, payments, lending, or regulatory experience. Address the full stack: product, compliance, risk, operations, and technology. If gaps exist, explain your advisory board or hiring plans. Show you have access to regulatory and banking relationship expertise. Reference specific relevant experiences: 'Our CRO spent 8 years at a top-10 U.S. bank building risk infrastructure. Our compliance lead held senior roles at a licensed neobank through its multi-state licensing process.'",
      },
      {
        category: "Market",
        question: "How large is your addressable market?",
        answer:
          "Present bottom-up fintech market sizing. Start with your specific customer segment and use case. Show current spending on existing solutions and your value proposition. Reference industry data on transaction volumes, account numbers, or lending originations. Address expansion paths from your initial wedge. Avoid top-down 'disrupting $X trillion in financial services' claims—fintech investors see through them. Show you understand your specific entry point.",
      },
      {
        category: "Milestones",
        question: "What does this round achieve and what triggers Series A?",
        answer:
          "Present concrete milestones: customer targets, revenue metrics, regulatory achievements, and product development. Show you understand Series A requirements for fintech: typically $500K-$2M ARR, proven unit economics, regulatory foundation, and evidence of retention. Explain the path from current state to those milestones. Be realistic about timeline—fintech development often takes longer than founders expect due to regulatory and partnership complexity.",
      },
    ],
    metrics: [
      {
        label: "Monthly Active Users",
        value: "5,000 - 50,000",
        note: "Active users engaging with core product features. Quality matters more than quantity—focus on users generating revenue.",
      },
      {
        label: "Monthly Recurring Revenue",
        value: "$20K - $200K MRR",
        note: "Revenue run rate from subscriptions, interchange, or transaction fees. Path to $1M+ ARR for Series A.",
      },
      {
        label: "Customer Acquisition Cost",
        value: "$20 - $100",
        note: "Blended CAC across channels. Varies significantly by customer type (consumer vs. SMB).",
      },
      {
        label: "Revenue Per User",
        value: "$5 - $30/month",
        note: "Monthly revenue per active user. Depends heavily on product type and monetization model.",
      },
      {
        label: "Fraud/Loss Rate",
        value: "< 1%",
        note: "Fraud losses and disputes as percentage of transaction volume. Critical to demonstrate risk management.",
      },
      {
        label: "Regulatory Status",
        value: "Licensed or partner-enabled",
        note: "Either direct licenses in key states or established BaaS/partner bank relationship enabling compliant operation.",
      },
    ],
    objections: [
      {
        objection: "Fintech is too competitive and unit economics never work.",
        response:
          "Address the challenge directly: 'We agree unit economics are critical—that's why we've built our model differently. Our CAC is $45 versus industry average of $100+ because we focus on partner-led distribution through payroll providers and vertical SaaS channels. Our ARPU is $25/month, higher than typical consumer fintechs, because we serve SMBs managing cash flow and payments. Our 18-month LTV:CAC is 3:1 with clear path to 5:1 through cross-sell. We're not trying to acquire every customer—we're focused on the segment where economics work.'",
      },
      {
        objection: "Banking partnerships are unstable and create existential risk.",
        response:
          "Acknowledge and address: 'Partner risk is real, which is why we've structured our business to mitigate it. We have relationships with two BaaS providers and direct relationships with our sponsor bank leadership. Our contract runs through 2026 with renewal rights. We've also designed our technology to be portable—we can migrate to a new partner in 90 days if needed. Longer-term, our growth creates optionality for our own charter or deeper partnership structures.'",
      },
      {
        objection: "Regulatory risk is too high in the current environment.",
        response:
          "Present your regulatory strategy: 'We've built compliance-first from day one. Our compliance team has experience from a top-20 bank and a licensed fintech. We maintain a multi-state license portfolio rather than relying on a single license. Our product design avoids regulatory gray areas—we know exactly which regulations apply and we comply fully. We've invested in compliance infrastructure that will be an asset, not a liability, as we scale. Recent regulatory actions have targeted companies with weak compliance—that's not us.'",
      },
      {
        objection: "Your target customer segment is too risky or unprofitable.",
        response:
          "Address customer quality directly: 'Our underwriting approach is more sophisticated than it appears. We use cash-flow data, payroll history, and transaction behavior signals to identify customers who look risky on traditional metrics but actually perform well. Our loss rates are below industry benchmarks at under 1%. We've also built our product to generate revenue without requiring credit extension—interchange and subscription revenue provide base economics even before any lending. Our customer segment is underserved precisely because traditional providers don't understand the risk properly.'",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Fintech seed decks must demonstrate regulatory viability, sustainable unit economics, and risk management sophistication. Investors expect domain expertise and evidence you can navigate financial services complexity. Lead with your differentiated approach to an underserved segment, show early traction, and present a credible regulatory and partnership strategy.",
    sections: [
      {
        title: "Problem",
        goal: "Define a specific financial services pain point with clear customer and economic impact",
        guidance:
          "Fintech investors see many 'banking is broken' pitches. Differentiate by naming the exact customer, the specific pain, and the economic impact. Quantify: fees paid, time wasted, opportunities missed, or financial outcomes affected. Show you understand how this problem is currently addressed and why solutions fail your target customer. Reference your personal connection to or deep understanding of the problem.",
      },
      {
        title: "Solution",
        goal: "Demonstrate your product and its differentiated value proposition",
        guidance:
          "Show the product, not just describe it. Explain what makes your approach different: better economics, underserved segment focus, technology advantage, or distribution innovation. Address the regulatory structure that enables your solution. Make clear how you make money and why that's sustainable. The best fintech solutions feel obvious in retrospect—show why this approach works now.",
      },
      {
        title: "Market Opportunity",
        goal: "Size the opportunity with fintech-specific rigor",
        guidance:
          "Build bottom-up from your specific customer segment. Reference transaction volumes, account numbers, or addressable spending. Show current economics of the market: what do customers pay today? Present your entry point and expansion path. Avoid 'disrupting X trillion' claims—show you understand your specific wedge. Reference comparable fintech company market sizes.",
      },
      {
        title: "Traction",
        goal: "Prove early product-market fit with quality metrics",
        guidance:
          "Lead with metrics that matter: active users, transaction volume, revenue, retention. Show customer quality, not just quantity. Include evidence of engagement: usage frequency, transaction patterns, NPS. Present customer testimonials that demonstrate real value delivered. If early, show waitlist, pilot results, or evidence of demand. Quality of customers matters as much as quantity in fintech.",
      },
      {
        title: "Business Model & Unit Economics",
        goal: "Demonstrate sustainable economics and path to profitability",
        guidance:
          "Present your revenue model clearly: interchange, subscriptions, interest margin, transaction fees. Show current unit economics: CAC, LTV, revenue per user, contribution margin. Be honest about what's working and what isn't. Show the path to improved economics at scale. Address variable costs that scale with growth: processing, compliance, risk losses. Fintech investors are highly skeptical of economics—demonstrate mastery.",
      },
      {
        title: "Regulatory & Partnerships",
        goal: "Show regulatory competence and partnership stability",
        guidance:
          "Present your regulatory structure: which licenses, which partnerships, how you operate compliantly. Show your banking or BaaS relationships. Address regulatory risk factors for your product type. Reference team expertise in navigating financial services regulation. Include compliance and risk management as competitive advantages, not just costs.",
      },
      {
        title: "Risk Management",
        goal: "Demonstrate risk management sophistication",
        guidance:
          "Present your approach to fraud, credit risk (if applicable), and operational risk. Show early metrics: fraud rates, loss rates, dispute rates. Explain how risk management improves with scale and data. Reference team experience in financial services risk. This section differentiates sophisticated fintech founders from those who don't understand the business.",
      },
      {
        title: "Competition",
        goal: "Position credibly in a crowded landscape",
        guidance:
          "Include all relevant competitors: neobanks, incumbents, other startups. Position honestly—you won't win on every dimension. Explain your specific advantage and which customers care about it. Show evidence: customer feedback, competitive wins. Address why incumbents won't copy your approach. Demonstrate deep competitive knowledge.",
      },
      {
        title: "Team",
        goal: "Show domain expertise and ability to execute",
        guidance:
          "Highlight financial services experience: banking, payments, lending, compliance, risk. Show you have the expertise to navigate fintech complexity. Address gaps and hiring plans. Include advisors with relevant experience. Reference relevant prior company experience. Team is critical in fintech—domain expertise is expected.",
      },
      {
        title: "Ask & Milestones",
        goal: "Clear ask with realistic fintech milestones",
        guidance:
          "State round size and use of funds. Present milestones that matter for fintech Series A: customer metrics, revenue targets, regulatory achievements, risk performance. Be realistic about timeline—fintech takes longer than pure software. Show the path to Series A requirements and what risks remain.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Fintech seed metrics focus on customer quality, unit economics, and risk management. Growth matters less than sustainable economics and demonstrated ability to manage financial services complexity. Investors benchmark against typical fintech development patterns and unit economics targets.",
    metrics: [
      {
        label: "Monthly Active Users",
        value: "5,000 - 50,000",
        note: "Users engaging meaningfully with core features. Quality and engagement matter more than raw numbers.",
      },
      {
        label: "Monthly Revenue",
        value: "$20K - $200K MRR",
        note: "Recurring revenue from interchange, subscriptions, or transaction fees. Path to $100K+ MRR for Series A.",
      },
      {
        label: "Revenue Per User",
        value: "$5 - $30/month",
        note: "Monthly revenue per active user. Varies by product type—lending higher, payments lower.",
      },
      {
        label: "Customer Acquisition Cost",
        value: "$20 - $100",
        note: "Blended CAC. Consumer typically $30-80, SMB can be higher. Channel mix significantly impacts.",
      },
      {
        label: "LTV:CAC Ratio",
        value: "2:1 - 3:1",
        note: "Early-stage ratio with clear path to 4:1+. Use actual customer data, not projections.",
      },
      {
        label: "30-Day Retention",
        value: "60-80%",
        note: "Percentage of users active 30 days after signup. Engagement quality matters.",
      },
      {
        label: "Fraud Rate",
        value: "< 1%",
        note: "Fraud losses as percentage of volume. Below 0.5% is excellent, above 2% is concerning.",
      },
      {
        label: "Dispute Rate",
        value: "< 1%",
        note: "Customer disputes and chargebacks. High rates indicate product or customer quality issues.",
      },
      {
        label: "Net Promoter Score",
        value: "40+",
        note: "Customer satisfaction indicator. Fintech NPS varies widely—trust and reliability drive scores.",
      },
      {
        label: "Regulatory Status",
        value: "Compliant operation established",
        note: "Licensed directly or operating compliantly through partner. Clear regulatory path defined.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Fintech seed diligence emphasizes regulatory compliance, banking partnerships, unit economics, and risk management foundations. Investors verify your ability to operate a compliant financial services business and your understanding of the economic realities.",
    items: [
      {
        item: "Regulatory compliance documentation",
        rationale:
          "Licenses held or applied for. BaaS/partner agreements with compliance responsibilities defined. Compliance policies and procedures. State-by-state operational status. Evidence of regulatory examination readiness.",
      },
      {
        item: "Banking partnership agreements",
        rationale:
          "Sponsor bank agreement with terms summary. BaaS platform contract if applicable. Revenue share and fee structures. Term length and termination provisions. Backup partner relationships if any.",
      },
      {
        item: "Unit economics analysis",
        rationale:
          "CAC by channel with methodology. LTV calculation with assumptions. Revenue per user breakdown. Contribution margin analysis. Path to profitability model.",
      },
      {
        item: "Customer cohort analysis",
        rationale:
          "Cohort retention curves (weekly and monthly). Revenue retention by cohort. Customer quality metrics by acquisition channel. Engagement and usage patterns.",
      },
      {
        item: "Risk management documentation",
        rationale:
          "Fraud prevention approach and current metrics. Credit policy (if lending). Transaction monitoring procedures. Dispute handling process. Vendor and operational risk management.",
      },
      {
        item: "Security and compliance certifications",
        rationale:
          "SOC 2 report or audit timeline. PCI compliance status (if handling cards). Data security policies. Incident response procedures. GLBA compliance documentation.",
      },
      {
        item: "Customer data with reference contacts",
        rationale:
          "Customer list with key metrics. Cohort information. Reference customers for diligence calls. Customer feedback and NPS data.",
      },
      {
        item: "Competitive analysis",
        rationale:
          "Comprehensive competitive landscape. Differentiation evidence. Win/loss analysis. Pricing comparison. Competitive positioning rationale.",
      },
      {
        item: "Team backgrounds with fintech credentials",
        rationale:
          "Detailed CVs emphasizing financial services experience. Compliance and risk team credentials. Advisory board with relevant expertise. Key hire plan.",
      },
      {
        item: "Financial model with assumptions",
        rationale:
          "18-24 month projections with explicit assumptions. Unit economics build-up. Scenario analysis. Historical accuracy if applicable. Capital efficiency metrics.",
      },
      {
        item: "Technology and infrastructure documentation",
        rationale:
          "Architecture overview. Third-party dependencies. Scaling approach. Security infrastructure. Data handling and privacy compliance.",
      },
      {
        item: "Legal and corporate documentation",
        rationale:
          "Corporate structure. Cap table. Material contracts. Any regulatory correspondence or issues. IP ownership documentation.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Fintech investor updates should emphasize growth metrics, unit economics, and risk performance. Investors need to see sustainable economics alongside growth. Be transparent about regulatory developments and partnership health—these are existential for fintech companies.",
    sections: [
      {
        section: "Key Metrics Dashboard",
        content:
          "Lead with core fintech metrics: active users, transaction volume, revenue, unit economics. Show growth rates and trends. Include risk metrics: fraud rate, dispute rate, loss rates. Present cohort retention. Use consistent formatting for easy tracking. Fintech investors scrutinize economics—show them prominently.",
      },
      {
        section: "Customer Growth & Quality",
        content:
          "New customer additions with channel breakdown. Customer quality metrics: engagement, transaction patterns, revenue per user. Activation and retention improvements. Notable customer segments or use cases. Customer feedback and satisfaction indicators.",
      },
      {
        section: "Unit Economics Progress",
        content:
          "CAC trends by channel. Revenue per user evolution. Contribution margin progress. LTV:CAC improvements. Path to target economics. Be honest about what's working and what isn't.",
      },
      {
        section: "Risk & Compliance",
        content:
          "Fraud and loss metrics. Dispute trends. Regulatory developments (licenses, examinations, policy changes). Compliance team and infrastructure updates. Any risk events and learnings. This section can't be skipped in fintech.",
      },
      {
        section: "Partnership Health",
        content:
          "Banking partner relationship status. BaaS platform developments. Contract renewals or expansions. Any partnership risks or transitions. New partnership opportunities.",
      },
      {
        section: "Product & Technology",
        content:
          "Feature releases and impact. Roadmap progress. Infrastructure improvements. Security enhancements. Technical debt management.",
      },
      {
        section: "Team & Operations",
        content:
          "Key hires and recruiting. Compliance and risk team development. Operational improvements. Culture indicators. Any departures and context.",
      },
      {
        section: "Financial Position & Asks",
        content:
          "Cash position and runway. Burn rate trends. Revenue vs. plan. Path to milestones. Specific asks: introductions, expertise, regulatory guidance. Fintech investors often have valuable network and expertise—leverage it.",
      },
    ],
  },
};

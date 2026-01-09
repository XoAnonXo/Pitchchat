import type { IndustryStageContent } from "../types";

export const fintechSeriesAContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Series A fintech companies must demonstrate proven unit economics, regulatory compliance at scale, and sustainable growth. Investors evaluate your ability to build a durable financial services business—not just a growth story. The bar has risen: investors expect profitability path clarity, strong risk management, and evidence you can navigate an increasingly complex regulatory environment.",
    questions: [
      {
        category: "Unit Economics",
        question: "What are your fully-loaded unit economics and path to profitability?",
        answer:
          "Series A requires proven, not projected, unit economics. Present your current CAC by channel, fully-loaded (including attribution, creative, and overhead). Show LTV based on actual cohort behavior, not projections. Present contribution margin including all variable costs: processing, fraud, support, compliance. Show CAC payback period with actual data. Explain your path to profitability: what needs to improve and how. Reference how you compare to public fintech benchmarks. Be prepared for deep scrutiny—fintech economics have disappointed many investors.",
      },
      {
        category: "Regulatory",
        question: "What's your regulatory position and expansion strategy?",
        answer:
          "Series A fintech must have regulatory foundation established. Present your current licensing status: which states, which products, any limitations. Explain your regulatory expansion strategy: state-by-state licensing, federal charter considerations, or international. Address recent regulatory developments affecting your category and how you're positioned. Show your compliance infrastructure: team, technology, policies. Reference any regulatory examinations or audits completed. Demonstrate that compliance is a competitive advantage, not just a cost center.",
      },
      {
        category: "Risk Performance",
        question: "How have your risk metrics performed and evolved?",
        answer:
          "Risk management is proven by results, not policies. Present your fraud rates, loss rates, and dispute rates with trends over time. Show how metrics compare to industry benchmarks. Explain what you've learned and how risk models have improved. Address any risk events and how you handled them. For lending products, show credit performance across vintages. Reference team expertise in risk management. Show that risk is integrated into product and growth decisions, not just monitored after the fact.",
      },
      {
        category: "Growth Efficiency",
        question: "How efficiently are you growing and what's your customer acquisition strategy?",
        answer:
          "Series A investors evaluate growth efficiency, not just growth rate. Present growth rate alongside CAC and payback. Show customer acquisition by channel with efficiency metrics. Explain your differentiated acquisition strategy: product-led growth, viral mechanics, partnerships, or segment focus. Address customer quality—not just volume—and how quality has evolved. Show evidence of organic growth and referrals. Reference your most efficient channels and plans to scale them.",
      },
      {
        category: "Banking Partnerships",
        question: "How stable are your banking relationships and what's your infrastructure strategy?",
        answer:
          "Banking partnerships are under scrutiny post-2023. Present your current partner relationships: sponsor bank, BaaS provider, payment processors. Explain contract terms, concentration risk, and backup plans. Address how you've adapted to industry disruption: partner bank failures, regulatory pressure on BaaS. Show evidence of partnership stability: tenure, expansions, executive relationships. Discuss long-term infrastructure strategy: charter consideration, multi-partner approach, vertical integration.",
      },
      {
        category: "Revenue Diversification",
        question: "How diversified is your revenue and what's the expansion strategy?",
        answer:
          "Revenue concentration creates risk. Present your revenue mix: interchange, subscriptions, interest income, fees, etc. Show how mix has evolved and expansion plans. Address cross-sell opportunities and evidence of success. Explain your product expansion roadmap and sequencing rationale. For single-product companies, show the depth of that product and stickiness metrics. Reference comparable companies' revenue evolution and your path to similar diversification.",
      },
      {
        category: "Customer Retention",
        question: "What's your customer retention and how sticky is your product?",
        answer:
          "Fintech retention is hard-won. Present logo retention and revenue retention separately. Show engagement metrics: login frequency, transaction volume, feature usage. Explain what drives retention: switching costs, product depth, network effects. Address customer segments with different retention patterns. Show cohort behavior over time—are customers deepening usage? Reference your approach to reducing churn and evidence of improvement. Strong retention justifies higher CAC.",
      },
      {
        category: "Competition",
        question: "How has the competitive landscape evolved and how are you positioned?",
        answer:
          "Fintech competition has intensified. Present the current competitive landscape: neobanks, incumbents, vertical fintechs, and embedded finance. Show how your positioning has evolved and evidence of differentiation: win rates, customer preference data, feature comparison. Address specific competitor moves and your response. Explain your sustainable differentiation: customer segment depth, product capability, distribution advantage, or economics. Be honest about where you win and lose.",
      },
      {
        category: "Team",
        question: "How has your team evolved for Series A scale?",
        answer:
          "Series A requires leadership depth. Present key hires since seed: commercial, compliance, risk, product, engineering leadership. Show organizational structure and functional coverage. Address your ability to recruit senior fintech talent—reference specific hires and their backgrounds. Explain how you've evolved from founder-led to scalable operations. Show your advisory network and board composition. Address any team gaps and hiring plan.",
      },
      {
        category: "Milestones",
        question: "What does this round achieve and what triggers Series B?",
        answer:
          "Present concrete milestones: revenue targets ($5-15M ARR typical for fintech A→B), profitability progress, product expansion, geographic growth. Show you understand Series B requirements: typically path to profitability, demonstrated unit economics at scale, and durable competitive position. Explain the 18-24 month plan. Be realistic about fintech's longer timeline to scale economics. Address key risks and how you'll mitigate them.",
      },
    ],
    metrics: [
      {
        label: "Annual Recurring Revenue",
        value: "$2M - $10M ARR",
        note: "Series A fintech typically shows $2-10M ARR with clear path to $20M+. Quality of revenue matters as much as size.",
      },
      {
        label: "Revenue Growth Rate",
        value: "100-200% YoY",
        note: "Year-over-year growth. Efficiency matters more than pure growth rate—show burn multiple.",
      },
      {
        label: "Net Revenue Retention",
        value: "100-120%",
        note: "Revenue retention including expansion, contraction, and churn. Above 100% indicates product stickiness.",
      },
      {
        label: "CAC Payback Period",
        value: "12-18 months",
        note: "Months to recover acquisition cost. Under 12 is excellent, over 24 requires strong justification.",
      },
      {
        label: "Fraud/Loss Rate",
        value: "< 0.5%",
        note: "Fraud and credit losses as percentage of volume. Trending improvement expected at Series A scale.",
      },
      {
        label: "Contribution Margin",
        value: "30-50%",
        note: "Revenue minus all variable costs. Path to 50%+ at scale expected.",
      },
    ],
    objections: [
      {
        objection: "Your unit economics don't support venture returns.",
        response:
          "Address with data and trajectory: 'Our current CAC payback is 16 months with 30% contribution margin. Here's our path to 12-month payback: reducing CAC through [specific initiatives], increasing ARPU through [cross-sell products], and improving margin through [operational leverage]. At scale, comparable fintechs achieve 60%+ contribution margins. Our cohort data shows improving economics with each vintage. We're building for sustainable unit economics, not growth at any cost.'",
      },
      {
        objection: "The regulatory environment creates too much uncertainty.",
        response:
          "Acknowledge and address: 'Regulatory scrutiny has increased, which favors compliant operators like us. We've invested in compliance from day one—our infrastructure passes the scrutiny that's catching under-invested competitors. We hold direct licenses in [X states], giving us more control than pure BaaS-dependent companies. Recent regulatory actions have targeted specific practices we avoid. Our approach is to over-comply and treat regulatory requirements as product features, not obstacles.'",
      },
      {
        objection: "Banking partnership concentration is existential risk.",
        response:
          "Present your mitigation strategy: 'We recognize partner risk and have structured accordingly. We work with [primary bank] plus [backup BaaS provider]. Our technology is designed for portability—we can migrate to a new partner in 90 days. Our contracts extend through [year] with renewal rights. We've invested in direct relationships at our sponsor bank, not just through intermediaries. Longer-term, our scale creates optionality for deeper partnership structures or our own charter.'",
      },
      {
        objection: "Competition from embedded finance and big tech will compress your opportunity.",
        response:
          "Address competitive dynamics: 'Embedded finance actually expands our opportunity by bringing more financial services digital-native. We compete on depth, not breadth—our [specific segment] customers need specialized capabilities that horizontal players won't prioritize. Our evidence: we win against [competitor] 70% of the time in our segment. Big tech faces regulatory and trust barriers that specialist fintechs avoid. Our path is category leadership in [segment], not competing against infinite balance sheets.'",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Series A fintech decks must demonstrate proven unit economics, regulatory strength, and sustainable competitive position. Investors expect evidence of a durable business, not just growth. Lead with your commercial traction and economics, show regulatory competence, and present a credible path to profitability.",
    sections: [
      {
        title: "Executive Summary",
        goal: "Establish credibility with key metrics in 60 seconds",
        guidance:
          "Lead with your strongest metrics: ARR, growth rate, unit economics, risk performance. State regulatory status clearly. Present your differentiation in one sentence. Series A decks should immediately establish you're a real business, not just an idea. Don't bury achievements—lead with proof.",
      },
      {
        title: "Problem & Opportunity",
        goal: "Frame a large, specific opportunity",
        guidance:
          "Deepen the problem definition with market sizing. Quantify the pain and the opportunity. Show market dynamics: regulatory changes, technology shifts, customer behavior evolution. Reference comparable company outcomes. Present your specific entry point and expansion path. Avoid abstract 'disrupting financial services' framing—be specific.",
      },
      {
        title: "Solution & Differentiation",
        goal: "Demonstrate your product and competitive moat",
        guidance:
          "Show the product at scale with real customer use cases. Present your differentiation with evidence: feature comparison, customer preference data, win rates. Explain what's defensible: network effects, data advantages, regulatory moat, segment depth. Address why this differentiation is sustainable against well-funded competition.",
      },
      {
        title: "Traction & Unit Economics",
        goal: "Prove business viability with metrics",
        guidance:
          "This is the most important section. Present revenue, growth rate, and efficiency metrics. Show unit economics: CAC, LTV, payback, contribution margin. Present customer metrics: retention, engagement, expansion. Include cohort analysis showing improving economics. Reference risk metrics. Make clear this is a real business with sustainable economics.",
      },
      {
        title: "Regulatory & Infrastructure",
        goal: "Demonstrate compliance strength and partnership stability",
        guidance:
          "Present regulatory status: licenses, compliance infrastructure, examination history. Show banking partnership structure and stability. Address how you're positioned for regulatory evolution. Present compliance as competitive advantage. Include team credentials in regulatory and risk. This section can differentiate you from competitors who've underinvested.",
      },
      {
        title: "Risk Management",
        goal: "Show risk management sophistication",
        guidance:
          "Present risk metrics: fraud, losses, disputes with trends. Show how risk management has evolved with scale. Explain your risk infrastructure: models, monitoring, team. Address any risk events and learnings. Reference comparable fintech risk benchmarks. Sophisticated risk management separates durable fintechs from failures.",
      },
      {
        title: "Business Model",
        goal: "Demonstrate sustainable economics",
        guidance:
          "Present revenue model with diversification. Show unit economics trajectory. Explain contribution margin structure and path to improvement. Address variable costs at scale. Show path to profitability with key assumptions. Reference comparable company economics at similar and later stages.",
      },
      {
        title: "Go-to-Market & Scale",
        goal: "Present scalable growth strategy",
        guidance:
          "Show customer acquisition strategy with efficiency metrics. Present growth channels with CAC by channel. Explain your expansion strategy: geographic, segment, or product. Show evidence of organic growth and referrals. Address team and infrastructure needed to scale. Present the plan to get from current traction to Series B milestones.",
      },
      {
        title: "Competition",
        goal: "Position credibly in competitive landscape",
        guidance:
          "Present comprehensive competitive analysis. Show differentiation with evidence: win rates, customer feedback, capability comparison. Address competitive threats: incumbents, neobanks, vertical specialists, embedded finance. Explain sustainable competitive advantages. Be honest about where you win and lose.",
      },
      {
        title: "Team & Financials",
        goal: "Show team capability and realistic plan",
        guidance:
          "Present leadership team with fintech credentials. Show organizational evolution and key hires. Present 24-36 month financial plan with assumptions. State raise amount and use of funds. Connect capital to milestones. Show path to Series B requirements: typically $15M+ ARR with profitability path.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Series A fintech benchmarks emphasize proven unit economics and sustainable growth. Investors compare against public fintech metrics and expect trajectory toward industry-leading economics. Growth efficiency matters more than raw growth rate.",
    metrics: [
      {
        label: "Annual Recurring Revenue",
        value: "$2M - $10M",
        note: "ARR range for Series A fintech. Quality and sustainability matter as much as size.",
      },
      {
        label: "Revenue Growth Rate",
        value: "100-200% YoY",
        note: "Year-over-year growth. Show alongside efficiency metrics—growth at reasonable burn.",
      },
      {
        label: "Gross Margin",
        value: "50-70%",
        note: "Revenue minus cost of revenue. Varies by model—payments lower, lending variable, subscriptions higher.",
      },
      {
        label: "Contribution Margin",
        value: "30-50%",
        note: "After variable costs (processing, fraud, support). Path to 60%+ at scale.",
      },
      {
        label: "CAC Payback Period",
        value: "12-18 months",
        note: "Months to recover acquisition cost. Under 12 is excellent for fintech.",
      },
      {
        label: "LTV:CAC Ratio",
        value: "3:1 - 4:1",
        note: "Based on actual cohort behavior. Clear path to 5:1+ expected.",
      },
      {
        label: "Net Revenue Retention",
        value: "100-120%",
        note: "Revenue retention including expansion. Above 100% indicates product stickiness.",
      },
      {
        label: "Logo Retention",
        value: "85-95%",
        note: "Annual customer retention. Varies by segment—SMB lower, enterprise higher.",
      },
      {
        label: "Fraud Rate",
        value: "< 0.5%",
        note: "Fraud losses as percentage of volume. Improving trend expected.",
      },
      {
        label: "Burn Multiple",
        value: "< 2x",
        note: "Net burn divided by net new ARR. Measures capital efficiency of growth.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Series A fintech diligence emphasizes unit economics validation, regulatory compliance, risk performance, and partnership stability. Investors verify the durability of your business model and your ability to scale in a complex environment.",
    items: [
      {
        item: "Unit economics deep dive",
        rationale:
          "Detailed CAC by channel with methodology. LTV calculation with cohort data. Contribution margin breakdown. CAC payback analysis. Comparison to benchmarks. Path to improvement with supporting evidence.",
      },
      {
        item: "Cohort analysis and retention data",
        rationale:
          "Customer cohorts by signup month. Logo and revenue retention curves. Engagement metrics by cohort. Customer quality indicators. Segment-level retention analysis.",
      },
      {
        item: "Regulatory compliance audit",
        rationale:
          "All licenses with status. Compliance policies and procedures. Examination history and findings. State-by-state operational status. Compliance team qualifications. Recent regulatory correspondence.",
      },
      {
        item: "Banking partnership documentation",
        rationale:
          "All partner agreements with key terms. Revenue share structures. Compliance responsibilities. Term and termination provisions. Relationship history. Backup arrangements.",
      },
      {
        item: "Risk management analysis",
        rationale:
          "Fraud rates by time period with trends. Loss and dispute metrics. Risk models and their performance. Risk event history and responses. Credit performance (if lending). Risk team credentials.",
      },
      {
        item: "Security and compliance certifications",
        rationale:
          "SOC 2 Type II report. PCI compliance (if applicable). Security infrastructure documentation. Penetration testing results. Incident history and responses.",
      },
      {
        item: "Customer and revenue detail",
        rationale:
          "Customer list with revenue, tenure, and engagement. Revenue breakdown by product and segment. Reference customers for calls. Churn analysis with reasons. Expansion case studies.",
      },
      {
        item: "Sales and growth analysis",
        rationale:
          "Sales funnel metrics by channel. Pipeline and forecasting. Win/loss analysis. Channel efficiency comparison. Growth experiments and results.",
      },
      {
        item: "Financial model with scenarios",
        rationale:
          "Detailed model with assumptions. Historical accuracy analysis. Scenario modeling. Path to profitability. Capital efficiency projections.",
      },
      {
        item: "Competitive intelligence",
        rationale:
          "Competitive landscape analysis. Win/loss data by competitor. Feature comparison. Pricing analysis. Competitive positioning rationale.",
      },
      {
        item: "Team and organization assessment",
        rationale:
          "Org chart with all roles. Leadership team backgrounds. Key person dependencies. Retention data. Hiring plan with key roles. Compensation benchmarking.",
      },
      {
        item: "Legal and corporate review",
        rationale:
          "Corporate structure and cap table. Material contracts. Regulatory correspondence. Litigation or disputes. IP documentation.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Series A fintech updates should emphasize unit economics, growth efficiency, and risk performance. Investors need to see a path to sustainable profitability, not just growth. Be transparent about regulatory developments and partnership health.",
    sections: [
      {
        section: "Key Metrics Dashboard",
        content:
          "Lead with core metrics: ARR, growth rate, unit economics (CAC, LTV, payback), contribution margin. Show efficiency metrics: burn multiple, gross margin trend. Include risk metrics: fraud rate, loss rate, NRR. Use consistent formatting for easy tracking. Fintech investors scrutinize economics—show them clearly.",
      },
      {
        section: "Growth & Efficiency",
        content:
          "Revenue growth with channel breakdown. CAC trends and efficiency improvements. Customer acquisition and activation metrics. Pipeline and conversion rates. Marketing and sales productivity. Show growth is efficient, not just fast.",
      },
      {
        section: "Unit Economics Progress",
        content:
          "CAC by channel with trends. LTV and retention metrics. Contribution margin evolution. Payback period improvement. Path to target economics. Be honest about what's working and what needs improvement.",
      },
      {
        section: "Risk & Compliance",
        content:
          "Fraud and loss metrics with trends. Dispute rates. Regulatory developments and examination updates. Compliance team and infrastructure progress. Any risk events and learnings. This section is critical for fintech.",
      },
      {
        section: "Partnership & Infrastructure",
        content:
          "Banking partner relationship health. BaaS platform developments. Contract renewals or changes. New capabilities or products enabled. Infrastructure improvements. Any partnership risks.",
      },
      {
        section: "Product & Technology",
        content:
          "Product releases and their impact. Roadmap progress. Technology infrastructure scaling. Security improvements. Customer feedback themes.",
      },
      {
        section: "Team & Operations",
        content:
          "Key hires and organizational changes. Sales and compliance capacity. Operational improvements. Culture and retention indicators. Any departures with context.",
      },
      {
        section: "Financial Position & Path",
        content:
          "Cash position and runway. Burn rate and efficiency trends. Revenue vs. plan. Path to profitability milestones. Financing considerations. Specific asks for the board.",
      },
    ],
  },
};

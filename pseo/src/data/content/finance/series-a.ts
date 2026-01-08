import type { IndustryStageContent } from "../types";

export const financeSeriesAContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Series A fintech companies must demonstrate proven unit economics, regulatory stability, and scalable operations. Investors evaluate your path to profitability, compliance infrastructure maturity, and ability to scale customer acquisition efficiently. The era of growth-at-all-costs fintech is over—Series A now requires evidence of sustainable business fundamentals.",
    questions: [
      {
        category: "Unit Economics at Scale",
        question:
          "What are your unit economics and how do they improve with scale?",
        answer:
          "Series A fintech requires proven, improving unit economics. Present your current metrics: CAC by channel, LTV based on mature cohorts, payback period, gross margin. Show how economics have improved from seed stage. Present scale economics: how CAC decreases with brand awareness, how LTV increases with product expansion. Demonstrate a path to 4:1+ LTV:CAC and sub-12-month payback. Investors need confidence that growth is profitable.",
      },
      {
        category: "Regulatory Maturity",
        question:
          "What's your regulatory status and how have you de-risked compliance?",
        answer:
          "Series A fintechs should have significant regulatory progress. Show licenses obtained and applications in final stages. Present compliance infrastructure: team size, technology stack, audit history. Address any regulatory examinations or feedback received. For banking partnerships, show relationship stability and depth. Demonstrate compliance is a competitive advantage, not just a cost center. Regulatory maturity reduces risk for Series A investors.",
      },
      {
        category: "Customer Acquisition Scalability",
        question:
          "How does customer acquisition scale and what's your channel strategy?",
        answer:
          "Fintech CAC often increases with scale as easy channels saturate. Present your channel portfolio and performance by channel. Show how you're diversifying acquisition: new channels, partnerships, brand marketing. Address CAC trajectory projections and assumptions. Include any viral or organic growth contribution. Demonstrate a scalable acquisition model, not just current efficiency.",
      },
      {
        category: "Revenue Growth & Diversification",
        question:
          "What's your revenue growth rate and how are you diversifying revenue?",
        answer:
          "Series A fintechs should show strong revenue growth with emerging diversification. Present revenue growth trajectory and drivers. Show revenue mix: primary product, adjacent products, cross-sell success. Address revenue per customer trends and expansion within accounts. Include net revenue retention showing customers increasing value. Demonstrate you're building a platform, not a single product.",
      },
      {
        category: "Risk Management Maturity",
        question:
          "How has your risk management matured and what are your loss rates?",
        answer:
          "Scaled fintech requires sophisticated risk management. Present your risk metrics: fraud rates, credit losses (if applicable), operational losses. Show trajectory and comparison to industry benchmarks. Demonstrate risk infrastructure evolution: technology, team, processes. Address how risk management scales with volume. Include any stress testing or scenario analysis. Risk management maturity is essential for Series A fintech credibility.",
      },
      {
        category: "Competitive Position",
        question:
          "How has your competitive position strengthened and what's your moat?",
        answer:
          "At Series A, competitive position should be clearly differentiated. Present your moat components: customer relationships, data advantages, network effects, brand, regulatory position, or cost structure. Show evidence of moat: retention vs. competitors, pricing power, customer feedback. Address competitive threats and your response. Demonstrate increasing returns to scale that protect your position.",
      },
      {
        category: "Operational Scalability",
        question:
          "How do your operations scale with customer growth?",
        answer:
          "Fintech operations can become bottlenecks at scale. Present operational metrics: support efficiency, onboarding time, manual process rates. Show automation progress and remaining manual dependencies. Address compliance operations scalability. Include operational infrastructure investments made. Demonstrate you can serve 10x customers without proportional cost increase.",
      },
      {
        category: "Banking & Infrastructure",
        question:
          "How stable is your banking infrastructure and what's the path to greater independence?",
        answer:
          "Banking infrastructure is critical for fintech scale. Present banking partner relationships: stability indicators, capacity for scale, contractual position. Address any infrastructure diversification or redundancy. If pursuing own charter or licenses, show timeline and interim strategy. Demonstrate you've built infrastructure resilience appropriate for scale.",
      },
      {
        category: "Product Expansion",
        question:
          "What's your product roadmap and expansion strategy?",
        answer:
          "Series A fintechs should have clear expansion paths. Present product roadmap: adjacent products, new segments, geographic expansion. Show customer demand evidence for expansion areas. Address cross-sell success to date. Include regulatory requirements for new products. Demonstrate you're building a platform with natural expansion paths, not a feature that will be commoditized.",
      },
      {
        category: "Path to Profitability",
        question:
          "What's your path to profitability and how much capital is required?",
        answer:
          "Fintech investors now require clear profitability paths. Present your model: revenue growth required, margin improvement trajectory, operating leverage. Show path to contribution margin positivity and ultimate profitability. Include total capital needed with scenario analysis. Address timeline realistically. Demonstrate you've planned the journey to sustainability, not just the next fundraise.",
      },
    ],
    metrics: [
      {
        label: "Annual Revenue",
        value: "$2M - $10M ARR",
        note: "Annualized revenue from all sources. Growth trajectory and quality (retention, expansion) matter as much as absolute number.",
      },
      {
        label: "Monthly Active Users",
        value: "100,000 - 500,000",
        note: "Active users with meaningful engagement. Quality of users—transaction frequency, revenue per user—matters significantly.",
      },
      {
        label: "LTV:CAC Ratio",
        value: "3:1 - 5:1",
        note: "Based on mature cohort behavior. Should show improvement trajectory toward 5:1+.",
      },
      {
        label: "CAC Payback Period",
        value: "9-15 months",
        note: "Time to recover customer acquisition cost. Should be improving toward sub-12 months.",
      },
      {
        label: "Net Revenue Retention",
        value: "110-130%",
        note: "Revenue retention including expansion within existing customers. Shows deepening customer relationships.",
      },
      {
        label: "Gross Margin",
        value: "60-80%",
        note: "At scale after direct costs. Varies by model but should show improvement trajectory.",
      },
    ],
    objections: [
      {
        objection:
          "Your growth has slowed significantly from the hyper-growth phase.",
        response:
          "Address growth deceleration directly. Show that growth is now more efficient—better unit economics compensate for lower growth rate. Present cohort quality improvements: better retention, higher LTV, lower loss rates. Demonstrate sustainable growth rate that compounds profitably. Reference successful fintechs that prioritized efficient growth. Quality of growth matters more than peak growth rate.",
      },
      {
        objection:
          "Your unit economics still require significant improvement to reach profitability.",
        response:
          "Present your unit economics improvement roadmap with specific initiatives. Show progress made from seed to current state. Address each lever: CAC optimization, LTV expansion, margin improvement. Include scenario analysis showing path to target economics. Reference comparable companies' unit economics evolution. Demonstrate clear plan, not just hope for improvement.",
      },
      {
        objection:
          "Regulatory pressure on your banking partners could disrupt your business.",
        response:
          "Acknowledge regulatory risk in the banking partnership model. Present your risk mitigation: partner diversification, direct license pursuit, relationship depth with current partners. Show compliance posture that makes you attractive to partners. Address contingency plans for partner issues. Demonstrate proactive approach to banking infrastructure stability.",
      },
      {
        objection:
          "Big tech companies are entering fintech—how do you compete?",
        response:
          "Address big tech competition directly. Show your advantages: focus, customer intimacy, regulatory expertise, trust in financial services. Present segments where big tech is disadvantaged: regulatory complexity, customer service requirements, specialized needs. Reference areas where fintechs have maintained position despite big tech entry. Demonstrate sustainable differentiation in your segment.",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Series A fintech pitch decks must demonstrate sustainable business fundamentals with a clear path to profitability. Lead with unit economics improvement and operational scalability. Show you've built a real business, not just acquired users. Regulatory maturity and risk management credibility are table stakes.",
    sections: [
      {
        title: "Business Traction",
        goal: "Open with proof of sustainable growth",
        guidance:
          "Lead with key metrics: revenue, users, unit economics, retention. Show trajectory over time with emphasis on improving efficiency. Include comparison to seed stage metrics. This slide should demonstrate product-market fit with sustainable economics.",
      },
      {
        title: "Market Opportunity",
        goal: "Frame the market with customer evidence",
        guidance:
          "Size the market based on proven customer segments. Show market dynamics: why fintech is winning, where value is shifting. Include customer quotes on why they chose you. Address expansion opportunities within the market.",
      },
      {
        title: "Product & Differentiation",
        goal: "Demonstrate product depth and competitive moat",
        guidance:
          "Present product with customer value focus. Show differentiation that creates sustainable advantage. Include product expansion roadmap. Address how product creates customer stickiness. Demonstrate you're building a platform, not a feature.",
      },
      {
        title: "Unit Economics",
        goal: "Prove sustainable and improving economics",
        guidance:
          "Present detailed unit economics: CAC by channel, LTV by cohort, payback period, margins. Show improvement trajectory from seed stage. Address path to target economics at scale. This slide is critical for Series A fintech credibility.",
      },
      {
        title: "Regulatory Position",
        goal: "Show regulatory maturity and advantage",
        guidance:
          "Present regulatory achievements: licenses obtained, compliance infrastructure built, examinations passed. Address remaining regulatory requirements and timeline. Show how regulatory position creates competitive advantage. Include banking partnership stability.",
      },
      {
        title: "Risk Management",
        goal: "Demonstrate sophisticated risk infrastructure",
        guidance:
          "Present risk metrics: loss rates, fraud prevention effectiveness, credit performance (if applicable). Show risk infrastructure evolution. Address how risk scales with growth. Include industry benchmark comparisons. Demonstrate institutional-quality risk management.",
      },
      {
        title: "Customer Acquisition",
        goal: "Show scalable acquisition model",
        guidance:
          "Present channel portfolio and performance. Show acquisition efficiency by channel. Address scalability of acquisition strategy. Include organic growth contribution. Demonstrate acquisition scales efficiently, not just current performance.",
      },
      {
        title: "Competitive Landscape",
        goal: "Position against evolved competitive field",
        guidance:
          "Updated competitive analysis showing strengthening position. Include win/loss data and customer feedback. Address big tech and large fintech competition. Show deepening moat with scale.",
      },
      {
        title: "Team & Operations",
        goal: "Show scaled organization ready for growth",
        guidance:
          "Present team growth and organizational structure. Highlight key hires and functional depth. Show operational efficiency improvements. Include hiring plan for this round. Demonstrate organizational readiness for scale.",
      },
      {
        title: "Financial Plan & Ask",
        goal: "Present clear path to profitability",
        guidance:
          "Show financial projections with path to profitability. Present this round's milestones and use of funds. Include scenario analysis for different growth rates. Define success metrics clearly. Close with ask and conviction.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Series A fintech benchmarks emphasize sustainable economics and operational scalability alongside growth. Investors compare your efficiency metrics against both fintech peers and traditional financial services. These benchmarks demonstrate business maturity beyond user acquisition.",
    metrics: [
      {
        label: "Annual Revenue",
        value: "$2M - $10M ARR",
        note: "Annualized revenue from all sources. Quality matters—high retention, expanding customers preferred.",
      },
      {
        label: "Revenue Growth Rate",
        value: "80-150% YoY",
        note: "Annual growth rate. Efficient growth valued over hyper-growth with poor economics.",
      },
      {
        label: "Monthly Active Users",
        value: "100,000 - 500,000",
        note: "Active engaged users. Quality of engagement matters—transacting users more valuable than passive.",
      },
      {
        label: "LTV:CAC Ratio",
        value: "3:1 - 5:1",
        note: "Based on mature cohorts. Should show improvement and path to 5:1+.",
      },
      {
        label: "CAC Payback Period",
        value: "9-15 months",
        note: "Time to recover CAC. Trending toward sub-12 months at scale.",
      },
      {
        label: "Net Revenue Retention",
        value: "110-130%",
        note: "Revenue retention including expansion. Shows deepening customer relationships.",
      },
      {
        label: "Gross Margin",
        value: "60-80%",
        note: "At scale gross margin. Should show improvement trajectory toward target.",
      },
      {
        label: "Monthly Transaction Volume",
        value: "$10M - $100M",
        note: "Transaction volume showing financial services scale.",
      },
      {
        label: "Loss Rate",
        value: "<1-2% of volume",
        note: "Combined fraud and credit losses. Should compare favorably to industry benchmarks.",
      },
      {
        label: "Team Size",
        value: "30-80 people",
        note: "Scaled team with depth in product, engineering, compliance, and operations.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Series A fintech diligence is comprehensive, covering unit economics depth, regulatory maturity, risk management sophistication, and operational scalability. Prepare for thorough financial and compliance review. Documentation quality reflects operational maturity.",
    items: [
      {
        item: "Detailed unit economics with cohort analysis",
        rationale:
          "Comprehensive unit economics: CAC by channel over time, LTV by cohort with retention curves, payback analysis. Include scenario modeling. Show data supporting improvement trajectory.",
      },
      {
        item: "Regulatory compliance documentation and examination history",
        rationale:
          "Complete regulatory file: licenses held and applications pending, compliance program documentation, examination history and findings, regulatory correspondence. Third-party compliance assessments.",
      },
      {
        item: "Risk management framework and loss data",
        rationale:
          "Risk framework documentation. Detailed loss data: fraud by type, credit losses (if applicable), operational losses. Trend analysis and benchmark comparison. Risk model documentation.",
      },
      {
        item: "Banking partner documentation and relationship assessment",
        rationale:
          "Partner contracts and terms. Relationship history and stability assessment. Capacity for scale. Backup or diversification plans. Recent communications and relationship health.",
      },
      {
        item: "Financial statements and detailed projections",
        rationale:
          "Audited or reviewed financials. Detailed projections with unit economics model. Revenue breakdown by product and segment. Path to profitability analysis with scenarios.",
      },
      {
        item: "Customer data and retention analysis",
        rationale:
          "Detailed customer metrics: acquisition by channel, retention by cohort, engagement patterns. Customer concentration analysis. NPS and satisfaction data. Customer references.",
      },
      {
        item: "Technology and security documentation",
        rationale:
          "Architecture documentation. Security certifications (SOC 2, PCI if applicable). Penetration testing results. Data protection and privacy compliance. Vendor risk assessment.",
      },
      {
        item: "Operational metrics and scalability analysis",
        rationale:
          "Operational efficiency metrics: support costs per user, onboarding time, automation rates. Scalability analysis for 10x growth. Process documentation for key workflows.",
      },
      {
        item: "Competitive analysis with win/loss data",
        rationale:
          "Detailed competitive landscape. Win/loss analysis with customer feedback. Market share data if available. Technical and feature comparison.",
      },
      {
        item: "Team and organizational assessment",
        rationale:
          "Organizational chart with role descriptions. Key person assessment. Compensation benchmarking. Retention data. Hiring plan and budget.",
      },
      {
        item: "Legal documentation and litigation status",
        rationale:
          "Customer agreements and terms. Regulatory correspondence. Any litigation or disputes. IP documentation. Corporate structure optimization.",
      },
      {
        item: "Cap table and governance documentation",
        rationale:
          "Complete cap table with all instruments. Prior funding terms. Board composition. Governance rights and procedures. Any unusual terms or provisions.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Series A fintech investor updates should emphasize sustainable growth metrics and operational scalability. Given the focus on profitability paths, unit economics trends are as important as growth. Maintain transparency on regulatory developments and risk metrics—these are material for future fundraising.",
    sections: [
      {
        section: "Executive Summary",
        content:
          "Lead with key metrics: revenue, growth rate, unit economics, cash position. Summarize biggest wins and challenges. Include regulatory and risk status. This should convey business health and trajectory in 60 seconds.",
      },
      {
        section: "Revenue & Growth",
        content:
          "Detailed revenue performance: growth rate, mix by product, expansion within customers. Show net revenue retention and customer health. Include pipeline and leading indicators. Address performance vs. plan.",
      },
      {
        section: "Unit Economics",
        content:
          "Report on CAC trends by channel. Show LTV evolution and cohort performance. Present payback period progress. Include margin trends. This section demonstrates sustainable business building.",
      },
      {
        section: "Customer Metrics",
        content:
          "User growth and engagement trends. Retention by cohort. NPS and satisfaction. Customer concentration and diversification. Quality of growth alongside quantity.",
      },
      {
        section: "Regulatory & Compliance",
        content:
          "Licensing progress and status. Any regulatory examinations or feedback. Compliance infrastructure developments. Banking partner relationship health. Material regulatory developments in the space.",
      },
      {
        section: "Risk & Operations",
        content:
          "Loss rates and risk metrics. Fraud trends and prevention effectiveness. Operational efficiency improvements. Any risk events and response. Scaling progress.",
      },
      {
        section: "Product & Development",
        content:
          "Product launches and improvements. Roadmap progress. Customer-driven developments. Technical infrastructure improvements. Competitive feature assessment.",
      },
      {
        section: "Priorities & Asks",
        content:
          "Next quarter priorities and milestones. Specific investor asks: introductions, expertise, strategic guidance. Fundraising timeline and preparation if relevant. Key decisions needing input.",
      },
    ],
  },
};

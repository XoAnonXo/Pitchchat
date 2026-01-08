import type { IndustryStageContent } from "../types";

export const hardwareSeriesAContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Series A hardware companies must demonstrate they've solved the prototype-to-production challenge. Investors evaluate manufacturing scalability, proven unit economics, and meaningful customer traction. The bar has risen—investors now require evidence of production capability and positive gross margins before Series A investment.",
    questions: [
      {
        category: "Production Readiness",
        question:
          "What's your current production capability and how does it scale?",
        answer:
          "Series A hardware companies should have production proven at low rate. Present your current production capacity, yield rates, and cycle time. Show your scaling roadmap: equipment investments, staffing, facility expansion. For CM partnerships, show the relationship maturity and capacity commitments. Demonstrate you've solved manufacturing—not just designed a product. Include production quality metrics and improvement trajectory.",
      },
      {
        category: "Unit Economics",
        question:
          "What are your current unit economics and how do they improve with scale?",
        answer:
          "Production unit economics should be proven, not projected. Present current BOM, manufacturing overhead, and gross margin. Show the path to target margins at scale: volume pricing commitments, manufacturing efficiency improvements, design optimizations. Include fully-loaded product cost including warranty, support, and logistics. Investors need confidence that selling more products improves the business.",
      },
      {
        category: "Customer Traction",
        question:
          "What customer traction do you have and what's the growth trajectory?",
        answer:
          "Series A requires meaningful revenue or binding commitments. Present shipped units, revenue, and customer count. Show customer growth trajectory and pipeline. Include repeat purchase rate if applicable. For B2B, show contract value and expansion within accounts. Demonstrate that customers derive real value—net promoter scores, testimonials, reorder rates. Quality of traction matters as much as quantity.",
      },
      {
        category: "Supply Chain Maturity",
        question:
          "How mature is your supply chain and what are the remaining risks?",
        answer:
          "Series A supply chains should be production-qualified. Show your supplier portfolio: number of suppliers, qualification status, relationship depth. Present inventory management approach: safety stock strategy, lead time management, demand forecasting. Address remaining risks: single-source components, long lead items, price volatility. Demonstrate you've built supply chain resilience—not just assembled a BOM.",
      },
      {
        category: "Quality Systems",
        question:
          "What's your quality system and how do you ensure production consistency?",
        answer:
          "Scaling production requires robust quality systems. Present your quality approach: inspection points, testing coverage, SPC implementation. Show quality metrics: FPY at scale, defect rates, customer return rates. For regulated products, show compliance status. Include warranty cost trends and root cause analysis process. Demonstrate that quality is systematic, not hero-dependent.",
      },
      {
        category: "Go-to-Market Execution",
        question:
          "How are you reaching customers and what's the sales efficiency?",
        answer:
          "Hardware GTM has unique challenges: distribution complexity, inventory management, channel margins. Present your sales strategy: direct vs. channel mix, geographic priorities, partnership approach. Show customer acquisition cost and payback period. For channel sales, show partner productivity. Demonstrate you've cracked distribution—not just built a product people want.",
      },
      {
        category: "Working Capital",
        question:
          "What are your working capital requirements and how do you manage cash conversion?",
        answer:
          "Hardware businesses tie up cash in inventory and receivables. Present your cash conversion cycle: inventory turns, DSO, DPO. Show working capital requirements at current scale and how they change with growth. Include inventory management strategy and any supply chain financing. Investors need to understand the capital efficiency of scaling hardware.",
      },
      {
        category: "Product Roadmap",
        question:
          "What's your product roadmap and how does it leverage your platform?",
        answer:
          "Single-product hardware companies face commodity risk. Present your product roadmap: variants, generations, adjacencies. Show how you leverage existing technology, manufacturing capability, and customer relationships. Include margin improvement on next-generation products. Demonstrate you're building a platform, not just a product. Address feature prioritization based on customer feedback.",
      },
      {
        category: "Competitive Moat",
        question:
          "How defensible is your position as you scale?",
        answer:
          "Hardware moats include: manufacturing expertise, supply chain relationships, IP, brand, and ecosystem. Present your competitive advantages and how they strengthen with scale. Show why competitors can't easily replicate your position. Address incumbent response and new entrant risk. Include any network effects or ecosystem lock-in. Demonstrate increasing returns to scale.",
      },
      {
        category: "Capital Path",
        question:
          "What's the capital required to reach profitability?",
        answer:
          "Hardware profitability requires scale. Present your path to break-even: revenue required, margin improvement, operating leverage. Show total capital needed to reach profitability. Include scenario analysis for faster or slower growth. Address working capital requirements at scale. Demonstrate you understand the capital journey and have a realistic plan.",
      },
    ],
    metrics: [
      {
        label: "Annual Revenue",
        value: "$1M - $5M",
        note: "Series A hardware companies should have meaningful revenue demonstrating production and sales capability. Growth trajectory matters as much as absolute number.",
      },
      {
        label: "Gross Margin",
        value: "35-50%",
        note: "Production-proven gross margin on shipped products. Should show improvement trajectory toward 50%+ at scale.",
      },
      {
        label: "Units Shipped",
        value: "1,000 - 10,000",
        note: "Enough production volume to prove manufacturing at scale. Quality and consistency of production matter.",
      },
      {
        label: "First Pass Yield",
        value: "90%+",
        note: "Production FPY should be at or near target levels. Consistent quality indicates manufacturing maturity.",
      },
      {
        label: "Customer Count",
        value: "100 - 1,000+",
        note: "For consumer products, meaningful customer base. For B2B, enough customers to prove repeatability.",
      },
      {
        label: "Net Promoter Score",
        value: "40+",
        note: "High NPS indicates product-market fit and supports word-of-mouth growth critical for hardware.",
      },
    ],
    objections: [
      {
        objection:
          "Your margins are lower than software—why should we accept hardware economics?",
        response:
          "Hardware margins are lower than software but can be highly attractive businesses. Show your margin improvement trajectory and target at scale. Present comparable hardware companies with strong returns. Demonstrate operating leverage: how incremental revenue flows to profit as you scale. Address the durability of hardware revenue—physical products with replacement cycles. Show the total addressable value you capture from each customer.",
      },
      {
        objection:
          "Hardware companies face significant working capital requirements that reduce returns.",
        response:
          "Acknowledge working capital reality and show your management approach. Present inventory turns and trajectory. Show strategies to improve cash conversion: supplier payment terms, customer deposits, just-in-time manufacturing. Include any supply chain financing arrangements. Demonstrate you've optimized working capital given your business model constraints.",
      },
      {
        objection:
          "Your production is still dependent on single-source suppliers or contract manufacturers.",
        response:
          "Present your supply chain diversification progress and roadmap. Show qualification status for alternative sources. Demonstrate relationship depth with primary suppliers that reduces risk. Include contractual protections and inventory strategies. Address timeline and cost to complete diversification. Be honest about current dependencies while showing active mitigation.",
      },
      {
        objection:
          "How do you compete with larger players who can manufacture at greater scale?",
        response:
          "Show your competitive differentiation beyond scale: product innovation, customer service, speed, specialization. Present cases where you've won against larger competitors and why. Demonstrate your target customer segment where you have advantages. Address partnership opportunities where scale helps. Show you understand your competitive position and are playing to your strengths.",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Series A hardware pitch decks must demonstrate production capability, proven unit economics, and customer traction. Lead with evidence of manufacturing at scale and customers who love the product. Show you've solved the hard problems and have a clear path to growth.",
    sections: [
      {
        title: "Traction Summary",
        goal: "Open with production and revenue proof points",
        guidance:
          "Lead with shipped units, revenue, and customer metrics. Show production capability and quality. Include customer testimonials and NPS. This slide should demonstrate you've solved manufacturing and achieved product-market fit.",
      },
      {
        title: "Product & Market",
        goal: "Present the product and market opportunity",
        guidance:
          "Show the product with customer context—not just engineering specs. Size the market based on proven customer segments. Include competitive positioning and why you win. Show product evolution and roadmap.",
      },
      {
        title: "Unit Economics",
        goal: "Demonstrate viable and improving unit economics",
        guidance:
          "Present current BOM, gross margin, and fully-loaded product cost. Show improvement trajectory at scale with specific drivers. Include comparative analysis to hardware benchmarks. Address target margin at maturity.",
      },
      {
        title: "Manufacturing & Quality",
        goal: "Prove production capability at scale",
        guidance:
          "Present current production capacity and quality metrics. Show FPY and quality trends. Include manufacturing strategy for scaling: expansion plans, CM relationships, investment requirements. This proves you've solved the hard part.",
      },
      {
        title: "Customer Evidence",
        goal: "Let customers prove product-market fit",
        guidance:
          "Present customer testimonials, NPS, and retention data. Show customer segmentation and which segments work best. Include reorder rates and expansion metrics. Address any customer concentration with diversification plan.",
      },
      {
        title: "Go-to-Market",
        goal: "Show scalable customer acquisition",
        guidance:
          "Present sales strategy and channel approach. Show CAC, payback period, and LTV metrics. Include distribution partnerships if relevant. Address inventory and fulfillment at scale. Demonstrate GTM is working and can scale.",
      },
      {
        title: "Supply Chain & Operations",
        goal: "Demonstrate operational maturity",
        guidance:
          "Present supply chain structure and key relationships. Show working capital metrics and management approach. Include operational infrastructure for scale: systems, team, facilities. Address risks and mitigation.",
      },
      {
        title: "Product Roadmap",
        goal: "Show platform value beyond single product",
        guidance:
          "Present product evolution: variants, generations, adjacencies. Show how you leverage existing capabilities. Include customer input on roadmap. Address margin improvement in future products. Demonstrate you're building a platform.",
      },
      {
        title: "Team & Organization",
        goal: "Show operational and scaling capability",
        guidance:
          "Present team with manufacturing and operations emphasis. Show organizational evolution and key hires made. Include hiring plan for this round. Address any organizational gaps and plans to fill them.",
      },
      {
        title: "Financial Plan & Ask",
        goal: "Present clear path to profitability",
        guidance:
          "Show revenue projections and path to profitability. Present this round's milestones and use of funds. Include working capital requirements. Define Series B bar and your plan to exceed it. Close with clear ask and conviction.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Series A hardware benchmarks focus on production capability, unit economics, and customer traction. Investors compare your metrics against hardware industry standards and successful hardware companies. These benchmarks demonstrate manufacturing maturity and commercial viability.",
    metrics: [
      {
        label: "Annual Revenue",
        value: "$1M - $5M",
        note: "Meaningful revenue demonstrating production and sales capability. Revenue quality (margin, repeatability) matters as much as growth.",
      },
      {
        label: "Revenue Growth Rate",
        value: "100-200% YoY",
        note: "Strong growth trajectory while maintaining quality and margin. Hardware growth can be constrained by production—show path to scaling.",
      },
      {
        label: "Gross Margin",
        value: "35-50%",
        note: "Production gross margin on shipped products. Path to 50%+ at scale with specific improvement drivers identified.",
      },
      {
        label: "First Pass Yield",
        value: "90%+",
        note: "Production FPY indicating manufacturing maturity. Consistent quality across production runs.",
      },
      {
        label: "Units Shipped",
        value: "1,000 - 10,000",
        note: "Production volume proving manufacturing at scale. Unit quality and consistency matter as much as volume.",
      },
      {
        label: "Customer Count",
        value: "100 - 1,000+",
        note: "Meaningful customer base proving product-market fit. Segment diversity reduces concentration risk.",
      },
      {
        label: "Net Promoter Score",
        value: "40+",
        note: "High NPS indicates product satisfaction and supports organic growth critical for hardware.",
      },
      {
        label: "Customer Return Rate",
        value: "<5%",
        note: "Low return rate indicates product quality and customer satisfaction. Include warranty costs.",
      },
      {
        label: "Inventory Turns",
        value: "4-8x annually",
        note: "Working capital efficiency measure. Higher turns indicate better inventory management.",
      },
      {
        label: "CAC Payback",
        value: "12-18 months",
        note: "Customer acquisition cost payback period. Hardware often has longer payback but higher LTV.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Series A hardware diligence is comprehensive, covering manufacturing capability, unit economics, supply chain, and customer validation. Prepare for deep operational review and customer references. Quality of documentation reflects operational maturity.",
    items: [
      {
        item: "Production data including yield, capacity, and quality metrics",
        rationale:
          "Detailed production records: FPY by period, capacity utilization, cycle times, defect analysis. Show manufacturing control charts and improvement trends. Be prepared for factory visit or detailed operational review.",
      },
      {
        item: "Complete unit economics with BOM and overhead breakdown",
        rationale:
          "Component-level BOM with current and target costs. Manufacturing overhead allocation. Fully-loaded product cost including warranty, support, logistics. Volume pricing commitments from suppliers.",
      },
      {
        item: "Customer data including revenue, retention, and NPS",
        rationale:
          "Customer list with revenue by account. Retention and expansion metrics. NPS and satisfaction data. Customer references willing to take diligence calls.",
      },
      {
        item: "Supply chain documentation and risk assessment",
        rationale:
          "Supplier list with qualification status and relationship assessment. Single-source component analysis. Lead time data and inventory strategy. Contingency plans for supply disruption.",
      },
      {
        item: "Quality system documentation and certifications",
        rationale:
          "Quality management system documentation. Relevant certifications (ISO, industry-specific). Test protocols and coverage. Warranty data and failure analysis.",
      },
      {
        item: "Financial statements and detailed projections",
        rationale:
          "Audited or reviewed financials. Detailed projections with unit economics model. Working capital analysis. Sensitivity scenarios.",
      },
      {
        item: "Inventory and working capital analysis",
        rationale:
          "Current inventory position and aging. Working capital components and trends. Cash conversion cycle analysis. Inventory management strategy.",
      },
      {
        item: "Manufacturing agreements and facility documentation",
        rationale:
          "CM contracts or facility lease agreements. Equipment list and capacity analysis. Expansion plans and capital requirements. Manufacturing partner references.",
      },
      {
        item: "Sales and distribution documentation",
        rationale:
          "Sales process and pipeline data. Channel partner agreements if applicable. Customer acquisition cost analysis. Geographic and segment breakdown.",
      },
      {
        item: "IP portfolio and competitive analysis",
        rationale:
          "Patent portfolio and application status. Freedom-to-operate analysis. Trade secret documentation. Competitive landscape analysis.",
      },
      {
        item: "Team and organizational documentation",
        rationale:
          "Organizational chart with manufacturing and operations coverage. Key employee backgrounds and compensation. Hiring plan and budget.",
      },
      {
        item: "Cap table and corporate documentation",
        rationale:
          "Clean cap table with all prior rounds. Board composition and governance. Any unusual terms or structure issues.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Series A hardware investor updates focus on production scaling, unit economics improvement, and revenue growth. Demonstrate operational execution and progress toward profitability. Transparent communication builds confidence for future financing needs.",
    sections: [
      {
        section: "Executive Summary",
        content:
          "Lead with key metrics: revenue, units shipped, gross margin. Summarize biggest wins and challenges. Include cash position and runway. This should convey company trajectory in 60 seconds.",
      },
      {
        section: "Revenue & Customer Metrics",
        content:
          "Detailed revenue performance: shipped units, ASP, revenue by segment. Customer metrics: new customers, retention, NPS trends. Pipeline and bookings if B2B. Compare to plan with variance analysis.",
      },
      {
        section: "Production & Operations",
        content:
          "Production volume and capacity utilization. Quality metrics: FPY, defect rates, returns. Manufacturing cost trends. Supply chain status and any issues. Show operational execution.",
      },
      {
        section: "Unit Economics Progress",
        content:
          "Current BOM and gross margin with trends. Cost reduction initiatives and results. Fully-loaded product cost evolution. Path to target margins with specific drivers.",
      },
      {
        section: "Product Development",
        content:
          "Roadmap progress: new products, variants, improvements. Customer feedback driving priorities. Margin improvement in new products. Certification or compliance updates if relevant.",
      },
      {
        section: "Team & Organization",
        content:
          "Team changes and key hires. Organizational evolution for scale. Facility or capability investments. Any operational challenges and solutions.",
      },
      {
        section: "Financial Status",
        content:
          "Cash position, burn rate, runway. Working capital trends. Performance vs. budget. Fundraising timeline and preparation if approaching next round.",
      },
      {
        section: "Priorities & Asks",
        content:
          "Next quarter priorities and milestones. Specific asks for investor help: customer introductions, manufacturing expertise, hiring. Strategic decisions needing input.",
      },
    ],
  },
};

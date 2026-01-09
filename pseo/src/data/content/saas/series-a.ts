import type { IndustryStageContent } from "../types";

export const saasSeriesAContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Series A SaaS investors expect proven product-market fit, repeatable go-to-market motion, and strong unit economics. The bar is high: typically $1-3M ARR, net revenue retention above 100%, and evidence that your growth engine works. Investors at this stage are betting on scalability—can you grow 3-5x with this capital while maintaining or improving efficiency?",
    questions: [
      {
        category: "Product-Market Fit",
        question: "What evidence proves you've achieved product-market fit?",
        answer:
          "At Series A, product-market fit should be demonstrable across multiple dimensions. Present: (1) Retention data showing customers stick—monthly NRR above 100%, logo retention above 90% monthly for SMB or 97% for enterprise, (2) Growth metrics showing pull—consistent monthly growth, organic signups, referrals, (3) Customer behavior indicating dependence—high engagement, expansion over time, vocal advocacy. Include customer quotes and reference willingness. Show that PMF isn't just with early adopters but extends to your core target market. Address any segments where PMF is stronger or weaker.",
      },
      {
        category: "Unit Economics",
        question: "Walk us through your unit economics and how they scale.",
        answer:
          "Present fully-loaded CAC by channel with trend over time. Show LTV calculation based on actual customer behavior: ARPU × gross margin × (1/churn). Calculate CAC payback period and LTV:CAC ratio—Series A typically expects payback under 18 months and LTV:CAC above 3:1. Explain what improves with scale: channel efficiency, sales productivity, pricing power, reduced churn. Show cohort economics evolution. Be honest about current state while demonstrating clear trajectory. Investors will stress-test these numbers.",
      },
      {
        category: "Go-to-Market",
        question: "Describe your go-to-market motion and evidence it's repeatable.",
        answer:
          "Whether sales-led, product-led, or hybrid, show the motion works repeatedly. For sales-led: present sales productivity metrics (quota attainment, ramp time), pipeline predictability, and win rates. For product-led: show conversion funnels, activation metrics, and viral coefficients. Present customer acquisition by channel with efficiency trends. Show you've moved beyond founder-led sales to a repeatable process. Address how the motion scales with capital—can you hire salespeople who succeed? Can you spend more on marketing efficiently?",
      },
      {
        category: "Net Revenue Retention",
        question: "What's your NRR and what drives expansion?",
        answer:
          "NRR is often the most important Series A SaaS metric. Present your NRR with methodology (monthly vs. annual calculation). Break down the components: gross retention, expansion, and contraction. Show cohort-level NRR trends. Explain expansion drivers: seat growth, upsells to higher tiers, cross-sell of new products, usage-based growth. Address any NRR headwinds and mitigation. Best-in-class Series A SaaS shows 110-130% NRR; anything below 100% requires strong explanation.",
      },
      {
        category: "Market Opportunity",
        question: "How big is the market and what's your path to category leadership?",
        answer:
          "Present market sizing that supports a venture-scale outcome. Bottom-up: your ICP count × willingness to pay. Top-down: relevant market research with your capture thesis. Show current market share and expansion path. Address the journey from initial wedge to broader platform. Series A investors need to believe this can be a $100M+ ARR company—show the path. Reference comparable companies' market positions and trajectories.",
      },
      {
        category: "Competitive Position",
        question: "How do you win against competitors and what's your defensible moat?",
        answer:
          "Present competitive positioning with evidence: win rates against specific competitors, reasons you win, reasons you lose. Show your sustainable differentiation: product capabilities, data advantages, network effects, brand, or ecosystem. Address how defensibility compounds over time. Be honest about where competitors are strong. Show you've made deliberate positioning choices rather than trying to win everywhere. Reference switching costs and customer lock-in evidence.",
      },
      {
        category: "Sales Efficiency",
        question: "What does sales productivity look like and how does it scale?",
        answer:
          "Present sales team metrics: quota attainment by rep tenure, ramp time to productivity, average deal size and sales cycle. Show sales efficiency ratio or magic number trends. Address whether you can hire salespeople who succeed at similar rates to early reps. Present your sales playbook maturity: documented process, training program, tooling. Show pipeline coverage and forecasting accuracy. Investors want confidence that capital translates to predictable revenue growth.",
      },
      {
        category: "Technology & Product",
        question: "What's your technical architecture and product roadmap?",
        answer:
          "Present technical architecture at appropriate detail: key systems, scalability approach, security posture. Address technical debt honestly and remediation plans. Show product velocity metrics and roadmap priorities. Explain build vs. buy decisions. Address platform vs. point solution trajectory. Investors want confidence your technology can support 10x scale and that product velocity continues. Include any proprietary technology or data advantages.",
      },
      {
        category: "Team & Organization",
        question: "How will you scale the team and what key hires do you need?",
        answer:
          "Present current team structure and planned evolution. Address key hires: specific roles, profiles, and timeline. Show retention metrics and culture indicators. Explain how you attract talent and your competitive positioning. For leadership gaps (often VP Sales or VP Marketing at Series A), show progress on searches or committed candidates. Demonstrate you can scale the organization, not just the product.",
      },
      {
        category: "Capital Efficiency",
        question: "How much are you raising and what does it achieve?",
        answer:
          "Present round size with specific use of funds: headcount plan, GTM investment, product development. Show 18-24 month projections with assumptions. Define milestones this capital achieves—typically 3-4x ARR growth positions you well for Series B. Present burn multiple targets (net burn / net new ARR). Show you understand capital efficiency expectations and have a plan to hit them. Address runway and path to next round.",
      },
    ],
    metrics: [
      {
        label: "Annual Recurring Revenue (ARR)",
        value: "$1M - $5M",
        note: "Series A SaaS typically ranges $1-3M ARR, with $3-5M for competitive rounds. Quality of ARR matters as much as quantity.",
      },
      {
        label: "ARR Growth Rate",
        value: "2-3x annual",
        note: "Year-over-year growth. Series A companies typically growing 2-3x annually with path to maintain growth.",
      },
      {
        label: "Net Revenue Retention (NRR)",
        value: "110-130%",
        note: "Best-in-class Series A NRR. Below 100% is a significant concern. Demonstrates expansion exceeds churn.",
      },
      {
        label: "Gross Revenue Retention",
        value: "85%+ (SMB), 95%+ (Enterprise)",
        note: "Annual logo retention before expansion. Indicates core product-market fit strength.",
      },
      {
        label: "LTV:CAC Ratio",
        value: "3:1 to 5:1",
        note: "Based on actual customer behavior, not projections. Series A bar is typically 3:1+ with clear path to improvement.",
      },
      {
        label: "CAC Payback Period",
        value: "12-18 months",
        note: "Months to recover CAC from gross profit. Under 12 months is excellent; over 24 months requires explanation.",
      },
    ],
    objections: [
      {
        objection: "Your growth rate is slowing—how do you reignite growth?",
        response:
          "Address growth deceleration directly with analysis. Show whether it's market-driven, execution-driven, or a natural maturation. Present specific growth levers you're investing in: new channels, sales team expansion, product expansion, market expansion. Reference comparable company growth curves at similar scale. Show you understand the causes and have concrete plans. If investing in new growth engines, show early evidence they work.",
      },
      {
        objection: "NRR is below our threshold—what's the path to improvement?",
        response:
          "Acknowledge NRR gap and present analysis. Break down components: is it churn, lack of expansion, or contraction? Show cohort-level trends—is NRR improving in recent cohorts? Present specific initiatives: customer success investment, expansion pricing, cross-sell products. Set realistic improvement targets with timeline. Reference any early evidence from pilot programs. Be honest about whether this is fixable or structural.",
      },
      {
        objection: "Sales efficiency metrics don't support your growth projections.",
        response:
          "Present your path to improving sales efficiency. Show what drives current efficiency: ramp time, quota setting, territory optimization, tooling. Present specific initiatives and their expected impact. Reference benchmark progression from comparable companies. If projecting efficiency improvement, ground it in evidence: cohort analysis of rep performance, process changes already showing results. Be realistic about timeline.",
      },
      {
        objection: "The market is crowded and well-funded competitors are pulling ahead.",
        response:
          "Address competitive pressure directly. Show your specific positioning and why you win in your segment. Present win rate data against named competitors. Reference customer switching or consideration—are they choosing you over competitors? Show your sustainable differentiation and why it compounds. Address funding disparity by showing capital efficiency advantage. Acknowledge market reality while demonstrating viable path to leadership in your segment.",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Series A SaaS decks focus on proven traction, scalable unit economics, and the path to market leadership. You're no longer proving the concept works—you're demonstrating it scales. Lead with metrics that prove PMF, show the growth engine works, and present a credible path to a large outcome.",
    sections: [
      {
        title: "Executive Summary",
        goal: "Set the stage with your core thesis and traction",
        guidance:
          "Open with your strongest proof points: ARR, growth rate, NRR, key customer logos. State your market position clearly. Make investors immediately understand the opportunity and why you're positioned to win. This slide should convey that you've built something valuable with strong momentum.",
      },
      {
        title: "Problem & Market",
        goal: "Frame the market opportunity you're capturing",
        guidance:
          "Present the problem in market context—what's broken, why now is the time. Size the market credibly with bottom-up methodology. Show your addressable segment today and expansion path. Reference market dynamics that support your growth: digital transformation, regulatory changes, demographic shifts. Make clear this is a large market with room for a category-defining company.",
      },
      {
        title: "Solution & Product",
        goal: "Demonstrate your product and differentiation",
        guidance:
          "Show the product solving real customer problems. Focus on core differentiators, not feature lists. Include customer outcomes: time saved, revenue generated, costs reduced. Show product evolution based on customer feedback. Make clear why customers choose you over alternatives and why they stay.",
      },
      {
        title: "Traction & Metrics",
        goal: "Prove product-market fit with data",
        guidance:
          "Present the metrics that matter: ARR, growth rate, NRR, unit economics. Show cohort data demonstrating retention. Include customer quality: logos, references, expansion stories. This is your strongest slide—let the numbers speak. Use charts that make trends clear. Address any metrics that require explanation.",
      },
      {
        title: "Unit Economics",
        goal: "Show the business model works",
        guidance:
          "Deep dive on economics: CAC by channel, LTV calculation, payback period, LTV:CAC ratio. Show improvement trajectory in cohorts. Explain what drives efficiency at scale. Address gross margin and path to target. Demonstrate you understand the levers and have a plan to optimize them.",
      },
      {
        title: "Go-to-Market",
        goal: "Show your growth engine is repeatable",
        guidance:
          "Present your GTM motion with evidence it scales. Sales productivity metrics if sales-led; conversion funnels if product-led. Show pipeline and forecasting. Address customer acquisition by channel and efficiency trends. Explain how capital accelerates growth—hiring plan, channel expansion, market expansion. Show the playbook works beyond founder-led sales.",
      },
      {
        title: "Competition",
        goal: "Demonstrate defensible positioning",
        guidance:
          "Map the competitive landscape honestly. Show your positioning and why it wins. Include win/loss data against competitors. Address competitive threats and your response. Show sustainable differentiation that compounds: network effects, data advantages, ecosystem, brand. Demonstrate deep competitive understanding.",
      },
      {
        title: "Team",
        goal: "Show you can execute at scale",
        guidance:
          "Present leadership team with relevant experience. Highlight Series A stage readiness: sales leadership, marketing leadership, operational capability. Address gaps and hiring plan. Show team depth beyond founders. Include advisors and committed hires. Demonstrate you've built an organization, not just a product.",
      },
      {
        title: "Financial Plan",
        goal: "Present credible projections and capital efficiency",
        guidance:
          "18-24 month projections with explicit assumptions. Break down use of funds: headcount, GTM, product. Show path to Series B metrics. Present burn multiple and efficiency targets. Scenario analysis showing sensitivity. Be realistic—missing projections damages future fundraising.",
      },
      {
        title: "Ask & Use of Funds",
        goal: "Close with clear ask and milestone path",
        guidance:
          "State round size and structure. Detail use of funds tied to specific outcomes. Present milestones this capital achieves—typically 3-4x ARR growth. Show the logical path from here to Series B. Make clear what success looks like and how you'll measure it.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Series A SaaS benchmarks reflect expectations for proven product-market fit and scalable economics. Investors at this stage have clear thresholds—meeting or exceeding these benchmarks significantly improves fundraising outcomes. Focus on NRR and growth efficiency as primary indicators.",
    metrics: [
      {
        label: "Annual Recurring Revenue (ARR)",
        value: "$1M - $5M",
        note: "Typical Series A range. Quality matters: customer concentration, segment mix, and durability of revenue.",
      },
      {
        label: "ARR Growth Rate",
        value: "2-3x annual",
        note: "Year-over-year growth rate. Should show consistent trajectory with path to sustain through Series A period.",
      },
      {
        label: "Net Revenue Retention (NRR)",
        value: "110-130%",
        note: "The defining Series A SaaS metric. Best-in-class above 120%. Below 100% is a significant hurdle.",
      },
      {
        label: "Gross Revenue Retention",
        value: "85%+ (SMB), 95%+ (Enterprise)",
        note: "Annual customer retention before expansion. Foundation of sustainable growth.",
      },
      {
        label: "LTV:CAC Ratio",
        value: "3:1 to 5:1",
        note: "Based on actual customer data. Series A threshold typically 3:1 with improvement trajectory.",
      },
      {
        label: "CAC Payback Period",
        value: "12-18 months",
        note: "Months to recover acquisition cost. Efficient companies under 12 months; over 24 months concerning.",
      },
      {
        label: "Burn Multiple",
        value: "1.5x - 2.5x",
        note: "Net Burn / Net New ARR. Under 1.5x is efficient; above 3x raises efficiency concerns.",
      },
      {
        label: "Gross Margin",
        value: "70-85%",
        note: "Software gross margin. Should be at or approaching target by Series A. Sub-70% requires explanation.",
      },
      {
        label: "Magic Number",
        value: "0.5 - 1.0+",
        note: "Net New ARR / S&M Spend. Indicates sales efficiency. Above 0.75 indicates efficient growth.",
      },
      {
        label: "Sales Productivity",
        value: "$500K - $1M ARR/rep/year",
        note: "Annual quota attainment per sales rep. Varies by ACV and sales motion.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Series A SaaS diligence is thorough and metrics-driven. Investors will validate every claim in your deck with underlying data. Prepare comprehensive documentation—quality and organization signal operational maturity. Expect detailed analysis of unit economics, retention, and competitive positioning.",
    items: [
      {
        item: "Complete ARR and MRR history with monthly detail",
        rationale:
          "Full monthly revenue history broken down by new, expansion, contraction, and churn. Include by-customer detail enabling cohort and segment analysis. Should reconcile perfectly with financial statements.",
      },
      {
        item: "Cohort analysis with retention and expansion data",
        rationale:
          "Monthly cohorts showing logo retention, revenue retention, and expansion by month. Both graphical and tabular format. Commentary on cohort performance variations and drivers.",
      },
      {
        item: "Unit economics build-up with source data",
        rationale:
          "Detailed CAC calculation by channel including all costs. LTV calculation with churn rate, ARPU, and gross margin inputs. Historical trends and improvement drivers. Methodology documentation.",
      },
      {
        item: "Sales pipeline and performance data",
        rationale:
          "Current pipeline by stage with probability weighting. Historical conversion rates by stage. Sales cycle analysis. Rep-level performance data. Forecasting methodology and historical accuracy.",
      },
      {
        item: "Customer list with detailed attributes",
        rationale:
          "Complete customer list with: company, plan, MRR/ARR, start date, expansion history, contract terms, health indicators. Be prepared for reference calls—investors will contact customers.",
      },
      {
        item: "Competitive win/loss analysis",
        rationale:
          "Deal-level win/loss data including competitor, outcome, and reason. Aggregate win rates by competitor. Trends over time. Source and methodology for tracking.",
      },
      {
        item: "Financial model with bottoms-up build",
        rationale:
          "Detailed model including revenue build-up, cost structure, and headcount plan. Explicit assumptions with sensitivity analysis. Scenario modeling. Historical accuracy of previous projections.",
      },
      {
        item: "Historical financial statements and projections",
        rationale:
          "P&L, balance sheet, and cash flow statements. Audited if available, reviewed at minimum. 18-24 month projections tied to operating plan. Variance analysis against previous forecasts.",
      },
      {
        item: "Cap table and option pool analysis",
        rationale:
          "Fully diluted cap table including all instruments. Option pool status and refresh plan. Prior funding terms and any unusual provisions. Pro forma for this round.",
      },
      {
        item: "Technical architecture and roadmap documentation",
        rationale:
          "System architecture overview with scalability assessment. Security framework and any certifications. Technical debt inventory. Product roadmap with prioritization rationale.",
      },
      {
        item: "Team profiles and org chart",
        rationale:
          "Detailed backgrounds for leadership team. Current org chart and planned evolution. Key person dependencies. Retention data and culture indicators. Hiring plan with target profiles.",
      },
      {
        item: "Legal and corporate documentation",
        rationale:
          "Corporate structure and governance documents. IP assignment and invention agreements. Material contracts including key customer and vendor agreements. Any litigation or legal issues.",
      },
      {
        item: "Customer references and case studies",
        rationale:
          "Prepared references willing to speak with investors. Case studies demonstrating customer value. NPS data and customer feedback summaries. Churn exit interview insights.",
      },
      {
        item: "Board materials and investor updates",
        rationale:
          "Recent board decks showing historical narrative. Investor update history demonstrating communication consistency. Strategic decisions and their outcomes.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Series A investor updates balance metrics rigor with strategic context. Investors at this stage expect sophisticated reporting and proactive communication about challenges. Maintain consistent format for trend visibility. Be transparent—investors can help more when they understand the full picture.",
    sections: [
      {
        section: "Key Metrics Dashboard",
        content:
          "Comprehensive metrics summary: ARR/MRR with growth rate, NRR, gross retention, CAC payback, burn multiple. Show month-over-month and year-over-year comparisons. Include targets and variance. Traffic light indicators for quick assessment. This section should immediately convey business health.",
      },
      {
        section: "Revenue Deep Dive",
        content:
          "Detailed revenue analysis: new business, expansion, contraction, churn. Pipeline and forecast. Notable deals won or lost with context. Sales team performance and productivity. Pricing or packaging developments. Revenue quality indicators.",
      },
      {
        section: "Customer & Product",
        content:
          "Customer metrics: NPS trends, churn analysis, expansion patterns. Product updates: releases, adoption metrics, roadmap progress. Customer success highlights and concerns. Feature usage data. Strategic product decisions and rationale.",
      },
      {
        section: "Go-to-Market Performance",
        content:
          "Channel performance and efficiency trends. Marketing metrics and campaign results. Sales motion evolution. Partnership developments. Competitive intelligence and market observations. Strategic GTM decisions.",
      },
      {
        section: "Unit Economics Update",
        content:
          "CAC trends by channel. LTV evolution in cohorts. Payback period changes. Gross margin analysis. Efficiency improvements and initiatives. Path to target economics.",
      },
      {
        section: "Team & Operations",
        content:
          "Headcount changes and hiring progress. Key departures and mitigation. Organizational developments. Culture and engagement indicators. Operational improvements. Board or governance updates.",
      },
      {
        section: "Financial Position",
        content:
          "Cash position and runway. Burn rate trend and drivers. Budget variance analysis. Key financial decisions. Fundraising timeline if applicable.",
      },
      {
        section: "Strategic Priorities & Asks",
        content:
          "Top priorities and progress against them. Strategic decisions pending. Specific asks: introductions, expertise, strategic input. Risks being monitored. Areas where board engagement would be valuable.",
      },
    ],
  },
};

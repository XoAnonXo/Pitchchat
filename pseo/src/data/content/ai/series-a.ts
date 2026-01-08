import type { IndustryStageContent } from "../types";

export const aiSeriesAContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Series A AI companies face rigorous examination of their go-to-market execution, unit economics, and ability to scale. Investors at this stage have seen hundreds of AI pitches and will probe whether you've found genuine product-market fit or are riding hype. Expect deep dives into customer retention, competitive positioning against well-funded players, and your path to profitability given inference costs.",
    questions: [
      {
        category: "Product-Market Fit",
        question:
          "What evidence do you have of true product-market fit beyond early adopter enthusiasm?",
        answer:
          "Series A investors want to see metrics that indicate sustainable demand, not just early traction. Strong signals include net revenue retention above 120%, organic inbound exceeding 30% of pipeline, customer expansion without heavy sales touch, and declining churn cohorts. Show that customers are integrating your AI into critical workflows—not just experimenting. Usage frequency, time-to-value metrics, and unprompted referrals are powerful indicators. If customers would experience significant pain switching away, you've found fit.",
      },
      {
        category: "Unit Economics",
        question:
          "How do your unit economics work at scale, especially with inference costs?",
        answer:
          "AI companies face unique margin pressure from compute costs. Investors want to see your fully-loaded gross margin (including inference, fine-tuning, and support costs) trending toward 70%+ as you scale. Demonstrate strategies for margin improvement: model distillation, caching, batching, moving to cheaper models for routine tasks. Show your cost per query trajectory and how pricing scales with customer value delivered. The best AI companies achieve software-like margins through efficiency gains.",
      },
      {
        category: "Competitive Moat",
        question:
          "How do you compete against foundation model providers moving into your vertical?",
        answer:
          "This is the existential question for AI startups. Your moat must be multi-layered: proprietary data that improves over time (flywheel effects), deep workflow integration that creates switching costs, domain expertise embedded in fine-tuning, and customer relationships that big tech can't replicate. Show how your product compounds in value—each customer makes the platform better. Demonstrate awareness of OpenAI/Anthropic/Google roadmaps and why your specific wedge is defensible.",
      },
      {
        category: "Go-to-Market",
        question:
          "What's your repeatable go-to-market motion and how do you scale it?",
        answer:
          "Series A requires proof that you've cracked distribution beyond founder-led sales. Investors look for: defined ICP with clear buying triggers, predictable pipeline generation, sales cycle benchmarks, and win rate data. Show how customer acquisition cost trends downward as you scale. Demonstrate channel diversification—inbound, outbound, partnerships, product-led growth. If you're PLG, show conversion funnels and expansion revenue. The goal is proving you can hire reps and predict their ramp.",
      },
      {
        category: "Team Scaling",
        question:
          "How will you scale your AI/ML team and what's your talent strategy?",
        answer:
          "AI talent is expensive and scarce. Investors want to see a realistic hiring plan that doesn't assume you'll poach from Google. Demonstrate talent advantages: unique technical challenges that attract researchers, equity upside, specialized domain that academics find interesting, or remote-friendly policies. Show you can build leverage through tooling—one ML engineer should support more value over time. Address retention strategy, especially given Big Tech compensation competition.",
      },
      {
        category: "Enterprise Readiness",
        question:
          "What's required to close larger enterprise deals and how ready are you?",
        answer:
          "Enterprise AI sales require security certifications (SOC 2, ISO 27001), deployment flexibility (VPC, on-prem options), integration capabilities (SSO, APIs, workflow tools), and compliance features (audit logs, data residency, model governance). Show your enterprise readiness roadmap with specific timeline. Demonstrate you understand the longer sales cycles—typically 6-12 months—and have the cash runway to support them. Reference any enterprise LOIs or pilots in progress.",
      },
      {
        category: "Technical Scalability",
        question:
          "Can your architecture handle 100x the current load while maintaining latency and accuracy?",
        answer:
          "Investors probe for technical debt that could slow growth. Demonstrate your scaling strategy: horizontal scaling approach, caching layers, async processing for non-critical tasks, geographic distribution. Show latency benchmarks under load and your monitoring/alerting infrastructure. Address model serving architecture—are you prepared for multi-model, multi-tenant workloads? Reference any stress testing or production incidents that proved your system's resilience.",
      },
      {
        category: "Market Timing",
        question:
          "Is now the right time for this AI solution or are you too early/late?",
        answer:
          "Market timing arguments for AI require nuance. If you're early, show what technical or market catalysts will drive adoption and how you'll survive until then. If you're in a hot space, explain why you'll win despite competition. The best answers show customer pull outpacing your ability to serve it, declining model costs making your solution newly viable, or regulatory/workflow changes creating windows. Demonstrate you're riding a wave, not creating one.",
      },
      {
        category: "Capital Efficiency",
        question:
          "How will you deploy this capital and what milestones will you hit for Series B?",
        answer:
          "Series A capital should fund you to clear Series B thresholds: typically $5-10M ARR, strong unit economics, and proof of scalable go-to-market. Break down your 18-24 month plan: hiring roadmap, infrastructure investment, sales/marketing allocation. Show capital efficiency metrics—how much ARR per dollar raised. Investors want confidence that this capital creates step-function value, not just extended runway. Define specific milestones that derisk the business.",
      },
      {
        category: "Risk Mitigation",
        question:
          "What are the biggest risks to this business and how are you mitigating them?",
        answer:
          "Sophisticated founders acknowledge risks openly. For AI companies, common risks include: foundation model dependency, talent concentration, customer concentration, regulatory uncertainty, and margin compression from competition. For each risk, show specific mitigation strategies. Investors respect founders who've thought deeply about failure modes. The goal isn't to pretend risks don't exist—it's to demonstrate you're actively managing them with concrete actions.",
      },
    ],
    metrics: [
      {
        label: "Annual Recurring Revenue (ARR)",
        value: "$1.5M - $4M",
        note: "Series A AI companies should demonstrate significant revenue traction. The bar has risen—strong companies often approach $2-3M ARR with clear path to $10M+.",
      },
      {
        label: "Net Revenue Retention (NRR)",
        value: "115% - 140%",
        note: "Critical metric showing customers expand over time. High NRR indicates product-market fit and reduces reliance on new customer acquisition.",
      },
      {
        label: "Gross Margin",
        value: "65% - 75%",
        note: "AI companies must demonstrate path to software-like margins despite inference costs. Show trajectory toward 70%+ through efficiency gains.",
      },
      {
        label: "Logo Count",
        value: "30 - 100 customers",
        note: "Enough customers to demonstrate repeatability without being spread too thin. Quality matters more than quantity—focus on ICP fit.",
      },
      {
        label: "CAC Payback Period",
        value: "12 - 18 months",
        note: "Efficient customer acquisition is essential for AI companies given high R&D costs. Sub-12 month payback is excellent.",
      },
      {
        label: "Monthly Growth Rate",
        value: "10% - 20% MoM",
        note: "Consistent double-digit monthly growth signals strong product-market fit. Investors look for sustainable trajectory, not spikes.",
      },
    ],
    objections: [
      {
        objection:
          "Your margins are too low for a software company—this looks like a services business.",
        response:
          "Address this by showing margin improvement trajectory. Present your current blended margin, breakdown by customer segment, and roadmap to 70%+. Demonstrate specific efficiency initiatives: model optimization, caching strategies, pricing adjustments. Show that your lowest-margin customers are either in onboarding (margins improve over time) or high-volume anchors that provide data/credibility benefits. The key is proving margins scale with volume.",
      },
      {
        objection:
          "We're seeing a lot of AI companies and many are struggling to find sustainable differentiation.",
        response:
          "Acknowledge the crowded landscape and then demonstrate your specific moat. Show data on competitive wins—why customers chose you over alternatives. Present customer quotes on differentiation. Demonstrate technical advantages that compound over time. Show customer dependency through integration depth, workflow embedding, or data effects. The best answer includes specific metrics on switching costs and competitive win rates.",
      },
      {
        objection:
          "Your customer concentration is concerning—what happens if your top customers churn?",
        response:
          "Present your concentration metrics transparently (no customer >15% of revenue is healthy). Show your diversification trajectory and pipeline composition. For each major customer, demonstrate contract terms, expansion opportunities, and relationship depth. Show usage trends indicating deepening engagement. If concentration is high, present specific plan and timeline to diversify while explaining strategic value of current anchor customers.",
      },
      {
        objection:
          "The sales cycle seems long for a product that should sell itself if it's truly AI-powered.",
        response:
          "Enterprise AI sales inherently take longer due to security reviews, procurement processes, and change management requirements. Show how your sales cycle compares to competitors and other enterprise software. Present strategies for acceleration: POC frameworks, security pre-clearance, champion enablement. Demonstrate that longer cycles result in larger, stickier deals. If you have PLG motion, show how it feeds enterprise pipeline.",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Series A pitch decks for AI companies must balance vision with execution proof. Investors have seen countless AI pitches—differentiate through specific metrics, customer evidence, and deep market understanding. Lead with traction, support with technology, close with team and vision.",
    sections: [
      {
        title: "Traction Summary",
        goal: "Hook investors immediately with impressive metrics",
        guidance:
          "Open with your strongest numbers: ARR, growth rate, NRR, logo count. Series A investors want to see you've proven something meaningful. Include one customer quote that captures why you win. This slide should create urgency—FOMO is your friend. Show month-over-month trajectory chart if growth is consistent.",
      },
      {
        title: "Problem & Market",
        goal: "Frame a large, urgent problem that your ICP desperately needs solved",
        guidance:
          "Move beyond generic AI hype. Show specific workflow pain points with quantified cost. Use customer quotes describing their situation before your solution. Present market size as bottom-up TAM based on your ICP and pricing. AI investors are skeptical of top-down 'AI market will be $X trillion' slides. Show why this problem is newly solvable or newly urgent.",
      },
      {
        title: "Solution Demo",
        goal: "Demonstrate product in action solving the specific problem",
        guidance:
          "Show, don't tell. Include screenshots or short video of actual product. Highlight AI capabilities without black-box mysticism—investors want to understand what the AI actually does. Show before/after metrics from real customers. Demonstrate ease of use and time-to-value. Make it concrete enough that investors could explain your product to others.",
      },
      {
        title: "Why Now & Moat",
        goal: "Explain market timing and sustainable competitive advantages",
        guidance:
          "Why is this the right moment for this AI solution? Reference specific catalysts: model capability improvements, cost decreases, workflow changes, regulatory shifts. Then layer your moat: proprietary data, workflow integration, technical innovation, customer relationships. Show how advantages compound over time. Address foundation model risk directly.",
      },
      {
        title: "Business Model & Unit Economics",
        goal: "Prove you have a sustainable, scalable business model",
        guidance:
          "Present pricing model with average contract values. Show fully-loaded unit economics: CAC, LTV, payback period, gross margin. Be transparent about inference costs and your strategy for margin improvement. Show how economics improve with scale. This slide separates serious AI businesses from demos looking for acqui-hires.",
      },
      {
        title: "Go-to-Market",
        goal: "Demonstrate repeatable customer acquisition motion",
        guidance:
          "Show your GTM flywheel: how customers discover, evaluate, and buy. Present pipeline data, conversion rates, sales cycle length. If PLG, show funnel metrics. If sales-led, show quota attainment and ramp time. Include customer acquisition breakdown by channel. Demonstrate you can hire sales reps and predict their performance.",
      },
      {
        title: "Customer Evidence",
        goal: "Let customers tell your story through their results",
        guidance:
          "Dedicate a full slide to customer proof points. Include logos, specific outcomes (quantified), and direct quotes. Show case studies across different segments if applicable. Present NRR and expansion data. This slide should answer: are customers genuinely successful and would they recommend you?",
      },
      {
        title: "Competitive Landscape",
        goal: "Show deep market understanding and clear positioning",
        guidance:
          "Present honest competitive analysis—investors will know if you're dismissive. Show differentiation along axes that matter to customers. Include win/loss data against specific competitors. Acknowledge foundation model provider risk and your strategy. Position around sustainable advantages, not features that can be copied.",
      },
      {
        title: "Team",
        goal: "Demonstrate you have the team to execute this specific opportunity",
        guidance:
          "Highlight relevant AI/ML experience, domain expertise, and startup track record. Show key hires made and your talent pipeline for critical roles. Address any gaps and hiring plan. Include advisors if they add credibility. For AI companies, technical depth of founding team is particularly scrutinized.",
      },
      {
        title: "Financial Plan & Ask",
        goal: "Present clear use of funds and path to Series B milestones",
        guidance:
          "Show 18-24 month financial plan with revenue projections, hiring, and key investments. Present specific milestones this capital will achieve. Define Series B bar and your plan to exceed it. Show capital efficiency metrics—ARR per dollar raised. Be specific about raise amount and use of funds breakdown. End with clear conviction in why this is an exceptional opportunity.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Series A AI companies are measured on proven business metrics, not just technical achievements. Investors benchmark against both AI-specific peers and broader enterprise software. The bar has risen significantly—aim to be in the top quartile of these ranges to command premium valuations.",
    metrics: [
      {
        label: "Annual Recurring Revenue",
        value: "$1.5M - $4M ARR",
        note: "The new Series A bar for AI companies has risen. Strong companies often exceed $2M with clear path to $10M. Revenue quality (contract length, expansion) matters as much as absolute number.",
      },
      {
        label: "Revenue Growth Rate",
        value: "3x - 4x YoY",
        note: "Year-over-year growth should demonstrate acceleration, not deceleration. Monthly growth of 10-20% is typical for strong Series A candidates.",
      },
      {
        label: "Net Revenue Retention",
        value: "115% - 140%",
        note: "Best-in-class AI companies exceed 130% NRR. This metric proves customers find increasing value over time and reduces reliance on new logo acquisition.",
      },
      {
        label: "Gross Revenue Retention",
        value: "85% - 95%",
        note: "Logo churn should be minimal for AI products delivering real value. Below 85% signals product-market fit issues that need addressing before scaling.",
      },
      {
        label: "Gross Margin",
        value: "65% - 75%",
        note: "AI companies must show path to software-like margins. Include all inference, fine-tuning, and customer success costs. Below 60% raises structural concerns.",
      },
      {
        label: "CAC Payback Period",
        value: "12 - 18 months",
        note: "Efficient customer acquisition is critical given AI R&D costs. Best companies achieve sub-12 month payback on fully-loaded CAC.",
      },
      {
        label: "LTV:CAC Ratio",
        value: "3:1 - 5:1",
        note: "Healthy LTV:CAC indicates sustainable unit economics. Ratio should improve as you scale through sales efficiency and expansion revenue.",
      },
      {
        label: "Average Contract Value",
        value: "$30K - $150K ACV",
        note: "Enterprise AI products typically command premium pricing. Show ACV growth trajectory as you move upmarket or expand use cases.",
      },
      {
        label: "Sales Efficiency",
        value: "0.7 - 1.2 Magic Number",
        note: "New ARR divided by prior quarter S&M spend. Above 0.8 indicates efficient growth; above 1.0 is excellent. Factor in ramp time for new reps.",
      },
      {
        label: "Customer Count & Concentration",
        value: "30-100 customers, top 3 <40% revenue",
        note: "Enough customers to prove repeatability. Avoid concentration risk where losing one customer materially impacts business. Diversify across segments.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Series A due diligence for AI companies is comprehensive, covering technical depth, business fundamentals, and team capability. Investors will spend significant time on customer references, codebase review, and financial model validation. Prepare thoroughly across all dimensions.",
    items: [
      {
        item: "Audited or reviewed financial statements with detailed revenue recognition",
        rationale:
          "Investors need confidence in reported metrics. Ensure revenue recognition follows proper SaaS standards—subscription vs. usage-based clarity, deferred revenue handling, and cohort reporting. Prepare monthly financial packages going back 12-18 months.",
      },
      {
        item: "Customer cohort analysis showing retention and expansion by segment",
        rationale:
          "Cohort data reveals true business health. Prepare analysis by: signup date, customer segment, contract size, and use case. Show how retention and NRR evolve over time. Identify which segments have best economics for scaling focus.",
      },
      {
        item: "Detailed pipeline and sales funnel data with stage definitions",
        rationale:
          "Investors validate growth trajectory through pipeline. Document your sales stages, conversion rates between stages, average time in stage, and historical accuracy of forecasts. Show pipeline coverage ratio (typically 3-4x quota).",
      },
      {
        item: "Technical architecture documentation and scalability assessment",
        rationale:
          "Technical diligence is thorough for AI companies. Prepare architecture diagrams, infrastructure costs breakdown, latency benchmarks under load, and disaster recovery plans. Be ready to explain model serving, data pipeline, and monitoring infrastructure.",
      },
      {
        item: "Model performance metrics, bias testing, and governance documentation",
        rationale:
          "AI-specific diligence includes model evaluation. Document accuracy metrics, edge case handling, bias testing methodology, model versioning practices, and incident response for model failures. Governance is increasingly important for enterprise sales.",
      },
      {
        item: "Competitive win/loss analysis with customer interview consent",
        rationale:
          "Investors will talk to customers and references. Prepare 8-10 customer contacts willing to take calls. Document win/loss patterns against specific competitors. Be transparent about losses and what you've learned.",
      },
      {
        item: "IP documentation including patents, trade secrets, and data rights",
        rationale:
          "AI IP extends beyond patents. Document your proprietary training data sources and rights, model innovations, trade secret practices, and competitive moat documentation. Address any foundation model dependencies and terms.",
      },
      {
        item: "Employment agreements with IP assignment and non-compete clauses",
        rationale:
          "Team IP ownership must be clean. Ensure all employees have signed proper agreements. Address any prior work conflicts, especially for team members from Big Tech AI labs. Document consulting arrangements.",
      },
      {
        item: "Security certifications and compliance documentation",
        rationale:
          "Enterprise readiness requires certifications. Prepare SOC 2 reports (or Type 1 and roadmap to Type 2), penetration testing results, data security practices, and compliance framework for your target industries (HIPAA, GDPR, etc.).",
      },
      {
        item: "Cap table and prior investment terms",
        rationale:
          "Clean cap table is essential. Ensure 409A valuations are current, option pool is sufficient for Series A hiring plan, and prior investment terms don't create unusual provisions. Document any outstanding SAFEs or convertible notes.",
      },
      {
        item: "Hiring plan and organization design for 18-24 month runway",
        rationale:
          "Show how team scales with capital. Prepare detailed hiring plan by function and quarter. Document key roles, compensation benchmarks, and recruiting pipeline. Show reporting structure evolution as company grows.",
      },
      {
        item: "Unit economics model with sensitivity analysis",
        rationale:
          "Financial model must withstand scrutiny. Build bottoms-up model with clear assumptions. Include sensitivity analysis on key drivers: pricing, conversion rates, churn, inference costs. Show path to profitability and multiple scenarios.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Series A investor updates should demonstrate execution against plan, surface strategic challenges early, and maintain trust through transparency. These updates become the foundation of your investor relationship and future fundraising narrative.",
    sections: [
      {
        section: "Executive Summary",
        content:
          "Lead with the headline: are you on track, ahead, or behind plan? Summarize 2-3 biggest wins and 1-2 key challenges. Include critical metrics dashboard: ARR, growth rate, burn, runway. This section should take 60 seconds to read and convey company health. End with specific asks if you need board/investor help.",
      },
      {
        section: "Revenue & Growth Metrics",
        content:
          "Present detailed revenue performance: ARR/MRR with month-over-month and year-over-year growth, new logos added, expansion revenue, churn (logo and revenue), and NRR. Show performance against plan and explain variances. Include bookings and pipeline metrics for forward-looking insight. Break down by customer segment if relevant.",
      },
      {
        section: "Product & Technical Progress",
        content:
          "Update on product roadmap execution. Highlight shipped features and customer impact. Share technical achievements: performance improvements, cost optimizations, new model capabilities. Address any technical debt or infrastructure investments. Include customer feedback themes and how they're influencing roadmap.",
      },
      {
        section: "Go-to-Market Performance",
        content:
          "Detail sales and marketing performance: pipeline generated, conversion rates, average sales cycle, win rates by segment. Share notable customer wins with context on why you won. Update on channel development and partnerships. Report on marketing efficiency and lead generation programs.",
      },
      {
        section: "Team & Organizational Development",
        content:
          "Report on hiring progress against plan. Highlight key hires and their expected impact. Acknowledge any departures and how you're addressing gaps. Share culture initiatives and team health indicators. Include any organizational changes and rationale.",
      },
      {
        section: "Financial Health & Runway",
        content:
          "Present cash position, monthly burn, and runway. Compare burn to plan and explain variances. Show path to key milestones with current burn rate. Update on any financing activities or strategic discussions. Include capital efficiency metrics and trends.",
      },
      {
        section: "Strategic Challenges & Asks",
        content:
          "Be transparent about obstacles you're facing. For each challenge, present your current hypothesis and mitigation plan. Explicitly request help where investors can add value: introductions, strategic advice, hiring assistance. Investors appreciate being asked for specific help rather than generic updates.",
      },
      {
        section: "Next Quarter Priorities",
        content:
          "Share the 3-5 critical priorities for next quarter and how you'll measure success. Connect priorities to Series B milestones. Include any strategic decisions you're contemplating where investor input would be valuable. Set expectations for what you'll report on next update.",
      },
    ],
  },
};

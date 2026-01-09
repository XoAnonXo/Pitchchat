import type { IndustryStageContent } from "../types";

export const saasSeedContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Seed-stage SaaS startups face intense scrutiny on product-market fit signals, unit economics trajectory, and path to scalable growth. Investors evaluate whether your subscription model can achieve the metrics needed for venture-scale returns. The bar has risen significantly—investors now expect early evidence of retention and willingness to pay, not just user acquisition.",
    questions: [
      {
        category: "Unit Economics",
        question: "What's your current CAC:LTV ratio and path to 3:1?",
        answer:
          "At seed stage, investors expect you to understand your unit economics even if they're not yet optimized. Break down your Customer Acquisition Cost by channel (paid, organic, sales-led) and explain your assumptions for Lifetime Value based on current churn rates and expansion revenue. Most seed SaaS companies show CAC:LTV between 1:1 and 2:1, with a clear plan to reach 3:1+ through improved retention, pricing optimization, or channel efficiency. Show your cohort analysis if available—even 3-6 months of data demonstrates analytical rigor and gives investors confidence in your trajectory.",
      },
      {
        category: "Retention",
        question: "What does your retention look like and what's driving churn?",
        answer:
          "Logo retention and net revenue retention are the most important SaaS metrics. Present your monthly or weekly retention curves by cohort. If retention is below benchmarks (85%+ monthly for SMB, 95%+ for enterprise), explain what you've learned about why customers leave and your specific initiatives to improve. Show you understand the difference between product issues, fit issues, and support issues. The best answers demonstrate deep customer understanding: 'Our churn is primarily in month 2-3 among companies under 20 employees who don't integrate with their CRM. We're addressing this with improved onboarding and a Salesforce integration shipping next month.'",
      },
      {
        category: "Go-to-Market",
        question: "What's your primary acquisition channel and is it scalable?",
        answer:
          "Present your customer acquisition strategy with channel-by-channel breakdown. Whether you're sales-led, product-led, or marketing-led, show early evidence that your primary channel works. Address CAC by channel and efficiency trends. For product-led growth, show activation and conversion metrics. For sales-led, show pipeline and conversion rates. Investors want to see a repeatable motion emerging—even if it's early—and evidence you can scale it with capital. Be honest about what's working and what's experimental.",
      },
      {
        category: "Product-Market Fit",
        question: "How do you know you have product-market fit?",
        answer:
          "Product-market fit is hard to measure precisely, but strong signals include: organic growth and word-of-mouth referrals, customers who use the product repeatedly without prompting, low churn in your target segment, customers who expand their usage over time, and qualitative feedback indicating the product is essential. Present your evidence across multiple dimensions. The 'Sean Ellis test' (would customers be disappointed if the product went away?) is useful but not sufficient alone. Show patterns in customer behavior that indicate genuine pull.",
      },
      {
        category: "Pricing",
        question: "How did you arrive at your pricing and is there room to grow ARPU?",
        answer:
          "Walk through your pricing methodology: did you test different price points, analyze willingness to pay, benchmark competitors? Show your current ARPU and explain expansion revenue potential. Most seed SaaS companies are underpriced—explain if you believe that's true for you and how you might address it. Present your pricing structure (per seat, usage-based, tiered) and why it aligns with customer value. Address any pricing friction you've observed in sales conversations.",
      },
      {
        category: "Competition",
        question: "How do you compete against established players and well-funded startups?",
        answer:
          "SaaS markets are usually competitive. Present your competitive positioning honestly: where you win, where you lose, and why. Avoid the trap of claiming you have no competitors or that you're better in every dimension. Show your specific differentiation: is it product capabilities, market focus, pricing, or distribution? Reference actual competitive situations—wins and losses—and what you learned. Investors value founders who understand their competitive landscape deeply and have made deliberate positioning choices.",
      },
      {
        category: "Technical Moat",
        question: "What's defensible about your product beyond execution speed?",
        answer:
          "Speed to market is valuable but not a moat. Explain what becomes harder to replicate over time: proprietary data that improves with usage, network effects, deep integrations with customer systems, workflow embedding that increases switching costs, or specialized domain expertise encoded in the product. The best SaaS companies build compounding advantages—show how your product becomes more valuable and more defensible as you grow. Be specific about what a well-funded competitor couldn't replicate in 18 months.",
      },
      {
        category: "Market Size",
        question: "How big is your market and how do you size it?",
        answer:
          "Present bottom-up market sizing that investors can validate. Start with your target customer profile: how many exist, what they pay for adjacent solutions, what your solution is worth to them. Calculate your serviceable addressable market before jumping to TAM. Explain your expansion path from initial wedge to broader market. Reference comparable SaaS companies' market sizes where relevant. Top-down TAM numbers get discounted heavily—show you understand your specific entry point and expansion trajectory.",
      },
      {
        category: "Team",
        question: "Why is this team positioned to win in this market?",
        answer:
          "Explain your team's relevant advantages: domain expertise, technical capabilities, prior startup experience, or unique insights into the customer problem. Be honest about gaps and how you plan to fill them. For SaaS, investors often look for commercial DNA (sales/marketing leadership) alongside technical founders—address whether you have this or plan to add it. Show evidence of ability to recruit: early hires, advisors, or committed candidates. Team is often the primary bet at seed stage.",
      },
      {
        category: "Milestones",
        question: "What milestones will this round achieve and what does Series A look like?",
        answer:
          "Present 3-5 concrete milestones this capital achieves: typically a mix of product (feature launches, platform capabilities), commercial (ARR targets, customer logos, NRR benchmarks), and team (key hires) goals. Show you understand what Series A investors in your space typically require—usually $1-3M ARR, strong retention, and a repeatable go-to-market motion. Explain the logical sequence of milestones and how they de-risk the business. Be realistic about timeline—most seed companies take 18-24 months to Series A.",
      },
    ],
    metrics: [
      {
        label: "Monthly Recurring Revenue (MRR)",
        value: "$10K - $100K",
        note: "Seed-stage SaaS typically shows $10K-$100K MRR. Focus on growth rate (15-20% month-over-month) over absolute numbers at this stage.",
      },
      {
        label: "Monthly Growth Rate",
        value: "15-25%",
        note: "Consistent month-over-month MRR growth. Compounding at 20% monthly means 9x growth annually.",
      },
      {
        label: "Logo Retention",
        value: "85%+ monthly (SMB), 95%+ (Enterprise)",
        note: "Monthly customer retention by count. Below these thresholds signals product-market fit issues.",
      },
      {
        label: "Net Revenue Retention",
        value: "100-110%",
        note: "NRR above 100% means expansion revenue exceeds churn. Best-in-class seed SaaS achieves 105-110%.",
      },
      {
        label: "CAC Payback Period",
        value: "12-18 months",
        note: "Months to recover customer acquisition cost from gross profit. Under 12 months is excellent, over 24 months is concerning.",
      },
      {
        label: "Gross Margin",
        value: "70-80%",
        note: "Software gross margin after hosting, support, and implementation costs. Below 70% requires explanation.",
      },
    ],
    objections: [
      {
        objection: "Your churn rate is too high to build a sustainable business.",
        response:
          "Acknowledge churn concerns directly with data: 'Our monthly churn is currently 6%, which is above the 4% benchmark for seed-stage SMB SaaS. Here's our analysis of why customers leave and our three-part retention strategy: 1) Onboarding improvements that increased 30-day activation from 40% to 65% in our last cohort, 2) Feature additions addressing the top churn driver (lack of integrations), shipping in Q2, 3) Customer success outreach for accounts showing declining usage patterns. We expect these to reduce churn to 4% within two quarters based on early cohort data.'",
      },
      {
        objection: "This looks like a feature, not a company.",
        response:
          "Address the platform vs. feature concern directly. Show your expansion roadmap: adjacent problems you can solve, additional modules in development, and customer feedback indicating willingness to consolidate more spend with you. Reference comparable companies that started narrow and expanded into platforms. Demonstrate network effects or data advantages that compound over time. Show evidence customers want you to do more, not just do one thing better.",
      },
      {
        objection: "Customer acquisition costs are too high to scale profitably.",
        response:
          "Present your CAC trajectory and improvement levers. Show CAC by channel with plans to shift toward more efficient channels. Demonstrate organic growth and referral mechanisms that improve blended CAC over time. If relying on sales, show how automation and process improvements reduce CAC at scale. Reference LTV expansion that justifies higher CAC. Be realistic about the path while showing specific initiatives that improve efficiency.",
      },
      {
        objection: "The market is too competitive with established players and funded startups.",
        response:
          "Competition validates the market. Present your differentiated positioning: specific customer segment, use case, or approach where you win. Show win rates against named competitors and why. Reference early traction as evidence of competitive viability. Address barriers to entry in your specific niche. Acknowledge competition honestly while demonstrating you've found a defensible position with evidence.",
      },
    ],
  },
  pitchDeck: {
    summary:
      "SaaS seed decks must demonstrate product-market fit signals, unit economics trajectory, and a clear path from early traction to Series A. Lead with the customer problem and your unique insight. Show metrics that prove customers find value. Be realistic about competition and honest about what you don't yet know.",
    sections: [
      {
        title: "Problem",
        goal: "Show a specific, quantifiable pain in your target segment's daily work",
        guidance:
          "SaaS investors see hundreds of 'productivity' pitches. Differentiate by naming the exact workflow, the persona (job title + company size), and the cost of the status quo. Quantify the pain: time wasted, money lost, opportunities missed. Example: 'Sales managers at 50-200 person companies spend 6 hours weekly reconciling CRM data with marketing automation—that's $15K/year in lost selling time per manager.' Make it concrete and verifiable.",
      },
      {
        title: "Solution",
        goal: "Demonstrate your product and its core value proposition",
        guidance:
          "Show the product, not just describe it. Use screenshots or a quick demo video. Focus on the primary use case and how it solves the problem you identified. Avoid feature lists—show the experience and outcome. Make clear what makes your approach different from alternatives. The best solution slides make viewers think 'of course—why didn't this exist before?'",
      },
      {
        title: "Traction",
        goal: "Prove early product-market fit with metrics",
        guidance:
          "Lead with your strongest metrics: MRR, growth rate, retention, NPS. Show cohort charts if you have them—nothing demonstrates PMF like a flat retention curve. Include customer logos if recognizable. Share customer quotes that demonstrate genuine enthusiasm. Show both quantitative and qualitative signals. If metrics are early, show the trajectory and explain what changed to improve them.",
      },
      {
        title: "Business Model",
        goal: "Explain how you make money and the unit economics",
        guidance:
          "Present pricing model clearly: per seat, usage-based, tiered plans. Show ARPU and explain expansion revenue potential. Present unit economics: CAC by channel, LTV, payback period. Be honest about where economics are today vs. target. Show the path to improving economics at scale. Investors want to see you understand your business model deeply.",
      },
      {
        title: "Market",
        goal: "Size the opportunity credibly",
        guidance:
          "Bottom-up sizing that investors can verify. Start with your ICP: how many companies fit the profile, what's their willingness to pay. Present SAM before TAM. Show the expansion path from initial wedge to broader market. Reference comparable SaaS companies and their market sizes. Avoid obviously inflated TAM numbers—they undermine credibility.",
      },
      {
        title: "Competition",
        goal: "Show you understand the landscape and have a defensible position",
        guidance:
          "Include all real alternatives: direct competitors, adjacent solutions, and status quo (spreadsheets, manual processes). Position yourself honestly—no one wins on every dimension. Explain your specific advantage and which customers care about it. Show win rates if available. Demonstrate deep competitive knowledge rather than dismissing competitors.",
      },
      {
        title: "Go-to-Market",
        goal: "Explain how you acquire and expand customers",
        guidance:
          "Present your primary GTM motion: product-led, sales-led, or hybrid. Show early evidence it works: conversion rates, pipeline, CAC trends. Explain how it scales with capital. Address the path from early adopters to mainstream market. Include any unique distribution advantages: partnerships, communities, network effects.",
      },
      {
        title: "Team",
        goal: "Show why this team will win",
        guidance:
          "Highlight relevant experience: domain expertise, prior startup success, functional excellence. Show complementary skills across founders. Address gaps honestly and plans to fill them. For SaaS, commercial experience alongside technical founders is valuable. Include key advisors or committed hires. Make clear why you specifically are positioned to solve this problem.",
      },
      {
        title: "Financials",
        goal: "Present realistic projections and capital efficiency",
        guidance:
          "Show 18-24 month projections with key assumptions explicit. Present burn rate and runway. Show path to key milestones (ARR targets, team size). Be realistic—aggressive projections that miss undermine trust for future fundraising. Show you understand SaaS economics and what good looks like.",
      },
      {
        title: "Ask",
        goal: "Clearly state what you need and how you'll use it",
        guidance:
          "State round size and structure. Break down use of funds: product, GTM, team. Connect capital to milestones: what this round achieves and how it positions you for Series A. Show timeline to next round. Be clear about what success looks like and what risks remain after this round.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "SaaS seed investors benchmark against these key metrics to evaluate product-market fit and capital efficiency. The bar has risen—investors expect more proof of retention and economics earlier. Focus on demonstrating sustainable growth, not just user acquisition.",
    metrics: [
      {
        label: "Monthly Recurring Revenue (MRR)",
        value: "$10K - $100K",
        note: "Range for seed-stage SaaS. Lower end acceptable with strong growth; higher end expected for larger rounds.",
      },
      {
        label: "MRR Growth Rate",
        value: "15-25% monthly",
        note: "Month-over-month growth. Consistency matters as much as peak rates. 20% monthly compounds to 9x annually.",
      },
      {
        label: "Net Revenue Retention (NRR)",
        value: "100-110%",
        note: "NRR above 100% indicates expansion exceeds churn. Early evidence of NRR >100% is a strong PMF signal.",
      },
      {
        label: "Logo Retention",
        value: "85%+ (SMB), 95%+ (Enterprise)",
        note: "Monthly customer retention. Below these thresholds indicates product-market fit issues requiring attention.",
      },
      {
        label: "CAC Payback Period",
        value: "12-18 months",
        note: "Months to recover acquisition cost. Under 12 is excellent, 18-24 acceptable with clear improvement path.",
      },
      {
        label: "LTV:CAC Ratio",
        value: "2:1 to 3:1 (early)",
        note: "Early stage ratio with clear path to 4:1+. Calculate using actual customer behavior, not projections.",
      },
      {
        label: "Gross Margin",
        value: "70-80%",
        note: "Software gross margin after COGS. Sub-70% requires explanation and clear path to target margins.",
      },
      {
        label: "Net Promoter Score",
        value: "40+",
        note: "NPS indicates customer satisfaction and referral likelihood. Strong NPS supports organic growth.",
      },
      {
        label: "Activation Rate",
        value: "40-60%",
        note: "Percentage of signups completing key activation milestones. Critical for product-led growth models.",
      },
      {
        label: "Time to Value",
        value: "Under 7 days",
        note: "Days from signup to first value realization. Faster TTV correlates with better retention.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "SaaS seed due diligence focuses on validating product-market fit signals, team capability, and unit economics trajectory. Investors will dig into retention data, customer feedback, and competitive positioning. Comprehensive documentation demonstrates operational maturity.",
    items: [
      {
        item: "Customer cohort analysis showing retention curves",
        rationale:
          "Cohort data is the clearest product-market fit signal. Provide monthly cohorts showing logo retention and revenue retention over at least 6 months. Include both visual charts and underlying data. If retention improves in recent cohorts, highlight the changes that drove improvement.",
      },
      {
        item: "MRR bridge showing growth, churn, and expansion",
        rationale:
          "Monthly MRR waterfall breaking down new business, expansion, contraction, and churn. Shows health of growth and identifies concerning patterns. Include 6-12 months of history with commentary on significant changes.",
      },
      {
        item: "Customer acquisition analysis by channel",
        rationale:
          "CAC breakdown by channel with trend over time. Include conversion rates at each funnel stage. Show which channels are scaling and which are experimental. Address any channel concentration risk.",
      },
      {
        item: "Customer list with contact information for references",
        rationale:
          "Full customer list including company, contact, signup date, plan, and MRR. Be prepared for investors to call customers. Highlight your best references but expect random selection too.",
      },
      {
        item: "Product roadmap and technical architecture",
        rationale:
          "Current roadmap with timeline and rationale. Technical architecture overview showing key systems and scalability approach. Address any technical debt or infrastructure concerns.",
      },
      {
        item: "Competitive analysis with win/loss data",
        rationale:
          "Map of competitive landscape with positioning. Win/loss analysis by competitor including reasons. Evidence of sustainable differentiation. Deal-level data if available.",
      },
      {
        item: "Financial model with assumptions",
        rationale:
          "18-24 month projection with explicit assumptions. Scenario analysis showing sensitivity to key variables. Historical accuracy if previous projections exist. Unit economics build-up.",
      },
      {
        item: "Team backgrounds and org chart",
        rationale:
          "Detailed backgrounds for founders and key team members. Current org chart and planned structure. Key person dependencies and risk mitigation. Hiring plan and committed candidates.",
      },
      {
        item: "Cap table and prior funding terms",
        rationale:
          "Complete cap table showing all ownership. Summary of prior funding terms including any unusual provisions. Option pool and refresh plan. Any outstanding convertible instruments.",
      },
      {
        item: "Customer feedback and NPS data",
        rationale:
          "Aggregate NPS or CSAT scores with methodology. Qualitative feedback themes from customer conversations. Evidence of product-market fit beyond metrics. Feature request patterns.",
      },
      {
        item: "Legal documentation (incorporation, IP, contracts)",
        rationale:
          "Certificate of incorporation and good standing. IP assignment agreements. Standard customer contract terms. Any pending legal issues or concerns.",
      },
      {
        item: "Sales pipeline and forecasting data",
        rationale:
          "Current pipeline with stage, value, and probability. Historical conversion rates by stage. Forecasting methodology and accuracy. Sales cycle length analysis.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Monthly SaaS investor updates should focus on growth metrics, retention signals, and milestone progress. Be consistent in format so trends are visible. Lead with what matters most: MRR growth and retention. Be transparent about challenges—investors can help more when they understand problems early.",
    sections: [
      {
        section: "Key Metrics Dashboard",
        content:
          "Lead with core SaaS metrics: MRR, growth rate, NRR, churn, CAC payback. Show month-over-month change and trend direction. Use consistent formatting so investors can track progress easily. Include sparklines or small charts if your email format supports them. This section should take 30 seconds to scan and understand business health.",
      },
      {
        section: "Customer Highlights",
        content:
          "New customers with brief context on why they chose you. Notable expansion or upsells. Customer success stories or quotes. Any churn with honest assessment of reasons. Reference customers willing to speak with investors.",
      },
      {
        section: "Product Updates",
        content:
          "Features shipped and their impact on metrics. Current sprint priorities. Roadmap progress against plan. Any technical challenges or infrastructure improvements. Customer feedback driving product decisions.",
      },
      {
        section: "Go-to-Market Progress",
        content:
          "Pipeline and conversion trends. Channel experiments and results. Marketing initiatives and performance. Sales team performance and capacity. Partnership or distribution developments.",
      },
      {
        section: "Team & Operations",
        content:
          "Key hires completed or in progress. Organizational changes. Culture and retention indicators. Operational improvements. Any departures and mitigation.",
      },
      {
        section: "Financial Position",
        content:
          "Cash position and runway. Burn rate trend. Revenue vs. plan. Key expense changes. Path to next milestone.",
      },
      {
        section: "Priorities & Asks",
        content:
          "Top 3 priorities for next month. Specific asks: introductions, expertise, advice. Decisions you're wrestling with where input helps. Clear, actionable requests make it easy for investors to help.",
      },
      {
        section: "Looking Ahead",
        content:
          "Key milestones approaching. Risks you're monitoring. Strategic decisions on the horizon. Any changes to fundraising timeline or strategy.",
      },
    ],
  },
};

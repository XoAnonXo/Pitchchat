import type { IndustryStageContent } from "../types";

export const aiSeedContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Seed-stage AI founders face intense scrutiny about technical defensibility, especially in a market where foundation models from OpenAI, Anthropic, and Google dominate headlines. Investors want to understand how your startup creates lasting value beyond being an API wrapper. Prepare to articulate your unique data advantages, model architecture innovations, and path to sustainable unit economics at scale.",
    questions: [
      {
        category: "Technical Moat",
        question: "How defensible is your AI against OpenAI, Google, and other foundation model providers entering your space?",
        answer:
          "Investors hear this concern constantly in AI deals. Your answer should focus on defensibility layers: proprietary training data that would take years to replicate, domain-specific fine-tuning that requires deep expertise, unique data flywheels where user interactions improve your model, or workflow integration that creates switching costs. Avoid claiming your prompt engineering is a moat. Instead, show how your approach compounds value over time in ways that big tech cannot easily replicate with scale alone.",
      },
      {
        category: "Data Strategy",
        question: "What is your data moat and how do you ensure you have rights to your training data?",
        answer:
          "Data provenance is now a legal and competitive battleground. Explain where your training data comes from, whether you have explicit licenses or consent, and how you handle potential copyright or privacy issues. The best answers show proprietary data sources: first-party user data with clear consent, partnerships with data owners, or synthetic data generation capabilities. Investors want to avoid companies that could face lawsuits or lose access to critical training data.",
      },
      {
        category: "Unit Economics",
        question: "What are your inference costs and how do they scale with usage?",
        answer:
          "AI startups often underestimate compute costs. Walk through your current cost per inference, how that changes at 10x and 100x scale, and your strategy for cost reduction. This might include model distillation, quantization, custom hardware, or architectural optimizations. Show you understand the path from current margins (which may be negative) to sustainable unit economics. Investors have seen too many AI companies with impressive demos but broken economics.",
      },
      {
        category: "Product Differentiation",
        question: "Why can't a customer just use ChatGPT or Claude directly instead of your product?",
        answer:
          "This is the 'wrapper company' objection. Your answer should articulate value beyond the base model: specialized domain knowledge, proprietary workflows, data integrations the customer needs, compliance and security requirements, or dramatically better UX for a specific use case. The strongest answers show that even if the underlying model commoditizes, your product layer remains valuable because of how it solves the complete customer problem.",
      },
      {
        category: "Go-to-Market",
        question: "How are you acquiring customers and what does your sales motion look like?",
        answer:
          "At seed stage, investors want to see evidence of repeatable customer acquisition. Describe your primary channel (product-led growth, outbound sales, partnerships), your customer acquisition cost, and early signs of repeatability. For enterprise AI, explain your champion-building strategy and how you navigate procurement. For prosumer or SMB, show activation and retention metrics. The goal is demonstrating you understand how to find and convert your target customer efficiently.",
      },
      {
        category: "Team",
        question: "What is your team's specific AI/ML expertise and track record?",
        answer:
          "AI investing is still somewhat team-driven given rapid technical change. Highlight relevant ML publications, experience at top AI labs or companies, successful AI products shipped, or deep domain expertise in your target vertical. If your team lacks traditional ML credentials, explain your compensating strengths: perhaps you are domain experts who have assembled strong technical advisors, or you have a track record of rapid technical learning and execution.",
      },
      {
        category: "Market Timing",
        question: "Why is now the right time for this AI application?",
        answer:
          "Timing matters enormously in AI given how fast the field moves. Explain what has changed recently that makes your approach newly viable: perhaps new model capabilities, dropping inference costs, regulatory clarity, or shifting customer willingness to adopt AI. Show you understand the technology evolution curve and why your solution is possible and necessary today when it was not two years ago.",
      },
      {
        category: "Regulatory Risk",
        question: "How do you think about AI regulation and compliance requirements?",
        answer:
          "With the EU AI Act, potential US regulations, and industry-specific requirements emerging, investors need to understand your regulatory exposure. Explain which regulatory frameworks apply to your use case, how you are building compliance into your product, and whether regulation might actually benefit you by raising barriers to entry. Show awareness of risks like algorithmic bias, explainability requirements, and data privacy obligations.",
      },
      {
        category: "Competition",
        question: "Who are your main competitors and how do you differentiate?",
        answer:
          "Map the competitive landscape honestly: other startups, incumbents adding AI features, and potential big tech entry. For each category, explain your differentiation. Avoid claiming you have no competitors, as investors view this skeptically. The best answers show you have studied alternatives deeply and can articulate specific advantages: faster time-to-value, better accuracy on target use cases, stronger integrations, or more suitable pricing for your segment.",
      },
      {
        category: "Vision",
        question: "What is the long-term vision and how big can this become?",
        answer:
          "Seed investors need to see a path to a large outcome. Paint a picture of where this goes: from initial wedge to platform, from one use case to many, from one vertical to horizontal expansion. Ground this in realistic market sizing for your initial beachhead, then show how success there unlocks larger opportunities. Avoid hand-wavy claims about AI transforming everything. Instead, show a logical expansion path with clear milestones.",
      },
    ],
    metrics: [
      {
        label: "Monthly Recurring Revenue (MRR)",
        value: "$10K - $50K",
        note: "Seed AI startups should show early revenue traction. Even modest MRR demonstrates willingness to pay and helps validate unit economics assumptions. Pure research-stage companies may have zero revenue but need strong technical proof points instead.",
      },
      {
        label: "Gross Margin",
        value: "50% - 70%",
        note: "Compute costs often compress AI margins. Investors want to see a path to 70%+ gross margins at scale, even if current margins are lower. Explain your cost structure and optimization roadmap.",
      },
      {
        label: "Model Latency (P95)",
        value: "< 500ms",
        note: "For real-time applications, latency matters for user experience. Show you have measured latency at realistic scale and have strategies for maintaining performance as usage grows.",
      },
      {
        label: "Active Users or Customers",
        value: "100 - 1,000",
        note: "Early user count indicates product-market fit exploration. More important than the number is engagement depth, retention, and qualitative feedback showing the product solves a real problem.",
      },
      {
        label: "Model Accuracy on Target Task",
        value: "85%+ on key benchmarks",
        note: "Define the metrics that matter for your use case and show your model performs well. Be specific about evaluation methodology and how you compare to alternatives including human performance.",
      },
      {
        label: "Customer Retention (Monthly)",
        value: "80%+ logo retention",
        note: "Early retention signals product stickiness. For B2B, track both logo retention and net revenue retention. Churn at seed stage often indicates product-market fit issues that need resolution.",
      },
    ],
    objections: [
      {
        objection: "This looks like a thin wrapper on top of OpenAI's API. What happens when they add this feature?",
        response:
          "Acknowledge the risk directly, then explain your defensibility layers. This might include proprietary data pipelines that improve model performance for your specific use case, deep workflow integration that would require significant effort to replicate, compliance and security features enterprise customers require, or network effects where user activity improves the product for everyone. Show you have thought carefully about the platform risk and have a strategy beyond hoping OpenAI does not compete.",
      },
      {
        objection: "AI inference costs seem unsustainable. How do you get to positive unit economics?",
        response:
          "Walk through your current cost structure and your path to profitability. This might involve model distillation to reduce compute requirements, architectural optimizations, batching strategies, or pricing adjustments as you prove value. Reference specific technical approaches and provide a timeline for when you expect to achieve target margins. Show you understand the problem deeply and have concrete plans, not just hope that costs will magically decrease.",
      },
      {
        objection: "The AI space is moving so fast. How do you avoid being disrupted by the next model breakthrough?",
        response:
          "This is a valid concern given rapid progress in foundation models. Your answer should focus on what remains durable even as underlying models improve: your unique data assets, customer relationships, workflow integration, domain expertise, and brand in your vertical. Show how you architect your system to benefit from model improvements rather than being displaced by them. The best AI companies become better as models improve, not obsolete.",
      },
      {
        objection: "Your team does not have PhD-level ML research credentials. Can you really compete technically?",
        response:
          "Many successful AI companies are built by strong engineers and domain experts rather than researchers. Explain your team's relevant strengths: deep understanding of the customer problem, ability to ship product quickly, domain expertise that guides model application, or strong technical advisors who provide research guidance. Show you know what you do not know and have strategies to fill gaps. Execution often matters more than pure research pedigree in applied AI.",
      },
    ],
  },
  pitchDeck: {
    summary:
      "A seed-stage AI pitch deck must address the elephant in the room: why your company will not be commoditized by foundation model providers. Structure your narrative around a specific, painful problem, your unique approach to solving it, and early evidence of traction. Keep technical depth accessible while demonstrating genuine innovation.",
    sections: [
      {
        title: "Problem",
        goal: "Establish a specific, expensive, and urgent problem in your target market",
        guidance:
          "Avoid generic statements about AI opportunity. Instead, identify a concrete pain point: perhaps manual processes that cost enterprises millions annually, decisions made with inadequate data, or expert bottlenecks that limit scale. Quantify the problem with real numbers. Show you have talked to customers and understand their pain deeply. The problem should be specific enough that your solution makes sense, but large enough to support a venture-scale outcome.",
      },
      {
        title: "Solution",
        goal: "Show how AI uniquely enables your approach to the problem",
        guidance:
          "Explain your solution clearly without jargon. Focus on customer outcomes rather than technical details. Why does AI make this solution newly possible or dramatically better? Demonstrate with a concrete example or demo. Avoid showing architecture diagrams unless investors specifically ask. The goal is showing you solve the problem effectively, not impressing with technical complexity.",
      },
      {
        title: "Why Now",
        goal: "Explain the timing that makes this opportunity ripe today",
        guidance:
          "AI timing is critical given rapid technology evolution. What has changed in the last one to two years that makes your approach viable? This might be new model capabilities, cost reductions, data availability, regulatory clarity, or customer readiness to adopt AI. Show you understand the technology wave and are positioned to ride it rather than fight against premature market conditions.",
      },
      {
        title: "Market",
        goal: "Size the opportunity credibly from bottom-up, not just top-down",
        guidance:
          "Start with your specific beachhead market and size it with a bottom-up analysis: number of potential customers, realistic price point, and achievable penetration. Then show how success in the beachhead unlocks larger markets. Investors are skeptical of AI TAM slides showing trillions of dollars. Ground your numbers in reality while still painting a venture-scale opportunity.",
      },
      {
        title: "Product & Differentiation",
        goal: "Demonstrate why customers choose you over alternatives",
        guidance:
          "Show your product and explain what makes it defensible. This is where you address the wrapper objection head-on. What do you have that others cannot easily replicate? Proprietary data, unique workflows, deep integrations, specialized model training, or exceptional user experience? Be specific about your moat and honest about what is and is not defensible.",
      },
      {
        title: "Traction",
        goal: "Prove early market validation with concrete evidence",
        guidance:
          "Show whatever evidence you have that the market wants this: revenue, pilots, users, waitlist signups, or at minimum strong customer interview data. For AI companies, also include technical validation: benchmark results, accuracy improvements, or successful POCs. Quality matters more than quantity at seed stage. A few deeply engaged customers beat thousands of casual signups.",
      },
      {
        title: "Business Model",
        goal: "Explain how you make money and path to profitability",
        guidance:
          "Detail your pricing model and unit economics. Address compute costs explicitly since investors worry about AI margins. Show you have thought through the path from current economics to sustainable margins. Include assumptions about cost improvements and pricing power. The best seed decks show thoughtfulness about economics even if current numbers are early.",
      },
      {
        title: "Team",
        goal: "Show why this team is uniquely positioned to win",
        guidance:
          "Highlight relevant experience: AI/ML expertise, domain knowledge in your target vertical, startup experience, or relevant company backgrounds. If you lack traditional ML credentials, explain your compensating strengths. Show the team covers key functions: technical, product, and commercial. Include notable advisors if they add meaningful credibility.",
      },
      {
        title: "Ask",
        goal: "Clear funding request with planned use of capital",
        guidance:
          "State your raise amount and how you will deploy capital. For AI companies, investors want to see thoughtful allocation between compute and model development, product engineering, and go-to-market. Define milestones this funding will achieve: technical goals, revenue targets, and metrics that set up Series A. Be specific about what success looks like in eighteen months.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Seed-stage AI metrics focus on early validation rather than scale. Investors prioritize technical proof points, initial revenue traction, and evidence of unit economics viability. The benchmarks below reflect typical expectations for AI startups raising seed rounds in 2024-2025, though exact thresholds vary by sub-sector and business model.",
    metrics: [
      {
        label: "Monthly Recurring Revenue (MRR)",
        value: "$10K - $50K",
        note: "Pre-revenue companies can raise seed rounds but need strong technical differentiation. Companies with $30K+ MRR have significantly stronger positioning for seed rounds at higher valuations.",
      },
      {
        label: "Revenue Growth Rate (MoM)",
        value: "15% - 30%",
        note: "Early-stage AI companies with revenue should demonstrate strong monthly growth. Even 10-15% month-over-month growth is acceptable if retention is strong and growth is accelerating.",
      },
      {
        label: "Gross Margin",
        value: "50% - 70%",
        note: "AI gross margins are often lower than traditional SaaS due to compute costs. Investors accept lower initial margins if there is a clear path to 70%+ margins at scale through optimization and pricing power.",
      },
      {
        label: "Burn Multiple",
        value: "2x - 4x",
        note: "Burn multiple equals net burn divided by net new ARR. Below 2x is excellent, 2-4x is acceptable at seed stage. Above 4x raises concerns about capital efficiency.",
      },
      {
        label: "Customer Acquisition Cost (CAC)",
        value: "< 3 months revenue",
        note: "Early CAC should be low as you target design partners and early adopters. CAC payback under 6 months is strong. Be prepared to explain how CAC will change as you scale beyond early adopters.",
      },
      {
        label: "Logo Retention (Monthly)",
        value: "85%+",
        note: "Monthly logo retention above 85% indicates product-market fit. Below 80% suggests fundamental issues to address before scaling. Net revenue retention matters more at later stages.",
      },
      {
        label: "Model Accuracy / Performance",
        value: "Top quartile vs alternatives",
        note: "Define metrics relevant to your use case and demonstrate performance. This might be accuracy, latency, cost-per-inference, or domain-specific benchmarks. Compare honestly to alternatives.",
      },
      {
        label: "Inference Cost per Request",
        value: "< 20% of revenue per use",
        note: "Compute cost as a percentage of revenue should allow for healthy margins. Track this carefully and have a plan for optimization as you scale.",
      },
      {
        label: "Time to Value for Customers",
        value: "< 1 week to first success",
        note: "How quickly do customers experience value? Faster time-to-value improves conversion and retention. AI products should aim for near-immediate demonstration of capability.",
      },
      {
        label: "Engineering Velocity",
        value: "Weekly releases, fast iteration",
        note: "Early-stage AI companies should ship rapidly to learn from customer feedback. Slow iteration is a red flag given how fast the competitive landscape moves.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "AI seed-stage diligence focuses on technical differentiation, data rights, and team capability. Investors will probe deeply on defensibility against foundation model providers and the sustainability of your technical approach. Prepare documentation and clear answers for each area below.",
    items: [
      {
        item: "Model Architecture & Training Documentation",
        rationale:
          "Technical diligence will examine your approach. Prepare clear documentation of your model architecture, training methodology, and how it differs from fine-tuning commodity models. Be ready to explain trade-offs and technical decisions.",
      },
      {
        item: "Data Rights & Provenance Audit",
        rationale:
          "With increasing litigation around training data, investors need confidence in your data rights. Document sources, licenses, consent mechanisms, and any potential copyright or privacy exposure. Clean data provenance is increasingly a dealbreaker.",
      },
      {
        item: "Compute Cost Analysis & Projections",
        rationale:
          "Prepare detailed breakdowns of current inference and training costs, with projections at 10x and 100x scale. Include optimization roadmap showing how costs improve over time. Investors need to believe in a path to healthy margins.",
      },
      {
        item: "Cap Table & Previous Financing",
        rationale:
          "Standard for all startups but especially important given AI company valuations. Document all equity grants, SAFEs, convertible notes, and option pool. Clean cap table with reasonable founder ownership is expected.",
      },
      {
        item: "Technical Team Assessment",
        rationale:
          "Be prepared for technical interviews or reference checks on key team members. Document relevant experience, publications, and track record. For teams without traditional ML backgrounds, prepare clear narrative on technical strategy.",
      },
      {
        item: "Competitive Analysis & Differentiation Memo",
        rationale:
          "Prepare a written analysis of your competitive landscape including other startups, incumbents, and potential big tech entry. Document your differentiation clearly. Investors will compare your assessment against their own research.",
      },
      {
        item: "Customer Reference List",
        rationale:
          "Prepare three to five customers willing to speak with investors. Choose customers who can speak to the problem severity, your product value, and their willingness to pay and expand. Brief customers on likely questions.",
      },
      {
        item: "Security & Compliance Documentation",
        rationale:
          "If targeting enterprise customers, document your security practices and any compliance certifications. SOC 2 Type II may not be complete at seed stage but have a clear roadmap. Address data handling and privacy practices.",
      },
      {
        item: "IP & Patent Strategy",
        rationale:
          "Document any patents filed or in preparation. More importantly, be prepared to discuss your broader IP strategy and how you protect your technical advantages. In AI, trade secrets and data often matter more than patents.",
      },
      {
        item: "Regulatory Risk Assessment",
        rationale:
          "Prepare analysis of relevant AI regulations in your target markets: EU AI Act, sector-specific requirements, and potential US regulation. Show you understand compliance requirements and have built them into your product roadmap.",
      },
      {
        item: "Financial Model & Projections",
        rationale:
          "Prepare a financial model showing path to Series A milestones. Include revenue projections, cost structure, hiring plan, and key assumptions. Models should be grounded in realistic customer acquisition and expansion rates.",
      },
      {
        item: "Product Roadmap & Technical Milestones",
        rationale:
          "Document your eighteen-month roadmap with clear milestones. Investors want to see how this funding advances both technical capabilities and commercial traction. Link milestones to Series A readiness.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Monthly investor updates for seed-stage AI companies should focus on technical progress, early customer traction, and key learnings. Keep updates concise but substantive. Transparency about challenges builds trust and often surfaces helpful investor support.",
    sections: [
      {
        section: "Highlights",
        content:
          "Lead with three to five key wins from the month. For AI companies, this should balance technical milestones with commercial progress. Examples: launched new model version with 20% accuracy improvement, closed first paying customer at $X MRR, completed successful POC with Fortune 500 company. Be specific with numbers and outcomes.",
      },
      {
        section: "Key Metrics",
        content:
          "Report core metrics consistently each month: MRR, customer count, key product metrics (accuracy, latency, usage), and runway. For AI specifically, include compute costs and any efficiency improvements. Consistent reporting builds credibility and helps investors track progress.",
      },
      {
        section: "Product & Technical",
        content:
          "Summarize technical progress and product development. What shipped? What did you learn? For AI companies, highlight model improvements, infrastructure wins, and any research breakthroughs. Be honest about technical challenges and how you are addressing them.",
      },
      {
        section: "Customers & Pipeline",
        content:
          "Update on customer acquisition, expansion, and pipeline. Share wins, losses, and learnings. What are customers saying? What patterns are emerging in sales conversations? This helps investors understand product-market fit trajectory and may surface introductions they can make.",
      },
      {
        section: "Team",
        content:
          "Note any hiring wins, departures, or planned hires. AI talent competition is fierce, so celebrate recruiting wins. If you are struggling to hire, mention it as investors may have relevant networks. Include any advisory board additions.",
      },
      {
        section: "Challenges & Asks",
        content:
          "Be transparent about obstacles and specific requests for help. Investors appreciate candor and often can assist with introductions, advice, or resources. Common asks: customer introductions, hiring referrals, technical advisor suggestions, or strategic advice on specific decisions.",
      },
      {
        section: "Cash & Runway",
        content:
          "Report current cash position and runway in months. Note any changes to burn rate and reasons. If runway is getting short, signal early so investors can help with bridge financing or accelerated fundraising. No investor likes surprises about cash.",
      },
      {
        section: "Next Month Focus",
        content:
          "Preview priorities for the coming month. What milestones are you targeting? This creates accountability and helps investors understand your execution cadence. It also signals where they might be able to provide timely support.",
      },
    ],
  },
};

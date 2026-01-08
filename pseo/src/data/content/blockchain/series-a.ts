import type { IndustryStageContent } from "../types";

export const blockchainSeriesAContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Series A blockchain companies must demonstrate product-market fit with sustainable economics—not just growth fueled by token incentives. Investors evaluate protocol revenue, organic user retention, and defensible competitive position. The bar has risen significantly post-crypto winter: real revenue and proven utility are now required, not just impressive TVL or user counts.",
    questions: [
      {
        category: "Sustainable Economics",
        question:
          "What's your protocol revenue and path to profitability without relying on token emissions?",
        answer:
          "Series A blockchain companies must show real revenue traction. Present protocol revenue: fee generation, revenue per user, revenue growth trajectory. Show unit economics that work without token subsidies. Address how revenue sustains operations as token emissions decrease. Present path to protocol profitability. Investors need confidence in sustainable economics—token appreciation is not a business model.",
      },
      {
        category: "Organic Retention",
        question:
          "What's your user retention after token incentives decrease or end?",
        answer:
          "The true test of product-market fit is retention without incentives. Show user behavior when incentives reduce: retention rates, usage patterns, migration rates. Present cohort analysis distinguishing organic users from incentive-driven. Show what percentage of TVL or volume is 'sticky.' Address your incentive reduction roadmap and expected impact. Organic retention proves real utility.",
      },
      {
        category: "Competitive Moat",
        question:
          "How defensible is your protocol against forks, competitors, and new entrants?",
        answer:
          "Blockchain protocols can be forked easily—what makes yours defensible? Present your moat: network effects, liquidity depth, integrations, developer ecosystem, brand, or technical differentiation. Show competitive dynamics: why users don't switch, what makes forking ineffective. Address any vampire attacks or competitive migrations. Demonstrate increasing returns to scale that protect your position.",
      },
      {
        category: "Regulatory Progress",
        question:
          "What's your regulatory status and how have you de-risked compliance?",
        answer:
          "Series A requires significant regulatory progress. Show compliance infrastructure built: licenses obtained, registrations completed, legal structure optimized. Present relationships with regulators and any formal guidance received. Address SEC, CFTC, and state requirements for US. For international, show MiCA readiness and key jurisdiction compliance. Regulatory de-risking should be measurable progress, not just legal opinions.",
      },
      {
        category: "Token Value Accrual",
        question:
          "How does value accrue to token holders and what's the treasury management strategy?",
        answer:
          "Token value should reflect protocol success. Present your value accrual mechanism: fee distribution, buybacks, staking returns, or governance value. Show treasury management: composition, policies, and runway. Address any token emissions and their sustainability. Include vesting schedules and unlock impact. Sophisticated investors understand tokenomics—demonstrate yours create aligned incentives.",
      },
      {
        category: "Security Track Record",
        question:
          "What's your security track record and how has your security posture matured?",
        answer:
          "Series A protocols should have established security credibility. Present your track record: any incidents, response effectiveness, funds at risk vs. recovered. Show security evolution: additional audits, bug bounty results, security team growth. Include insurance coverage and coverage limits. Address any smart contract upgrades and migration security. Security track record builds trust with institutional users.",
      },
      {
        category: "Decentralization Progress",
        question:
          "How has decentralization progressed and what's the governance participation rate?",
        answer:
          "Series A should show meaningful decentralization progress. Present governance evolution: decision-making distribution, admin key status, upgrade mechanisms. Show participation metrics: voter turnout, proposal activity, delegate diversity. Address remaining centralization and timeline for removal. Demonstrate decentralization is real, not theater. Include any regulatory benefits from genuine decentralization.",
      },
      {
        category: "Enterprise & Institutional",
        question:
          "What enterprise or institutional adoption have you achieved?",
        answer:
          "Enterprise and institutional users validate protocol maturity. Present institutional adoption: large users, enterprise integrations, institutional TVL. Show what requirements they imposed: security, compliance, SLAs. Address enterprise sales motion and pipeline. Include any partnerships with traditional finance or tech companies. Institutional adoption signals protocol readiness for scale.",
      },
      {
        category: "Cross-chain Strategy",
        question:
          "What's your multi-chain or cross-chain strategy as the ecosystem evolves?",
        answer:
          "Blockchain landscape continues fragmenting across L1s and L2s. Present your multi-chain approach: deployments across chains, bridging strategy, liquidity fragmentation management. Show chain selection rationale and competitive dynamics across ecosystems. Address any chain-specific risks or opportunities. Demonstrate strategic thinking about ecosystem evolution.",
      },
      {
        category: "Exit Path",
        question:
          "What are realistic exit scenarios for blockchain investments?",
        answer:
          "Blockchain exits differ from traditional venture. Present realistic scenarios: strategic acquisition by exchange, fintech, or tech company; M&A within crypto; or potential token liquidity events. Reference comparable transactions and valuations. Address how your structure (token vs. equity) affects exit options. Show strategic interest you've attracted. Investors need to see liquidity path—demonstrate thoughtful planning.",
      },
    ],
    metrics: [
      {
        label: "Protocol Revenue",
        value: "$500K - $3M annually",
        note: "Actual fee revenue generated by the protocol. This is the key metric for sustainable economics. Should show growth trajectory.",
      },
      {
        label: "Monthly Active Wallets",
        value: "50,000 - 500,000",
        note: "Unique wallets with meaningful activity monthly. Distinguish organic users from incentivized. Quality and retention matter.",
      },
      {
        label: "Total Value Locked",
        value: "$20M - $200M",
        note: "For DeFi protocols. Focus on organic, sticky TVL. Show TVL composition and concentration. Stability matters as much as size.",
      },
      {
        label: "Net Dollar Retention",
        value: "100-150%",
        note: "For protocols with measurable user value, show users increasing their usage/deposits over time. Proves deepening engagement.",
      },
      {
        label: "User Retention (90-day)",
        value: "30-50%",
        note: "Users active after 90 days, ideally without ongoing incentives. Proves genuine utility beyond speculation.",
      },
      {
        label: "Governance Participation",
        value: "10-30% of tokens voting",
        note: "Active governance participation indicates engaged community and meaningful decentralization progress.",
      },
    ],
    objections: [
      {
        objection:
          "Your revenue is still tiny compared to your valuation expectations.",
        response:
          "Address revenue multiple expectations directly. Show revenue growth rate and trajectory to meaningful scale. Reference comparable protocol valuations and revenue multiples. Present the market opportunity that justifies growth expectations. Demonstrate operating leverage—how costs scale vs. revenue. Acknowledge crypto valuation premium but justify with market size and growth potential.",
      },
      {
        objection:
          "User growth has slowed significantly since incentives decreased.",
        response:
          "Acknowledge the incentive-to-organic transition challenge. Show organic user metrics isolated from incentive-driven. Present retention of high-value users through the transition. Demonstrate product improvements driving organic adoption. Show sustainable growth rate expectation post-transition. Reference successful protocol transitions from incentive-driven to organic growth.",
      },
      {
        objection:
          "Regulatory crackdown could shut down the entire business.",
        response:
          "Address regulatory risk with specifics. Show compliance infrastructure and progress toward regulatory clarity. Present legal structure optimization for different regulatory scenarios. Demonstrate proactive regulator engagement and any favorable outcomes. Show geographic diversification reducing single-jurisdiction risk. Reference similar protocols that have navigated regulatory challenges. Risk is real but manageable with proper approach.",
      },
      {
        objection:
          "A competitor could fork your protocol and offer better incentives.",
        response:
          "Acknowledge fork risk but show why it's mitigated. Present network effects that don't transfer with code: liquidity depth, integrations, brand, community. Show competitive instances where forks failed to capture share. Demonstrate continuous innovation making static forks obsolete. Address any successful competitor attacks and how you responded. Your moat should be more than just first-mover.",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Series A blockchain pitch decks must demonstrate sustainable business fundamentals alongside crypto-native advantages. Lead with revenue traction, organic retention, and competitive moat. Show you've built a business, not just a protocol. Post-crypto winter, the bar for Series A is significantly higher.",
    sections: [
      {
        title: "Traction & Metrics",
        goal: "Lead with proof of product-market fit",
        guidance:
          "Open with key metrics: protocol revenue, active users, TVL, retention. Show trajectory over time. Distinguish organic activity from incentivized. Include comparison to Series A round. This slide should demonstrate clear product-market fit with sustainable economics.",
      },
      {
        title: "Problem & Market",
        goal: "Frame the market opportunity with evidence",
        guidance:
          "Size the market based on proven user segments. Show why blockchain solution wins: specific advantages that drive adoption. Include market timing evidence. Address total addressable market realistically—crypto markets are volatile but opportunities are real.",
      },
      {
        title: "Protocol & Product",
        goal: "Demonstrate technical differentiation and user value",
        guidance:
          "Present protocol capabilities with user value focus. Show technical differentiation and why it matters to users. Include product roadmap and capability expansion. Address composability and ecosystem positioning. Technical depth should support, not replace, business value.",
      },
      {
        title: "Business Model",
        goal: "Show sustainable revenue and unit economics",
        guidance:
          "Present revenue model in detail: fee structures, revenue per user, gross margin. Show unit economics working without token subsidies. Include revenue growth trajectory and path to profitability. Address token value accrual if applicable. This proves you've built a business.",
      },
      {
        title: "Competitive Position",
        goal: "Demonstrate defensible moat and market position",
        guidance:
          "Show competitive landscape evolution and your strengthening position. Present moat components: network effects, liquidity, integrations, technical differentiation. Include win/loss data and competitive migrations. Address fork risk and how you maintain advantage.",
      },
      {
        title: "Security & Track Record",
        goal: "Build confidence in protocol safety",
        guidance:
          "Present security track record: incidents (if any), response effectiveness, funds protected. Show security maturity: audit coverage, bug bounty results, security team. Include insurance coverage. This slide addresses existential risk directly.",
      },
      {
        title: "Regulatory Status",
        goal: "Show compliance progress and risk mitigation",
        guidance:
          "Present regulatory achievements: licenses, registrations, favorable guidance. Show compliance infrastructure built. Address remaining regulatory risks and mitigation. Include legal structure and jurisdictional strategy. Regulatory de-risking is competitive advantage.",
      },
      {
        title: "Governance & Decentralization",
        goal: "Demonstrate meaningful decentralization progress",
        guidance:
          "Present governance evolution: participation rates, decision distribution, admin key status. Show decentralization roadmap and progress. Address any remaining centralization with timeline. Include community metrics and engagement quality.",
      },
      {
        title: "Team & Organization",
        goal: "Show scaled organization with crypto-native expertise",
        guidance:
          "Present team growth and current structure. Highlight key hires and their impact. Show crypto-native expertise across functions. Include advisory relationships and their involvement. Address organizational evolution for scale.",
      },
      {
        title: "Financials & Ask",
        goal: "Present clear path to sustainable scale",
        guidance:
          "Show financial model: revenue projections, cost structure, path to profitability. Present raise amount and use of funds. Include treasury management approach. Define milestones this capital achieves. Show capital efficiency and milestone-based deployment.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Series A blockchain benchmarks focus on sustainable business metrics alongside crypto-native indicators. Investors compare your fundamentals against both crypto protocols and traditional companies. These benchmarks demonstrate business maturity beyond token speculation.",
    metrics: [
      {
        label: "Protocol Revenue",
        value: "$500K - $3M annually",
        note: "Real fee revenue from protocol operations. The most important metric for sustainable economics. Growth trajectory matters.",
      },
      {
        label: "Monthly Active Wallets",
        value: "50,000 - 500,000",
        note: "Unique active wallets monthly. Distinguish organic from incentivized. Retention and engagement quality matter.",
      },
      {
        label: "Total Value Locked",
        value: "$20M - $200M",
        note: "For DeFi protocols. Organic TVL without unsustainable incentives. Composition and stability as important as size.",
      },
      {
        label: "User Retention (90-day)",
        value: "30-50%",
        note: "Users returning after 90 days, ideally without incentives. Proves genuine utility and product-market fit.",
      },
      {
        label: "Revenue Growth Rate",
        value: "100-300% YoY",
        note: "Annual revenue growth. Crypto can grow faster but sustainability matters more than peak growth.",
      },
      {
        label: "Net Revenue Retention",
        value: "100-150%",
        note: "For protocols with measurable user economics. Shows users deepening engagement over time.",
      },
      {
        label: "Governance Participation",
        value: "10-30%",
        note: "Token voting participation. Indicates community engagement and decentralization credibility.",
      },
      {
        label: "Security Audit Coverage",
        value: "3+ audits, 100% critical code",
        note: "Comprehensive audit coverage from reputable firms. All critical findings addressed. Ongoing security program.",
      },
      {
        label: "Institutional/Enterprise Users",
        value: "5-20 significant",
        note: "Large users or enterprise integrations. Validates protocol maturity and security confidence.",
      },
      {
        label: "Team Size",
        value: "20-50 people",
        note: "Scaled team across engineering, security, community, and business. Heavy on technical and security talent.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Series A blockchain diligence is comprehensive, covering business fundamentals, security depth, regulatory status, and tokenomics sustainability. Prepare for thorough technical review and institutional-grade documentation. Quality of preparation reflects operational maturity.",
    items: [
      {
        item: "Comprehensive security audit history and remediation",
        rationale:
          "All audit reports with remediation evidence. Ongoing security program documentation. Bug bounty statistics and payouts. Incident history with response analysis. Insurance coverage and limits. Security is institutional table stakes.",
      },
      {
        item: "Financial model with protocol economics analysis",
        rationale:
          "Detailed financial model: revenue drivers, cost structure, path to profitability. Protocol economics analysis: fee sustainability, token emission impact, treasury runway. Scenario analysis for different adoption levels.",
      },
      {
        item: "Regulatory compliance documentation",
        rationale:
          "Comprehensive regulatory file: licenses obtained, registrations, legal opinions on token status, regulator correspondence. Compliance program documentation. Legal structure and jurisdictional analysis.",
      },
      {
        item: "On-chain analytics with organic/incentivized segmentation",
        rationale:
          "Detailed on-chain metrics with methodology. Organic vs. incentivized user segmentation. Retention cohort analysis. TVL composition and concentration. Transaction pattern analysis. Transparency in methodology.",
      },
      {
        item: "Tokenomics documentation with sustainability modeling",
        rationale:
          "Complete tokenomics documentation: distribution, emissions, value accrual, governance. Economic modeling showing sustainability scenarios. Comparison to successful tokenomics models. Treasury management policies.",
      },
      {
        item: "Competitive analysis with market positioning evidence",
        rationale:
          "Detailed competitive landscape: market share analysis, technical benchmarking, win/loss data. Fork analysis and outcomes. Integration and partnership analysis. Moat documentation.",
      },
      {
        item: "Governance documentation and decentralization metrics",
        rationale:
          "Governance process documentation. Participation metrics and trends. Decentralization roadmap with milestones achieved. Admin key status and removal timeline. Community decision documentation.",
      },
      {
        item: "Technical architecture and upgrade documentation",
        rationale:
          "System architecture documentation. Smart contract design and upgrade mechanisms. Chain selection rationale. Multi-chain strategy documentation. Technical roadmap and capability evolution.",
      },
      {
        item: "Enterprise and institutional user references",
        rationale:
          "References from significant users: enterprise customers, institutional TVL providers, major integrations. Case studies of institutional adoption. Requirements they imposed and how you met them.",
      },
      {
        item: "Team evaluation with crypto experience verification",
        rationale:
          "Detailed team backgrounds with crypto experience verified. Key person risk analysis. Organizational structure and scaling plan. Compensation benchmarking. Reference checks on key personnel.",
      },
      {
        item: "Treasury and token management documentation",
        rationale:
          "Treasury composition and management policies. Multi-sig setup and key management. Vesting schedules and unlock analysis. Market impact analysis for scheduled unlocks.",
      },
      {
        item: "Cap table with token allocation reconciliation",
        rationale:
          "Complete cap table reconciling equity and token allocations. Prior funding terms for all rounds. SAFT/SAFE conversion mechanics. Any complex structures or unusual terms explained.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Series A blockchain investor updates should demonstrate business fundamentals while maintaining crypto-native context. Focus on sustainable metrics—revenue, retention, competitive position—rather than token price. Transparency about challenges builds credibility for future fundraising.",
    sections: [
      {
        section: "Executive Summary",
        content:
          "Lead with key business metrics: protocol revenue, active users, retention, treasury status. Summarize biggest wins and challenges. Include security status—any incidents or concerns. This should convey protocol health and business trajectory in 60 seconds.",
      },
      {
        section: "Revenue & Economics",
        content:
          "Detail revenue performance: fee generation, revenue per user, growth trajectory. Show progress toward sustainable economics. Include treasury status and runway. Address any tokenomics adjustments or emission changes. Focus on business fundamentals.",
      },
      {
        section: "User Metrics & Retention",
        content:
          "Report on user metrics: active wallets, growth, retention by cohort. Distinguish organic from incentivized where possible. Show engagement depth and user value trends. Address any concerning patterns. Demonstrate organic product-market fit.",
      },
      {
        section: "Product & Development",
        content:
          "Update on development progress: features shipped, technical improvements, integration additions. Include security improvements and audit progress. Show roadmap status with timeline adjustments if needed.",
      },
      {
        section: "Competitive Position",
        content:
          "Report on competitive dynamics: market share trends, competitive moves, win/loss outcomes. Include integration and partnership progress. Address any competitive threats or opportunities. Show moat strengthening.",
      },
      {
        section: "Security & Compliance",
        content:
          "Security status: incidents (hopefully none), audit progress, bug bounty activity, insurance updates. Compliance developments: regulatory changes, license progress, legal updates. These are institutional concerns—keep investors well-informed.",
      },
      {
        section: "Governance & Community",
        content:
          "Update on governance: participation trends, major decisions, decentralization progress. Include community metrics and engagement quality. Report on any governance challenges or improvements.",
      },
      {
        section: "Priorities & Asks",
        content:
          "Next quarter priorities and milestones. Specific investor asks: introductions, strategic guidance, technical expertise. Flag any significant decisions requiring board input. Include fundraising timeline if approaching next round.",
      },
    ],
  },
};

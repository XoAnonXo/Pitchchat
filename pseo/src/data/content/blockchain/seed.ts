import type { IndustryStageContent } from "../types";

export const blockchainSeedContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Seed-stage blockchain startups face unique investor scrutiny around token necessity, regulatory positioning, and sustainable economics beyond speculation. After the 2022 crypto winter, investors are far more skeptical of token-centric business models without clear utility. Your challenge is demonstrating real user value that justifies blockchain architecture—not just crypto hype repackaged.",
    questions: [
      {
        category: "Token Necessity",
        question:
          "Why does this need to be on a blockchain? Why do you need a token?",
        answer:
          "This is the most important question for any blockchain startup. Investors have seen countless projects where blockchain added complexity without value. Explain specifically what blockchain enables: censorship resistance, trustless coordination, programmable ownership, or permissionless composability. If you have a token, justify its necessity for the system to function—not just as a fundraising mechanism. The strongest answers show the product couldn't exist without blockchain properties.",
      },
      {
        category: "Regulatory Strategy",
        question:
          "How are you navigating securities law and crypto regulation?",
        answer:
          "Regulatory risk is existential for blockchain startups. Present your legal framework: is your token a security, utility token, or commodity? Show your compliance approach and legal counsel involvement. Address SEC, CFTC, and state-level requirements for US. For international, cover MiCA in Europe and relevant jurisdictions. Investors need confidence you won't be shut down by regulators—show you've thought this through carefully with qualified legal advice.",
      },
      {
        category: "User Acquisition",
        question:
          "How do you acquire users without unsustainable token incentives?",
        answer:
          "Many crypto projects bootstrapped growth with token emissions that proved unsustainable. Present your user acquisition strategy that doesn't depend on token price appreciation. Show organic growth metrics: users who joined without incentives, retention after incentive programs end, real utility driving adoption. If using token incentives, show the path to sustainable economics when incentives decrease. Investors want to see real demand, not manufactured metrics.",
      },
      {
        category: "Revenue Model",
        question:
          "What's your revenue model beyond token appreciation?",
        answer:
          "Token price appreciation is not a business model. Present actual revenue streams: transaction fees, protocol fees, enterprise services, or SaaS components. Show revenue you've generated or clear path to revenue. Address how revenue accrues to token holders if applicable. Investors learned from 2022 that protocols need sustainable economics—demonstrate yours clearly.",
      },
      {
        category: "Smart Contract Security",
        question:
          "How do you ensure smart contract security and what's your audit status?",
        answer:
          "Smart contract exploits have cost billions. Present your security approach: internal review process, testing coverage, formal verification if applicable. Show audit status: completed audits, auditor reputation, findings and remediation. Address your bug bounty program and ongoing security monitoring. Include any insurance coverage. Security is existential in crypto—show you take it seriously.",
      },
      {
        category: "Decentralization",
        question:
          "How decentralized is your protocol actually, and what's the path to greater decentralization?",
        answer:
          "Many 'decentralized' protocols are controlled by small teams with admin keys. Be honest about your current centralization: admin controls, upgrade mechanisms, key management. Present your decentralization roadmap: governance transition, key revocation, community control. Show why current centralization is necessary for development while demonstrating commitment to true decentralization. Investors respect honesty over decentralization theater.",
      },
      {
        category: "Technical Architecture",
        question:
          "What chain are you building on and why?",
        answer:
          "Chain selection significantly impacts your product. Explain your choice: Ethereum for composability and security, L2s for cost and speed, Solana for performance, or application-specific chain for control. Show understanding of tradeoffs: decentralization vs. performance, ecosystem vs. differentiation. Address cross-chain strategy if relevant. Demonstrate technical depth in your architectural decisions.",
      },
      {
        category: "Token Economics",
        question:
          "Walk me through your tokenomics and why they're sustainable.",
        answer:
          "Tokenomics design determines long-term viability. Present your token model: supply schedule, distribution, utility mechanisms, and value accrual. Show how tokenomics incentivize desired behaviors without creating unsustainable dynamics. Address inflation, emission schedule, and long-term equilibrium. Reference successful tokenomics models you've learned from. Avoid ponzi-like structures that rely on continuous new capital.",
      },
      {
        category: "Competitive Landscape",
        question:
          "How do you compete with established protocols in this space?",
        answer:
          "Crypto moves fast and competition is intense. Present your competitive positioning: what differentiates you from existing protocols. Show network effects or moats you're building. Address why users would switch from established alternatives. Include technical benchmarking where relevant. Demonstrate you understand the competitive landscape deeply and have a credible path to differentiation.",
      },
      {
        category: "Team & Execution",
        question:
          "What crypto-native experience does your team have?",
        answer:
          "Crypto requires specific domain expertise. Highlight team experience: prior protocol development, DeFi experience, security background, community building. Show understanding of crypto culture and communication norms. Address any team members who've been through crypto cycles before. Investors value teams who understand the space—not just technologists applying blockchain to problems.",
      },
    ],
    metrics: [
      {
        label: "Active Wallets",
        value: "1,000 - 10,000 weekly",
        note: "Unique wallets actively using the protocol weekly. Exclude obvious bots and wash trading. Quality of users matters more than quantity.",
      },
      {
        label: "Transaction Volume",
        value: "$100K - $1M monthly",
        note: "Real transaction volume through the protocol. Focus on organic activity, not incentivized or wash volume.",
      },
      {
        label: "Total Value Locked (TVL)",
        value: "$500K - $5M",
        note: "For DeFi protocols. TVL indicates user trust but can be inflated by incentives. Show organic TVL trajectory.",
      },
      {
        label: "Protocol Revenue",
        value: "$10K - $100K monthly",
        note: "Actual fee revenue generated by the protocol. This is the most important metric for sustainable economics.",
      },
      {
        label: "Smart Contract Audits",
        value: "1-2 completed",
        note: "Audits from reputable firms (Trail of Bits, OpenZeppelin, Consensys Diligence). All critical findings addressed.",
      },
      {
        label: "Developer Activity",
        value: "3-10 active contributors",
        note: "GitHub commits, PRs, and active developers. Shows development velocity and community engagement.",
      },
    ],
    objections: [
      {
        objection:
          "Crypto winter proved most of these projects have no real value.",
        response:
          "Acknowledge the crypto winter reality—many projects did fail because they lacked fundamental value. Differentiate your project: show real utility you provide, users who engage without token incentives, and sustainable economics. Present metrics that survived the downturn. Reference successful protocols that emerged stronger. The survivors have clearer value propositions—demonstrate yours.",
      },
      {
        objection:
          "Your tokenomics look like they'll lead to a death spiral when incentives end.",
        response:
          "Address tokenomics concerns directly with analysis. Show your emission schedule and how protocol utility sustains demand as emissions decrease. Present scenarios for different adoption levels. Reference sustainable tokenomics models and how yours compares. If there are risks, acknowledge them and show mitigation. Sophisticated investors understand tokenomics deeply—engage at that level.",
      },
      {
        objection:
          "The regulatory environment is too uncertain for us to invest in crypto.",
        response:
          "Regulatory uncertainty is real but manageable. Present your compliance approach and legal positioning. Show how your structure addresses specific regulatory concerns. Reference regulatory clarity in your operating jurisdictions. Demonstrate you've invested in legal counsel and compliance infrastructure. Address specific regulatory scenarios and your contingency plans. Smart regulatory positioning is a competitive advantage.",
      },
      {
        objection:
          "How do we know this won't be the next exploit headline?",
        response:
          "Security concerns are valid given the industry's history. Present your security investment: audit coverage, ongoing monitoring, bug bounties, insurance. Show your security-first development culture. Reference your track record if clean, or how you've improved after any incidents. Demonstrate security is a priority, not an afterthought. Include your incident response plan.",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Blockchain seed pitch decks must overcome significant investor skepticism post-crypto winter. Lead with real utility and sustainable economics, not token price potential. Show you understand why most crypto projects failed and why yours is different. Credibility comes from substance, not hype.",
    sections: [
      {
        title: "Problem & Opportunity",
        goal: "Frame a real problem that blockchain uniquely solves",
        guidance:
          "Identify a specific problem where blockchain properties (trustlessness, permissionlessness, programmable ownership) provide genuine advantages. Show why centralized solutions are inadequate. Avoid generic 'disintermediation' claims—be specific about the value blockchain creates. Size the opportunity realistically.",
      },
      {
        title: "Solution & Why Blockchain",
        goal: "Demonstrate blockchain necessity and your specific approach",
        guidance:
          "Present your solution with clear explanation of why it requires blockchain. Show the specific properties you leverage: censorship resistance, composability, trustless coordination. Demonstrate your technical approach and architecture decisions. This is the most important slide—weak blockchain justification kills deals.",
      },
      {
        title: "Product & Traction",
        goal: "Show real usage and product-market fit signals",
        guidance:
          "Present your product with user metrics. Show active wallets, transaction volume, and retention without artificial incentives if possible. Include user testimonials and use cases. Demonstrate organic demand beyond speculation. For pre-launch, show waitlist and community engagement quality.",
      },
      {
        title: "Token Model (if applicable)",
        goal: "Explain tokenomics clearly and justify token necessity",
        guidance:
          "If you have a token, present its utility and necessity for the system. Show tokenomics: supply, distribution, emission schedule, value accrual. Address sustainability without continuous new capital. Show regulatory positioning. If no token yet, explain if/when you might add one and why.",
      },
      {
        title: "Business Model & Revenue",
        goal: "Show sustainable economics beyond token appreciation",
        guidance:
          "Present actual revenue model: protocol fees, enterprise services, SaaS components. Show revenue generated or clear path to revenue. Address how revenue relates to token value if applicable. Demonstrate you're building a business, not just a token.",
      },
      {
        title: "Security & Compliance",
        goal: "Address the two existential risks directly",
        guidance:
          "Present security approach: audits completed, ongoing processes, bug bounties. Show regulatory strategy: legal positioning, compliance infrastructure, jurisdictional approach. These are existential risks—dedicate a slide to addressing them directly. Reference legal counsel and security partners.",
      },
      {
        title: "Competitive Landscape",
        goal: "Position against existing protocols and alternatives",
        guidance:
          "Map the competitive landscape: other protocols, centralized alternatives, potential new entrants. Show your differentiation and why users choose you. Address network effects and moats. Include win/loss data if available. Demonstrate deep understanding of the space.",
      },
      {
        title: "Team & Advisors",
        goal: "Show crypto-native expertise and relevant experience",
        guidance:
          "Highlight team crypto experience: prior protocols, DeFi background, security expertise. Include relevant advisors and their involvement. Show community building capability. Address any gaps in the team. Crypto expertise is essential—demonstrate yours clearly.",
      },
      {
        title: "Roadmap & Milestones",
        goal: "Present clear development and growth path",
        guidance:
          "Show development roadmap: technical milestones, product launches, ecosystem expansion. Include go-to-market milestones: user growth, partnership targets, revenue goals. Present decentralization roadmap if relevant. Be realistic about crypto development timelines.",
      },
      {
        title: "Funding & Use of Funds",
        goal: "Present capital needs and allocation",
        guidance:
          "Show raise amount and detailed use of funds: development, security, growth, operations. Present runway and path to next milestones. Address token fundraising vs. equity if relevant. Show capital efficiency and milestone-based deployment. Include treasury management approach if holding crypto.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Seed-stage blockchain metrics focus on organic usage and sustainable economics. Post-crypto winter, investors heavily discount vanity metrics and incentivized activity. These benchmarks emphasize real utility and economic sustainability over speculative growth.",
    metrics: [
      {
        label: "Weekly Active Wallets",
        value: "1,000 - 10,000",
        note: "Unique wallets with meaningful activity weekly. Filter out bots and wash trading. Quality matters more than quantity.",
      },
      {
        label: "Monthly Transaction Volume",
        value: "$100K - $1M",
        note: "Real transaction volume through the protocol. Organic volume preferred over incentivized activity.",
      },
      {
        label: "Total Value Locked",
        value: "$500K - $5M",
        note: "For DeFi protocols. Focus on organic TVL without unsustainable incentives. Stability matters as much as size.",
      },
      {
        label: "Protocol Revenue",
        value: "$10K - $100K monthly",
        note: "Fee revenue generated by the protocol. The key metric for sustainable economics. Growing trajectory important.",
      },
      {
        label: "User Retention (30-day)",
        value: "20-40%",
        note: "Users returning after 30 days. Crypto retention is challenging—show improvement trajectory.",
      },
      {
        label: "Smart Contract Audits",
        value: "1-2 from reputable firms",
        note: "Audits from recognized security firms. All critical and high findings must be addressed.",
      },
      {
        label: "Developer Contributors",
        value: "3-10 active",
        note: "Active contributors to protocol development. Shows development velocity and community health.",
      },
      {
        label: "Community Size",
        value: "5,000 - 50,000 Discord/Twitter",
        note: "Community engagement across platforms. Quality of engagement matters more than follower count.",
      },
      {
        label: "Capital Raised",
        value: "$1M - $5M",
        note: "Seed rounds vary significantly. Include any token pre-sales or grants in total capital picture.",
      },
      {
        label: "Team Size",
        value: "5-15 people",
        note: "Core team including developers, community, and business. Heavy on technical talent typically.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Blockchain seed diligence focuses on security, regulatory positioning, and sustainable economics. Investors conduct thorough technical and legal review given the industry's history of exploits and regulatory actions. Prepare comprehensive documentation in these areas.",
    items: [
      {
        item: "Smart contract audit reports and remediation documentation",
        rationale:
          "All audit reports from reputable firms with evidence that critical and high findings have been addressed. Include any ongoing security processes and monitoring. Security is existential—documentation must be thorough.",
      },
      {
        item: "Legal opinion on token classification and regulatory status",
        rationale:
          "Legal memo from qualified counsel addressing token classification (if applicable), securities law compliance, and regulatory positioning. Include analysis for key jurisdictions: US, EU, and operating locations.",
      },
      {
        item: "Tokenomics documentation with sustainability analysis",
        rationale:
          "Complete tokenomics documentation: distribution, emission schedule, utility mechanisms, and economic modeling. Include scenarios showing sustainability under different adoption levels.",
      },
      {
        item: "Technical architecture documentation",
        rationale:
          "System architecture, smart contract design, chain selection rationale, and technical roadmap. Include any formal verification or advanced security measures. Show technical depth and quality.",
      },
      {
        item: "On-chain analytics and user metrics",
        rationale:
          "On-chain data showing real usage: active wallets, transaction patterns, TVL composition, retention analysis. Include methodology for filtering bots and wash activity. Transparency builds trust.",
      },
      {
        item: "Team background and crypto experience",
        rationale:
          "Detailed backgrounds highlighting crypto-native experience. Include any prior protocol involvement, DeFi experience, or security background. Reference checks for key team members.",
      },
      {
        item: "Treasury and token management documentation",
        rationale:
          "Treasury composition, custody arrangements, and management policies. Include any token vesting schedules and lockup documentation. Multi-sig setup and key management procedures.",
      },
      {
        item: "Community and governance documentation",
        rationale:
          "Community metrics, governance processes (if implemented), and decentralization roadmap. Show community engagement quality and governance participation rates.",
      },
      {
        item: "Competitive analysis and market positioning",
        rationale:
          "Detailed competitive landscape analysis. Include technical benchmarking, market share analysis, and differentiation justification. Show deep understanding of the space.",
      },
      {
        item: "Financial model and capital plan",
        rationale:
          "Financial projections including protocol revenue, operating costs, and runway analysis. Address both crypto and fiat treasury management. Show path to sustainable operations.",
      },
      {
        item: "Insurance and risk management documentation",
        rationale:
          "Any smart contract insurance, D&O coverage, or other risk management measures. Include incident response plans and business continuity procedures.",
      },
      {
        item: "Cap table and prior funding documentation",
        rationale:
          "Complete cap table including any token allocations to investors. Prior funding terms including SAFTs, SAFEs, or equity rounds. Address any complex token/equity structures.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Seed-stage blockchain investor updates should focus on organic growth metrics and sustainable economics. Given crypto market volatility, frame progress in terms of real utility rather than token price. Maintain transparency about challenges—crypto investors expect honest communication.",
    sections: [
      {
        section: "Key Metrics Dashboard",
        content:
          "Lead with core metrics: active wallets, transaction volume, protocol revenue, TVL if applicable. Show trajectory over time. Separate organic activity from incentivized where possible. Include security status—any incidents or concerns. This dashboard should convey protocol health at a glance.",
      },
      {
        section: "Product & Development Progress",
        content:
          "Update on development milestones: features shipped, smart contract upgrades, integrations completed. Include security improvements and audit progress. Show technical roadmap status and any timeline adjustments with rationale.",
      },
      {
        section: "User Growth & Engagement",
        content:
          "Detail user metrics: new wallet growth, retention trends, user behavior patterns. Include community growth and engagement quality. Address any concerning trends. Show what's driving organic adoption.",
      },
      {
        section: "Revenue & Economics",
        content:
          "Report on protocol revenue and fee generation. Show progress toward sustainable economics. Address token metrics if relevant but focus on fundamental value creation rather than price. Include treasury status and runway.",
      },
      {
        section: "Security & Compliance",
        content:
          "Security status update: any incidents, audit progress, monitoring improvements. Compliance developments: regulatory changes affecting the protocol, legal updates, licensing progress. These are existential concerns—keep investors informed.",
      },
      {
        section: "Market & Competition",
        content:
          "Update on competitive landscape: new entrants, competitor moves, market share trends. Include partnership progress and ecosystem development. Address market conditions and their impact on the protocol.",
      },
      {
        section: "Team & Operations",
        content:
          "Team updates: key hires, departures, organizational changes. Include community team growth and governance development. Report on operational infrastructure improvements.",
      },
      {
        section: "Priorities & Asks",
        content:
          "Next period priorities and key milestones. Specific asks for investor support: introductions, technical expertise, strategic guidance. Flag any significant decisions requiring board input.",
      },
    ],
  },
};

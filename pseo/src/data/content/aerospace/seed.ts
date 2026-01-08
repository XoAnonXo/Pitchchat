import type { IndustryStageContent } from "../types";

export const aerospaceSeedContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Seed-stage aerospace and space startups face unique investor scrutiny around technical risk, regulatory pathways, and capital intensity. Investors evaluate your Technology Readiness Level (TRL), government contracting experience, and realistic timelines. The space ecosystem has matured significantly—investors now expect clear differentiation from the dozens of funded competitors in each segment.",
    questions: [
      {
        category: "Technical Readiness",
        question:
          "What is your current Technology Readiness Level and what milestones will advance it?",
        answer:
          "NASA's TRL scale (1-9) is the standard framework investors use to assess aerospace technical maturity. At seed stage, most startups are TRL 3-5: analytical and experimental proof-of-concept in laboratory environment progressing toward relevant environment testing. Be specific about your current TRL with evidence. Define the next 2-3 milestones that advance your TRL with realistic timelines. Investors understand aerospace development takes time but want to see clear milestone-based progress.",
      },
      {
        category: "Manufacturing Readiness",
        question:
          "What's your Manufacturing Readiness Level and path to production scale?",
        answer:
          "MRL complements TRL for hardware companies. Seed-stage aerospace companies typically target MRL 4-5: capability to produce prototype components in production-relevant environment. Discuss your manufacturing approach: in-house vs. contract manufacturing, key supplier relationships, and capital requirements for scaling. Investors want to see you've thought through the production challenges, not just the technology. Reference any manufacturing partnerships or LOIs.",
      },
      {
        category: "Regulatory Pathway",
        question:
          "What's your regulatory pathway and timeline for key certifications?",
        answer:
          "Aerospace regulatory landscape includes FAA (launch licenses, airworthiness), FCC (spectrum), NOAA (remote sensing), and potentially ITAR/export controls. Map your specific regulatory requirements with realistic timelines. Show you understand the process—investors have been burned by founders who underestimate regulatory complexity. If you've had preliminary discussions with regulators, highlight this. First-mover advantage in certain approvals can be significant moat.",
      },
      {
        category: "Government vs Commercial",
        question:
          "What's your go-to-market strategy: government contracts, commercial, or both?",
        answer:
          "Aerospace markets split between government (DoD, NASA, civil agencies) and commercial (telecom, remote sensing, logistics). Each has different sales cycles, margins, and scaling dynamics. Government provides validation and patient capital but has long cycles and compliance burden. Commercial offers faster iteration but requires market creation. Most seed-stage companies focus on one initially—explain your choice and eventual expansion strategy.",
      },
      {
        category: "Capital Intensity",
        question:
          "How much capital will you need to reach commercial operations and what's the funding strategy?",
        answer:
          "Aerospace is capital-intensive by nature. Investors want honesty about total capital requirements. Map your funding strategy: seed for core technology validation, Series A for prototype demonstration, later rounds for manufacturing scale. Include non-dilutive funding sources: SBIR/STTR, NASA contracts, DoD partnerships. Show you understand the fundraising landscape and have a realistic plan that doesn't assume smooth sailing.",
      },
      {
        category: "Team Expertise",
        question:
          "What aerospace/space experience does your team have and what gaps exist?",
        answer:
          "Aerospace requires deep domain expertise. Highlight team members' backgrounds: prior aerospace companies, government agencies, relevant research. Be honest about gaps and your hiring plan. Investors look for: systems engineering experience, regulatory expertise, manufacturing knowledge, and government contracting familiarity. Advisory boards can fill gaps, but core team needs hands-on aerospace experience.",
      },
      {
        category: "Launch & Dependencies",
        question:
          "What are your launch or critical infrastructure dependencies?",
        answer:
          "Space companies depend on launch access; aviation companies depend on airports and airspace. Identify your critical dependencies and mitigation strategies. For launch: relationships with providers, manifested slots, cost projections. Discuss backup options and how dependency risk affects your timeline. Investors have seen many space startups delayed by launch availability—show you've planned for this.",
      },
      {
        category: "Competitive Landscape",
        question:
          "How do you differentiate from well-funded competitors like SpaceX, Planet, Rocket Lab?",
        answer:
          "The aerospace startup landscape is crowded with well-funded competitors. Differentiation requires specificity: unique technology approach, underserved market segment, cost structure advantage, or specialized expertise. Avoid claiming you'll 'out-execute' larger players. Show deep understanding of competitive positioning and why your wedge is defensible. Investors want to see you've mapped the landscape and found genuine whitespace.",
      },
      {
        category: "Timeline Reality",
        question:
          "What's your realistic timeline to key technical and commercial milestones?",
        answer:
          "Aerospace timelines are notoriously optimistic. Investors discount founder projections heavily. Present a realistic timeline with built-in contingency. Reference industry benchmarks—how long similar systems took to develop. Show you understand what can go wrong and have buffer built in. Credibility comes from acknowledging aerospace complexity, not from aggressive promises.",
      },
      {
        category: "Exit Landscape",
        question:
          "What's the exit landscape for aerospace companies in your segment?",
        answer:
          "Aerospace exits include strategic acquisition (prime contractors, tech companies entering space), private equity, and potentially IPO for larger outcomes. Research recent transactions in your segment with valuation multiples. Discuss strategic interest you've received or could attract. Show you understand the M&A landscape and how your company fits. Investors need to see a path to liquidity given long development timelines.",
      },
    ],
    metrics: [
      {
        label: "Technology Readiness Level (TRL)",
        value: "TRL 4-6",
        note: "Seed-stage aerospace companies should demonstrate at least lab-validated technology (TRL 4) with path to relevant environment testing (TRL 5-6).",
      },
      {
        label: "Non-Dilutive Funding",
        value: "$500K - $2M",
        note: "SBIR/STTR awards, NASA contracts, or DoD funding provide validation and extend runway. Investors view government funding as strong technical validation.",
      },
      {
        label: "Development Timeline",
        value: "18-36 months to prototype",
        note: "Realistic timeline to functional prototype or demonstration mission. Include hardware-software integration and testing phases.",
      },
      {
        label: "Regulatory Milestones",
        value: "Preliminary engagement",
        note: "Evidence of regulatory pathway clarity: preliminary FAA discussions, FCC spectrum applications filed, or ITAR classification confirmed.",
      },
      {
        label: "Strategic Partnerships",
        value: "1-2 LOIs or partnerships",
        note: "Letters of intent from potential customers, technology partners, or prime contractors provide market validation for aerospace ventures.",
      },
      {
        label: "Team Aerospace Experience",
        value: "10+ years combined",
        note: "Founding team should have meaningful aerospace industry experience across technical and business functions.",
      },
    ],
    objections: [
      {
        objection:
          "Aerospace development takes too long—you'll need multiple rounds before generating revenue.",
        response:
          "Acknowledge the timeline reality and present your capital-efficient development approach. Show milestone-based funding strategy where each round de-risks specific technical or commercial milestones. Reference non-dilutive funding sources that extend runway. Present intermediate revenue opportunities: government R&D contracts, technology licensing, or service revenue during development phase. The goal is showing you've planned for the long journey.",
      },
      {
        objection:
          "The space/aerospace market is crowded with well-funded players—why will you win?",
        response:
          "Avoid generic differentiation claims. Present specific competitive analysis: where incumbents are weak, what market segments they're ignoring, or what technical approaches they've overlooked. Show customer evidence that your approach solves problems others don't. Reference your unique advantages: team expertise, technology IP, cost structure, or government relationships. Investors want specificity, not ambition.",
      },
      {
        objection:
          "Your timeline seems aggressive compared to industry benchmarks.",
        response:
          "If your timeline differs from industry norms, explain specifically why. Reference your technical approach, team experience, or parallel development strategies that enable acceleration. Provide analogous examples where faster development was achieved. Be willing to extend timeline if investor feedback suggests skepticism—credibility matters more than optimistic projections. Show contingency planning for delays.",
      },
      {
        objection:
          "What happens if you can't get launch access or face regulatory delays?",
        response:
          "Demonstrate you've mapped dependencies and have mitigation strategies. For launch: multiple provider relationships, rideshare options, backup manifest slots. For regulatory: early engagement strategy, parallel certification paths, contingency designs. Show you've modeled scenarios and have runway for delays. Investors appreciate founders who've thought through failure modes.",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Aerospace seed pitch decks must balance technical credibility with commercial vision. Investors evaluate both your technology depth and business acumen. Lead with your unique technical insight, demonstrate market understanding, and show a realistic path through the long development journey.",
    sections: [
      {
        title: "Technical Vision",
        goal: "Hook with your unique technical insight and its implications",
        guidance:
          "Open with the technical breakthrough or approach that enables your company. Make it accessible—investors may not be aerospace engineers. Show what's newly possible because of your innovation. This should feel like a genuine technical insight, not a business opportunity dressed in engineering language.",
      },
      {
        title: "Market Opportunity",
        goal: "Frame the problem you're solving and market size",
        guidance:
          "Size your market bottom-up: specific customer segments, their budgets, your addressable portion. Avoid trillion-dollar space economy claims. Show the pain point: what's impossible, expensive, or difficult today that your solution addresses. Include evidence of market demand: RFIs, customer conversations, or government program priorities.",
      },
      {
        title: "Solution & Technology",
        goal: "Explain your technical approach and current development status",
        guidance:
          "Present your technology with appropriate technical depth. Include your current TRL/MRL with evidence. Show development roadmap: what you've built, what's next, key risk reduction milestones. Use diagrams and specifications that demonstrate engineering rigor. Address technical risks and mitigation strategies.",
      },
      {
        title: "Regulatory & Compliance",
        goal: "Demonstrate you understand and can navigate the regulatory landscape",
        guidance:
          "Map the regulatory requirements for your product: FAA, FCC, NOAA, export controls. Show your compliance strategy and timeline. If you've had regulatory engagement, highlight it. This slide demonstrates you understand aerospace complexity and have a realistic path to market.",
      },
      {
        title: "Competitive Landscape",
        goal: "Position against incumbents and other startups",
        guidance:
          "Honest competitive analysis including well-funded competitors and primes. Show differentiation on axes that matter: cost, capability, timeline, or market segment. Acknowledge strong competitors while articulating your wedge. Include barriers to entry you're building.",
      },
      {
        title: "Business Model",
        goal: "Explain how you'll make money",
        guidance:
          "Aerospace business models vary: hardware sales, services, government contracts, data/analytics. Present your model with realistic unit economics. Show pricing benchmarks from comparable products. Address margin trajectory as you scale. Include revenue timing—when does meaningful revenue begin?",
      },
      {
        title: "Go-to-Market Strategy",
        goal: "Show your path to first customers and scale",
        guidance:
          "Map your GTM approach: government vs. commercial focus, direct vs. channel sales, geographic priorities. For government: SBIR pathway, prime contractor relationships, specific programs you're targeting. For commercial: customer pipeline, pilot programs, partnership strategy. Show you understand aerospace sales cycles.",
      },
      {
        title: "Team",
        goal: "Demonstrate aerospace expertise and startup capability",
        guidance:
          "Aerospace teams need technical depth and industry experience. Highlight relevant backgrounds: prior aerospace companies, government agencies, academic research. Show advisors who fill gaps. Address key hires you need and recruiting strategy. This is critical for aerospace credibility.",
      },
      {
        title: "Traction & Milestones",
        goal: "Show progress and define success metrics",
        guidance:
          "Present what you've accomplished: technical demonstrations, customer conversations, government funding, partnerships. Define next 12-18 month milestones with realistic timelines. Include non-dilutive funding applications and status. Show momentum despite early stage.",
      },
      {
        title: "Funding Plan",
        goal: "Lay out capital needs and use of funds",
        guidance:
          "Present your raise amount and specific use of funds. Show milestones this capital achieves. Include total capital path estimate to commercial operations. Reference non-dilutive funding strategy. Show capital efficiency thinking—aerospace investors appreciate teams who stretch dollars.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Seed-stage aerospace metrics focus on technical progress, team strength, and early commercial validation. Unlike software startups, aerospace companies are measured on development milestones and risk reduction rather than revenue growth. These benchmarks help investors assess your technical and commercial maturity.",
    metrics: [
      {
        label: "Technology Readiness Level",
        value: "TRL 4-6",
        note: "NASA's TRL scale is the standard measure. Seed companies should have lab-validated technology (TRL 4) progressing toward relevant environment testing (TRL 5-6).",
      },
      {
        label: "Manufacturing Readiness Level",
        value: "MRL 3-5",
        note: "For hardware companies, MRL indicates production scalability. Seed stage typically shows prototype component capability in lab environment.",
      },
      {
        label: "Non-Dilutive Funding Secured",
        value: "$500K - $2M",
        note: "SBIR Phase I/II, NASA contracts, DoD funding provide technical validation and extend runway without dilution.",
      },
      {
        label: "Letters of Intent",
        value: "1-3 LOIs",
        note: "Customer or partner LOIs demonstrate market interest. Government program interest or prime contractor engagement counts heavily.",
      },
      {
        label: "Patent Applications",
        value: "1-3 filed",
        note: "IP protection is important in aerospace. Provisional or full utility patents on core technology show defensibility.",
      },
      {
        label: "Team Size",
        value: "3-8 people",
        note: "Small but capable team with deep aerospace expertise. Key roles: technical lead, systems engineer, business development.",
      },
      {
        label: "Prototype Status",
        value: "Component or subsystem level",
        note: "Seed-stage companies typically have validated key components or subsystems, not full systems.",
      },
      {
        label: "Regulatory Engagement",
        value: "Initial discussions initiated",
        note: "Evidence of regulatory pathway planning: FAA pre-application meetings, FCC filings, ITAR classification.",
      },
      {
        label: "Development Timeline",
        value: "24-48 months to demonstration",
        note: "Realistic timeline to major technical demonstration or prototype. Aerospace timelines are longer than software.",
      },
      {
        label: "Capital Raised",
        value: "$1M - $5M pre-seed/seed",
        note: "Total capital raised to date including non-dilutive. Aerospace seed rounds tend to be larger than software given capital intensity.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Aerospace seed diligence focuses on technical credibility, regulatory awareness, and team capability. Investors conduct deep technical reviews and reference calls to validate claims. Prepare comprehensive documentation on your technology, team, and development plan.",
    items: [
      {
        item: "Technical specifications and design documentation",
        rationale:
          "Investors will evaluate your engineering work. Prepare system architecture documents, key specifications, performance analysis, and test results. Be ready for technical deep-dives with engineering advisors.",
      },
      {
        item: "Technology readiness assessment with evidence",
        rationale:
          "Document your TRL/MRL claims with supporting evidence: test data, analysis results, prototype demonstrations. Use NASA/DoD TRL definitions precisely. Investors will verify claims.",
      },
      {
        item: "Development roadmap with risk assessment",
        rationale:
          "Detailed development plan including key milestones, dependencies, and risks. Show critical path analysis and risk mitigation strategies. Include contingency planning for major risks.",
      },
      {
        item: "Regulatory pathway analysis",
        rationale:
          "Document required certifications, licenses, and approvals. Include timeline estimates and cost assumptions. Show any preliminary regulatory engagement or guidance received.",
      },
      {
        item: "IP landscape and freedom to operate analysis",
        rationale:
          "Patent applications filed, trade secrets documented, and initial freedom-to-operate analysis. Aerospace IP can be complex—show you've mapped the landscape.",
      },
      {
        item: "Team backgrounds with aerospace experience verification",
        rationale:
          "Detailed resumes highlighting aerospace experience. Be prepared for reference calls to verify claims. Address any employment agreement issues from prior positions.",
      },
      {
        item: "Capital plan and funding strategy",
        rationale:
          "Detailed use of funds, burn rate assumptions, and total capital path estimate. Include non-dilutive funding applications and status. Show capital efficiency thinking.",
      },
      {
        item: "Customer/partner pipeline documentation",
        rationale:
          "Evidence of market interest: LOIs, pilot agreements, government program connections. Include customer interview contacts for reference calls.",
      },
      {
        item: "Competitive analysis with technical differentiation",
        rationale:
          "Detailed competitive landscape including well-funded startups and incumbents. Technical comparison on key performance parameters. Market positioning analysis.",
      },
      {
        item: "ITAR/export control classification",
        rationale:
          "For defense-related technology, ITAR classification affects funding sources and investor pool. Document your classification status and compliance approach.",
      },
      {
        item: "Manufacturing and supply chain strategy",
        rationale:
          "For hardware companies, production scalability is critical. Document manufacturing approach, key supplier relationships, and capital requirements for production.",
      },
      {
        item: "Corporate structure and cap table",
        rationale:
          "Clean corporate structure appropriate for aerospace (may affect government contracting eligibility). Current cap table and prior funding terms.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Seed-stage aerospace investor updates focus on technical progress and risk reduction. Given long development timelines, investors want to see consistent milestone achievement and prudent resource management. Transparent communication builds trust for future funding rounds.",
    sections: [
      {
        section: "Technical Progress Summary",
        content:
          "Lead with your most significant technical accomplishment this period. Include TRL/MRL advancement if applicable. Share test results, design completions, or prototype progress. Be specific about what was achieved and what it proves. Include photos or data visualizations of progress.",
      },
      {
        section: "Milestone Status",
        content:
          "Report against your committed milestones: on track, ahead, or behind with explanation. For delays, explain root cause and mitigation. For completed milestones, describe the evidence and what's unlocked. Update future milestone timeline based on learnings.",
      },
      {
        section: "Risk Reduction",
        content:
          "Aerospace investing is about risk reduction. Identify key risks and how you've addressed them this period. Technical risks retired through testing, regulatory risks reduced through engagement, market risks addressed through customer conversations. Show you're systematically de-risking.",
      },
      {
        section: "Regulatory & Compliance Updates",
        content:
          "Report on regulatory engagement: meetings held, applications filed, guidance received. Include any compliance activities or certifications progressed. For ITAR-controlled companies, report on compliance program status.",
      },
      {
        section: "Customer & Partner Development",
        content:
          "Update on commercial progress: customer conversations, LOI advancement, pilot programs, partnership discussions. For government-focused companies, report on SBIR/STTR applications, program engagement, and prime contractor relationships.",
      },
      {
        section: "Team & Operations",
        content:
          "Report on team changes: key hires, departures, organizational updates. Include any facility or equipment acquisitions. Share team capacity and any hiring priorities.",
      },
      {
        section: "Financial Status",
        content:
          "Cash position, burn rate, and runway. Report against budget with variance explanation. Include non-dilutive funding status: applications submitted, awards received, or pipeline. Show capital efficiency awareness.",
      },
      {
        section: "Asks & Next Period Priorities",
        content:
          "Specific asks for investor help: introductions, technical advisors, regulatory guidance. Define next period priorities and success metrics. Preview any upcoming decisions where board input would be valuable.",
      },
    ],
  },
};

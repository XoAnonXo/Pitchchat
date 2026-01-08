import type { IndustryStageContent } from "../types";

export const chemistrySeedContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Seed-stage chemistry and biotech startups face rigorous scientific validation requirements alongside commercial viability assessment. Investors evaluate the strength of your scientific foundation, regulatory pathway clarity, and team's ability to navigate long development timelines. The biotech funding environment has shifted toward proof-of-concept data—investors want to see de-risked science before committing significant capital.",
    questions: [
      {
        category: "Scientific Validation",
        question:
          "What scientific evidence supports your approach and how differentiated is your science?",
        answer:
          "Seed biotech requires compelling scientific rationale. Present your scientific foundation: mechanism of action, preclinical data, any in-vivo results. Show differentiation from existing approaches—what's novel about your science? Include publications, patents, or key opinion leader validation. Address reproducibility of your data. Investors evaluate whether your science represents genuine innovation or incremental improvement. Strong scientific story with supporting data is essential.",
      },
      {
        category: "Development Stage",
        question:
          "What's your current development stage and what are the key milestones ahead?",
        answer:
          "Be precise about development stage—discovery, lead optimization, preclinical, IND-enabling. Present your data package supporting current stage. Show clear milestones: what data do you need to generate, what decisions does it enable? Include realistic timelines with dependencies identified. Address technical risks at each stage. Investors need to understand where you are and what it takes to reach the next value inflection point.",
      },
      {
        category: "Regulatory Pathway",
        question:
          "What's your regulatory strategy and have you engaged with regulators?",
        answer:
          "Regulatory strategy should be well-developed even at seed stage. Present your pathway: FDA designation pursued (breakthrough, fast track, orphan), endpoint strategy, precedent products. Show any regulatory interactions: pre-IND meetings, scientific advice, Type B meetings. Address whether your endpoints are validated or require qualification. Include international regulatory considerations if relevant. Clear regulatory thinking demonstrates team sophistication.",
      },
      {
        category: "Intellectual Property",
        question:
          "What's your IP position and freedom-to-operate status?",
        answer:
          "IP is foundational for biotech value. Present your portfolio: patents filed and granted, composition-of-matter vs. method claims, geographic coverage. Show freedom-to-operate analysis—have you identified blocking patents? Address patent term relative to product lifecycle. Include trade secrets and know-how that complement patents. IP strategy should support both protection and partnership flexibility. Weak IP position significantly limits exit options.",
      },
      {
        category: "Target Selection",
        question:
          "Why this target/indication and what's the market opportunity?",
        answer:
          "Target and indication selection defines your opportunity. Present the rationale: unmet medical need, patient population, current treatment landscape. Show market size but focus on addressable segments. Include competitive landscape—who else is targeting this? Address why existing treatments fail and how you're differentiated. Show key opinion leader input on target validity. Your indication choice should balance opportunity size with development feasibility.",
      },
      {
        category: "Manufacturing Strategy",
        question:
          "How will you manufacture at scale and what's your CMO strategy?",
        answer:
          "Manufacturing strategy should be considered early. Present your approach: internal capability vs. CMO partners. Show process development status and scalability path. Address tech transfer complexity and timeline. Include manufacturing risks: yield, cost, quality consistency. For biologics, this is especially critical. Investors have seen too many programs fail at manufacturing scale-up. Demonstrate you're thinking ahead.",
      },
      {
        category: "Team Expertise",
        question:
          "What relevant drug development experience does your team have?",
        answer:
          "Biotech requires deep domain expertise. Present team backgrounds: prior drug development experience, therapeutic area expertise, regulatory interactions. Show relevant track record—drugs advanced, approvals contributed to, company building experience. Address gaps honestly with plans to fill them. Include scientific advisors and their involvement level. First-time biotech founders with strong industry veterans often perform well.",
      },
      {
        category: "Capital Efficiency",
        question:
          "How capital-efficiently can you reach your next milestone?",
        answer:
          "Biotech can be capital-efficient with smart milestone design. Present your milestone strategy: what data creates maximum value with minimum capital? Show budget allocation: preclinical studies, manufacturing, team. Address what you're not doing and why—focus is valuable. Include partnership or grant opportunities that extend runway. Demonstrate capital-efficient mindset even if total development cost is high.",
      },
      {
        category: "Partnership Strategy",
        question:
          "What's your pharma partnership strategy and timing?",
        answer:
          "Most biotech assets partner at some stage. Present your strategy: when to partner, with whom, what terms to optimize for. Show any existing pharma interest or discussions. Address what data package makes you partnership-ready. Include competitive dynamics—are others pursuing similar partnerships? Your partnership strategy should balance value capture with development acceleration.",
      },
      {
        category: "Exit Scenarios",
        question:
          "What are realistic exit scenarios for a company at your stage?",
        answer:
          "Biotech exits differ by stage and therapeutic area. Present realistic scenarios: acquisition by pharma, merger with public company, or IPO at later stage. Reference comparable transactions with valuations. Address your therapeutic area's M&A activity. Show strategic buyers who might be interested and why. Investors need to see liquidity path—biotech investments are long duration.",
      },
    ],
    metrics: [
      {
        label: "Development Stage",
        value: "Discovery to IND-enabling",
        note: "Clear stage definition with supporting data package. Later stage (preclinical+) commands higher valuations.",
      },
      {
        label: "Lead Candidates",
        value: "1-3 programs",
        note: "Focused pipeline with clear prioritization. Lead program should have most data and resources.",
      },
      {
        label: "Patents Filed",
        value: "2-5 applications",
        note: "Composition-of-matter preferred. Geographic coverage should match market opportunity.",
      },
      {
        label: "Key Data Timeline",
        value: "12-24 months",
        note: "Timeline to next value-creating data milestone. Should be achievable with seed capital.",
      },
      {
        label: "Team Size",
        value: "5-15 people",
        note: "Core team with drug development experience. Heavy on R&D with essential corporate functions.",
      },
      {
        label: "Grant Funding",
        value: "$500K - $2M",
        note: "Non-dilutive funding (SBIR, foundation grants) extends runway and validates science.",
      },
    ],
    objections: [
      {
        objection:
          "Your development timeline is too long for typical venture fund lifecycles.",
        response:
          "Address timeline concerns with milestone-based value creation. Show intermediate inflection points that create partnership or exit optionality. Present your therapeutic area's timeline benchmarks. Reference successful investments with similar timelines. Demonstrate understanding of investor timeline constraints and how your strategy accommodates them.",
      },
      {
        objection:
          "The big pharma companies all have programs in this space—how do you compete?",
        response:
          "Large pharma programs can be opportunity, not just competition. Show differentiation: novel mechanism, better efficacy, improved safety profile. Address scenarios where pharma might acquire rather than compete. Present timeline advantages of focused biotech vs. large company bureaucracy. Reference successful biotechs acquired by companies with internal programs.",
      },
      {
        objection:
          "Your science is too early—there's too much technical risk.",
        response:
          "Acknowledge early-stage risk while showing de-risking path. Present data that supports your mechanism hypothesis. Show what additional experiments reduce risk most efficiently. Reference successful companies that started at similar stages. Address your team's ability to pivot if initial approach fails. Early-stage investment is about risk-adjusted returns, not risk elimination.",
      },
      {
        objection:
          "Your IP position doesn't seem strong enough to support a standalone company.",
        response:
          "Present complete IP picture: filed applications, trade secrets, know-how. Show freedom-to-operate analysis and any clearance opinions. Address patent term extension potential. Reference comparable companies with similar IP positions at seed stage. Include IP strategy evolution as you advance. Weak IP can strengthen with development data and additional filings.",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Seed-stage biotech pitch decks must establish scientific credibility while demonstrating commercial potential. Lead with the problem and your differentiated approach. Science should be compelling but accessible. Address regulatory and manufacturing early—these separate serious biotechs from science projects.",
    sections: [
      {
        title: "Problem & Unmet Need",
        goal: "Establish the medical need your science addresses",
        guidance:
          "Present the disease or condition with patient impact. Show treatment landscape gaps: what's available, why it fails, what patients need. Include market sizing but focus on unmet need. Use patient stories if available. The problem should be significant and underserved.",
      },
      {
        title: "Scientific Approach",
        goal: "Present your differentiated science accessibly",
        guidance:
          "Explain your mechanism of action clearly—even for complex science. Show what's novel and why it should work. Include key data supporting your hypothesis. Make it understandable to generalist investors while maintaining scientific rigor. Differentiation should be clear.",
      },
      {
        title: "Preclinical Data",
        goal: "Show evidence supporting your approach",
        guidance:
          "Present your strongest data: in-vitro, in-vivo, any clinical signals. Include efficacy, safety, and pharmacology data as available. Show data quality and reproducibility. Address limitations honestly. This slide proves you're beyond hypothesis.",
      },
      {
        title: "Development Plan",
        goal: "Show clear path to next milestone",
        guidance:
          "Present development roadmap with key milestones. Include IND-enabling studies, clinical plans if applicable. Show what this capital achieves. Address dependencies and risk mitigation. Timeline should be realistic with contingencies.",
      },
      {
        title: "Regulatory Strategy",
        goal: "Demonstrate regulatory pathway clarity",
        guidance:
          "Present your regulatory approach: designation strategy, endpoint selection, precedent products. Show any regulatory interactions or feedback. Address timeline to IND and clinical trial initiation. Regulatory sophistication builds credibility.",
      },
      {
        title: "Intellectual Property",
        goal: "Establish your IP foundation",
        guidance:
          "Present patent portfolio: composition-of-matter, methods, coverage. Show freedom-to-operate status. Include patent term considerations. Address IP risks and mitigation. Strong IP is foundational for biotech value.",
      },
      {
        title: "Competitive Landscape",
        goal: "Position against alternatives in development",
        guidance:
          "Map competitive landscape: approved products, clinical-stage programs, other preclinical efforts. Show your differentiation clearly. Address both efficacy and development risk comparisons. Demonstrate awareness of competitive dynamics.",
      },
      {
        title: "Team",
        goal: "Show drug development capability",
        guidance:
          "Present team with relevant experience highlighted. Show therapeutic area expertise and regulatory experience. Include scientific advisors and their involvement. Address gaps with hiring plans. Team credibility is essential in biotech.",
      },
      {
        title: "Business Model",
        goal: "Show path to value creation",
        guidance:
          "Present partnership and exit strategy. Show comparable transactions in your space. Include timeline to partnership-ready status. Address pharma interest and any discussions. Demonstrate understanding of biotech value creation.",
      },
      {
        title: "Funding & Milestones",
        goal: "Present capital needs and use of funds",
        guidance:
          "Show raise amount and milestone-based use of funds. Present what capital achieves: specific data, regulatory progress. Include runway and path to next financing. Be realistic about biotech capital requirements.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Seed-stage biotech metrics focus on scientific validation and development progress rather than commercial metrics. Investors evaluate data quality, IP position, and team capability. These benchmarks help demonstrate you've de-risked the science enough for institutional investment.",
    metrics: [
      {
        label: "Development Stage",
        value: "Discovery to IND-enabling",
        note: "Preclinical or IND-enabling stages most common for seed. Later stage commands premium valuation.",
      },
      {
        label: "Lead Candidates",
        value: "1-3 programs",
        note: "Focused pipeline preferred. Lead program should be clearly prioritized with backup compounds.",
      },
      {
        label: "In-Vivo Data",
        value: "Proof-of-concept in relevant models",
        note: "Animal model data supporting mechanism. Efficacy and preliminary safety signals valuable.",
      },
      {
        label: "Patents Filed",
        value: "2-5 applications",
        note: "Composition-of-matter priority. Geographic coverage in key markets (US, EU, Japan, China).",
      },
      {
        label: "Freedom-to-Operate",
        value: "Preliminary analysis complete",
        note: "FTO analysis identifying potential blocking patents. Clearance strategy if issues identified.",
      },
      {
        label: "Regulatory Interactions",
        value: "Pre-IND meeting planned or completed",
        note: "FDA engagement demonstrates pathway clarity. Type B meeting feedback highly valuable.",
      },
      {
        label: "CMO Identified",
        value: "Manufacturing partner selected",
        note: "Contract manufacturer identified for scale-up. Process development timeline understood.",
      },
      {
        label: "Key Opinion Leader Support",
        value: "2-3 engaged advisors",
        note: "KOLs validating science and clinical approach. Active involvement, not just names on website.",
      },
      {
        label: "Non-Dilutive Funding",
        value: "$500K - $2M",
        note: "SBIR/STTR grants, foundation funding, or pharma collaboration. Extends runway and validates science.",
      },
      {
        label: "Team Size",
        value: "5-15 people",
        note: "Core R&D team with drug development experience. CSO/CMO-caliber leadership.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Biotech seed diligence focuses heavily on scientific validation, IP strength, and team capability. Expect thorough review by scientific experts. Data quality, reproducibility, and honest assessment of risks are valued over promotional positioning.",
    items: [
      {
        item: "Complete data package with raw data access",
        rationale:
          "All preclinical data with experimental details. Raw data for key experiments. Statistical analysis methodology. Reproducibility information. Be prepared for scientific expert review.",
      },
      {
        item: "IP portfolio documentation and FTO analysis",
        rationale:
          "Patent applications and prosecution history. Freedom-to-operate analysis with counsel opinion. Patent term calculations. Trade secret inventory. Geographic coverage assessment.",
      },
      {
        item: "Regulatory strategy documentation",
        rationale:
          "Regulatory pathway analysis with precedent products. FDA meeting minutes or planned interactions. Endpoint strategy with regulatory precedent. Designation strategy (breakthrough, orphan, etc.).",
      },
      {
        item: "Manufacturing assessment",
        rationale:
          "Process development status and scale-up considerations. CMO identification and capability assessment. Cost of goods projections. Supply chain for critical materials.",
      },
      {
        item: "Competitive landscape analysis",
        rationale:
          "Comprehensive competitive mapping: approved, clinical, preclinical. Differentiation analysis with data support. Competitive intelligence sources and monitoring. Risk assessment from competitive programs.",
      },
      {
        item: "Team backgrounds with reference checks",
        rationale:
          "Detailed CVs for all key personnel. Drug development track record verification. Reference checks on key team members. Assessment of gaps and hiring plans.",
      },
      {
        item: "Scientific advisor engagement documentation",
        rationale:
          "Advisor agreements and compensation. Evidence of active engagement (meeting minutes, contributions). KOL relationships and potential clinical trial support. Advisory board structure.",
      },
      {
        item: "Development plan and budget",
        rationale:
          "Detailed milestone-based development plan. Budget allocation by activity. Assumptions and risk factors. Contingency planning. Comparison to comparable programs.",
      },
      {
        item: "Market analysis and commercial assessment",
        rationale:
          "Market sizing with methodology. Pricing and reimbursement landscape. Payer and HTA considerations. Commercial model assumptions (partner vs. self).",
      },
      {
        item: "Corporate documentation",
        rationale:
          "Cap table and prior funding terms. Material contracts (licenses, collaboration). Corporate structure including any academic relationships. Employee agreements and IP assignment.",
      },
      {
        item: "Risk analysis",
        rationale:
          "Comprehensive risk assessment: scientific, regulatory, commercial, competitive. Risk mitigation strategies. Honest assessment of program-killing risks. Pivot options if primary approach fails.",
      },
      {
        item: "Non-dilutive funding documentation",
        rationale:
          "Grant applications and awards. Foundation support. Pharma collaboration terms if applicable. Future non-dilutive funding pipeline.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Seed-stage biotech investor updates focus on scientific progress and milestone achievement. Given long development timelines, emphasize risk reduction and value creation at each update. Maintain transparency about challenges—biotech investors expect setbacks and value honest communication.",
    sections: [
      {
        section: "Executive Summary",
        content:
          "Lead with key developments: data milestones, regulatory progress, IP achievements. Summarize program status across pipeline. Include cash position and runway. This should convey progress and trajectory quickly.",
      },
      {
        section: "Program Progress",
        content:
          "Detailed update on lead program: experiments completed, data generated, decisions made. Show milestone progress against plan. Address any timeline changes with explanation. Include supporting programs as relevant.",
      },
      {
        section: "Data Highlights",
        content:
          "Present new data generated with implications. Include both positive results and any setbacks. Show how data informs development decisions. Address data quality and reproducibility. Scientific progress is the primary update.",
      },
      {
        section: "Regulatory Update",
        content:
          "Progress on regulatory interactions and strategy. FDA meeting preparations or outcomes. IND progress if applicable. Designation applications. Regulatory pathway remains on track or adjustments needed.",
      },
      {
        section: "IP Progress",
        content:
          "Patent prosecution updates: filings, office actions, grants. FTO developments. Trade secret protection progress. Any IP risks or competitive filings identified.",
      },
      {
        section: "Team & Organization",
        content:
          "Key hires and their contributions. Advisory engagement highlights. Organizational development. Any departures with transition plans.",
      },
      {
        section: "Financial Status",
        content:
          "Cash position and burn rate. Runway remaining. Non-dilutive funding progress. Any changes to budget or timeline. Upcoming financing needs and timing.",
      },
      {
        section: "Forward Look",
        content:
          "Key milestones for next quarter. Critical decision points approaching. Specific investor asks: introductions, expertise, strategic input. Any support needed.",
      },
    ],
  },
};

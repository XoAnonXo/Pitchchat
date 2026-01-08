import type { IndustryStageContent } from "../types";

export const chemistrySeriesAContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Series A biotech companies must demonstrate clinical-stage readiness or significant preclinical de-risking. Investors evaluate the strength of your data package, regulatory clarity, and ability to execute clinical trials. The bar has risen—Series A now typically requires IND-enabling data or early clinical results, with a clear path to meaningful clinical milestones.",
    questions: [
      {
        category: "Clinical Data",
        question:
          "What clinical or late-stage preclinical data supports your approach?",
        answer:
          "Series A biotech should have substantial data. Present your data package: IND-enabling studies completed, Phase 1 safety data if in clinic, or robust preclinical efficacy. Show data quality: study design, statistical power, reproducibility. Address how data de-risks the program vs. competitors. Include any biomarker or translational data supporting human efficacy. This is the core of Series A biotech valuation.",
      },
      {
        category: "Clinical Development Plan",
        question:
          "What's your clinical development plan and timeline to key milestones?",
        answer:
          "Series A should have detailed clinical plans. Present your development strategy: Phase 1 design (if not completed), Phase 2 trial design, patient population, endpoints. Show regulatory alignment on design. Include timeline with dependencies and risk factors. Address patient recruitment strategy and site selection. Clinical execution capability is critical at this stage.",
      },
      {
        category: "Regulatory Status",
        question:
          "What's your regulatory status and what guidance have you received?",
        answer:
          "Series A biotechs should have meaningful regulatory interactions. Present FDA meeting outcomes: pre-IND feedback, Type B meeting minutes, special designations obtained. Show how regulatory feedback shaped development plans. Address any regulatory concerns raised and your response. Include international regulatory strategy if relevant. Regulatory alignment significantly de-risks clinical development.",
      },
      {
        category: "Competitive Position",
        question:
          "How do you differentiate against clinical-stage competitors?",
        answer:
          "At Series A, competitive dynamics are clearer. Present competitive landscape with clinical-stage programs. Show your differentiation: mechanism, efficacy expectations, safety profile, patient convenience. Include head-to-head data if available or planned. Address competitive programs that have failed and implications. Your positioning should be specific and data-supported, not just aspirational.",
      },
      {
        category: "Manufacturing Readiness",
        question:
          "How ready is your manufacturing for clinical supply and commercial scale?",
        answer:
          "Series A requires manufacturing maturity. Present your CMC status: process locked, analytical methods validated, stability data. Show CMO relationships and capacity commitments. Address scale-up challenges and timelines. Include cost trajectory toward commercial manufacturing. For biologics especially, manufacturing is often rate-limiting. Demonstrate you won't be held back by CMC.",
      },
      {
        category: "Partnership Interest",
        question:
          "What pharma partnership interest have you generated and what's your strategy?",
        answer:
          "Series A biotechs often attract partnership interest. Present pharma engagement: confidentiality agreements, diligence processes, term sheet discussions if applicable. Show what data or milestones make you optimally partnership-ready. Address deal structure preferences: geography, indication, development stage splits. Include competitive dynamics among potential partners. Partnership optionality provides downside protection.",
      },
      {
        category: "IP Strength",
        question:
          "How has your IP position strengthened and what's the competitive moat?",
        answer:
          "Series A should show IP maturation. Present portfolio evolution: new filings, prosecuted claims, granted patents. Show patent term relative to development timeline—will you have adequate protection at launch? Include any competitive IP challenges or FTO updates. Address data exclusivity strategy as complement to patents. Comprehensive IP creates sustainable competitive advantage.",
      },
      {
        category: "Team Execution",
        question:
          "How has your team demonstrated execution capability?",
        answer:
          "Series A evaluates track record since seed. Present execution evidence: milestones achieved, timelines met, data quality delivered. Show team evolution: key hires that strengthened capability. Include any pivots and how they were managed. Address board composition and strategic support. Execution track record predicts future performance.",
      },
      {
        category: "Capital Efficiency",
        question:
          "How efficiently have you deployed capital and what's required to reach key milestones?",
        answer:
          "Series A evaluates capital efficiency. Present achievement per dollar of seed capital: data generated, regulatory progress, team built. Show this round's milestone targets and capital required. Include scenario analysis: faster timeline requiring more capital vs. capital-efficient path. Address total capital to approval or partnership milestone. Capital efficiency matters even for large biotech raises.",
      },
      {
        category: "Exit Scenarios",
        question:
          "What are realistic exit scenarios and comparable transactions?",
        answer:
          "Series A investors need liquidity visibility. Present exit scenarios: acquisition at clinical milestones, later-stage acquisition, or IPO path. Reference comparable transactions with valuations and timing. Show strategic buyer landscape and any expressed interest. Address therapeutic area M&A activity trends. Your path to liquidity should be specific and evidence-based.",
      },
    ],
    metrics: [
      {
        label: "Development Stage",
        value: "IND filed to Phase 2",
        note: "IND filed/cleared or early clinical data. Phase 1 complete positions for larger Series A.",
      },
      {
        label: "Clinical Trial Status",
        value: "Phase 1 initiated or planned",
        note: "For clinical-stage: patients enrolled, sites active. For pre-clinical: IND timeline clear.",
      },
      {
        label: "Safety Data",
        value: "IND-enabling tox complete",
        note: "GLP toxicology studies completed. Any clinical safety data from Phase 1 highly valuable.",
      },
      {
        label: "Patent Portfolio",
        value: "5+ applications, key patents granted",
        note: "Composition-of-matter grants in key markets. Patent term through expected commercial life.",
      },
      {
        label: "CMO Relationships",
        value: "Clinical supply secured",
        note: "Manufacturing partner locked for clinical supply. Commercial scale-up path identified.",
      },
      {
        label: "Pharma Interest",
        value: "Active diligence or discussions",
        note: "Multiple pharma companies engaged. CDAs signed, diligence underway, or partnership discussions.",
      },
    ],
    objections: [
      {
        objection:
          "Your Phase 1 data shows a safety signal that concerns us.",
        response:
          "Address safety signals directly and scientifically. Present the signal in context: incidence, severity, management, resolution. Show how it compares to approved therapies in the class. Include regulatory feedback if available. Present dose optimization or patient selection strategies that may mitigate. Safety signals aren't necessarily fatal—transparent discussion and mitigation plans matter.",
      },
      {
        objection:
          "The competitive landscape has evolved significantly—are you still differentiated?",
        response:
          "Present updated competitive analysis with recent developments. Show how your differentiation remains or has strengthened. Include head-to-head positioning data if available. Address competitive failures and implications for your approach. Demonstrate you're tracking competition and adapting strategy. Static differentiation claims don't hold at Series A.",
      },
      {
        objection:
          "Your timeline to value-creating data seems too long for this raise.",
        response:
          "Address timeline concerns with milestone granularity. Show intermediate data readouts that create value. Present partnership optionality that provides earlier liquidity. Reference comparable programs and their milestone timelines. Include scenario analysis for accelerated paths. Long timelines can work with clear milestone value creation.",
      },
      {
        objection:
          "Pharma companies have internal programs here—why would they acquire rather than compete?",
        response:
          "Present pharma program landscape with differentiation. Show timeline advantages: your asset may be further along or better positioned. Address synergy opportunities with pharma portfolios. Reference build-vs-buy decisions pharma has made in similar situations. Include any pharma interest that validates acquisition thesis. Pharma programs don't preclude acquisition—they often enable it.",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Series A biotech pitch decks must demonstrate clinical readiness with robust data and clear execution plans. Lead with your strongest data and regulatory progress. Show you've matured from promising science to executable development program. Address competitive dynamics and partnership strategy as key value drivers.",
    sections: [
      {
        title: "Clinical/Preclinical Data",
        goal: "Lead with your strongest evidence",
        guidance:
          "Open with key data: efficacy signals, safety profile, translational markers. Present data clearly with statistical rigor. Show what this data means for development decisions. Include comparison to competitive programs where favorable. This is the foundation of Series A valuation.",
      },
      {
        title: "Market & Competitive Landscape",
        goal: "Frame the opportunity with competitive context",
        guidance:
          "Size the market based on addressable patient segments. Show competitive landscape: approved therapies, clinical programs, unmet need gaps. Position your differentiation clearly. Include market timing—why now for your approach. Address standard of care evolution.",
      },
      {
        title: "Clinical Development Plan",
        goal: "Demonstrate execution readiness",
        guidance:
          "Present clinical strategy: trial designs, patient populations, endpoints. Show regulatory alignment and feedback incorporated. Include timeline with key decision points. Address execution risks and mitigation. Clinical plan should be specific and achievable.",
      },
      {
        title: "Regulatory Status",
        goal: "Show regulatory pathway de-risking",
        guidance:
          "Present regulatory achievements: IND status, FDA feedback, special designations. Show how regulatory guidance shaped development. Include any remaining regulatory risks and strategy. Address international regulatory plans. Regulatory progress is major Series A value driver.",
      },
      {
        title: "Manufacturing & CMC",
        goal: "Demonstrate clinical and commercial supply readiness",
        guidance:
          "Present CMC status: process development, analytical validation, stability. Show CMO relationships and capacity. Address scale-up timeline and risks. Include cost trajectory. For biologics, manufacturing readiness is critical path.",
      },
      {
        title: "Intellectual Property",
        goal: "Show IP maturation and competitive protection",
        guidance:
          "Present patent portfolio evolution: grants, prosecution progress, new filings. Show freedom-to-operate status. Include patent term analysis relative to product lifecycle. Address any IP risks or competitive challenges. IP should be clearly protective.",
      },
      {
        title: "Partnership Strategy",
        goal: "Show strategic optionality and pharma interest",
        guidance:
          "Present partnership strategy: timing, deal structure, target partners. Show pharma interest generated: discussions, diligence, interest level. Include optionality this creates for investors. Address competitive dynamics for partnership.",
      },
      {
        title: "Competitive Positioning",
        goal: "Demonstrate sustainable differentiation",
        guidance:
          "Present detailed competitive analysis with clinical-stage programs. Show differentiation with data support. Include head-to-head expectations. Address competitive risks and your response. Positioning should be evidence-based.",
      },
      {
        title: "Team & Execution Track Record",
        goal: "Show capability and results",
        guidance:
          "Present team with clinical development experience emphasized. Show execution track record: milestones achieved, data delivered, timelines met. Include organizational capability for clinical execution. Address any key hires needed.",
      },
      {
        title: "Financials & Ask",
        goal: "Present clear milestone-based plan",
        guidance:
          "Show use of funds tied to specific milestones. Present what data this capital generates. Include scenario analysis and capital efficiency. Address path to next financing or exit. Close with clear ask and conviction.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Series A biotech benchmarks focus on clinical readiness and data quality. Investors evaluate whether you've sufficiently de-risked to justify larger capital deployment. These benchmarks demonstrate transition from promising science to executable clinical program.",
    metrics: [
      {
        label: "Development Stage",
        value: "IND filed to Phase 2 ready",
        note: "IND filed/cleared minimum. Phase 1 data significantly increases valuation and optionality.",
      },
      {
        label: "Clinical Patients Treated",
        value: "0-50 (Phase 1)",
        note: "For clinical-stage: patients dosed in trials. Safety and early efficacy signals valuable.",
      },
      {
        label: "IND-Enabling Studies",
        value: "Complete GLP tox package",
        note: "GLP toxicology completed. CMC package IND-ready. Pharmacology studies supporting dose selection.",
      },
      {
        label: "Regulatory Designations",
        value: "1-2 obtained",
        note: "Orphan drug, fast track, breakthrough therapy. Designations signal regulatory pathway clarity.",
      },
      {
        label: "Patent Grants",
        value: "2+ key markets",
        note: "Composition-of-matter patents granted in US and EU minimum. Method claims supporting.",
      },
      {
        label: "CMO Under Contract",
        value: "Clinical supply secured",
        note: "Manufacturing partner contracted. Process locked for clinical material. Scale-up path identified.",
      },
      {
        label: "Pharma Interest",
        value: "Multiple parties engaged",
        note: "CDAs with 3+ pharma companies. Active diligence or partnership discussions underway.",
      },
      {
        label: "Scientific Advisors",
        value: "5-10 active KOLs",
        note: "Key opinion leaders actively engaged. Clinical trial site relationships. Publication support.",
      },
      {
        label: "Team Size",
        value: "15-40 people",
        note: "Team scaled for clinical operations. CMO/CMC, regulatory, and clinical leads in place.",
      },
      {
        label: "Non-Dilutive Funding",
        value: "$2M - $10M cumulative",
        note: "Grants, foundation support, collaborations. Demonstrates external validation and extends runway.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Series A biotech diligence is comprehensive, covering clinical data depth, regulatory documentation, manufacturing readiness, and team capability. Expect expert scientific review and significant documentation requirements. Quality and transparency reflect operational maturity.",
    items: [
      {
        item: "Complete clinical data package with statistical analysis",
        rationale:
          "All clinical trial data with full statistical analysis. Study reports, CRFs, and raw data access. Safety database if Phase 1 complete. Biomarker and translational data. Independent statistical review may be conducted.",
      },
      {
        item: "IND documentation or regulatory meeting minutes",
        rationale:
          "Complete IND package if filed. All FDA meeting minutes and correspondence. Type A/B/C meeting outcomes. Special designation applications and feedback. Regulatory counsel communications.",
      },
      {
        item: "CMC and manufacturing documentation",
        rationale:
          "Chemistry, manufacturing, and controls package. Process development reports. Analytical methods and validation. Stability data. CMO contracts and capacity commitments. Scale-up assessment and timeline.",
      },
      {
        item: "Patent prosecution files and FTO opinions",
        rationale:
          "Complete patent prosecution history. Freedom-to-operate opinions from qualified counsel. Patent term analysis and extension strategy. Competitive IP landscape analysis. License agreements if applicable.",
      },
      {
        item: "Clinical operations capability assessment",
        rationale:
          "Clinical trial plans with site identification. CRO relationships and contracts. Patient recruitment strategy validation. Clinical operations team capability. Trial budget and timeline with assumptions.",
      },
      {
        item: "Competitive intelligence documentation",
        rationale:
          "Detailed competitive landscape with clinical-stage programs. Head-to-head positioning analysis. Competitive program failures and implications. Market research and physician feedback. Competitive monitoring process.",
      },
      {
        item: "Financial model with milestone scenarios",
        rationale:
          "Detailed financial projections through key milestones. Scenario analysis: base, upside, downside. Cash burn and runway analysis. Partnership scenario economics. Capital requirements through approval.",
      },
      {
        item: "Partnership documentation and pharma interest",
        rationale:
          "CDA log with pharma companies. Diligence request and response documentation. Any term sheets or indications of interest. Partnership strategy and timing analysis. Comparable transaction analysis.",
      },
      {
        item: "Team backgrounds with drug development track record",
        rationale:
          "Detailed CVs for all key personnel. Drug development contributions verified. Reference checks on key team members. Organizational structure and capability gaps. Hiring plan with budget.",
      },
      {
        item: "Scientific advisory board documentation",
        rationale:
          "SAB member agreements and engagement evidence. KOL relationships for clinical trials. Scientific advisory meeting minutes. Publication strategy. Expert network access.",
      },
      {
        item: "Risk register and mitigation plans",
        rationale:
          "Comprehensive risk assessment: clinical, regulatory, competitive, commercial. Risk mitigation strategies with owners. Pivot options if primary approach fails. Board risk discussions documented.",
      },
      {
        item: "Legal and corporate documentation",
        rationale:
          "Cap table with all instruments. Material contracts: licenses, collaborations, CMOs. Corporate governance documentation. Employee agreements and IP assignment. Litigation or threatened claims.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Series A biotech investor updates should demonstrate clinical progress and milestone execution. Given significant capital deployed, updates should be thorough with clear metrics. Maintain transparency on challenges—clinical development has inherent setbacks and honest communication builds trust.",
    sections: [
      {
        section: "Executive Summary",
        content:
          "Lead with clinical/development milestones achieved. Include regulatory status updates. Summarize key data generated. Cash position and runway. Partnership activity if relevant. This should convey program trajectory immediately.",
      },
      {
        section: "Clinical Development",
        content:
          "Detailed clinical trial progress: enrollment, sites, timeline. Safety observations and management. Any efficacy signals or biomarker data. Protocol amendments if applicable. Regulatory interactions related to clinical program.",
      },
      {
        section: "Regulatory Update",
        content:
          "FDA interactions and outcomes. IND amendments or updates. Special designation progress. International regulatory filings. Any regulatory risks or challenges. Keep investors current on regulatory pathway.",
      },
      {
        section: "Data Highlights",
        content:
          "New data generated with interpretation. Clinical data emerging from trials. Preclinical data supporting development decisions. Publication and presentation activity. Data quality and reproducibility confirmation.",
      },
      {
        section: "Manufacturing Progress",
        content:
          "CMC and supply status. Process development milestones. CMO relationship management. Clinical supply availability. Scale-up progress toward commercial manufacturing.",
      },
      {
        section: "Competitive Landscape",
        content:
          "Competitive program updates: trial results, regulatory actions, failures. Implications for your program positioning. Market dynamics shifts. How differentiation has evolved.",
      },
      {
        section: "Partnership Activity",
        content:
          "Pharma engagement status. Diligence processes active. Any partnership discussions or terms. Strategic interest in the space. Optionality created for exit or development.",
      },
      {
        section: "Financial & Forward Look",
        content:
          "Cash position and burn rate. Runway and financing timeline. Budget vs. actual performance. Next quarter priorities and milestones. Specific investor asks: introductions, expertise, strategic guidance.",
      },
    ],
  },
};

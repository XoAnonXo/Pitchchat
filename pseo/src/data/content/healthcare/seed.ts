import type { IndustryStageContent } from "../types";

export const healthcareSeedContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Healthcare seed-stage startups face intense scrutiny on regulatory pathways, clinical validation, and go-to-market complexity. Investors evaluate your understanding of healthcare economics, reimbursement dynamics, and the ability to navigate long sales cycles while building a sustainable business. The bar has risen—investors expect early evidence of provider or payer engagement, not just a promising technology.",
    questions: [
      {
        category: "Regulatory",
        question: "What's your FDA regulatory pathway and timeline?",
        answer:
          "Present your regulatory strategy with specificity. For medical devices, explain whether you're pursuing 510(k), De Novo, or PMA pathway and why. For digital health, clarify if you're regulated as a device, exempt, or pursuing enforcement discretion. Show you understand predicate devices, clinical requirements, and timeline expectations. Include any pre-submission meetings with FDA and feedback received. The best answers show regulatory expertise: 'We're pursuing 510(k) with predicate XYZ. We've completed our pre-submission meeting where FDA agreed our bench testing approach is sufficient. We expect clearance in 12-14 months based on similar recent clearances.'",
      },
      {
        category: "Clinical Validation",
        question: "What clinical evidence do you have and what's your validation plan?",
        answer:
          "Healthcare investors require clinical evidence matching your claims. Present your evidence hierarchy: bench testing, feasibility studies, pilot trials, clinical studies. Explain study design, endpoints, and statistical power. If early, show your evidence generation roadmap with clear milestones. Reference comparable products and their evidence requirements. Be honest about what your data shows and doesn't show. Address how evidence requirements differ by customer type (health systems vs. payers vs. pharma).",
      },
      {
        category: "Reimbursement",
        question: "How do customers pay for this and what's the reimbursement strategy?",
        answer:
          "Healthcare economics are complex—show you understand them. Explain who pays: patient out-of-pocket, provider budget, payer reimbursement, employer/self-insured, or pharma. If seeking reimbursement, explain the CPT code strategy (existing, Category III, or new code application). Present your health economics analysis: cost savings, quality improvements, or outcome benefits that justify payment. Show early payer conversations or coverage decisions. Address the timing gap between product launch and reimbursement establishment.",
      },
      {
        category: "Go-to-Market",
        question: "How do you sell into health systems and what's your sales cycle?",
        answer:
          "Healthcare sales are long and complex. Present your GTM motion realistically: who you sell to (clinical champion, administrator, C-suite), the buying process (committees, pilots, value analysis), and typical timeline (often 12-18 months). Show early traction: LOIs, pilots, design partnerships, or sales. Explain your land-and-expand strategy within health systems. Address how you'll build a scalable sales motion—direct vs. distribution vs. platform partnerships. Reference your team's healthcare sales experience.",
      },
      {
        category: "Clinical Workflow",
        question: "How does your solution fit into existing clinical workflows?",
        answer:
          "Workflow integration determines adoption. Explain exactly where your product fits in the care journey: which setting (inpatient, outpatient, home), which moment, which user. Address EHR integration requirements and approach (FHIR APIs, Epic App Orchard, etc.). Show you understand the user's current workflow and how you minimize disruption. Present evidence of usability: user testing, pilot feedback, time-motion studies. Address training requirements and change management needs.",
      },
      {
        category: "Competition",
        question: "How do you differentiate from existing solutions and incumbents?",
        answer:
          "Healthcare markets have entrenched incumbents and high switching costs. Present your competitive landscape honestly: existing products, legacy approaches, and emerging competitors. Explain your differentiation: clinical superiority, workflow advantage, cost efficiency, or patient experience. Show evidence: head-to-head data, customer feedback, win/loss analysis. Address the 'good enough' competitor—why switch from current solutions? Reference specific customer conversations about competitive positioning.",
      },
      {
        category: "Patient Safety",
        question: "How do you ensure patient safety and manage clinical risk?",
        answer:
          "Safety is non-negotiable in healthcare. Explain your quality management system and risk management approach. For clinical products, describe your clinical risk analysis (per ISO 14971 if applicable). Present your adverse event monitoring plan. Address cybersecurity for connected devices or data-handling systems. Show you understand HIPAA requirements and your compliance approach. Reference any safety signals from testing or pilots and your mitigation strategies.",
      },
      {
        category: "Team",
        question: "What healthcare experience does your team have?",
        answer:
          "Healthcare requires domain expertise. Present your team's healthcare credentials: clinical background, industry experience, regulatory expertise, commercial healthcare experience. Address the full stack needed: clinical, regulatory, commercial, technical. If gaps exist, explain your plan: advisors, key hires, partnerships. Show you have access to clinical expertise for product development and validation. Reference specific healthcare relationships the team brings.",
      },
      {
        category: "Market Size",
        question: "How do you size the market opportunity?",
        answer:
          "Present bottom-up healthcare market sizing. Start with patient population or procedures, narrow to your specific indication or use case, apply realistic adoption and pricing assumptions. Reference comparable company market sizes. Address market dynamics: is this a growing or shifting market? Explain your entry point and expansion path. Avoid top-down TAM numbers without bottoms-up validation—healthcare investors will verify your math.",
      },
      {
        category: "Milestones",
        question: "What does this round achieve and what triggers Series A?",
        answer:
          "Present concrete milestones this capital achieves: regulatory (submissions, clearances), clinical (study completion, data), commercial (pilots, first sales), and team (key hires). Show you understand healthcare Series A requirements: typically FDA clearance/submission, clinical evidence, early commercial traction or strong pilots. Explain the 18-24 month path and key de-risking events. Be realistic about timeline—healthcare development often takes longer than founders expect.",
      },
    ],
    metrics: [
      {
        label: "Regulatory Status",
        value: "Pre-submission to 510(k) filed",
        note: "Seed stage typically ranges from regulatory strategy defined to submission filed. Clearance is often a Series A milestone.",
      },
      {
        label: "Clinical Evidence",
        value: "Feasibility to pilot data",
        note: "Early clinical validation through bench testing, feasibility studies, or small pilot programs with clinical partners.",
      },
      {
        label: "Provider Partnerships",
        value: "2-5 design/pilot partners",
        note: "Health system partnerships for development, validation, or early pilots. LOIs or paid pilots are strong signals.",
      },
      {
        label: "Customer Pipeline",
        value: "$500K-$2M in LOIs/pilots",
        note: "Letters of intent, pilot agreements, or contracted revenue. Shows commercial interest beyond clinical enthusiasm.",
      },
      {
        label: "Team Healthcare Experience",
        value: "10+ years collective",
        note: "Combined team experience in healthcare—clinical, regulatory, commercial. Domain expertise is essential.",
      },
      {
        label: "Reimbursement Progress",
        value: "Strategy defined, early payer conversations",
        note: "Clear reimbursement pathway identified with supporting health economics analysis.",
      },
    ],
    objections: [
      {
        objection: "The regulatory pathway is too long and expensive for a seed-stage company.",
        response:
          "Address regulatory concerns with a realistic plan: 'Our 510(k) pathway has well-defined precedents—we've identified 15 cleared predicates with similar indications. Our clinical requirements are bench testing and a small usability study, not a randomized trial. Based on recent clearances in this category, we project 12-14 months and $400K in regulatory costs post-seed. We've de-risked through a pre-submission meeting where FDA confirmed our approach. The seed round funds us through submission with 6 months of buffer.'",
      },
      {
        objection: "Health system sales cycles are too long for your runway.",
        response:
          "Acknowledge and address: 'Health system sales average 12-18 months, which is why we're pursuing a two-track strategy. First, we're targeting innovative health systems with faster procurement—our three pilots closed in 4-6 months through innovation departments. Second, we're building a pathway through clinical champions who can start with department-level budgets. Our seed milestones focus on proving the pilot model and building pipeline, not achieving scale revenue. We expect 3-5 paying customers by Series A, with a larger pipeline that converts post-raise.'",
      },
      {
        objection: "How do you compete with EHR vendors who could add this feature?",
        response:
          "Address platform risk directly: 'EHR vendors optimize for breadth, not depth—our category requires clinical specialization they won't prioritize. Epic has 150 product priorities; we have one. Our clinical validation and workflow optimization represent 3 years of focused development. More importantly, health systems increasingly prefer best-of-breed for clinical applications. Our integration approach (FHIR-native, EHR-agnostic) positions us as a complement. We're also pursuing Epic App Orchard and Cerner partnerships that align rather than compete.'",
      },
      {
        objection: "Your reimbursement pathway is unclear.",
        response:
          "Present your reimbursement strategy: 'We have three payment pathways. Primary: existing CPT code 99XXX covers our service with average reimbursement of $X. We've validated with billing compliance review. Secondary: hospital cost savings—our health economics study shows $Y savings per patient, supporting capital budget purchase. Third: value-based contracts where we share in outcomes improvement. We've had preliminary conversations with 3 payers who've expressed interest pending clinical data. Our seed milestone is completing the health economics analysis to support these conversations.'",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Healthcare seed decks must demonstrate regulatory competence, clinical validation pathway, and realistic go-to-market understanding. Investors expect domain expertise and evidence you can navigate healthcare complexity. Lead with the clinical problem and patient impact, show early validation, and present a credible path through regulatory and commercial hurdles.",
    sections: [
      {
        title: "Problem",
        goal: "Define a specific clinical problem with quantifiable patient and economic impact",
        guidance:
          "Healthcare investors want to see clinical pain and economic opportunity. Quantify the problem: patient outcomes (mortality, morbidity, quality of life), provider burden (time, cost, burnout), system cost (per-patient, aggregate). Be specific about the population and setting. Show you understand how this problem is currently addressed and why existing solutions fall short. Reference clinical literature supporting the problem magnitude.",
      },
      {
        title: "Solution",
        goal: "Demonstrate your product and its clinical value proposition",
        guidance:
          "Show the product in clinical context. Explain the mechanism of action or clinical approach. Present early efficacy signals if available. Make clear what's novel versus incremental improvement. Address clinical workflow fit—show exactly how and when the product is used. Include regulatory classification and why. Healthcare investors expect clinical sophistication in how you present the solution.",
      },
      {
        title: "Clinical Evidence",
        goal: "Present your evidence and validation pathway",
        guidance:
          "Show current evidence: bench testing, feasibility data, pilot results. Present your evidence generation roadmap aligned with regulatory and commercial requirements. Explain study design for planned trials. Reference evidence standards in your category—what do you need to prove and to whom? Include clinical advisors or KOL relationships supporting your validation approach.",
      },
      {
        title: "Regulatory Strategy",
        goal: "Demonstrate regulatory competence and realistic pathway",
        guidance:
          "Present your regulatory classification and pathway. Show predicate analysis for 510(k) or De Novo justification. Include FDA feedback if you've had interactions. Present realistic timeline with key milestones. Address international regulatory strategy if relevant (CE marking, etc.). Healthcare investors assess regulatory competence carefully—show you know what you don't know and have expertise or advisors to fill gaps.",
      },
      {
        title: "Market Opportunity",
        goal: "Size the market with healthcare-specific rigor",
        guidance:
          "Build bottom-up from patient population and clinical utilization. Reference procedure volumes, disease prevalence, or utilization data. Show adoption assumptions grounded in healthcare reality (often 5-15% penetration, not 30%+). Present expansion path: adjacent indications, settings, or geographies. Address market dynamics: growing incidence, shifting care settings, policy changes.",
      },
      {
        title: "Business Model",
        goal: "Explain healthcare economics and path to sustainable revenue",
        guidance:
          "Present pricing and payment model: who pays and why. Address reimbursement strategy if applicable. Show unit economics understanding: pricing vs. cost of goods, implementation costs, customer lifetime value. Explain how economics improve at scale. Reference comparable companies' business models. Healthcare often has complex revenue models—demonstrate you understand yours.",
      },
      {
        title: "Go-to-Market",
        goal: "Present realistic commercial strategy for healthcare",
        guidance:
          "Show your GTM motion: who you sell to, how you reach them, the buying process. Present early commercial traction: LOIs, pilots, design partnerships. Address sales cycle reality and how you'll navigate it. Explain team or partnership approach to sales. Include channel strategy: direct, distribution, platform partnerships. Reference your commercial team's healthcare experience.",
      },
      {
        title: "Team",
        goal: "Demonstrate healthcare domain expertise",
        guidance:
          "Healthcare requires specialized experience. Present clinical, regulatory, commercial, and technical expertise on your team. Address gaps and hiring plan. Include clinical and scientific advisors. Show healthcare network and relationships. Reference relevant prior healthcare company experience. Investors bet heavily on team in healthcare—domain expertise is expected.",
      },
      {
        title: "Financials & Milestones",
        goal: "Present healthcare-realistic projections and capital plan",
        guidance:
          "Show 18-24 month plan tied to seed capital. Present major milestones: regulatory submissions, clinical data, commercial proof points. Be realistic about healthcare timelines—they often slip. Show burn rate and runway. Address capital needs through Series A. Healthcare development is capital intensive—show you understand the path.",
      },
      {
        title: "Ask",
        goal: "Clear ask with healthcare-appropriate use of funds",
        guidance:
          "State round size and use of funds. Typical healthcare seed allocation: regulatory and clinical (40-50%), product development (20-30%), commercial validation (15-25%), team (10-20%). Connect funding to milestones and Series A readiness. Be clear about what this round de-risks and what remains for future rounds.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Healthcare seed metrics focus on regulatory progress, clinical validation, and commercial traction signals. Revenue is less important than evidence of product-market fit in a complex sale environment. Investors benchmark against typical healthcare development timelines and commercial proof points.",
    metrics: [
      {
        label: "Regulatory Status",
        value: "Strategy → Submission",
        note: "Progress from regulatory strategy defined through pre-submission feedback to submission. Clearance often post-seed.",
      },
      {
        label: "Clinical Partners",
        value: "3-5 active partners",
        note: "Health systems engaged for design input, feasibility testing, or pilots. Mix of academic and community systems valuable.",
      },
      {
        label: "Pilot Results",
        value: "1-3 completed pilots",
        note: "Completed pilots with clinical and operational outcomes data. Conversion to paid contracts is strong signal.",
      },
      {
        label: "LOIs / Pipeline",
        value: "$500K-$2M",
        note: "Letters of intent or contracted pilots. Indicates commercial interest beyond research relationships.",
      },
      {
        label: "Clinical Outcome Data",
        value: "Feasibility demonstrated",
        note: "Early clinical evidence supporting efficacy. Bench testing, feasibility studies, or pilot clinical data.",
      },
      {
        label: "Reimbursement Pathway",
        value: "Defined with validation",
        note: "Clear payment pathway identified. Early payer conversations or health economics analysis completed.",
      },
      {
        label: "EHR Integration",
        value: "Technical pathway validated",
        note: "Integration approach defined. Early integration with 1-2 EHR systems or FHIR-based approach proven.",
      },
      {
        label: "Team Domain Experience",
        value: "20+ years collective",
        note: "Combined healthcare experience across clinical, regulatory, and commercial functions.",
      },
      {
        label: "KOL Network",
        value: "3-5 clinical advisors",
        note: "Key opinion leader relationships for clinical validation, market access, and credibility.",
      },
      {
        label: "IP Position",
        value: "Provisional or utility filed",
        note: "Patent protection for core technology. Freedom to operate analysis completed or underway.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Healthcare seed diligence emphasizes regulatory pathway, clinical evidence, team expertise, and market access strategy. Investors verify your understanding of healthcare complexity and ability to navigate it. Documentation demonstrates operational readiness for a regulated industry.",
    items: [
      {
        item: "Regulatory strategy document with pathway analysis",
        rationale:
          "Detailed regulatory plan including classification, pathway selection rationale, predicate analysis (if 510(k)), timeline, and budget. Include any FDA feedback or meeting minutes. Shows regulatory competence.",
      },
      {
        item: "Clinical evidence summary and validation roadmap",
        rationale:
          "Current evidence (bench, feasibility, pilot data) and planned studies. Include protocol synopses, endpoint definitions, and evidence requirements by stakeholder (FDA, payers, providers). Demonstrates clinical rigor.",
      },
      {
        item: "Reimbursement and health economics analysis",
        rationale:
          "Payment pathway analysis: CPT codes, coverage landscape, pricing rationale. Health economics model showing ROI to payers/providers. Early payer feedback if available. Critical for commercial viability.",
      },
      {
        item: "Clinical partner agreements or LOIs",
        rationale:
          "Documentation of health system relationships: design partnerships, pilot agreements, LOIs. Include scope, timeline, and any commercial terms. Validates market access.",
      },
      {
        item: "Quality management system documentation",
        rationale:
          "QMS framework appropriate to regulatory pathway. Design controls, risk management (ISO 14971), document control procedures. Even early stage should show quality foundations.",
      },
      {
        item: "HIPAA compliance documentation",
        rationale:
          "Privacy and security framework for handling PHI. Business associate agreements template, security risk assessment, compliance policies. Required for any health data handling.",
      },
      {
        item: "Competitive analysis with clinical differentiation",
        rationale:
          "Comprehensive competitive landscape including clinical evidence comparison. Win/loss analysis from pilot or sales conversations. Positioning rationale. Shows market understanding.",
      },
      {
        item: "Team backgrounds with healthcare credentials",
        rationale:
          "Detailed CVs for founders and key team. Emphasize healthcare experience: clinical, regulatory, commercial. Include advisory board with clinical and industry advisors.",
      },
      {
        item: "IP portfolio and freedom to operate analysis",
        rationale:
          "Patent applications, prosecution status, and claims. FTO analysis for key markets. IP assignment documentation. Important for defensibility and exit potential.",
      },
      {
        item: "Product architecture and EHR integration approach",
        rationale:
          "Technical architecture with security controls. EHR integration strategy (FHIR, proprietary APIs, etc.). Interoperability roadmap. Shows technical healthcare readiness.",
      },
      {
        item: "Financial model with healthcare-specific assumptions",
        rationale:
          "18-24 month projections with explicit healthcare assumptions: sales cycles, implementation timelines, reimbursement ramp. Scenario analysis. Capital efficiency metrics.",
      },
      {
        item: "Customer reference list for diligence calls",
        rationale:
          "Clinical partners and pilot customers willing to speak with investors. Include clinical champions and administrative buyers. Reference calls are standard in healthcare diligence.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Healthcare investor updates should emphasize regulatory and clinical milestones, commercial proof points, and team development. Healthcare development is lumpy—focus on progress toward major milestones rather than linear metrics. Be transparent about timeline risks and regulatory feedback.",
    sections: [
      {
        section: "Milestone Progress Dashboard",
        content:
          "Lead with status of key milestones: regulatory submissions/feedback, clinical studies, commercial pilots, key hires. Use clear status indicators (on track, at risk, completed). Healthcare is milestone-driven—investors want to see progress toward discrete events, not just activity.",
      },
      {
        section: "Regulatory & Clinical Update",
        content:
          "Detailed progress on regulatory pathway: submissions, FDA feedback, study enrollment, data readouts. Include any timeline changes with explanation. Reference specific regulatory meetings or guidance received. This is often the most important section for healthcare companies.",
      },
      {
        section: "Commercial Progress",
        content:
          "Pilot status and results. Pipeline development and key opportunities. Customer conversations and feedback. Any revenue or contracted commitments. Health system relationships and decision timelines. Show momentum even if revenue is early.",
      },
      {
        section: "Product & Technical",
        content:
          "Product development against clinical requirements. Integration progress (EHR, data systems). Quality system development. Technical challenges and solutions. User feedback from clinical settings.",
      },
      {
        section: "Team & Operations",
        content:
          "Key hires and recruiting pipeline. Clinical advisor engagement. Operational developments (manufacturing, quality systems, etc.). Healthcare requires specialized talent—show progress building the team.",
      },
      {
        section: "Financial Position",
        content:
          "Cash position and burn rate. Spending versus plan. Runway and path to next milestone. Healthcare development is expensive—keep investors informed on capital position.",
      },
      {
        section: "Risks & Asks",
        content:
          "Key risks you're monitoring: regulatory, clinical, commercial, competitive. Specific asks for investors: introductions to health systems, clinical advisors, regulatory experts. Healthcare investors often have valuable networks—use them.",
      },
      {
        section: "Looking Ahead",
        content:
          "Next 30-60 day priorities. Upcoming milestones and expected timing. Any strategic decisions requiring input. Path to next financing and any timing considerations.",
      },
    ],
  },
};

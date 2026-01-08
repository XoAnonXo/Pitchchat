import type { IndustryStageContent } from "../types";

export const roboticsSeedContent: IndustryStageContent = {
  investorQuestions: {
    summary:
      "Seed-stage robotics startups face unique investor scrutiny around demo-to-deployment reality, task success rates, and the challenge of operating reliably in unstructured real-world environments. Investors have seen countless impressive demos that failed in production. Your job is demonstrating that your robot actually works—not in controlled conditions, but in the messy reality of customer environments.",
    questions: [
      {
        category: "Demo Reality",
        question:
          "How does your demo performance compare to real-world operation?",
        answer:
          "Investors are deeply skeptical of robotics demos after seeing many that didn't translate to production. Be brutally honest about the gap between demo and deployment conditions. Explain what's controlled in your demos vs. what varies in production. Show data from pilot deployments in actual customer environments—runtime hours, task completion rates, intervention frequency. The best answer acknowledges the gap while showing you're systematically closing it.",
      },
      {
        category: "Task Success",
        question:
          "What is your task success rate in production conditions?",
        answer:
          "Task success rate is the critical metric for robotics—the percentage of tasks completed successfully without human intervention. At seed stage, 80-90% in controlled pilots is typical, with path to 95%+ for production viability. Present your success rate with specific conditions: environment complexity, task variety, edge case handling. Show how success rate improves with more deployment data. Be specific about failure modes and your approach to addressing them.",
      },
      {
        category: "Human Intervention",
        question:
          "How often does your robot require human intervention and why?",
        answer:
          "Intervention rate determines whether your robot creates value or just shifts work. Present interventions per hour or per task with categorization: navigation failures, manipulation failures, edge cases, safety stops. Show intervention rate trajectory as you gather more data and improve the system. Address the cost of intervention in customer economics—if intervention is frequent, the ROI case falls apart.",
      },
      {
        category: "Deployment Complexity",
        question:
          "How long does it take to deploy at a new site and what's required?",
        answer:
          "Deployment friction kills robotics businesses. Present your deployment process: site assessment, installation time, training period, go-live timeline. Show what customer involvement is required. Compare to competitors or industry benchmarks. The goal is demonstrating that deployment is manageable—not a custom integration project each time. Show how deployment time decreases with experience.",
      },
      {
        category: "Hardware Strategy",
        question:
          "What's your hardware strategy—build custom vs. integrate existing platforms?",
        answer:
          "Hardware strategy significantly impacts capital intensity and time-to-market. Custom hardware provides differentiation but requires more capital and development time. Integrating existing platforms (mobile bases, arms, sensors) accelerates development but may limit capabilities. Present your approach with clear rationale. Address how strategy evolves as you scale. Show you understand the trade-offs and have made a deliberate choice.",
      },
      {
        category: "Safety Framework",
        question:
          "How do you ensure safety when operating around humans?",
        answer:
          "Safety is non-negotiable in robotics, especially for human-proximate operation. Present your safety framework: sensing, prediction, reactive behaviors, fail-safes. Show your safety testing methodology and results. Address relevant safety standards (ISO 10218, ISO 13849) and compliance status. Include any safety certifications or third-party validation. Safety failures can end a robotics company—show you take it seriously.",
      },
      {
        category: "Customer ROI",
        question:
          "What's the customer ROI and how long until payback?",
        answer:
          "Robots must deliver clear economic value. Present customer ROI analysis: labor costs replaced or augmented, productivity improvements, quality gains. Show payback period on robot investment—ideally under 18-24 months. Include total cost of ownership: robot cost, deployment, maintenance, support. Reference customer validation of ROI claims. Economic value must be compelling enough to overcome adoption friction.",
      },
      {
        category: "Technical Moat",
        question:
          "What's technically differentiated about your approach?",
        answer:
          "Robotics technical differentiation can come from many sources: perception algorithms, motion planning, manipulation skills, learning systems, domain-specific optimization. Explain your technical advantage specifically—not generic AI claims. Show why this advantage is durable. Address whether your approach scales with data (learning effects) or requires manual engineering for each environment. Investors want to understand your technical wedge.",
      },
      {
        category: "Market Focus",
        question:
          "Why did you choose this market and application?",
        answer:
          "Robotics companies succeed by deeply solving specific problems before generalizing. Explain your market choice: why this application is good for robotics, why it's good for your team, why timing is right. Show deep understanding of customer workflows and pain points. Address market size realistically—robotics markets are often smaller than software. Demonstrate you're building a wedge that can expand.",
      },
      {
        category: "Team Experience",
        question:
          "What robotics deployment experience does your team have?",
        answer:
          "Robotics requires unique skills: mechanical engineering, controls, perception, integration, and field deployment experience. Highlight team backgrounds in robotics specifically—this is different from general software engineering. Show prior robotics products shipped or deployed. Address gaps with hiring plan or advisors. Investors value teams who've seen robots fail in the field and learned from it.",
      },
    ],
    metrics: [
      {
        label: "Task Success Rate",
        value: "80-90% in pilots",
        note: "Success rate in real customer environments, not controlled demos. Should show improvement trajectory with path to 95%+ for production scale.",
      },
      {
        label: "Interventions Per Shift",
        value: "2-5 interventions",
        note: "Human interventions required per 8-hour shift of operation. Lower is better; categorize by failure type for improvement focus.",
      },
      {
        label: "Autonomous Runtime",
        value: "4-8 hours continuous",
        note: "Hours of autonomous operation between required human interventions. Demonstrates system reliability in production conditions.",
      },
      {
        label: "Pilot Deployments",
        value: "2-5 active pilots",
        note: "Number of pilots in customer environments. Quality of pilots (complexity, duration) matters as much as quantity.",
      },
      {
        label: "Deployment Time",
        value: "1-2 weeks per site",
        note: "Time from arrival to production operation at new site. Shows deployment process maturity.",
      },
      {
        label: "Customer ROI Payback",
        value: "12-24 months",
        note: "Customer payback period on robot investment. Based on labor savings, productivity gains, and total cost of ownership.",
      },
    ],
    objections: [
      {
        objection:
          "Your demos look impressive, but how do we know this works in the real world?",
        response:
          "Acknowledge demo skepticism directly—it's valid in robotics. Present data from real customer deployments: runtime hours, task success rates, intervention frequency. Show the range of conditions you've operated in. Include customer testimonials on real-world performance. If limited deployment, be honest about it and present your validation plan with specific milestones. The goal is demonstrating you understand the demo-to-deployment gap.",
      },
      {
        objection:
          "Robotics companies often fail to scale beyond a few pilot customers.",
        response:
          "Address the pilots-to-scale challenge specifically. Show what you've learned about deployment process and how you're systematizing it. Present your scalability plan: deployment team structure, remote monitoring capabilities, customer success approach. Reference metrics that indicate scalability: declining deployment time, improving support efficiency. Show you're building a business, not a series of custom integrations.",
      },
      {
        objection:
          "The robot hardware seems expensive—how do customer economics work?",
        response:
          "Present detailed customer economics: robot cost, deployment, ongoing support and maintenance. Show ROI analysis based on labor savings or productivity gains. Include payback period and compare to customer investment criteria. Address hardware cost trajectory with volume. If offering RaaS (Robot-as-a-Service), show the unit economics of that model. Customer economics must be compelling.",
      },
      {
        objection:
          "What happens when your robot fails or causes damage in production?",
        response:
          "Address safety and liability directly. Present your safety framework and testing results. Show your incident response process for failures. Discuss insurance approach and any safety certifications. Reference your track record—incidents avoided, minor issues handled well. Demonstrate you've thought through failure modes and have appropriate risk management.",
      },
    ],
  },
  pitchDeck: {
    summary:
      "Robotics seed pitch decks must bridge the gap between impressive technology and real-world viability. Investors are skeptical of demos—show production reality. Lead with customer deployment evidence, not lab capabilities. Demonstrate you understand the challenges of deploying robots at scale.",
    sections: [
      {
        title: "Robot in Action",
        goal: "Show the robot doing real work, not demo tasks",
        guidance:
          "Open with video or images of the robot in actual customer environments—not a lab demo. Show the real task being performed. Include customer context: what environment, what problem. Make it tangible and credible. Avoid over-edited demo videos that hide failures.",
      },
      {
        title: "Problem & Market",
        goal: "Frame the problem and why robotics is the right solution",
        guidance:
          "Identify specific workflows where robotics creates clear value. Show the pain point: labor shortages, dangerous tasks, productivity constraints. Size the market based on specific customer segments. Explain why robotics is newly viable for this application—technology enablers, cost trajectory, or workflow changes.",
      },
      {
        title: "Solution & Capabilities",
        goal: "Demonstrate technical capabilities with production evidence",
        guidance:
          "Present robot capabilities with specificity: task types, success rates, operational conditions. Show technical differentiation from other approaches. Include metrics from real deployments, not lab benchmarks. Address the gap between current capabilities and production requirements with clear development path.",
      },
      {
        title: "Deployment Reality",
        goal: "Show you understand the deployment challenge",
        guidance:
          "Present your deployment process: timeline, customer requirements, training needs. Show deployment learnings and process improvements. Address scaling challenges and how you'll address them. This slide separates real robotics companies from research projects.",
      },
      {
        title: "Customer Evidence",
        goal: "Let pilot customers validate your robot",
        guidance:
          "Present pilot deployment results: runtime, success rates, customer feedback. Include testimonials from customers who've deployed your robot. Show diversity of pilots if applicable. Address any pilot failures and learnings. Customer evidence is the most credible proof in robotics.",
      },
      {
        title: "Customer Economics",
        goal: "Demonstrate clear customer ROI",
        guidance:
          "Present customer economic analysis: labor costs, productivity gains, total ROI. Show payback period on robot investment. Include total cost of ownership: purchase, deployment, support. Reference customer validation of ROI. Economics must be compelling to overcome adoption friction.",
      },
      {
        title: "Business Model",
        goal: "Show how you'll make money",
        guidance:
          "Present pricing model: hardware sale, RaaS, hybrid approach. Show unit economics at scale. Include service revenue streams: deployment, support, upgrades. Address working capital implications of hardware business. Demonstrate you've thought through the business model challenges.",
      },
      {
        title: "Competitive Landscape",
        goal: "Position against other approaches",
        guidance:
          "Map competitive landscape: other robotics companies, automation alternatives, status quo. Show differentiation on dimensions that matter to customers. Address large companies (Amazon, Google) potentially entering your space. Include technical comparisons where you have advantages.",
      },
      {
        title: "Team",
        goal: "Demonstrate robotics expertise and deployment experience",
        guidance:
          "Highlight robotics-specific experience: prior robots deployed, technical depth, field experience. Address key capabilities: mechanical, perception, controls, deployment. Show advisors who fill gaps. Robotics investors value teams who've seen robots fail in the field.",
      },
      {
        title: "Funding & Milestones",
        goal: "Present capital needs and path to production scale",
        guidance:
          "Show raise amount and use of funds: development, pilots, hardware. Present milestones this capital achieves: success rate targets, deployment count, revenue. Include total capital path to production scale. Be realistic about robotics capital intensity and timeline.",
      },
    ],
  },
  metricsBenchmarks: {
    summary:
      "Seed-stage robotics metrics focus on real-world performance, not lab capabilities. Investors evaluate task success rates in production conditions, deployment scalability, and customer economics. These benchmarks demonstrate whether your robot actually works outside the lab.",
    metrics: [
      {
        label: "Task Success Rate",
        value: "80-90% in customer environments",
        note: "Percentage of tasks completed without human intervention in real deployments. Must show improvement trajectory toward 95%+.",
      },
      {
        label: "Interventions Per Shift",
        value: "2-5 per 8-hour shift",
        note: "Human interventions required during operation. Categorize by type: navigation, manipulation, edge cases.",
      },
      {
        label: "Autonomous Runtime",
        value: "4-8 hours continuous",
        note: "Hours of operation without required intervention. Demonstrates system reliability and robustness.",
      },
      {
        label: "Deployment Time",
        value: "1-2 weeks per site",
        note: "Time from arrival to production operation. Shows deployment process maturity and scalability potential.",
      },
      {
        label: "Pilot Count",
        value: "2-5 active pilots",
        note: "Customer pilot deployments in production environments. Quality and diversity of pilots matter.",
      },
      {
        label: "Pilot Runtime Hours",
        value: "1,000+ total hours",
        note: "Cumulative runtime across all pilots. Demonstrates real-world validation and data for improvement.",
      },
      {
        label: "Customer ROI Payback",
        value: "12-24 months",
        note: "Time for customer to recover robot investment. Based on validated labor savings and productivity gains.",
      },
      {
        label: "Hardware Cost",
        value: "Target $50K-$200K",
        note: "Robot hardware cost target at production volume. Must support customer ROI payback timeline.",
      },
      {
        label: "Team Size",
        value: "5-12 people",
        note: "Core team covering mechanical, software, perception, and deployment. Field deployment experience is critical.",
      },
      {
        label: "Capital Raised",
        value: "$1M - $5M",
        note: "Robotics seed rounds tend larger given hardware and deployment costs. May include non-dilutive grants.",
      },
    ],
  },
  diligenceChecklist: {
    summary:
      "Robotics seed diligence focuses on real-world performance validation and team capability. Investors will request pilot deployment data and customer references. Prepare comprehensive documentation on robot performance, safety, and deployment process.",
    items: [
      {
        item: "Pilot deployment data with performance metrics",
        rationale:
          "Detailed data from customer pilots: task success rates, intervention frequency, runtime hours, failure analysis. Be prepared to show raw performance logs and demonstrate performance claims.",
      },
      {
        item: "Robot demonstration in production-like conditions",
        rationale:
          "Live or video demonstration in realistic conditions—not a controlled lab setup. Investors may request to observe pilots at customer sites.",
      },
      {
        item: "Safety documentation and risk assessment",
        rationale:
          "Safety framework documentation, testing results, and compliance with relevant standards. Include incident history and response protocols. Safety is critical for robotics diligence.",
      },
      {
        item: "Customer references and testimonials",
        rationale:
          "Pilot customers willing to speak with investors about real-world performance. Prepare 3-5 references with different perspectives on the robot's value.",
      },
      {
        item: "Technical architecture and differentiation documentation",
        rationale:
          "System architecture showing perception, planning, and control approaches. Technical differentiation explanation. IP documentation including patents and trade secrets.",
      },
      {
        item: "Deployment process and scalability plan",
        rationale:
          "Documented deployment process with timeline, requirements, and learnings. Show how process scales with more deployments.",
      },
      {
        item: "Hardware strategy and BOM",
        rationale:
          "Hardware approach (build vs. integrate) with rationale. Bill of materials with cost trajectory to production volume.",
      },
      {
        item: "Customer economics and ROI analysis",
        rationale:
          "Detailed customer ROI model with validated assumptions. Show total cost of ownership and payback calculation.",
      },
      {
        item: "Team backgrounds and robotics experience",
        rationale:
          "Detailed resumes highlighting robotics experience. Prior robots shipped or deployed. Reference contacts for key team members.",
      },
      {
        item: "Capital plan and financial model",
        rationale:
          "Use of funds breakdown, particularly hardware vs. software investment. Financial projections with unit economics at scale.",
      },
      {
        item: "Competitive analysis",
        rationale:
          "Detailed landscape including other robotics companies, automation alternatives, and potential large company entrants.",
      },
      {
        item: "Insurance and liability approach",
        rationale:
          "Insurance coverage for robot operation. Liability framework with customers. Risk management approach.",
      },
    ],
  },
  investorUpdate: {
    summary:
      "Seed-stage robotics investor updates focus on real-world performance improvement and pilot expansion. Show progress toward production-viable success rates and deployment scalability. Demonstrate you're systematically solving the hard problems of robotics deployment.",
    sections: [
      {
        section: "Performance Summary",
        content:
          "Lead with key production metrics: task success rate, interventions, runtime hours. Show trajectory over time—are you improving? Include data from newest pilots and how it compares to earlier deployments. This should demonstrate progress toward production viability.",
      },
      {
        section: "Pilot Deployments",
        content:
          "Update on pilot status: new pilots started, pilots concluded, active deployments. Include deployment learnings and process improvements. Show diversity of environments and tasks covered. Present customer feedback and testimonials from recent pilots.",
      },
      {
        section: "Technical Progress",
        content:
          "Detail technical improvements: success rate drivers, failure mode reductions, new capabilities. Show how you're addressing the issues you're seeing in deployment. Include hardware iterations if relevant. Connect technical progress to production readiness.",
      },
      {
        section: "Deployment Process",
        content:
          "Report on deployment efficiency: time per deployment, customer requirements evolution, remote support capabilities. Show how you're systematizing deployment for scale. Include any tools or automation being developed.",
      },
      {
        section: "Customer Development",
        content:
          "Update on customer pipeline: new prospects, conversion progress, expansion opportunities. Include customer economics validation from pilots. Report on market feedback and positioning learning.",
      },
      {
        section: "Team & Operations",
        content:
          "Report on team: key hires, capability additions. Include any safety incidents (hopefully none) and learnings. Operational infrastructure development for scale.",
      },
      {
        section: "Financial Status",
        content:
          "Cash position, burn rate, runway. Performance against budget. Include any pilot revenue or customer deposits. Hardware costs and trajectory.",
      },
      {
        section: "Priorities & Asks",
        content:
          "Next period priorities with specific performance targets. Areas where investor help is valuable: customer introductions, technical advisors, hiring. Strategic decisions needing input.",
      },
    ],
  },
};

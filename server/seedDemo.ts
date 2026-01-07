import "dotenv/config";
import { db } from "./db";
import { users, projects, documents, chunks, links } from "@shared/schema";
import { eq } from "drizzle-orm";

// Fixed IDs for idempotency
const DEMO_USER_ID = "demo-system-user-001";
const DEMO_PROJECT_ID = "00000000-0000-0000-0000-000000000001";
const DEMO_LINK_ID = "00000000-0000-0000-0000-000000000002";

// PayFlow pitch content chunks - comprehensive coverage
const PAYFLOW_CHUNKS = [
  // Company Overview
  {
    content: `PayFlow is a B2B payments infrastructure company. We help businesses automate their accounts payable and receivable through API-first payment rails that plug directly into ERPs like NetSuite, SAP, and QuickBooks. Our platform cuts payment processing time by 80% and completely eliminates manual reconciliation. Customers typically save 15+ hours per week on payment operations. We're based in San Francisco with 32 employees and were founded in 2022 by Sarah Chen and Marcus Williams.`,
    metadata: { filename: "company_overview", section: "overview" }
  },
  // What we do / Product
  {
    content: `What PayFlow does: We provide a unified payment platform for businesses. Think of us as the Stripe for B2B payments. Companies connect their accounting software to PayFlow, and we handle everything - invoice processing, payment routing, vendor management, approval workflows, and reconciliation. Our core products include: PayFlow AP (accounts payable automation), PayFlow AR (accounts receivable and collections), PayFlow Connect (ERP integrations), and PayFlow Analytics (cash flow insights and forecasting).`,
    metadata: { filename: "product_overview", section: "product" }
  },
  // How it works / Technology
  {
    content: `How PayFlow works technically: Our architecture is built on three pillars. First, smart invoice processing using OCR and ML to extract data from any invoice format with 99.2% accuracy. Second, intelligent payment routing - our proprietary algorithm analyzes 47 different factors to choose the optimal payment method and timing, reducing transaction costs by 35%. Third, real-time sync with ERPs through our REST API and webhooks. Integration typically takes 2-3 days for standard setups. We process payments through partnerships with JPMorgan, Wells Fargo, and Cross River Bank.`,
    metadata: { filename: "technical_architecture", section: "technology" }
  },
  // Problem we solve
  {
    content: `The problem we're solving: B2B payments are broken. US businesses waste $180 billion annually on manual payment processing. 68% of companies still use paper checks. Finance teams spend 40% of their time on payment tasks that should be automated. The average B2B payment takes 23 days to clear. 12% of invoices have errors requiring manual intervention. International payments cost 3-5% in fees. CFOs have no real-time visibility into cash flow. We fix all of this.`,
    metadata: { filename: "problem_statement", section: "problem" }
  },
  // Traction and metrics
  {
    content: `Our traction: We're at $2.4M ARR growing 180% year-over-year. We have 47 enterprise customers including Johnson Controls, Sysco, and Aramark - three Fortune 500 companies. We process $145M in monthly payment volume. Our NPS is 72, which is exceptional for fintech. Platform uptime is 99.99%. Average contract value is $52K per year on 24-month terms. We added 18 new customers last quarter alone.`,
    metadata: { filename: "traction_metrics", section: "traction" }
  },
  // Market size
  {
    content: `Market opportunity: The B2B payments market is massive. TAM is $45 billion in the US alone. We're focused on mid-market enterprises (100-5000 employees) which represents an $8 billion SAM. Our target SOM is $400M by year 5. The market is growing at 11% CAGR driven by digital transformation and the death of paper checks. Every CFO we talk to has this problem on their priority list.`,
    metadata: { filename: "market_analysis", section: "market" }
  },
  // Team
  {
    content: `Our team: Sarah Chen, CEO - she was an engineering lead at Stripe where she built their B2B payments product from zero to $500M GMV. Marcus Williams, CTO - 15 years in payment systems, was a fintech architect at Goldman Sachs. Jennifer Park, VP Sales - came from Tipalti where she closed $12M in enterprise deals. We have 32 full-time employees, 15 engineers, mostly recruited from Stripe, Square, and Plaid. The team has shipped payment products used by millions of businesses.`,
    metadata: { filename: "team_bios", section: "team" }
  },
  // Financials
  {
    content: `Financial overview: Current ARR is $2.4M, projecting $5.2M by end of year. Gross margins are 72%. Customer acquisition cost is $8,500 with an 8-month payback period. Net revenue retention is 135% - customers expand significantly after onboarding. We're burning $420K per month with 18 months of runway. Path to profitability is Q4 2026 at $15M ARR. Unit economics are strong and improving each quarter.`,
    metadata: { filename: "financials", section: "financials" }
  },
  // Competition
  {
    content: `Competitive landscape: Bill.com is the 800-pound gorilla at $20B market cap but they focus on SMB - we win on developer experience and 40% lower pricing for mid-market. Tipalti dominates enterprise but takes 3 months to implement vs our 2 weeks. Melio is consumer-focused payments, different market entirely. Our moat is the payment routing technology - it's taken 2 years to build and reduces transaction costs by 35% compared to anyone else. No competitor can match this.`,
    metadata: { filename: "competitive_analysis", section: "competition" }
  },
  // Go-to-market
  {
    content: `Go-to-market strategy: We use a land-and-expand model. We enter through finance teams with a pilot, then expand after hitting two integration milestones. Strategic partnerships with ERPs drive distribution - we're NetSuite certified and SAP certification is in progress. Content marketing drives 45% of inbound leads through our CFO-focused blog. Sales cycle is 45 days for mid-market, 90 days for enterprise. 28% of qualified demos convert to closed deals.`,
    metadata: { filename: "gtm_strategy", section: "gtm" }
  },
  // The ask / fundraise
  {
    content: `What we're raising: Series A of $12M at $48M pre-money valuation. Use of funds: 50% goes to engineering to expand from 15 to 35 engineers and launch our EU product. 30% for sales and marketing to triple the sales team. 15% for operations including SOC 2 Type II and additional payment licenses. 5% for G&A. Target milestones for Series B: $15M ARR, 150 customers, EU product live.`,
    metadata: { filename: "fundraise", section: "ask" }
  },
  // Customer story 1
  {
    content: `Customer success story - Sysco: Before PayFlow, Sysco's regional AP team processed 2,000 invoices monthly with 6 FTEs. They had 15% error rates and payments took 34 days on average. After implementing PayFlow, they process the same volume with 2 FTEs, error rate dropped to 0.3%, and average payment time is now 8 days. They've saved $1.2M annually and expanded from one region to four. The CFO called it "the best fintech investment we've made."`,
    metadata: { filename: "case_studies", section: "customers" }
  },
  // Customer story 2
  {
    content: `Customer success story - TechCorp Manufacturing: A 500-person manufacturing company paying 800 vendors monthly. Before PayFlow, their finance team spent 3 days per week on payment processing. They missed early payment discounts worth $200K annually. After PayFlow: payment processing takes 4 hours per week, they capture 95% of early payment discounts, and cash flow forecasting improved from "educated guesses" to real-time accuracy. ROI was positive in month 2.`,
    metadata: { filename: "case_studies", section: "customers" }
  },
  // Security and compliance
  {
    content: `Security and compliance: We're SOC 2 Type I certified with Type II in progress. PCI DSS compliant for payment processing. Bank-level 256-bit encryption for all data. We partner with established banks - JPMorgan, Wells Fargo, Cross River - not crypto or unstable institutions. 99.99% uptime SLA. We process through existing banking rails, not new experimental payment networks. Enterprise customers require this level of trust and we deliver it.`,
    metadata: { filename: "security", section: "compliance" }
  },
  // Product roadmap
  {
    content: `Product roadmap: Q1 2025 - Launch PayFlow International for cross-border payments with 50% lower fees than banks. Q2 2025 - AI-powered cash flow forecasting with 95% accuracy. Q3 2025 - PayFlow Capital: working capital loans based on payment flow data, huge margin opportunity. Q4 2025 - EU expansion with local payment rails. We're building a full financial operating system for mid-market companies, not just a point solution.`,
    metadata: { filename: "roadmap", section: "product" }
  },
  // Why now
  {
    content: `Why now is the right time: Three macro trends converging. First, CFOs are under pressure to do more with less - automation is mandatory, not optional. Second, real-time payments infrastructure (FedNow) is finally live, enabling instant B2B settlement. Third, the API-first economy means companies expect everything to integrate seamlessly. Legacy players like Bill.com are 15 years old with technical debt. We're built for the modern stack.`,
    metadata: { filename: "market_timing", section: "why_now" }
  },
  // Risks and mitigation
  {
    content: `Key risks and how we mitigate them: Risk 1 - Big players like Stripe entering B2B. Mitigation: Stripe is focused on payments acceptance, not AP/AR automation. Different product. Risk 2 - Economic downturn reducing spend. Mitigation: We save money, so we actually do better in downturns. Risk 3 - Bank partnerships. Mitigation: We have three bank partners, no single point of failure. Risk 4 - Enterprise sales cycles. Mitigation: Product-led growth motion for faster initial adoption.`,
    metadata: { filename: "risk_analysis", section: "risks" }
  },
  // Vision
  {
    content: `Our vision: We're building the financial operating system for mid-market businesses. Today it's payments. Tomorrow it's working capital, treasury management, and financial planning. Every CFO should have the tools that Fortune 500 companies have. We're democratizing financial operations. In 5 years, PayFlow will be as essential as Salesforce is for sales teams. That's a $50B+ company.`,
    metadata: { filename: "vision", section: "vision" }
  }
];

async function seedDemo() {
  console.log("🌱 Starting demo data seed...\n");

  // 1. Create demo user
  const existingUser = await db.select().from(users).where(eq(users.id, DEMO_USER_ID)).limit(1);

  if (existingUser.length === 0) {
    await db.insert(users).values({
      id: DEMO_USER_ID,
      email: "demo@pitchchat.io",
      firstName: "Demo",
      lastName: "System",
      provider: "local",
      password: "demo-system-no-login", // Cannot be used for login
      emailVerified: true,
      tokens: 999999999,
    });
    console.log("✅ Created demo user: demo@pitchchat.io");
  } else {
    console.log("⏭️  Demo user already exists");
  }

  // 2. Create demo project
  const existingProject = await db.select().from(projects).where(eq(projects.id, DEMO_PROJECT_ID)).limit(1);

  if (existingProject.length === 0) {
    await db.insert(projects).values({
      id: DEMO_PROJECT_ID,
      userId: DEMO_USER_ID,
      name: "PayFlow",
      description: "B2B payments infrastructure that helps businesses automate their accounts payable and receivable workflows. We reduce payment processing time by 80% and eliminate manual reconciliation.",
      defaultModel: "gpt-4o",
    });
    console.log("✅ Created demo project: PayFlow");
  } else {
    console.log("⏭️  Demo project already exists");
  }

  // 3. Create demo documents
  const docsToCreate = [
    { name: "PayFlow_Pitch_Deck.pdf", mimeType: "application/pdf", size: 2456789 },
    { name: "Financial_Model_Q4.xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", size: 1234567 },
    { name: "Market_Analysis.pdf", mimeType: "application/pdf", size: 987654 },
  ];

  const existingDocs = await db.select().from(documents).where(eq(documents.projectId, DEMO_PROJECT_ID));

  for (const doc of docsToCreate) {
    if (!existingDocs.find(d => d.originalName === doc.name)) {
      await db.insert(documents).values({
        projectId: DEMO_PROJECT_ID,
        filename: `demo-${doc.name.toLowerCase().replace(/[^a-z0-9.]/g, '-')}`,
        originalName: doc.name,
        fileSize: doc.size,
        mimeType: doc.mimeType,
        status: "completed",
        tokens: 5000,
        pageCount: doc.name.includes("Deck") ? 18 : doc.name.includes("Model") ? 5 : 12,
      });
      console.log(`✅ Created document: ${doc.name}`);
    } else {
      console.log(`⏭️  Document already exists: ${doc.name}`);
    }
  }

  // 4. Create chunks - always recreate to get latest content
  const projectDocs = await db.select().from(documents).where(eq(documents.projectId, DEMO_PROJECT_ID));
  const primaryDoc = projectDocs[0]; // Use first doc (pitch deck) for all chunks

  if (!primaryDoc) {
    console.log("❌ No documents found for demo project");
  } else {
    // Delete existing chunks for demo project docs
    for (const doc of projectDocs) {
      await db.delete(chunks).where(eq(chunks.documentId, doc.id));
    }
    console.log("🗑️  Cleared existing chunks");

    // Create fresh chunks attached to primary document
    for (let i = 0; i < PAYFLOW_CHUNKS.length; i++) {
      const chunk = PAYFLOW_CHUNKS[i];
      await db.insert(chunks).values({
        documentId: primaryDoc.id,
        content: chunk.content,
        metadata: chunk.metadata,
        tokenCount: Math.ceil(chunk.content.length / 4),
        chunkIndex: i,
      });
    }
    console.log(`✅ Created ${PAYFLOW_CHUNKS.length} content chunks`);
  }

  // 5. Create demo link
  const existingLink = await db.select().from(links).where(eq(links.slug, "demo")).limit(1);

  if (existingLink.length === 0) {
    await db.insert(links).values({
      id: DEMO_LINK_ID,
      projectId: DEMO_PROJECT_ID,
      slug: "demo",
      name: "Investor Demo Room",
      status: "active",
      expiresAt: null,
      limitTokens: 50000,
      allowDownloads: false,
    });
    console.log("✅ Created demo link: /chat/demo");
  } else {
    console.log("⏭️  Demo link already exists");
  }

  console.log("\n🎉 Demo seed complete!");
  console.log("   Visit: http://localhost:5170/chat/demo");
}

seedDemo()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  });

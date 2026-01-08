import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import {
  ArrowRight,
  BarChart3,
  Eye,
  FileText,
  Globe,
  Lock,
  MessageSquare,
  Shield,
  Upload,
  UserCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Redirect } from "wouter";
import { BlobMorphBackground } from "@/components/backgrounds";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Landing() {
  usePageTitle("Home");
  const { user } = useAuth();

  if (user) return <Redirect to="/dashboard" />;

  const goAuth = () => {
    window.location.href = "/auth";
  };

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 z-50 w-full border-b border-black/[0.08] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => scrollToId("top")}
            className="group flex items-center gap-3"
          >
            <Logo size="lg" className="rounded-xl border border-black/10 bg-white p-1.5 shadow-[0_1px_0_rgba(0,0,0,0.06)]" />
            <span className="font-inter-tight text-[15px] font-semibold tracking-tight">
              PitchChat
            </span>
          </button>

          <div className="hidden items-center gap-8 md:flex">
            <button
              type="button"
              onClick={() => scrollToId("features")}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-black/60 transition-colors hover:text-black"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToId("workflow")}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-black/60 transition-colors hover:text-black"
            >
              Workflow
            </button>
            <button
              type="button"
              onClick={() => scrollToId("security")}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-black/60 transition-colors hover:text-black"
            >
              Security
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="h-10 rounded-xl px-4 text-sm font-semibold text-black/70 hover:bg-black/[0.04] hover:text-black"
              onClick={goAuth}
            >
              Log in
            </Button>
            <Button
              className="group h-10 rounded-xl bg-black px-5 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(0,0,0,0.22)] transition-transform hover:-translate-y-0.5 hover:bg-black/90"
              onClick={goAuth}
            >
              Create room
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </nav>

      <main id="top" className="pt-28 space-y-6 px-4 sm:px-6 lg:px-8">
        {/* Hero Section - Typeless centered style */}
        <section className="section-card-typeless bg-section-gray rounded-[32px] animate-fade-in-up relative overflow-hidden">
          <BlobMorphBackground />

          <div className="section-card-inner py-16 px-8 md:px-12 text-center relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/70">
              <Logo size="sm" className="h-4 w-4" />
              Pitch, with AI
            </div>

            <h1 className="mt-8 font-inter-tight text-[48px] font-semibold leading-[1.0] tracking-[-0.03em] text-black sm:text-[72px] md:text-[88px]">
              Pitch with your agent.
              <br />
              <span className="text-black/50">Turn your deck into a room.</span>
            </h1>

            <p className="mt-8 mx-auto max-w-2xl text-[18px] leading-[1.6] text-black/60 sm:text-[18px]">
              PitchChat turns your documents into an interactive AI pitch room that
              answers investor questions, captures leads, and tracks intent—without
              the back-and-forth.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                className="group h-14 rounded-full bg-black px-8 py-4 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-black/90"
                onClick={goAuth}
              >
                Create your room
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <a href="/chat/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-full border-black/10 bg-white px-8 py-4 text-sm font-semibold text-black/80 transition-all duration-300 hover:-translate-y-1 hover:bg-black/[0.03]"
                >
                  See a live room
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Stats Section - White cards on light background */}
        <section className="section-card-typeless bg-white rounded-[32px] animate-fade-in-up animation-delay-100">
          <div className="section-card-inner py-12 px-8 md:px-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-black/10 bg-section-gray px-6 py-5 card-typeless transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">
                  Lead capture
                </div>
                <div className="mt-2 font-inter-tight text-lg font-semibold tracking-tight">
                  Warm follow-ups
                </div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-section-gray px-6 py-5 card-typeless transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">
                  Analytics
                </div>
                <div className="mt-2 font-inter-tight text-lg font-semibold tracking-tight">
                  What they cared about
                </div>
              </div>
              <div className="rounded-3xl border border-black/10 bg-section-gray px-6 py-5 card-typeless transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">
                  Answers
                </div>
                <div className="mt-2 font-inter-tight text-lg font-semibold tracking-tight">
                  24/7 investor-ready
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section - Light blue */}
        <section id="demo" className="section-card-typeless bg-section-blue rounded-[32px] animate-fade-in-up animation-delay-200">
          <div className="section-card-inner py-16 px-8 md:px-12">
            <div className="zigzag-left">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">
                  Live Preview
                </div>
                <h3 className="mt-3 font-inter-tight text-3xl font-semibold tracking-tight sm:text-4xl">
                  See it in action
                </h3>
                <p className="mt-4 text-[14px] leading-relaxed text-black/60 max-w-md sm:text-[15px]">
                  Experience how investors interact with your pitch room. Questions get instant, grounded answers with citations.
                </p>
              </div>

              {/* Simplified Demo Panel */}
              <div className="rounded-[32px] border border-black/10 bg-white shadow-lg overflow-hidden card-typeless animate-fade-slide-up transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Logo size="md" className="h-9 w-9 rounded-2xl bg-black p-1.5" variant="white" />
                    <div>
                      <p className="font-inter-tight text-sm font-bold leading-none">
                        AI Pitch Room
                      </p>
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-black/45">
                        public link · lead capture
                      </p>
                    </div>
                  </div>
                  <div className="hidden items-center gap-2 sm:flex">
                    <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-semibold text-black/60">
                      6 docs
                    </span>
                    <span className="rounded-full border border-black/10 bg-white px-3 py-1 text-[11px] font-semibold text-black/60">
                      14 questions
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <div className="max-w-[85%] rounded-[22px] rounded-tr-sm bg-black px-4 py-3 text-white">
                        <p className="text-sm font-medium leading-relaxed">
                          What&apos;s your go-to-market plan for mid-market?
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-[22px] rounded-tl-sm border border-black/10 bg-white px-4 py-3 text-black">
                        <p className="text-sm font-medium leading-relaxed text-black/80">
                          The deck outlines a land-and-expand motion via security
                          teams. Pilots convert to annual contracts after two
                          integration milestones.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-black/60">
                            deck.pdf
                          </span>
                          <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-black/60">
                            gtm · p. 7
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center gap-2 rounded-2xl border border-black/10 bg-black/[0.03] px-3 py-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl border border-black/10 bg-white">
                      <MessageSquare className="h-4 w-4 text-black" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-black/55">
                        Ask about revenue, churn, pricing…
                        <span className="ml-1 text-black/35">press Enter</span>
                      </p>
                    </div>
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-black text-white">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section Header */}
        <section id="features" className="section-card-typeless bg-white rounded-[32px] animate-fade-in-up">
          <div className="section-card-inner py-16 px-8 md:px-12 text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
              Features
            </div>
            <h2 className="mt-4 font-inter-tight text-[36px] font-semibold tracking-[-0.03em] sm:text-[48px]">
              Everything investors ask.
            </h2>
            <p className="mt-4 text-[18px] text-black/60">
              Minimal UI. Maximum signal.
            </p>
          </div>
        </section>

        {/* Feature 1: Upload - Light Blue, Zigzag Left */}
        <section className="section-card-typeless bg-section-blue rounded-[32px] transition-all duration-300 hover:-translate-y-1 animate-fade-in-up">
          <div className="section-card-inner py-16 px-8 md:px-12">
            <div className="zigzag-left">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                  PitchChat
                </div>
                <h3 className="mt-2 font-inter-tight text-[28px] font-semibold tracking-[-0.02em] sm:text-[32px]">
                  Upload once
                </h3>
                <p className="mt-4 text-[18px] leading-[1.6] text-black/60 max-w-md">
                  Drop your deck, memo, and data room PDFs. PitchChat indexes and keeps everything organized.
                </p>
              </div>

              {/* Upload Preview Mockup */}
              <div className="rounded-[32px] border border-black/10 bg-white shadow-lg overflow-hidden">
                <div className="p-5">
                  {/* Drop zone */}
                  <div className="rounded-2xl border-2 border-dashed border-black/20 bg-black/[0.02] p-6 text-center">
                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-black/[0.06]">
                      <Upload className="h-5 w-5 text-black/40" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-black/60">Drop files here</p>
                    <p className="mt-1 text-[11px] text-black/40">PDF, DOCX, PPTX up to 50MB</p>
                  </div>

                  {/* Uploaded files list */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-3 rounded-xl bg-black/[0.03] px-4 py-3">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-red-500/10">
                        <FileText className="h-4 w-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-black/80 truncate">Series_A_Deck.pdf</p>
                        <p className="text-[10px] text-black/45">2.4 MB · Indexed</p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-black/[0.03] px-4 py-3">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-500/10">
                        <FileText className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-black/80 truncate">Financial_Model.xlsx</p>
                        <p className="text-[10px] text-black/45">1.8 MB · Indexing...</p>
                      </div>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/60"></div>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl bg-black/[0.03] px-4 py-3">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-orange-500/10">
                        <FileText className="h-4 w-4 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-black/80 truncate">Data_Room_Memo.pdf</p>
                        <p className="text-[10px] text-black/45">890 KB · Indexed</p>
                      </div>
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 2: Answer - Lavender, Zigzag Right */}
        <section className="section-card-typeless bg-section-lavender rounded-[32px] transition-all duration-300 hover:-translate-y-1 animate-fade-in-up animation-delay-100">
          <div className="section-card-inner py-16 px-8 md:px-12">
            <div className="zigzag-right">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                  PitchChat
                </div>
                <h3 className="mt-2 font-inter-tight text-[28px] font-semibold tracking-[-0.02em] sm:text-[32px]">
                  Answer instantly
                </h3>
                <p className="mt-4 text-[18px] leading-[1.6] text-black/60 max-w-md">
                  Investors ask questions. The room responds with grounded answers and citations.
                </p>
              </div>

              {/* Answer Preview Mockup */}
              <div className="rounded-[32px] border border-black/10 bg-white shadow-lg overflow-hidden">
                <div className="p-5 space-y-3">
                  {/* Question */}
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-[20px] rounded-tr-sm bg-black px-4 py-3 text-white">
                      <p className="text-sm font-medium leading-relaxed">
                        What&apos;s your current ARR and growth rate?
                      </p>
                    </div>
                  </div>

                  {/* Answer with citations */}
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-[20px] rounded-tl-sm border border-black/10 bg-white px-4 py-3">
                      <p className="text-sm font-medium leading-relaxed text-black/80">
                        We&apos;re at $2.4M ARR with 180% YoY growth. Net revenue retention is 135% driven by expansion in enterprise accounts.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-black/60">
                          <FileText className="h-3 w-3" />
                          metrics.pdf
                        </span>
                        <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-black/60">
                          p. 12
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Typing indicator */}
                  <div className="flex justify-start">
                    <div className="rounded-[20px] rounded-tl-sm border border-black/10 bg-black/[0.02] px-4 py-3">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 animate-bounce rounded-full bg-black/30" style={{ animationDelay: "0ms" }}></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-black/30" style={{ animationDelay: "150ms" }}></div>
                        <div className="h-2 w-2 animate-bounce rounded-full bg-black/30" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 3: Capture - Cream, Zigzag Left */}
        <section className="section-card-typeless bg-section-cream rounded-[32px] transition-all duration-300 hover:-translate-y-1 animate-fade-in-up animation-delay-200">
          <div className="section-card-inner py-16 px-8 md:px-12">
            <div className="zigzag-left">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                  PitchChat
                </div>
                <h3 className="mt-2 font-inter-tight text-[28px] font-semibold tracking-[-0.02em] sm:text-[32px]">
                  Capture leads
                </h3>
                <p className="mt-4 text-[18px] leading-[1.6] text-black/60 max-w-md">
                  Gate chat behind email—convert anonymous viewers into warm follow-ups.
                </p>
              </div>

              {/* Capture Leads Preview Mockup */}
              <div className="rounded-[32px] border border-black/10 bg-white shadow-lg overflow-hidden">
                <div className="p-6">
                  {/* Gate overlay card */}
                  <div className="rounded-2xl bg-gradient-to-b from-black/[0.02] to-black/[0.06] p-6 text-center">
                    <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-black">
                      <Lock className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="mt-4 font-inter-tight text-lg font-semibold text-black">
                      Enter your email to continue
                    </h4>
                    <p className="mt-2 text-sm text-black/55">
                      Get instant access to ask questions about this pitch
                    </p>

                    {/* Email input */}
                    <div className="mt-5 flex gap-2">
                      <div className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-left">
                        <span className="text-sm text-black/40">name@venture.com</span>
                      </div>
                      <button className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white">
                        Continue
                      </button>
                    </div>

                    <p className="mt-4 text-[11px] text-black/40">
                      Your email helps founders follow up with interested investors
                    </p>
                  </div>

                  {/* Captured leads indicator */}
                  <div className="mt-4 flex items-center justify-between rounded-xl bg-emerald-500/10 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700">12 leads captured</span>
                    </div>
                    <span className="text-xs text-emerald-600/70">This week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature 4: Track - Gray, Zigzag Right */}
        <section className="section-card-typeless bg-section-gray rounded-[32px] transition-all duration-300 hover:-translate-y-1 animate-fade-in-up animation-delay-300">
          <div className="section-card-inner py-16 px-8 md:px-12">
            <div className="zigzag-right">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                  PitchChat
                </div>
                <h3 className="mt-2 font-inter-tight text-[28px] font-semibold tracking-[-0.02em] sm:text-[32px]">
                  Track intent
                </h3>
                <p className="mt-4 text-[18px] leading-[1.6] text-black/60 max-w-md">
                  See what people asked, what they revisited, and where they hesitated.
                </p>
              </div>

              {/* Track Intent Preview Mockup */}
              <div className="rounded-[32px] border border-black/10 bg-white shadow-lg overflow-hidden">
                <div className="p-5">
                  {/* Header stats */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="rounded-xl bg-black/[0.03] p-3 text-center">
                      <div className="font-inter-tight text-2xl font-bold text-black">47</div>
                      <div className="text-[10px] font-semibold text-black/45 uppercase tracking-wider">Views</div>
                    </div>
                    <div className="rounded-xl bg-black/[0.03] p-3 text-center">
                      <div className="font-inter-tight text-2xl font-bold text-black">23</div>
                      <div className="text-[10px] font-semibold text-black/45 uppercase tracking-wider">Questions</div>
                    </div>
                    <div className="rounded-xl bg-emerald-500/10 p-3 text-center">
                      <div className="font-inter-tight text-2xl font-bold text-emerald-600">8.2m</div>
                      <div className="text-[10px] font-semibold text-emerald-600/70 uppercase tracking-wider">Avg. Time</div>
                    </div>
                  </div>

                  {/* Top questions */}
                  <div className="rounded-xl border border-black/10 bg-black/[0.02] p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart3 className="h-4 w-4 text-black/50" />
                      <span className="text-xs font-semibold uppercase tracking-wider text-black/50">Top Questions</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 rounded-full bg-black/10 overflow-hidden">
                          <div className="h-full w-[85%] rounded-full bg-black"></div>
                        </div>
                        <span className="text-xs font-semibold text-black/60 whitespace-nowrap">Revenue</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 rounded-full bg-black/10 overflow-hidden">
                          <div className="h-full w-[65%] rounded-full bg-black/70"></div>
                        </div>
                        <span className="text-xs font-semibold text-black/60 whitespace-nowrap">Team</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 rounded-full bg-black/10 overflow-hidden">
                          <div className="h-full w-[45%] rounded-full bg-black/50"></div>
                        </div>
                        <span className="text-xs font-semibold text-black/60 whitespace-nowrap">Market</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent activity */}
                  <div className="mt-3 flex items-center gap-2 text-xs text-black/50">
                    <Eye className="h-3 w-3" />
                    <span>partner@sequoia.com viewed 12m ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow/Comparison Section */}
        <section id="workflow" className="section-card-typeless bg-white rounded-[32px] animate-fade-in-up">
          <div className="section-card-inner py-16 px-8 md:px-12">
            <div className="text-center mb-12">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                Workflow
              </div>
              <h2 className="mt-4 font-inter-tight text-[36px] font-semibold tracking-[-0.03em] sm:text-[48px]">
                A room beats a PDF.
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-[18px] leading-[1.6] text-black/60">
                Investors don&apos;t want another attachment. They want answers. PitchChat
                gives them a place to explore your story—while you collect signal.
              </p>
            </div>

            {/* Dark vs Light Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Static PDF - Light muted card */}
              <div className="rounded-[32px] bg-black/[0.03] p-8 border border-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                      Static PDF
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <div className="font-inter-tight text-6xl font-bold text-black/25">
                        0
                      </div>
                      <div className="text-sm font-semibold text-black/45">
                        insights
                      </div>
                    </div>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-2xl border border-black/10 bg-white text-black/60">
                    <FileText className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-black/55">
                  Sent to 50 investors. Two replies. Silence.
                </p>
              </div>

              {/* PitchChat - Dark prominent card */}
              <div className="rounded-[32px] bg-black p-8 text-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">
                      PitchChat
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <div className="font-inter-tight text-6xl font-bold">
                        4x
                      </div>
                      <div className="text-sm font-semibold text-white/60">
                        faster follow-up
                      </div>
                    </div>
                  </div>
                  <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-white">
                    <Zap className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-white/80">
                  Questions reveal intent. You know what to address before the call.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section - Lavender */}
        <section id="security" className="section-card-typeless bg-section-lavender rounded-[32px] animate-fade-in-up">
          <div className="section-card-inner py-16 px-8 md:px-12">
            <div className="text-center mb-12">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                Security
              </div>
              <h2 className="mt-4 font-inter-tight text-[36px] font-semibold tracking-[-0.03em] sm:text-[48px]">
                Secure by design.
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-[18px] leading-[1.6] text-black/60">
                Your deck is sensitive. Control access, track sharing, and keep your
                data isolated.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-[24px] bg-white p-8 card-typeless transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-black/10 bg-section-gray text-black">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div className="font-inter-tight text-[20px] font-semibold tracking-[-0.02em]">
                    Encryption
                  </div>
                </div>
                <p className="mt-4 text-[18px] leading-[1.6] text-black/60">
                  Documents are encrypted at rest and in transit.
                </p>
              </div>

              <div className="rounded-[24px] bg-white p-8 card-typeless transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-black/10 bg-section-gray text-black">
                    <Lock className="h-6 w-6" />
                  </div>
                  <div className="font-inter-tight text-[20px] font-semibold tracking-[-0.02em]">
                    Access control
                  </div>
                </div>
                <p className="mt-4 text-[18px] leading-[1.6] text-black/60">
                  Gate by email or verification. Revoke instantly.
                </p>
              </div>

              <div className="rounded-[24px] bg-white p-8 card-typeless transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl border border-black/10 bg-section-gray text-black">
                    <Globe className="h-6 w-6" />
                  </div>
                  <div className="font-inter-tight text-[20px] font-semibold tracking-[-0.02em]">
                    Shareable links
                  </div>
                </div>
                <p className="mt-4 text-[18px] leading-[1.6] text-black/60">
                  One link for investors. Full telemetry for you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Cream */}
        <section className="section-card-typeless bg-section-cream rounded-[32px] animate-fade-in-up">
          <div className="section-card-inner py-16 px-8 md:px-12 text-center">
            <h2 className="font-inter-tight text-[32px] font-semibold tracking-[-0.03em] sm:text-[48px]">
              Ready to fundraise smarter?
            </h2>
            <p className="mt-4 text-[18px] leading-[1.6] text-black/60 max-w-lg mx-auto">
              Create a room in minutes. Share one link. Get real investor signal.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={goAuth}
                className="h-14 rounded-full bg-black px-8 py-4 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(0,0,0,0.22)] transition-all duration-300 hover:-translate-y-1 hover:bg-black/90"
              >
                Start free
              </Button>
              <a href="/chat/demo">
                <Button
                  variant="outline"
                  className="h-14 rounded-full border-black/10 bg-white px-8 py-4 text-sm font-semibold text-black/80 transition-all duration-300 hover:-translate-y-1 hover:bg-black/[0.03]"
                >
                  See live room
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-black/[0.08] bg-white mt-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-black flex items-center justify-center">
                <Logo size="sm" variant="white" className="p-1" />
              </div>
              <span className="font-inter-tight text-sm font-bold tracking-tight text-black">
                PitchChat
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs font-semibold uppercase tracking-[0.16em] text-black/60">
              <button type="button" onClick={() => scrollToId("features")} className="hover:text-black">
                Features
              </button>
              <button type="button" onClick={() => scrollToId("workflow")} className="hover:text-black">
                Workflow
              </button>
              <button type="button" onClick={() => scrollToId("security")} className="hover:text-black">
                Security
              </button>
              <a href="/terms" className="hover:text-black">
                Terms
              </a>
              <a href="/privacy" className="hover:text-black">
                Privacy
              </a>
            </div>

            <div className="text-xs font-semibold text-black/40 space-y-2">
              <p>© {new Date().getFullYear()} PitchChat</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

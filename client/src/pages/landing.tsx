import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Eye,
  FileText,
  Globe,
  Lock,
  MessageSquare,
  Shield,
  Sparkles,
  Upload,
  UserCheck,
  Zap,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Redirect } from "wouter";



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
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(0,0,0,0.06),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(0,0,0,0.05),transparent_60%),radial-gradient(circle_at_55%_85%,rgba(0,0,0,0.04),transparent_65%)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,rgba(0,0,0,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.12)_1px,transparent_1px)] [background-size:56px_56px]" />
      </div>

      <nav className="fixed top-0 z-50 w-full border-b border-black/[0.08] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          <button
            type="button"
            onClick={() => scrollToId("top")}
            className="group flex items-center gap-3"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 bg-white shadow-[0_1px_0_rgba(0,0,0,0.06)]">
              <span className="font-inter-tight text-[15px] font-extrabold tracking-tight">
                PC
              </span>
            </span>
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

      <main id="top" className="pt-28">
        <header className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/70">
                <Sparkles className="h-4 w-4" />
                Pitch, don&apos;t type
              </div>

              <h1 className="mt-6 font-inter-tight text-[44px] font-semibold leading-[0.98] tracking-[-0.04em] text-black sm:text-[62px] md:text-[74px]">
                Pitch, don&apos;t type.
                <br />
                <span className="text-black/60">Turn your deck into a room.</span>
              </h1>

              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-black/60 sm:text-[16px]">
                PitchChat turns your documents into an interactive AI pitch room that
                answers investor questions, captures leads, and tracks intent—without
                the back-and-forth.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="group h-12 rounded-2xl bg-black px-7 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(0,0,0,0.22)] transition-transform hover:-translate-y-0.5 hover:bg-black/90"
                  onClick={goAuth}
                >
                  Create your room
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-2xl border-black/10 bg-white px-7 text-sm font-semibold text-black/80 hover:bg-black/[0.03]"
                  onClick={() => scrollToId("demo")}
                >
                  See a live room
                </Button>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Lead capture
                  </div>
                  <div className="mt-2 font-inter-tight text-lg font-semibold tracking-tight">
                    Warm follow-ups
                  </div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Analytics
                  </div>
                  <div className="mt-2 font-inter-tight text-lg font-semibold tracking-tight">
                    What they cared about
                  </div>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white/75 px-4 py-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Answers
                  </div>
                  <div className="mt-2 font-inter-tight text-lg font-semibold tracking-tight">
                    24/7 investor-ready
                  </div>
                </div>
              </div>
            </div>

            <div id="demo" className="relative">
              <div className="overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.14)]">
                <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-2xl bg-black text-white">
                      <Sparkles className="h-4 w-4" />
                    </div>
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

                <div className="grid grid-cols-1 md:grid-cols-5">
                  <aside className="hidden border-r border-black/10 md:col-span-2 md:block">
                    <div className="p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
                        Intent signals
                      </p>
                      <div className="mt-4 space-y-3">
                        {[
                          {
                            title: "Asked about CAC/LTV",
                            meta: "2m ago · investor@fund.com",
                          },
                          {
                            title: "Opened financial model",
                            meta: "8m ago · 3 pages",
                          },
                          {
                            title: "Concern: churn",
                            meta: "flagged by questions",
                          },
                        ].map((row) => (
                          <div
                            key={row.title}
                            className="rounded-2xl border border-black/10 bg-white px-4 py-3"
                          >
                            <p className="text-xs font-semibold text-black">
                              {row.title}
                            </p>
                            <p className="mt-1 text-[11px] font-medium text-black/50">
                              {row.meta}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </aside>

                  <section className="md:col-span-3">
                    <div className="p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-black/45">
                        Conversation
                      </p>
                      <div className="mt-4 space-y-3">
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
                  </section>
                </div>
              </div>

              <div className="pointer-events-none absolute -inset-x-8 -bottom-10 -z-10 h-56 bg-[radial-gradient(circle_at_50%_30%,rgba(0,0,0,0.18),transparent_70%)] blur-2xl" />
            </div>
          </div>
        </header>

        <section id="features" className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
          <div className="flex items-end justify-between gap-6">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                Features
              </div>
              <h2 className="mt-3 font-inter-tight text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                Everything investors ask.
              </h2>
            </div>
            <div className="hidden text-sm text-black/60 md:block">
              Minimal UI. Maximum signal.
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              {
                icon: <Upload className="h-4 w-4" />,
                title: "Upload once",
                desc: "Drop your deck, memo, and data room PDFs. PitchChat indexes and keeps everything organized.",
              },
              {
                icon: <MessageSquare className="h-4 w-4" />,
                title: "Answer instantly",
                desc: "Investors ask questions. The room responds with grounded answers and citations.",
              },
              {
                icon: <UserCheck className="h-4 w-4" />,
                title: "Capture leads",
                desc: "Gate chat behind email—convert anonymous viewers into warm follow-ups.",
              },
              {
                icon: <Eye className="h-4 w-4" />,
                title: "Track intent",
                desc: "See what people asked, what they revisited, and where they hesitated.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-[26px] border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(0,0,0,0.08)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/45">
                      PitchChat
                    </div>
                    <div className="mt-2 font-inter-tight text-xl font-semibold tracking-tight">
                      {f.title}
                    </div>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-2xl border border-black/10 bg-white text-black/70">
                    {f.icon}
                  </span>
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-black/60">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="workflow" className="mx-auto mt-24 max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-10 border-y border-black/[0.08] py-16 lg:grid-cols-2 lg:items-start">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                Workflow
              </div>
              <h2 className="mt-3 font-inter-tight text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
                A room beats a PDF.
              </h2>
              <p className="mt-5 max-w-xl text-[14px] leading-relaxed text-black/60 sm:text-[15px]">
                Investors don&apos;t want another attachment. They want answers. PitchChat
                gives them a place to explore your story—while you collect signal.
              </p>
            </div>

            <div className="rounded-[28px] border border-black/10 bg-white p-6">
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    label: "Static PDF",
                    stat: "0",
                    statLabel: "insights",
                    body: "Sent to 50 investors. Two replies. Silence.",
                    muted: true,
                  },
                  {
                    label: "PitchChat",
                    stat: "4x",
                    statLabel: "faster follow-up",
                    body: "Questions reveal intent. You know what to address before the call.",
                    muted: false,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className={`rounded-[26px] border p-6 ${
                      row.muted
                        ? "border-black/10 bg-black/[0.02]"
                        : "border-black bg-black text-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <div
                          className={`text-[10px] font-semibold uppercase tracking-[0.18em] ${
                            row.muted ? "text-black/45" : "text-white/60"
                          }`}
                        >
                          {row.label}
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                          <div
                            className={`font-inter-tight text-5xl font-semibold tracking-tight ${
                              row.muted ? "text-black/30" : "text-white"
                            }`}
                          >
                            {row.stat}
                          </div>
                          <div
                            className={`text-sm font-semibold ${
                              row.muted ? "text-black/45" : "text-white/60"
                            }`}
                          >
                            {row.statLabel}
                          </div>
                        </div>
                      </div>
                      <div
                        className={`grid h-10 w-10 place-items-center rounded-2xl ${
                          row.muted
                            ? "border border-black/10 bg-white text-black/60"
                            : "bg-white/10 text-white"
                        }`}
                      >
                        {row.muted ? (
                          <FileText className="h-4 w-4" />
                        ) : (
                          <Zap className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    <p
                      className={`mt-4 text-[14px] leading-relaxed ${
                        row.muted ? "text-black/55" : "text-white/80"
                      }`}
                    >
                      {row.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="security" className="mx-auto mt-24 max-w-6xl px-4 pb-24 sm:px-6">
          <div className="rounded-[32px] border border-black/10 bg-white p-8 sm:p-12">
            <div className="flex flex-col gap-3">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-black/50">
                Security
              </div>
              <h2 className="font-inter-tight text-3xl font-semibold tracking-tight sm:text-4xl">
                Secure by design.
              </h2>
              <p className="max-w-2xl text-[14px] leading-relaxed text-black/60 sm:text-[15px]">
                Your deck is sensitive. Control access, track sharing, and keep your
                data isolated.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
              {[
                {
                  icon: <Shield className="h-5 w-5" />,
                  title: "Encryption",
                  desc: "Documents are encrypted at rest and in transit.",
                },
                {
                  icon: <Lock className="h-5 w-5" />,
                  title: "Access control",
                  desc: "Gate by email, domain, or verification. Revoke instantly.",
                },
                {
                  icon: <Globe className="h-5 w-5" />,
                  title: "Shareable links",
                  desc: "One link for investors. Full telemetry for you.",
                },
              ].map((s) => (
                <div
                  key={s.title}
                  className="rounded-[26px] border border-black/10 bg-black/[0.02] p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl border border-black/10 bg-white text-black">
                      {s.icon}
                    </div>
                    <div className="font-inter-tight text-lg font-semibold tracking-tight">
                      {s.title}
                    </div>
                  </div>
                  <p className="mt-4 text-[14px] leading-relaxed text-black/60">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-[32px] border border-black/10 bg-white/80 p-8 sm:p-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div className="max-w-xl">
                <h2 className="font-inter-tight text-2xl font-semibold tracking-tight sm:text-3xl">
                  Ready to fundraise smarter?
                </h2>
                <p className="mt-2 text-sm font-medium leading-relaxed text-black/60">
                  Create a room in minutes. Share one link. Get real investor signal.
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Button
                  onClick={goAuth}
                  className="h-12 rounded-2xl bg-black px-6 text-sm font-semibold text-white hover:bg-black/90"
                >
                  Start free
                </Button>
                <Button
                  variant="outline"
                  onClick={() => scrollToId("demo")}
                  className="h-12 rounded-2xl border-black/10 bg-white px-6 text-sm font-semibold text-black/80 hover:bg-black/[0.03]"
                >
                  See live room
                </Button>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-black/[0.08] bg-white/80">
          <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-black text-white">
                <span className="font-inter-tight text-xs font-extrabold tracking-tight">
                  PC
                </span>
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
            </div>

            <p className="text-xs font-semibold text-black/40">
              © {new Date().getFullYear()} PitchChat
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { BlobMorphBackground } from "@/components/backgrounds";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function PrivacyPage() {
  usePageTitle("Privacy Policy");

  return (
    <div className="min-h-screen bg-white font-inter-tight text-black selection:bg-black selection:text-white">
      <nav className="fixed top-0 z-50 w-full border-b border-black/[0.08] bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="group flex items-center gap-3">
            <Logo size="lg" className="rounded-xl border border-black/10 bg-white p-1.5 shadow-[0_1px_0_rgba(0,0,0,0.06)]" />
            <span className="font-inter-tight text-[15px] font-semibold tracking-tight">
              PitchChat
            </span>
          </a>
          <Button
            variant="ghost"
            className="h-10 rounded-xl px-4 text-sm font-semibold text-black/70 hover:bg-black/[0.04] hover:text-black"
            asChild
          >
            <a href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </a>
          </Button>
        </div>
      </nav>

      <main className="pt-28 space-y-6 px-4 sm:px-6 lg:px-8">
        <section className="section-card-typeless bg-section-gray rounded-[32px] animate-fade-in-up relative overflow-hidden">
          <BlobMorphBackground />
          <div className="section-card-inner py-16 px-8 md:px-12 text-center relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/70">
              Legal
            </div>
            <h1 className="mt-6 font-inter-tight text-[42px] font-semibold leading-[1.05] tracking-[-0.03em] text-black sm:text-[64px]">
              Privacy Policy
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-[17px] leading-[1.6] text-black/60">
              This policy explains how PitchChat collects, uses, and protects your
              information.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
              Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
        </section>

        <section className="section-card-typeless bg-white rounded-[32px]">
          <div className="section-card-inner max-w-4xl space-y-10 text-black/70">
            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                1. Scope
              </h2>
              <p className="text-[15px] leading-[1.7]">
                This Privacy Policy describes how we collect, use, and share information
                when you use PitchChat. It applies to our website, app, and related
                services.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                2. Information we collect
              </h2>
              <ul className="list-disc space-y-2 pl-5 text-[15px]">
                <li>Account data: name, email, password, and authentication details.</li>
                <li>Content: documents, links, messages, and project data you upload.</li>
                <li>Usage data: log data, device info, pages viewed, and feature usage.</li>
                <li>Communications: support requests, feedback, and surveys.</li>
                <li>Billing data: billing details processed by our payment provider.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                3. Sources of information
              </h2>
              <p className="text-[15px] leading-[1.7]">
                We collect information directly from you, automatically through your
                use of the service, and from integrations you connect.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                4. How we use information
              </h2>
              <p className="text-[15px] leading-[1.7]">
                We use information to provide and improve the service, personalize your
                experience, process payments, send transactional messages, and maintain
                security and compliance.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                5. Legal bases (EEA/UK)
              </h2>
              <p className="text-[15px] leading-[1.7]">
                If you are in the EEA or UK, we process data based on contract necessity,
                legitimate interests, legal obligations, and your consent where required.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                6. Sharing & disclosures
              </h2>
              <p className="text-[15px] leading-[1.7]">
                We do not sell your personal data. We share data with service providers
                who help operate PitchChat, such as cloud hosting, analytics, email
                delivery, AI processing, and payment processing. We may also share
                information to comply with law or protect our rights.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                7. International transfers
              </h2>
              <p className="text-[15px] leading-[1.7]">
                Your information may be processed outside your country. Where required,
                we use appropriate safeguards such as standard contractual clauses.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                8. Data retention
              </h2>
              <p className="text-[15px] leading-[1.7]">
                We retain data for as long as needed to provide the service and meet
                legal obligations. You can request deletion of your account data.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                9. Security
              </h2>
              <p className="text-[15px] leading-[1.7]">
                We implement technical and organizational measures to protect your data.
                No system is perfectly secure; please use strong passwords and keep
                credentials confidential.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                10. Cookies & tracking
              </h2>
              <p className="text-[15px] leading-[1.7]">
                We use cookies and similar technologies for authentication, preferences,
                and analytics. You can control cookies through your browser settings.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                11. Your rights
              </h2>
              <p className="text-[15px] leading-[1.7]">
                Depending on your location, you may have rights to access, correct,
                delete, restrict, or export your personal data, and to object to certain
                processing. Contact us at support@pitchchat.ai to exercise these rights.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                12. Children's privacy
              </h2>
              <p className="text-[15px] leading-[1.7]">
                PitchChat is not intended for children under 13. We do not knowingly
                collect information from children.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                13. Changes to this policy
              </h2>
              <p className="text-[15px] leading-[1.7]">
                We may update this policy from time to time. We will post updates and,
                where required, provide additional notice.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                14. Contact
              </h2>
              <p className="text-[15px] leading-[1.7]">
                For privacy questions or requests, contact us at support@pitchchat.ai.
              </p>
            </div>
          </div>
        </section>

        <section className="section-card-typeless bg-section-cream rounded-[32px] animate-fade-in-up">
          <div className="section-card-inner max-w-4xl">
            <div className="rounded-3xl border border-black/10 bg-white p-8 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                Company information
              </h2>
              <div className="mt-4 grid gap-3 text-[15px] text-black/70 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">Company</p>
                  <p className="mt-1 font-semibold text-black">VFSOFT BG EOOD</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">EIK</p>
                  <p className="mt-1 font-semibold text-black">206728740</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">Town</p>
                  <p className="mt-1 font-semibold text-black">Sofia</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">Address</p>
                  <p className="mt-1 font-semibold text-black">
                    BULGARIA, Sofia, Triaditsa district, VITOSHA, 48, GROUND FLOOR
                  </p>
                </div>
              </div>
              <p className="mt-6 text-[13px] text-black/50">
                If you have questions about this policy, contact us at support@pitchchat.ai.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

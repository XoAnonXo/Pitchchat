import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { BlobMorphBackground } from "@/components/backgrounds";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function TermsPage() {
  usePageTitle("Terms & Conditions");

  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
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
              Terms & Conditions
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-[17px] leading-[1.6] text-black/60">
              These terms govern your use of PitchChat. By accessing or using the
              service, you agree to the terms below.
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
                1. Definitions
              </h2>
              <p className="text-[15px] leading-[1.7]">
                "PitchChat," "we," "us," and "our" refer to VFSOFT BG EOOD. "You" and "your"
                refer to the individual or entity using the service. "Content" means
                all documents, data, and materials you upload or provide.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                2. Eligibility & account registration
              </h2>
              <p className="text-[15px] leading-[1.7]">
                You must be at least 18 years old and able to form a binding contract.
                You are responsible for providing accurate account information and
                keeping it up to date.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                3. Account security
              </h2>
              <p className="text-[15px] leading-[1.7]">
                You are responsible for safeguarding your login credentials and for
                all activity that occurs under your account. Notify us promptly if
                you suspect unauthorized access.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                4. Service description
              </h2>
              <p className="text-[15px] leading-[1.7]">
                PitchChat converts your documents into AI-powered pitch rooms, links,
                and analytics. The service may evolve, and features may change, be
                added, or removed.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                5. Acceptable use
              </h2>
              <p className="text-[15px] leading-[1.7]">
                You agree not to misuse the service, upload unlawful content, or
                interfere with normal operation.
              </p>
              <ul className="list-disc space-y-2 pl-5 text-[15px]">
                <li>Do not upload content you do not have the rights to use.</li>
                <li>Do not attempt to reverse engineer, probe, or disrupt the platform.</li>
                <li>Do not use the service for unlawful, harmful, or fraudulent activity.</li>
                <li>Do not scrape or automate access beyond documented limits.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                6. Content & intellectual property
              </h2>
              <p className="text-[15px] leading-[1.7]">
                You retain ownership of your Content. You grant us a limited license
                to host, process, and display Content solely to provide the service.
                We own the PitchChat software, design, and trademarks.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                7. Integrations & third-party services
              </h2>
              <p className="text-[15px] leading-[1.7]">
                If you connect third-party services, their terms and privacy policies
                apply. We are not responsible for third-party services or content.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                8. Payments, billing & taxes
              </h2>
              <p className="text-[15px] leading-[1.7]">
                Paid plans are billed in advance at the prices shown at checkout.
                You authorize us or our payment processor to charge your payment
                method. Taxes may apply based on your location.
              </p>
              <p className="text-[15px] leading-[1.7]">
                You can cancel at any time; access remains until the end of the billing
                period. Unless required by law, fees are non-refundable.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                9. Free plans & usage limits
              </h2>
              <p className="text-[15px] leading-[1.7]">
                Free and trial tiers may include limits on storage, usage, or features.
                Limits are described in-product and may change with notice.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                10. Service availability & changes
              </h2>
              <p className="text-[15px] leading-[1.7]">
                We aim for reliable service but do not guarantee uninterrupted access.
                We may suspend service for maintenance or security reasons.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                11. Feedback
              </h2>
              <p className="text-[15px] leading-[1.7]">
                If you provide feedback, you grant us permission to use it without
                restriction or compensation.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                12. Termination & suspension
              </h2>
              <p className="text-[15px] leading-[1.7]">
                We may suspend or terminate accounts for violations of these terms,
                suspected abuse, or legal compliance. You may stop using the service
                at any time.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                13. Disclaimers
              </h2>
              <p className="text-[15px] leading-[1.7]">
                PitchChat is provided "as is" and "as available" without warranties of
                any kind, express or implied, including merchantability or fitness for
                a particular purpose.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                14. Limitation of liability
              </h2>
              <p className="text-[15px] leading-[1.7]">
                To the maximum extent permitted by law, we are not liable for indirect,
                incidental, special, or consequential damages, or loss of profits, data,
                or goodwill.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                15. Indemnification
              </h2>
              <p className="text-[15px] leading-[1.7]">
                You agree to indemnify and hold us harmless from claims arising from
                your use of the service or your Content.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                16. Governing law
              </h2>
              <p className="text-[15px] leading-[1.7]">
                These terms are governed by the laws of Bulgaria.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                17. Changes to terms
              </h2>
              <p className="text-[15px] leading-[1.7]">
                We may update these terms from time to time. We will post updates
                and, where required, provide additional notice.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="font-inter-tight text-[22px] font-semibold tracking-[-0.02em] text-black">
                18. Contact
              </h2>
              <p className="text-[15px] leading-[1.7]">
                For questions about these terms, contact us at support@pitchchat.ai.
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
                If you have questions about these terms, contact us at support@pitchchat.ai.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

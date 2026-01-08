import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";

import { CookieConsent } from "@/components/CookieConsent";
import { PseoFooter } from "@/components/pseo/PseoFooter";
import { PseoHeader } from "@/components/pseo/PseoHeader";
import { PseoOrganizationSchema } from "@/components/pseo/PseoOrganizationSchema";
import { PseoScrollTracker } from "@/components/pseo/PseoScrollTracker";
import { PseoTimeTracker } from "@/components/pseo/PseoTimeTracker";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pitchchat Investor Questions",
  description: "Investor-ready guidance for founders raising seed and Series A rounds.",
  metadataBase: new URL(getSiteUrl()),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="en">
      <head>
        <PseoOrganizationSchema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {gaId ? (
          <>
            {/* Google Consent Mode v2 - default to denied */}
            <Script
              id="gtag-consent-default"
              strategy="beforeInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('consent', 'default', {
                    'analytics_storage': 'denied',
                    'ad_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied',
                    'wait_for_update': 500
                  });
                `,
              }}
            />
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        ) : null}
        <PseoHeader />
        <div id="main-content" className="min-h-screen">
          {children}
        </div>
        <PseoFooter />
        <CookieConsent />
        <PseoScrollTracker />
        <PseoTimeTracker />
      </body>
    </html>
  );
}

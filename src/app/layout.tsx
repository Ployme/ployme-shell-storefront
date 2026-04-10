import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import Script from "next/script";
import { THIRD_PARTY_SCRIPTS } from "@/lib/integrations/third-party-scripts";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
});

const instrumentSans = Instrument_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oliveto — Oils with origin.",
  description:
    "Small-batch olive oils from trusted producers. An editorial storefront by Oliveto.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${instrumentSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        {children}
        {THIRD_PARTY_SCRIPTS.map((s) => (
          <Script
            key={s.id}
            id={s.id}
            src={s.src}
            strategy={s.strategy ?? "afterInteractive"}
            dangerouslySetInnerHTML={
              s.inline ? { __html: s.inline } : undefined
            }
          />
        ))}
      </body>
    </html>
  );
}

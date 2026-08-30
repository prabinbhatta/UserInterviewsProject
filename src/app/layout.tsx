import type { Metadata } from "next";
import { Fraunces, Manrope, IBM_Plex_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "./LanguageProvider";
import { PageviewTracker } from "./PageviewTracker";
import type { Lang } from "@/lib/i18n";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const TITLE = "PanelMeet";
const DESCRIPTION = "PanelMeet connects Nepali companies with research participants.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: TITLE,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const initialLang: Lang = cookieStore.get("lang")?.value === "ne" ? "ne" : "en";

  return (
    <html
      lang={initialLang}
      className={`${fraunces.variable} ${manrope.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <PageviewTracker />
        <LanguageProvider initialLang={initialLang}>{children}</LanguageProvider>
      </body>
    </html>
  );
}

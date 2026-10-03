import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/ReduxProvider";
import { AuthInit } from "@/components/AuthInit";
import GlobalNavbar from "@/components/GlobalNavbar";
import GlobalFooter from "@/components/GlobalFooter";
import FeedbackWidget from "@/components/FeedbackWidget";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Toaster } from 'sonner';
import { headers } from 'next/headers';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://learntok.in'),
  title: {
    default: "LearnTok | Find people who've already done it",
    template: "%s | LearnTok",
  },
  description: "LearnTok is the best platform to discover real, authentic experiences from people who've already done what you're trying to do. Share knowledge, get advice, and learn from others on LearnTok.",
  keywords: ["LearnTok", "real experiences", "mentorship", "learning", "career advice", "moving abroad", "how to"],
  authors: [{ name: "LearnTok" }],
  creator: "LearnTok",
  publisher: "LearnTok",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://learntok.in",
    siteName: "LearnTok",
    title: "LearnTok | Find people who've already done it",
    description: "Discover real experiences from people who've already done what you're trying to do on LearnTok.",
    images: [
      {
        url: "/og-image.png", // Add an og-image.png to your public folder
        width: 1200,
        height: 630,
        alt: "LearnTok - Real Experiences",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LearnTok | Find people who've already done it",
    description: "Discover real experiences from people who've already done what you're trying to do on LearnTok.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nonce = (await headers()).get('x-nonce') ?? undefined;

  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#fdfaf6] text-black antialiased min-h-screen flex flex-col`} nonce={nonce}>
        <ReduxProvider>
          <AuthInit>
            <GlobalNavbar />
            <div className="flex-1 flex flex-col">
              {children}
            </div>
            <GlobalFooter />
            <FeedbackWidget />
          </AuthInit>
        </ReduxProvider>
        <Toaster position="bottom-right" richColors />
        <SpeedInsights />
      </body>
    </html>
  );
}

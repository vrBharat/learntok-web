import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/ReduxProvider";
import { AuthInit } from "@/components/AuthInit";
import GlobalNavbar from "@/components/GlobalNavbar";
import GlobalFooter from "@/components/GlobalFooter";
import FeedbackWidget from "@/components/FeedbackWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LearnTok | Find people who've already done it",
  description: "Discover real experiences from people who've already done what you're trying to do.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#fdfaf6] text-black antialiased min-h-screen flex flex-col`}>
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
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "@/store/ReduxProvider";
import { AuthInit } from "@/components/AuthInit";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LearnTok | Short-form Educational Content",
  description: "Learn anything in seconds with AI-powered short educational videos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-text-primary antialiased`}>
        <ReduxProvider>
          <AuthInit>
            {children}
          </AuthInit>
        </ReduxProvider>
      </body>
    </html>
  );
}

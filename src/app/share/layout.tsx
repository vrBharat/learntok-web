import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Share Your Experience',
  description: "Share what worked and what didn't. Help others navigate career changes, moving abroad, learning, and life milestones on LearnTok.",
  alternates: {
    canonical: '/share',
  },
};

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

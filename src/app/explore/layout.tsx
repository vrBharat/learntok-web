import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore Experiences',
  description: "Browse and discover real, authentic experiences and stories shared by people who've already done what you're trying to do.",
  alternates: {
    canonical: '/explore',
  },
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

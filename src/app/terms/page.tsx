import React from 'react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#fdfaf6] text-black font-sans w-full flex flex-col items-center pb-24">
      <div className="w-full max-w-2xl px-4 py-16 flex flex-col gap-8">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tighter border-b-2 border-black pb-4 mb-4">
          TERMS AND CONDITIONS
        </h1>
        
        <p className="font-mono text-sm text-gray-600 mb-8">
          Last Updated: September 25, 2026
        </p>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tighter">1. USER CONDUCT & CONTENT RULES</h2>
          <p className="font-mono text-sm leading-relaxed text-gray-800">
            LearnTalk is a platform built for sharing authentic, helpful, and real-life experiences. To maintain the quality of the platform, you agree NOT to post any content that:
          </p>
          <ul className="list-disc list-inside space-y-2 font-mono text-sm pl-4 text-gray-800">
            <li>Contains adult, sexually explicit, or NSFW material.</li>
            <li>Contains misleading information, scams, or malicious links.</li>
            <li>Promotes hate speech, harassment, or discrimination.</li>
            <li>Is designed purely for SEO spam, self-promotion, or selling a course ("guru" spam).</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tighter">2. RIGHT TO REMOVE CONTENT</h2>
          <p className="font-mono text-sm leading-relaxed text-gray-800">
            We reserve the right, at our sole discretion, to remove, edit, or block any content or user account that violates these terms without prior notice. If you post adult content or spam, your account will be permanently banned.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold tracking-tighter">3. LIABILITY</h2>
          <p className="font-mono text-sm leading-relaxed text-gray-800">
            Experiences shared on LearnTalk are the personal anecdotes of the users. They do not constitute professional, legal, or financial advice. We are not liable for any outcomes resulting from following advice found on this platform. Verify all critical information (e.g., visa requirements, legal processes) with official authorities.
          </p>
        </section>

        <div className="mt-12 pt-8 border-t-2 border-black flex flex-col gap-4">
          <p className="font-mono text-xs text-gray-500">
            By continuing to use LearnTalk, you agree to these terms.
          </p>
          <Link href="/" className="text-blue-600 font-bold font-mono text-sm hover:underline">
            ← BACK TO HOME
          </Link>
        </div>
      </div>
    </div>
  );
}

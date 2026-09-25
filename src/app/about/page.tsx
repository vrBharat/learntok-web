import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fdfaf6] text-black font-sans w-full flex flex-col items-center pb-24">
      <div className="w-full max-w-2xl px-4 py-16 flex flex-col gap-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter border-b-2 border-black pb-4 mb-4">
          ABOUT LEARNTOK
        </h1>
        
        <p className="text-xl font-mono text-gray-800 leading-relaxed">
          The internet is broken. If you try to figure out how to do something hard—move to a new country, switch careers, start a business—you're immediately flooded by SEO spam, generic AI articles, and "gurus" trying to sell you a $999 course.
        </p>

        <p className="text-xl font-mono text-gray-800 leading-relaxed">
          We believe the best way to figure out how to do something is to talk to someone who just did it.
        </p>

        <div className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] my-8">
          <h2 className="font-bold text-2xl tracking-tighter mb-4">OUR MANIFESTO</h2>
          <ul className="list-disc list-inside space-y-4 font-mono text-sm">
            <li><strong>No Gurus:</strong> We don't want "experts." We want normal people who recently figured it out.</li>
            <li><strong>No Generic Advice:</strong> "Work hard and network" is useless. "I emailed the hiring manager at 8am on a Tuesday and attached a Figma redesign of their homepage" is useful.</li>
            <li><strong>Transparency:</strong> We want to know how long it actually took and how much it actually cost.</li>
            <li><strong>Real Timelines:</strong> Show us the rejections. Show us the messy middle. Show us what went wrong.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/explore" className="flex-1 text-center py-4 bg-black text-white font-bold border-2 border-black hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none">
            READ EXPERIENCES
          </Link>
          <Link href="/share" className="flex-1 text-center py-4 bg-[#0000FF] text-white font-bold border-2 border-black hover:bg-blue-800 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none">
            SHARE YOUR STORY
          </Link>
        </div>

      </div>
    </div>
  );
}

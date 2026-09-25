import React from 'react';
import Link from 'next/link';

export default function GlobalFooter() {
  return (
    <footer className="w-full border-t border-black bg-[#fdfaf6] mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col items-center text-center gap-4">
        <svg width="140" height="32" viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="68" height="32" fill="black"/>
          <text x="34" y="22" fill="white" fontSize="16" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">LEARN</text>
          <rect x="68" y="0" width="72" height="32" fill="transparent" stroke="black" strokeWidth="4"/>
          <text x="104" y="22" fill="black" fontSize="16" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">TOK</text>
        </svg>
        <p className="font-mono text-xs text-gray-600">real experiences. real people.</p>
        
        <nav className="flex items-center gap-4 font-mono text-xs mt-2 flex-wrap justify-center">
          <Link href="/explore" className="hover:underline text-blue-600">Explore</Link>
          <Link href="/share" className="hover:underline text-blue-600">Share</Link>
          <Link href="/about" className="hover:underline text-blue-600">About</Link>
          <Link href="/terms" className="hover:underline text-blue-600">Terms & Conditions</Link>
        </nav>

        <div className="text-[10px] text-gray-400 font-mono mt-4">
          built for people figuring things out.
        </div>
      </div>
    </footer>
  );
}

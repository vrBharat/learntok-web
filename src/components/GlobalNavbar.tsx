'use client';

import React from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { logout } from '@/store/slices/authSlice';

export default function GlobalNavbar() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <header className="w-full border-b border-black bg-[#fdfaf6]">
      <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-y-4">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
          <svg width="140" height="32" viewBox="0 0 140 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="68" height="32" fill="black"/>
            <text x="34" y="22" fill="white" fontSize="16" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">LEARN</text>
            <rect x="68" y="0" width="72" height="32" fill="transparent" stroke="black" strokeWidth="4"/>
            <text x="104" y="22" fill="black" fontSize="16" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="1">TALK</text>
          </svg>
        </Link>

        <nav className="flex items-center gap-4 md:gap-6 font-mono text-xs md:text-sm order-3 w-full md:w-auto md:order-none justify-center md:justify-start border-t border-black md:border-none pt-3 md:pt-0">
          <Link href="/explore" className="hover:underline text-blue-600">Explore</Link>
          <Link href="/share" className="hover:underline text-blue-600">Share</Link>
          <Link href="/about" className="hover:underline text-blue-600">About</Link>
        </nav>

        <div className="flex items-center gap-4 font-mono text-xs md:text-sm">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link href={`/u/${user?.username}`} className="hover:underline text-black font-bold">
                @{user?.username}
              </Link>
              <button onClick={() => dispatch(logout())} className="hover:underline text-gray-500">
                [Logout]
              </button>
            </div>
          ) : (
            <Link href="/auth/login" className="hover:underline font-bold text-black border border-black px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-px active:translate-x-px active:shadow-none bg-white transition-all">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

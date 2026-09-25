import React from 'react';
import Link from 'next/link';
import { ExperienceData } from '@/services/firebase/experiences';

export default function ExperienceCard({ experience }: { experience: ExperienceData }) {
  const { id, title, author, category, origin, destination, duration, cost, year, quote } = experience;
  
  return (
    <div className="border border-black bg-white p-4 md:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-gray-600 mb-4 pb-4 border-b border-gray-200">
        {origin && destination && (
          <>
            <span className="font-bold text-black uppercase">{origin} → {destination}</span>
            <span>•</span>
          </>
        )}
        <span>{category}</span>
        <span>•</span>
        <span>{year}</span>
      </div>
      
      <p className="text-xl font-bold mb-2">
        {title}
      </p>
      
      {quote && (
        <p className="text-sm font-mono text-gray-700 italic mb-4 pl-4 border-l-2 border-gray-300">
          "{quote}"
        </p>
      )}

      <div className="flex flex-wrap items-center gap-6 font-mono text-sm mb-6 mt-4">
        <div className="flex flex-col gap-1">
          <span className="text-gray-500 text-[10px] uppercase">Duration</span>
          <span>{duration}</span>
        </div>
        {cost && (
          <div className="flex flex-col gap-1">
            <span className="text-gray-500 text-[10px] uppercase">Cost</span>
            <span>{cost}</span>
          </div>
        )}
        <div className="flex flex-col gap-1">
          <span className="text-gray-500 text-[10px] uppercase">By</span>
          <Link href={`/u/${author}`} className="hover:underline text-blue-600">
            @{author}
          </Link>
        </div>
      </div>
      
      <Link href={`/experience/${id}`}>
        <button className="text-sm font-bold border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">
          READ EXPERIENCE →
        </button>
      </Link>
    </div>
  );
}

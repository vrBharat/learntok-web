'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import ExperienceCard from '@/components/ExperienceCard';
import { getExperiences, ExperienceData } from '@/services/firebase/experiences';

  import { useRouter } from 'next/navigation';

  export default function Home() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [recentExperiences, setRecentExperiences] = useState<ExperienceData[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchRecent = async () => {
        setIsLoading(true);
        const data = await getExperiences(3);
        setRecentExperiences(data);
        setIsLoading(false);
      };
      fetchRecent();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        router.push('/explore');
      }
    };

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-8 md:py-16 flex flex-col gap-16 md:gap-24">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center gap-6 mt-4 md:mt-8">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight max-w-3xl">
          find someone who's already been where you're going.
        </h1>
        <p className="text-base md:text-xl font-mono text-gray-700 max-w-2xl px-2">
          Real experiences from people who've actually done the thing.
        </p>

        <form onSubmit={handleSearch} className="w-full max-w-2xl mt-4 md:mt-8 flex flex-col gap-3">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-4 w-5 h-5 text-gray-500" />
            <input 
              type="text" 
              placeholder="What are you trying to do?"
              className="w-full border-2 border-black bg-white py-3 md:py-4 pl-12 pr-4 text-base md:text-lg outline-none focus:ring-4 focus:ring-blue-500/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            className="w-full md:w-auto self-center mt-4 py-3 px-8 bg-[#0000FF] text-white font-bold border-2 border-black hover:bg-blue-800 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none"
          >
            FIND EXPERIENCES →
          </button>
          <p className="text-xs font-mono text-gray-500 mt-2 md:mt-4 px-4">
            no gurus. no generic advice. just real experiences.
          </p>
        </form>
      </section>

      {/* Categories Section */}
      <section className="w-full">
        <h2 className="text-xl font-bold tracking-tighter border-b-2 border-black pb-2 mb-6">
          people are figuring out...
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 font-mono text-sm">
          <Link href="/explore?c=career" className="flex items-center justify-between hover:bg-gray-100 p-2 -mx-2 group">
            <span className="group-hover:underline text-blue-600">CAREER</span>
            <span className="text-gray-500 text-xs">1,248 experiences</span>
          </Link>
          <Link href="/explore?c=moving" className="flex items-center justify-between hover:bg-gray-100 p-2 -mx-2 group">
            <span className="group-hover:underline text-blue-600">MOVING</span>
            <span className="text-gray-500 text-xs">823 experiences</span>
          </Link>
          <Link href="/explore?c=education" className="flex items-center justify-between hover:bg-gray-100 p-2 -mx-2 group">
            <span className="group-hover:underline text-blue-600">EDUCATION</span>
            <span className="text-gray-500 text-xs">741 experiences</span>
          </Link>
          <Link href="/explore?c=business" className="flex items-center justify-between hover:bg-gray-100 p-2 -mx-2 group">
            <span className="group-hover:underline text-blue-600">BUSINESS</span>
            <span className="text-gray-500 text-xs">602 experiences</span>
          </Link>
          <Link href="/explore?c=languages" className="flex items-center justify-between hover:bg-gray-100 p-2 -mx-2 group">
            <span className="group-hover:underline text-blue-600">LANGUAGES</span>
            <span className="text-gray-500 text-xs">542 experiences</span>
          </Link>
          <Link href="/explore?c=freelancing" className="flex items-center justify-between hover:bg-gray-100 p-2 -mx-2 group">
            <span className="group-hover:underline text-blue-600">FREELANCING</span>
            <span className="text-gray-500 text-xs">499 experiences</span>
          </Link>
        </div>
      </section>

      {/* Featured Experiences */}
      <section className="w-full">
        <h2 className="text-xl font-bold tracking-tighter border-b-2 border-black pb-2 mb-6">
          recently lived
        </h2>
        <div className="flex flex-col gap-6">
          {isLoading ? (
            <div className="font-mono text-sm text-gray-500">Loading recent experiences...</div>
          ) : recentExperiences.length > 0 ? (
            recentExperiences.map(exp => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))
          ) : (
            <div className="p-8 border-2 border-dashed border-gray-300 text-center font-mono text-gray-500">
              No recent experiences found. Share your journey!
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

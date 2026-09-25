'use client';

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import ExperienceCard from '@/components/ExperienceCard';
import { getExperiences, ExperienceData } from '@/services/firebase/experiences';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExperiences = async () => {
      setIsLoading(true);
      const data = await getExperiences(50);
      setExperiences(data);
      setIsLoading(false);
    };
    fetchExperiences();

    // Read search query from URL if present
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');
      const c = params.get('c'); // Handle category click from homepage
      
      if (q) setSearchQuery(q);
      else if (c) setSearchQuery(c);
    }
  }, []);

  const filteredExperiences = experiences.filter(exp => 
    exp.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    exp.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-black font-sans w-full flex flex-col items-center">
      <div className="w-full max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold border-b-2 border-black pb-2 mb-8 tracking-tighter">
          SEARCH EXPERIENCES
        </h1>

        <div className="relative flex items-center w-full mb-4">
          <Search className="absolute left-4 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="What are you trying to do?"
            className="w-full border-2 border-black bg-white py-4 pl-12 pr-4 text-lg outline-none focus:ring-4 focus:ring-blue-500/20 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-mono"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <p className="font-mono text-sm text-gray-600 mb-12">
          {isLoading ? 'Loading...' : `${filteredExperiences.length} experiences found`}
        </p>

        <div className="flex flex-col gap-8">
          {filteredExperiences.map(exp => (
            <ExperienceCard key={exp.id} experience={exp} />
          ))}
          {!isLoading && filteredExperiences.length === 0 && (
            <div className="p-8 border-2 border-dashed border-gray-300 text-center font-mono text-gray-500">
              No experiences found. Be the first to share one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { use, useEffect, useState } from 'react';
import ExperienceCard from '@/components/ExperienceCard';
import { getExperiencesByUsername, ExperienceData } from '@/services/firebase/experiences';

export default function UserProfile({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const decodedUsername = decodeURIComponent(resolvedParams.username);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserExperiences = async () => {
      const data = await getExperiencesByUsername(decodedUsername);
      setExperiences(data);
      setIsLoading(false);
    };
    fetchUserExperiences();
  }, [decodedUsername]);

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-black font-sans w-full flex flex-col items-center pb-24">
      <div className="w-full max-w-3xl px-4 py-12">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-black pb-8 mb-12 gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold tracking-tighter">@{decodedUsername}</h1>
            <p className="font-mono text-gray-600">LearnTok Contributor</p>
          </div>
          
          <div className="flex gap-4 font-mono text-sm">
            <div className="flex flex-col items-center">
              <span className="font-bold text-xl">{isLoading ? '-' : experiences.length}</span>
              <span className="text-gray-500 text-xs">EXPERIENCES</span>
            </div>
          </div>
        </div>

        {/* User's Experiences */}
        <section className="w-full mb-16">
          <h2 className="text-xl font-bold tracking-tighter bg-black text-white px-3 py-1 self-start inline-block mb-6">
            EXPERIENCES BY @{decodedUsername}
          </h2>
          <div className="flex flex-col gap-6">
            {isLoading ? (
              <p className="font-mono text-sm text-gray-500">Loading...</p>
            ) : experiences.length > 0 ? (
              experiences.map(exp => (
                <ExperienceCard key={exp.id} experience={exp} />
              ))
            ) : (
              <p className="font-mono text-sm text-gray-500 italic">No experiences shared yet.</p>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

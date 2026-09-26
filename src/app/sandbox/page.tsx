import React from 'react';
import ShareableExperienceCard from '@/components/ShareableExperienceCard';

export default function SandboxPage() {
  return (
    <div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center p-8">
      <div className="w-full">
        <h1 className="text-black font-mono text-3xl font-bold mb-8 text-center tracking-tighter">Share Card Demo</h1>
        <ShareableExperienceCard 
          userName="Alice Developer"
          experienceTitle="How I landed my first frontend job in 6 months without a degree"
          keyTakeaway="Focus on building 3 high-quality projects instead of 10 generic ones. The depth of your understanding matters more than quantity."
        />
      </div>
    </div>
  );
}

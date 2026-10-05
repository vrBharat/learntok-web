'use client';
import { logger } from '@/lib/logger';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addExperience } from '@/services/firebase/experiences';
import { toast } from 'sonner';

export default function SharePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Basic form state for Phase 3
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    goal: '',
    duration: '',
    cost: '',
    whatWorked: '',
    whatDidnt: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast.error("You must be logged in to share an experience.");
      router.push('/auth/login');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const year = new Date().getFullYear().toString();
      await addExperience({
        ...formData,
        author: user.username,
        year: year
      }, user.id);
      toast.success('Experience published successfully!');
      router.push('/explore');
    } catch (err) {
      logger.error(err);
      toast.error('Failed to publish experience.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-black font-sans w-full flex flex-col items-center pb-24">
      <div className="w-full max-w-2xl px-4 py-12">
        <h1 className="text-4xl font-bold border-b-2 border-black pb-4 mb-2 tracking-tighter">
          SHARE AN EXPERIENCE
        </h1>
        <p className="font-mono text-sm text-gray-600 mb-12">
          No generic advice. Tell us what you actually did.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          
          {/* Basic Info */}
          <section className="flex flex-col gap-6">
            <h2 className="text-xl font-bold tracking-tighter bg-black text-white px-3 py-1 self-start">1. THE BASICS</h2>
            
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Title</label>
              <input 
                type="text" 
                placeholder="e.g. I moved from India to Germany as a developer"
                className="w-full border-2 border-black bg-white p-3 font-mono text-sm outline-none focus:ring-4 focus:ring-blue-500/20"
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">Category</label>
              <select 
                className="w-full border-2 border-black bg-white p-3 font-mono text-sm outline-none focus:ring-4 focus:ring-blue-500/20"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                required
              >
                <option value="">Select a category</option>
                <option value="Career">Career</option>
                <option value="Moving">Moving</option>
                <option value="Education">Education</option>
                <option value="Business">Business</option>
                <option value="Languages">Languages</option>
              </select>
            </div>
          </section>

          {/* The Goal */}
          <section className="flex flex-col gap-6">
            <h2 className="text-xl font-bold tracking-tighter bg-black text-white px-3 py-1 self-start">2. THE GOAL</h2>
            
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">What were you trying to achieve?</label>
              <textarea 
                placeholder="Be specific."
                className="w-full border-2 border-black bg-white p-3 font-mono text-sm min-h-[100px] outline-none focus:ring-4 focus:ring-blue-500/20"
                value={formData.goal}
                onChange={e => setFormData({...formData, goal: e.target.value})}
                required
              />
            </div>
          </section>

          {/* Quick Facts */}
          <section className="flex flex-col gap-6">
            <h2 className="text-xl font-bold tracking-tighter bg-black text-white px-3 py-1 self-start">3. THE DETAILS</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">How long did it take?</label>
                <input 
                  type="text" 
                  placeholder="e.g. 6 months"
                  className="w-full border-2 border-black bg-white p-3 font-mono text-sm outline-none focus:ring-4 focus:ring-blue-500/20"
                  value={formData.duration}
                  onChange={e => setFormData({...formData, duration: e.target.value})}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-sm">How much did it cost? (Optional)</label>
                <input 
                  type="text" 
                  placeholder="e.g. €5,200"
                  className="w-full border-2 border-black bg-white p-3 font-mono text-sm outline-none focus:ring-4 focus:ring-blue-500/20"
                  value={formData.cost}
                  onChange={e => setFormData({...formData, cost: e.target.value})}
                />
              </div>
            </div>
          </section>

          {/* Deep Dive */}
          <section className="flex flex-col gap-6">
            <h2 className="text-xl font-bold tracking-tighter bg-black text-white px-3 py-1 self-start">4. DEEP DIVE</h2>
            
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">What Worked?</label>
              <textarea 
                placeholder="Share the strategies, resources, or decisions that actually helped you."
                className="w-full border-2 border-black bg-white p-3 font-mono text-sm min-h-[120px] outline-none focus:ring-4 focus:ring-blue-500/20"
                value={formData.whatWorked}
                onChange={e => setFormData({...formData, whatWorked: e.target.value})}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm">What Didn't Work? (Mistakes to avoid)</label>
              <textarea 
                placeholder="What failures or roadblocks did you face? What do you wish you knew earlier?"
                className="w-full border-2 border-black bg-white p-3 font-mono text-sm min-h-[120px] outline-none focus:ring-4 focus:ring-blue-500/20"
                value={formData.whatDidnt}
                onChange={e => setFormData({...formData, whatDidnt: e.target.value})}
              />
            </div>
          </section>

          <button 
            type="submit" 
            className="w-full py-4 bg-[#0000FF] text-white font-bold border-2 border-black hover:bg-blue-800 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none text-lg mt-4"
          >
            PUBLISH EXPERIENCE
          </button>
        </form>
      </div>
    </div>
  );
}

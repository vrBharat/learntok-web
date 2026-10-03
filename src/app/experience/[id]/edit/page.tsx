'use client';
import { logger } from '@/lib/logger';
import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getExperienceById, updateExperience, ExperienceData } from '@/services/firebase/experiences';
import { toast } from 'sonner';

export default function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { isAuthenticated, user, isInitialized } = useSelector((state: RootState) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    goal: '',
    duration: '',
    cost: '',
  });

  useEffect(() => {
    const fetchExp = async () => {
      const data = await getExperienceById(resolvedParams.id);
      if (data) {
        if (data.userId !== user?.id) {
          toast.error("You are not authorized to edit this experience.");
          router.push(`/experience/${resolvedParams.id}`);
          return;
        }
        setFormData({
          title: data.title || '',
          category: data.category || '',
          goal: data.goal || '',
          duration: data.duration || '',
          cost: data.cost || '',
        });
      } else {
        toast.error("Experience not found.");
        router.push('/explore');
      }
      setIsLoading(false);
    };
    
    if (isInitialized) {
      if (!isAuthenticated) {
        toast.error("You must be logged in to edit an experience.");
        router.push('/auth/login');
      } else {
        fetchExp();
      }
    }
  }, [resolvedParams.id, isInitialized, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) {
      toast.error("You must be logged in to edit an experience.");
      router.push('/auth/login');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await updateExperience(resolvedParams.id, {
        ...formData
      });
      toast.success('Experience updated successfully!');
      router.push(`/experience/${resolvedParams.id}`);
    } catch (err) {
      logger.error(err);
      toast.error('Failed to update experience.');
      setIsSubmitting(false);
    }
  };

  if (isLoading || !isInitialized) {
    return <div className="min-h-screen bg-[#fdfaf6] flex justify-center items-center font-mono">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-black font-sans w-full flex flex-col items-center pb-24">
      <div className="w-full max-w-2xl px-4 py-12">
        <h1 className="text-4xl font-bold border-b-2 border-black pb-4 mb-2 tracking-tighter uppercase">
          EDIT EXPERIENCE
        </h1>
        <p className="font-mono text-sm text-gray-600 mb-12">
          Update your experience details.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          
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

          <div className="flex gap-4 mt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex-1 py-4 bg-[#0000FF] text-white font-bold border-2 border-black hover:bg-blue-800 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none text-lg disabled:opacity-50"
            >
              {isSubmitting ? 'UPDATING...' : 'SAVE CHANGES'}
            </button>
            <button 
              type="button" 
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="px-8 py-4 bg-white text-black font-bold border-2 border-black hover:bg-gray-100 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none text-lg disabled:opacity-50"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

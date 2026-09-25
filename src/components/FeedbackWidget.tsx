'use client';

import React, { useState } from 'react';
import { submitFeedback } from '@/services/firebase/feedback';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { usePathname } from 'next/navigation';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'feedback' | 'bug'>('feedback');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const pathname = usePathname();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await submitFeedback({
        type,
        message,
        userId: user?.id,
        username: user?.username,
        email: user?.email,
        path: pathname,
      });
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setMessage('');
      }, 3000);
    } catch (error) {
      console.error(error);
      alert('Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="bg-white border-2 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-80 font-mono flex flex-col gap-4">
          <div className="flex justify-between items-center border-b-2 border-black pb-2 mb-2">
            <h3 className="font-bold text-lg">Send Feedback</h3>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-black font-bold"
            >
              ✕
            </button>
          </div>

          {submitted ? (
            <div className="text-green-600 font-bold py-4 text-center">
              Thanks! We received it.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex gap-4">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input 
                    type="radio" 
                    name="type" 
                    value="feedback" 
                    checked={type === 'feedback'} 
                    onChange={() => setType('feedback')}
                    className="accent-black"
                  />
                  Idea/Feedback
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input 
                    type="radio" 
                    name="type" 
                    value="bug" 
                    checked={type === 'bug'} 
                    onChange={() => setType('bug')}
                    className="accent-black"
                  />
                  Bug Report
                </label>
              </div>

              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={type === 'feedback' ? "How was your experience? Any ideas?" : "What's broken? Please describe."}
                className="w-full h-24 border-2 border-black p-2 text-sm outline-none focus:ring-4 focus:ring-blue-500/20 resize-none"
                required
              />

              <button 
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full bg-black text-white font-bold py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'SENDING...' : 'SEND'}
              </button>
            </form>
          )}
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-[#0000FF] text-white font-mono font-bold text-sm px-4 py-3 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-[2px] active:translate-x-[2px] active:shadow-none transition-all flex items-center gap-2"
        >
          <span>💬</span> FEEDBACK
        </button>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { getExperienceById, deleteExperience, ExperienceData } from '@/services/firebase/experiences';
import { getQuestionsForExperience, addQuestion, replyToQuestion, QuestionData } from '@/services/firebase/questions';

export default function ExperienceDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [experience, setExperience] = useState<ExperienceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Q&A State
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const fetchExp = async () => {
      const data = await getExperienceById(resolvedParams.id);
      setExperience(data);
      if (data) {
        const qData = await getQuestionsForExperience(resolvedParams.id);
        setQuestions(qData);
      }
      setIsLoading(false);
    };
    fetchExp();
  }, [resolvedParams.id]);

  const handleAskQuestion = async () => {
    if (!isAuthenticated || !user) {
      alert("You must be logged in to ask a question.");
      router.push('/auth/login');
      return;
    }
    if (!newQuestionText.trim()) return;

    setIsSubmittingQuestion(true);
    try {
      const qId = await addQuestion(resolvedParams.id, user.id, user.username, newQuestionText);
      setQuestions([...questions, {
        id: qId,
        experienceId: resolvedParams.id,
        askerUsername: user.username,
        text: newQuestionText
      }]);
      setNewQuestionText('');
    } catch (err) {
      console.error(err);
      alert("Failed to ask question. Remember to check Firebase console if an index is required!");
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  const handleDeleteExperience = async () => {
    if (confirm("Are you sure you want to delete this experience? This action cannot be undone.")) {
      try {
        await deleteExperience(resolvedParams.id);
        alert("Experience deleted.");
        router.push('/explore');
      } catch (err) {
        console.error(err);
        alert("Failed to delete experience.");
      }
    }
  };

  const handleReply = async (questionId: string) => {
    if (!replyText.trim()) return;
    try {
      await replyToQuestion(questionId, replyText);
      setQuestions(questions.map(q => q.id === questionId ? { ...q, reply: replyText } : q));
      setReplyingToId(null);
      setReplyText('');
    } catch (err) {
      console.error(err);
      alert("Failed to post reply.");
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#fdfaf6] flex justify-center items-center font-mono">Loading...</div>;
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] flex flex-col justify-center items-center font-mono gap-4">
        <div>Experience not found.</div>
        <Link href="/explore" className="text-blue-600 underline">Go back</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf6] text-black font-sans w-full flex flex-col items-center pb-24">
      <div className="w-full max-w-3xl px-4 py-12">
        
        {/* Breadcrumb */}
        <div className="font-mono text-[10px] md:text-xs text-gray-500 mb-6 md:mb-8 tracking-widest uppercase flex flex-wrap gap-1">
          <Link href="/explore" className="hover:underline text-blue-600">EXPLORE</Link> 
          <span>/</span> 
          <span className="truncate max-w-[150px] md:max-w-none">{experience.category}</span> 
          <span>/</span> 
          <span>EXPERIENCE</span>
        </div>

        {/* Header */}
        <div className="mb-8 md:mb-12 border-b-2 border-black pb-6 md:pb-8">
          <div className="flex justify-between items-start gap-4 mb-4 md:mb-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter leading-tight">
              {experience.title}
            </h1>
            {isAuthenticated && user?.id === experience.userId && (
              <button 
                onClick={handleDeleteExperience}
                className="py-2 px-4 bg-red-600 text-white font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none whitespace-nowrap uppercase tracking-widest"
              >
                Delete
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 md:gap-x-6 gap-y-2 font-mono text-xs md:text-sm">
            <Link href={`/u/${experience.author}`} className="font-bold text-blue-600 hover:underline">@{experience.author}</Link>
            <span className="text-gray-400 hidden sm:inline">|</span>
            {experience.origin && experience.destination ? (
              <span className="uppercase">{experience.origin} → {experience.destination}</span>
            ) : (
              <span className="uppercase">{experience.category}</span>
            )}
            <span className="text-gray-400 hidden sm:inline">|</span>
            <span>{experience.year}</span>
          </div>
        </div>

        <div className="flex flex-col gap-12">
          
          {/* THE GOAL */}
          {experience.goal && (
            <section>
              <h2 className="text-xl font-bold tracking-tighter mb-4 inline-block border-b border-black">THE GOAL</h2>
              <p className="text-lg whitespace-pre-wrap">{experience.goal}</p>
            </section>
          )}


          {/* QUICK FACTS */}
          <section className="bg-white border-2 border-black p-6 font-mono text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="font-bold text-lg mb-4 font-sans tracking-tighter">THE DETAILS</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-gray-500 text-xs block mb-1">COST</span>
                <span className="font-bold">{experience.cost || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500 text-xs block mb-1">TIME TAKEN</span>
                <span className="font-bold">{experience.duration || 'N/A'}</span>
              </div>
            </div>
          </section>

          {/* Q&A */}
          <section className="mt-12 pt-12 border-t border-dashed border-gray-400">
            <h2 className="text-2xl font-bold tracking-tighter mb-2">QUESTIONS?</h2>
            <p className="text-sm font-mono text-gray-600 mb-6">Ask @{experience.author} about this experience.</p>
            
            <div className="flex flex-col gap-4 max-w-lg mb-10">
              <textarea 
                className="w-full border-2 border-black bg-white p-3 font-mono text-sm min-h-[100px] outline-none focus:ring-4 focus:ring-blue-500/20"
                placeholder="What do you want to know?"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                disabled={isSubmittingQuestion}
              />
              <button 
                onClick={handleAskQuestion}
                disabled={isSubmittingQuestion || !newQuestionText.trim()}
                className="self-start py-2 px-6 bg-black text-white font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all disabled:opacity-50"
              >
                {isSubmittingQuestion ? 'ASKING...' : 'ASK QUESTION'}
              </button>
            </div>

            <div className="flex flex-col gap-6">
              {questions.length === 0 ? (
                <p className="font-mono text-sm text-gray-500 italic">No questions yet. Be the first to ask!</p>
              ) : (
                questions.map((q) => (
                  <div key={q.id} className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Link href={`/u/${q.askerUsername}`} className="font-mono text-xs font-bold hover:underline">@{q.askerUsername} asked:</Link>
                        {q.askerUsername === experience.author && (
                          <span className="bg-black text-white text-[10px] px-1.5 py-0.5 font-bold tracking-wider font-mono">AUTHOR</span>
                        )}
                      </div>
                    </div>
                    <p className="font-sans text-sm mb-4 font-bold">"{q.text}"</p>

                    {q.reply ? (
                      <div className="pl-4 border-l-4 border-blue-500 mt-4 pt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <Link href={`/u/${experience.author}`} className="font-mono text-xs font-bold text-blue-600 hover:underline">
                            @{experience.author} replied:
                          </Link>
                          <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 font-bold tracking-wider font-mono">AUTHOR</span>
                        </div>
                        <p className="text-sm text-gray-800 font-mono whitespace-pre-wrap">{q.reply}</p>
                      </div>
                    ) : (
                      isAuthenticated && user?.username === experience.author && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          {replyingToId === q.id ? (
                            <div className="flex flex-col gap-2">
                              <textarea 
                                className="w-full border-2 border-black p-2 font-mono text-sm"
                                placeholder="Type your reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                              />
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleReply(q.id!)}
                                  className="py-1 px-4 bg-[#0000FF] text-white font-bold text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none"
                                >
                                  POST REPLY
                                </button>
                                <button 
                                  onClick={() => { setReplyingToId(null); setReplyText(''); }}
                                  className="py-1 px-4 bg-white text-black font-bold text-xs border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none"
                                >
                                  CANCEL
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button 
                              onClick={() => setReplyingToId(q.id!)}
                              className="text-xs font-bold text-blue-600 hover:underline font-mono uppercase"
                            >
                              Reply to this question
                            </button>
                          )}
                        </div>
                      )
                    )}
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

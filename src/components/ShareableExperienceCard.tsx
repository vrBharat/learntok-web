"use client";

import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Share2, Download, Check } from "lucide-react";
import Image from "next/image";

interface ShareableExperienceCardProps {
  userName: string;
  userAvatar?: string;
  experienceTitle: string;
  keyTakeaway: string;
}

export default function ShareableExperienceCard({
  userName,
  userAvatar,
  experienceTitle,
  keyTakeaway,
}: ShareableExperienceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setIsGenerating(true);
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `learntok-${userName.replace(/\s+/g, '-').toLowerCase()}-experience.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate image", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      setIsGenerating(true);
      const dataUrl = await toPng(cardRef.current, { quality: 1, pixelRatio: 2 });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "learntok-experience.png", { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: experienceTitle,
          text: `Check out this experience by ${userName} on LearnTok!`,
          files: [file],
        });
      } else {
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to share", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto">
      {/* The Card to be captured */}
      <div
        ref={cardRef}
        className="w-full aspect-[4/5] relative bg-[#ccff00] border-4 border-black p-5 sm:p-6 md:p-8 flex flex-col justify-between"
        style={{
          boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)"
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-4 z-10">
          <div className="w-14 h-14 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            {userAvatar ? (
              <Image 
                src={userAvatar} 
                alt={userName} 
                width={56} 
                height={56} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#0000ff] flex items-center justify-center text-white font-bold text-xl">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-black font-bold text-lg leading-none">{userName}</h3>
            <p className="text-black font-mono text-xs mt-1 uppercase font-bold">Lived this</p>
          </div>
        </div>

        {/* Content */}
        <div className="z-10 mt-8 flex-grow flex flex-col justify-center gap-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black leading-tight tracking-tighter">
            "{experienceTitle}"
          </h2>
          <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-black font-mono text-sm leading-relaxed">
              {keyTakeaway}
            </p>
          </div>
        </div>

        {/* Footer / Branding */}
        <div className="z-10 mt-6 md:mt-8 pt-4 border-t-4 border-black flex justify-between items-end">
          <div className="font-black text-black text-xl sm:text-2xl md:text-3xl tracking-tighter">
            learntok<span className="text-[#0000ff]">.</span>
          </div>
          <p className="text-black font-mono text-[10px] sm:text-xs font-bold bg-white border-2 border-black px-1.5 py-0.5 sm:px-2 sm:py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            learntok.in
          </p>
        </div>
      </div>

      {/* Action Buttons (Not included in image) */}
      <div className="flex gap-3 sm:gap-4 w-full mt-4">
        <button
          onClick={handleShare}
          disabled={isGenerating}
          className="flex-1 flex items-center justify-center gap-2 bg-[#0000ff] text-white border-2 border-black py-3 px-4 sm:px-6 font-bold transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none disabled:opacity-70 cursor-pointer font-mono text-sm sm:text-base"
        >
          {copied ? <Check size={18} /> : <Share2 size={18} />}
          {copied ? "COPIED!" : "SHARE CARD"}
        </button>
        <button
          onClick={handleDownload}
          disabled={isGenerating}
          className="flex items-center justify-center p-3 sm:p-3 bg-white text-black border-2 border-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-1 hover:translate-x-1 hover:shadow-none cursor-pointer"
          title="Download Image"
        >
          <Download size={20} />
        </button>
      </div>
    </div>
  );
}

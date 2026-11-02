import React, { useState, useEffect } from 'react';
import { BirthdayConfig, THEME_CONFIGS } from '../types';
import { RotateCcw, Heart, Sparkles, Check } from 'lucide-react';

interface MessageCardProps {
  config: BirthdayConfig;
}

export const MessageCard: React.FC<MessageCardProps> = ({ config }) => {
  const theme = THEME_CONFIGS[config.theme];
  const fullText = config.message || `Happy Birthday ${config.name}! Wishing you the brightest year ahead!`;

  const [displayedLength, setDisplayedLength] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  // Typewriter effect
  useEffect(() => {
    setDisplayedLength(0);
    setIsTyping(true);

    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayedLength(index);
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 28);

    return () => clearInterval(interval);
  }, [fullText]);

  const handleReplay = () => {
    setDisplayedLength(0);
    setIsTyping(true);
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayedLength(index);
      if (index >= fullText.length) {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 28);
  };

  const handleShowAll = () => {
    setDisplayedLength(fullText.length);
    setIsTyping(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-10">
      {/* Container styled like a letter / memo on desk */}
      <div className="relative bg-[#fffdfa] rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-amber-100/80 transform rotate-[-0.5deg]">
        {/* Washi Tape Accent at Top */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-pink-200/80 backdrop-blur-xs rounded-xs shadow-xs -rotate-2 border-y border-pink-300/40 pointer-events-none" />

        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-amber-100/60 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-rose-500" />
            </span>
            <div>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">A Special Message</p>
              <p className="text-[11px] text-slate-500">From the heart, written for {config.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isTyping ? (
              <button
                type="button"
                onClick={handleShowAll}
                className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg bg-slate-100 transition-colors"
              >
                Skip typing
              </button>
            ) : (
              <button
                type="button"
                onClick={handleReplay}
                className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                title="Replay typewriter"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Replay</span>
              </button>
            )}
          </div>
        </div>

        {/* Handwritten Animated Message Content */}
        <div className="min-h-[140px] flex flex-col justify-between">
          <p className="font-handwriting text-2xl sm:text-3xl text-slate-800 leading-relaxed tracking-wide whitespace-pre-wrap">
            {fullText.slice(0, displayedLength)}
            {isTyping && (
              <span className="inline-block w-1.5 h-6 bg-pink-500 ml-1 animate-pulse align-middle" />
            )}
          </p>

          {!isTyping && (
            <div className="mt-8 pt-4 border-t border-dashed border-amber-100 flex items-center justify-between text-xs text-slate-400">
              <span className="font-handwriting text-xl text-slate-600">
                Forever cheering for you ✨
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-pink-600 font-medium">
                <Check className="w-3 h-3 stroke-[3]" />
                <span>Message delivered</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

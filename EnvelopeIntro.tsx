import React, { useState } from 'react';
import { BirthdayConfig, THEME_CONFIGS } from '../types';
import { audioEngine } from '../utils/audio';
import { confettiEngine } from '../utils/confetti';
import { Sparkles, Heart } from 'lucide-react';

interface EnvelopeIntroProps {
  config: BirthdayConfig;
  onOpenComplete: () => void;
}

export const EnvelopeIntro: React.FC<EnvelopeIntroProps> = ({ config, onOpenComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = THEME_CONFIGS[config.theme];

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    audioEngine.playChime();
    confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.45, 90, theme.candleColors);

    // Auto complete after card emerges
    window.setTimeout(() => {
      onOpenComplete();
    }, 1400);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br ${theme.gradientBg} select-none overflow-hidden`}>
      {/* Background ambient decorative shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-12 left-10 w-48 h-48 rounded-full bg-pink-200/50 blur-3xl" />
        <div className="absolute bottom-12 right-10 w-64 h-64 rounded-full bg-amber-200/50 blur-3xl" />
      </div>

      <div className="relative flex flex-col items-center max-w-sm w-full">
        {/* Envelope Container with 3D perspective */}
        <div
          onClick={handleOpen}
          className="relative w-80 h-56 sm:w-96 sm:h-64 cursor-pointer group"
          style={{ perspective: '1000px' }}
        >
          {/* Card that slides out of envelope */}
          <div
            className={`absolute inset-x-4 top-4 bottom-4 bg-white rounded-2xl shadow-md border border-slate-100 flex flex-col items-center justify-center p-6 text-center transition-all duration-700 ease-out z-10 ${
              isOpen ? '-translate-y-28 opacity-100 scale-105 shadow-xl' : 'translate-y-0 opacity-0 scale-95'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mb-2">
              <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
            <p className="text-xs uppercase font-bold tracking-wider text-slate-400">A special surprise for</p>
            <h2 className="text-2xl font-black text-slate-900 font-display mt-0.5">{config.name}</h2>
            <p className="text-xs font-medium text-pink-600 mt-2 flex items-center gap-1">
              <span>Opening your birthday bash</span>
              <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
            </p>
          </div>

          {/* Envelope Back Base */}
          <div className="absolute inset-0 bg-gradient-to-b from-rose-200 via-rose-300 to-pink-400 rounded-3xl shadow-2xl border border-white/40 z-0" />

          {/* Envelope Side Flaps */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-20" viewBox="0 0 384 256" fill="none">
            {/* Left triangle */}
            <path d="M0 0 L192 140 L0 256 Z" fill="rgba(244, 114, 182, 0.92)" />
            {/* Right triangle */}
            <path d="M384 0 L192 140 L384 256 Z" fill="rgba(251, 113, 133, 0.92)" />
            {/* Bottom triangle */}
            <path d="M0 256 L192 125 L384 256 Z" fill="rgba(244, 63, 94, 0.95)" />
          </svg>

          {/* Envelope Top Flap (animated fold open) */}
          <div
            className="absolute top-0 inset-x-0 h-32 origin-top transition-transform duration-700 ease-in-out z-30"
            style={{
              transformStyle: 'preserve-3d',
              transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0deg)',
            }}
          >
            <svg className="w-full h-full drop-shadow-md" viewBox="0 0 384 130" fill="none">
              <path
                d="M0 0 L192 128 L384 0 Z"
                fill="rgb(253, 164, 175)"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="1.5"
              />
            </svg>
          </div>

          {/* Wax Seal Stamp (Centered on envelope front before open) */}
          <div
            className={`absolute top-24 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 transition-all duration-500 flex flex-col items-center ${
              isOpen ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100 scale-100 group-hover:scale-105'
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 shadow-lg shadow-amber-900/30 border-2 border-amber-100 flex items-center justify-center p-1 cursor-pointer">
              <div className="w-full h-full rounded-full border border-amber-600/40 flex items-center justify-center flex-col">
                <Sparkles className="w-4 h-4 text-amber-950" />
                <span className="text-[9px] font-black tracking-tighter uppercase text-amber-950">OPEN</span>
              </div>
            </div>
            <div className="mt-2 py-0.5 px-3 rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-slate-100 text-[11px] font-bold text-slate-800 whitespace-nowrap animate-bounce">
              Tap to open 💌
            </div>
          </div>
        </div>

        {/* Outer instructions */}
        <div className="mt-8 text-center">
          <p className="text-sm font-semibold text-slate-700">
            You received a special greeting!
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Tap the envelope to reveal the celebration
          </p>
        </div>
      </div>
    </div>
  );
};

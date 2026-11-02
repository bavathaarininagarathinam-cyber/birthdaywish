import React, { useState } from 'react';
import { BirthdayConfig, THEME_CONFIGS } from '../types';
import { encodeConfigToUrl } from '../utils/storage';
import { MusicToggle } from './MusicToggle';
import { Share2, Edit3, Check, Sparkles, PartyPopper, Heart } from 'lucide-react';

interface HeroSectionProps {
  config: BirthdayConfig;
  onEdit: () => void;
  onScrollToCake: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ config, onEdit, onScrollToCake }) => {
  const theme = THEME_CONFIGS[config.theme];
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = encodeConfigToUrl(config);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback for older browsers
        const input = document.createElement('input');
        input.value = url;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Prompt fallback
      window.prompt('Copy this surprise link to share with friends:', url);
    }
  };

  return (
    <header className="relative w-full pt-4 pb-12 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center">
      {/* Top action toolbar (sticky/clean, respects thumb zones & single line rules) */}
      <div className="w-full flex items-center justify-between gap-3 pb-8 pt-2">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-white flex items-center justify-center shadow-xs">
            <PartyPopper className="w-4 h-4" />
          </span>
          <span className="font-display font-extrabold text-sm sm:text-base text-slate-800 tracking-tight whitespace-nowrap">
            Birthday Surprise
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MusicToggle />

          <button
            type="button"
            onClick={handleShare}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white ring-2 ring-emerald-300'
                : 'bg-white/90 backdrop-blur-sm text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
            }`}
            title="Copy shareable link"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span className="whitespace-nowrap">Link copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span className="whitespace-nowrap">Share</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium text-slate-600 hover:text-slate-900 bg-white/70 hover:bg-white border border-slate-200 transition-colors cursor-pointer"
            title="Edit birthday details"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline whitespace-nowrap">Edit details</span>
          </button>
        </div>
      </div>

      {/* Main Hero Header */}
      <div className="text-center flex flex-col items-center max-w-3xl mx-auto mt-4">
        {/* Playful Pill Subtitle */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider shadow-xs mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>A Special Celebration For Someone Wonderful</span>
        </div>

        {/* Big Animated Headline */}
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-tight text-slate-900 leading-[1.08] text-balance">
          Happy Birthday,{' '}
          <span className={`bg-gradient-to-r ${theme.heroGradient} bg-clip-text text-transparent`}>
            {config.name}!
          </span>{' '}
          🎉
        </h1>

        {/* Big Glowing Age Display */}
        <div className="my-8 flex flex-col items-center">
          <div className="relative inline-flex items-center justify-center">
            {/* Ambient Radial Glow */}
            <div className={`absolute -inset-6 bg-gradient-to-r ${theme.heroGradient} rounded-full blur-2xl opacity-30`} />

            {/* Glowing Big Age Number */}
            <div className="relative px-8 py-3 rounded-3xl bg-white/90 backdrop-blur-md border border-slate-100 shadow-xl shadow-slate-200/50 flex items-baseline gap-2">
              <span className={`font-mono font-black text-6xl sm:text-8xl tabular-nums tracking-tighter bg-gradient-to-br ${theme.heroGradient} bg-clip-text text-transparent animate-glow-pulse`}>
                {config.age}
              </span>
              <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-400">
                YEARS OLD
              </span>
            </div>
          </div>

          <p className="font-handwriting text-2xl sm:text-3xl text-slate-700 font-semibold mt-4">
            Turning {config.age} never looked so brilliant ✨
          </p>
        </div>

        {/* Quick jump to cake button */}
        <button
          type="button"
          onClick={onScrollToCake}
          className={`mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm shadow-md shadow-pink-500/20 ${theme.primary} ${theme.primaryHover} hover:scale-105 active:scale-95 transition-all cursor-pointer`}
        >
          <span>Blow Out Your Candles</span>
          <span>🎂</span>
        </button>
      </div>
    </header>
  );
};

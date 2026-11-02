import React, { useState, useEffect } from 'react';
import { BirthdayConfig, THEME_CONFIGS } from '../types';
import { audioEngine } from '../utils/audio';
import { confettiEngine } from '../utils/confetti';
import { Sparkles, Flame, Wind, RotateCcw, PartyPopper } from 'lucide-react';

interface BirthdayCakeProps {
  config: BirthdayConfig;
}

export const BirthdayCake: React.FC<BirthdayCakeProps> = ({ config }) => {
  const theme = THEME_CONFIGS[config.theme];
  const maxCandles = Math.min(Math.max(config.age, 1), 20);

  // Candles state: array of boolean (true = lit, false = blown out)
  const [candles, setCandles] = useState<boolean[]>(() => Array(maxCandles).fill(true));
  const [hasStartedWish, setHasStartedWish] = useState(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState(false);

  // When config.age changes, update candles
  useEffect(() => {
    setCandles(Array(maxCandles).fill(true));
    setHasStartedWish(false);
    setShowCelebrationModal(false);
  }, [maxCandles]);

  const litCount = candles.filter(Boolean).length;
  const allBlownOut = litCount === 0;

  const handleStartWish = () => {
    setHasStartedWish(true);
    audioEngine.playChime();
  };

  const handleBlowCandle = (index: number) => {
    if (!candles[index]) return; // already blown

    audioEngine.playBlow();

    const updated = [...candles];
    updated[index] = false;
    setCandles(updated);

    const remaining = updated.filter(Boolean).length;
    if (remaining === 0) {
      // All candles blown!
      window.setTimeout(() => {
        audioEngine.playCelebration();
        confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.45, 120, theme.candleColors);
        confettiEngine.startRain(4000, theme.candleColors);
        setShowCelebrationModal(true);
      }, 350);
    }
  };

  const handleBlowAll = () => {
    audioEngine.playBlow();
    setCandles(Array(maxCandles).fill(false));
    window.setTimeout(() => {
      audioEngine.playCelebration();
      confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.45, 120, theme.candleColors);
      confettiEngine.startRain(4000, theme.candleColors);
      setShowCelebrationModal(true);
    }, 400);
  };

  const handleRelight = () => {
    audioEngine.playChime();
    setCandles(Array(maxCandles).fill(true));
    setShowCelebrationModal(false);
    setHasStartedWish(false);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Status & Instruction Pill */}
      <div className="mb-6 text-center">
        {!hasStartedWish ? (
          <button
            type="button"
            onClick={handleStartWish}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm shadow-lg ${theme.primary} ${theme.primaryHover} hover:scale-105 active:scale-95 transition-all cursor-pointer`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Make a Wish & Blow Candles</span>
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-100 text-amber-900 text-xs font-bold shadow-sm">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>
                {allBlownOut
                  ? 'All candles blown out!'
                  : `Tap each flame to blow it out (${litCount} left)`}
              </span>
            </span>

            {!allBlownOut && (
              <button
                type="button"
                onClick={handleBlowAll}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Wind className="w-3.5 h-3.5 text-slate-500" />
                <span>Blow All at Once</span>
              </button>
            )}

            {allBlownOut && (
              <button
                type="button"
                onClick={handleRelight}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Relight</span>
              </button>
            )}
          </div>
        )}

        <p className="text-xs text-slate-500 mt-2">
          {config.age > 20
            ? `Showing 20 candles for ${config.name}'s ${config.age} glorious years ✨`
            : `${maxCandles} candle${maxCandles > 1 ? 's' : ''} for ${config.name}'s special day ✨`}
        </p>
      </div>

      {/* SVG Illustrated Cake */}
      <div className="relative w-full max-w-md h-72 sm:h-80 select-none">
        {/* SVG Cake Structure */}
        <svg viewBox="0 0 400 320" className="w-full h-full drop-shadow-xl" fill="none">
          {/* Cake Stand / Plate */}
          <ellipse cx="200" cy="285" rx="180" ry="24" fill="#cbd5e1" />
          <ellipse cx="200" cy="282" rx="170" ry="20" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
          <path d="M170 285 L160 312 L240 312 L230 285 Z" fill="#94a3b8" />
          <ellipse cx="200" cy="312" rx="45" ry="6" fill="#64748b" />

          {/* Bottom Cake Layer */}
          <path
            d="M60 210 C60 235 340 235 340 210 L340 260 C340 280 60 280 60 260 Z"
            fill="#fed7aa"
          />
          <ellipse cx="200" cy="210" rx="140" ry="26" fill="#ffedd5" />

          {/* Bottom Layer Frosting Drips */}
          <path
            d="M60 210 Q 75 230, 90 212 Q 110 240, 130 212 Q 155 242, 175 212 Q 200 245, 225 212 Q 250 240, 275 212 Q 295 238, 315 212 Q 330 228, 340 210"
            fill="none"
            stroke="#f472b6"
            strokeWidth="8"
            strokeLinecap="round"
          />

          {/* Middle Cake Layer */}
          <path
            d="M85 145 C85 170 315 170 315 145 L315 195 C315 215 85 215 85 195 Z"
            fill="#fbcfe8"
          />
          <ellipse cx="200" cy="145" rx="115" ry="22" fill="#fdf2f8" />

          {/* Middle Layer Frosting Pattern */}
          <path
            d="M85 145 Q 105 168, 125 148 Q 145 172, 165 148 Q 185 174, 205 148 Q 225 172, 245 148 Q 265 170, 285 148 Q 300 162, 315 145"
            fill="none"
            stroke="#fb7185"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Top Cake Layer */}
          <path
            d="M110 90 C110 112 290 112 290 90 L290 135 C290 152 110 152 110 135 Z"
            fill="#fef08a"
          />
          <ellipse cx="200" cy="90" rx="90" ry="18" fill="#fef9c3" />

          {/* Top Layer Cream Frosting border */}
          <path
            d="M110 90 Q 125 106, 140 92 Q 155 108, 170 92 Q 185 110, 200 92 Q 215 110, 230 92 Q 245 108, 260 92 Q 275 106, 290 90"
            fill="none"
            stroke="#fbbf24"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Sprinkles on top */}
          <rect x="140" y="86" width="6" height="2.5" rx="1" fill="#ec4899" transform="rotate(15 140 86)" />
          <rect x="175" y="92" width="6" height="2.5" rx="1" fill="#3b82f6" transform="rotate(-30 175 92)" />
          <rect x="220" y="85" width="6" height="2.5" rx="1" fill="#10b981" transform="rotate(25 220 85)" />
          <rect x="250" y="94" width="6" height="2.5" rx="1" fill="#8b5cf6" transform="rotate(-15 250 94)" />
          <rect x="190" y="98" width="6" height="2.5" rx="1" fill="#f97316" transform="rotate(40 190 98)" />
          <rect x="160" y="95" width="6" height="2.5" rx="1" fill="#e11d48" transform="rotate(-20 160 95)" />
        </svg>

        {/* Candles Container (Interactive HTML Overlay positioned directly on top cake tier) */}
        <div className="absolute top-10 inset-x-6 sm:inset-x-12 h-24 flex items-end justify-center pointer-events-none">
          <div className="flex items-end justify-center gap-1 sm:gap-1.5 w-full max-w-[280px]">
            {candles.map((isLit, idx) => {
              const candleColor = theme.candleColors[idx % theme.candleColors.length];
              return (
                <div
                  key={idx}
                  onClick={() => handleBlowCandle(idx)}
                  className="pointer-events-auto cursor-pointer flex flex-col items-center group relative transition-transform duration-200 hover:-translate-y-1"
                  title={isLit ? 'Click to blow out candle!' : 'Blown out'}
                >
                  {/* Flame or Smoke */}
                  <div className="h-7 w-5 flex items-center justify-center relative">
                    {isLit ? (
                      <div className="relative animate-flicker">
                        {/* Glow halo */}
                        <div className="absolute -inset-1.5 bg-amber-400/50 rounded-full blur-xs" />
                        {/* Outer flame */}
                        <div className="w-3 h-5 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-full" />
                        {/* Inner blue/white core */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-2.5 bg-white rounded-full opacity-90" />
                      </div>
                    ) : (
                      /* Smoke puff */
                      <div className="animate-smoke flex flex-col items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400/80 mb-0.5" />
                        <div className="w-2.5 h-2.5 rounded-full bg-slate-300/60" />
                      </div>
                    )}
                  </div>

                  {/* Wick */}
                  <div className="w-0.5 h-1.5 bg-slate-700" />

                  {/* Candle Wax Body */}
                  <div
                    style={{ backgroundColor: candleColor }}
                    className="w-2 sm:w-2.5 h-9 sm:h-11 rounded-t-sm shadow-sm relative overflow-hidden"
                  >
                    {/* Diagonal stripes on candle */}
                    <div className="absolute inset-0 opacity-30 bg-stripes" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Celebration Modal when all candles are blown */}
      {showCelebrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 sm:p-8 text-center shadow-2xl border border-pink-100 animate-scale-up relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-pink-500 text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-pink-500/30 animate-bounce">
              <PartyPopper className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 font-display">
              Wish Made! ✨
            </h3>

            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              All {maxCandles} candles are blown out! May your secret wish take flight and come true this year, <strong className="text-slate-900 font-bold">{config.name}</strong>! 🎂💖
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setShowCelebrationModal(false)}
                className={`w-full py-3 px-4 rounded-xl text-white font-bold text-sm shadow-md ${theme.primary} ${theme.primaryHover} transition-all cursor-pointer`}
              >
                Continue Celebrating 🎉
              </button>
              <button
                type="button"
                onClick={handleRelight}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Relight Candles 🕯️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

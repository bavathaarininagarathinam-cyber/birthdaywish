import React, { useState, useEffect, useCallback } from 'react';
import { BalloonItem } from '../types';
import { audioEngine } from '../utils/audio';
import { confettiEngine } from '../utils/confetti';
import { Sparkles, X } from 'lucide-react';

interface BalloonsOverlayProps {
  friendName: string;
}

const FUN_WISHES = [
  'May your year be filled with spontaneous road trips and giant ice creams! 🍦',
  'Wishing you zero bad hair days and 365 days of good vibes! ✨',
  'May your coffee be strong and your Wi-Fi never buffer! ☕⚡',
  'May all your wildest dreams take flight this year! 🚀',
  'Here is to eating extra cake with zero guilt! 🎂🍰',
  'May your laughter echo in every room you enter! 😂💖',
  'May you find forgotten money in every coat pocket! 💸🎉',
  'Wishing you endless boba, cozy hoodies, and great playlists! 🧋🎶',
  'May your adventures be legendary and your naps truly restorative! 🛌⭐',
  'You deserve the whole universe today and every day! 🌟👑',
];

const BALLOON_PALETTES = [
  '#f43f5e', '#ec4899', '#8b5cf6', '#a855f7',
  '#06b6d4', '#0284c7', '#10b981', '#f59e0b', '#fbbf24'
];

export const BalloonsOverlay: React.FC<BalloonsOverlayProps> = ({ friendName }) => {
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);
  const [poppedCount, setPoppedCount] = useState(0);
  const [activeWish, setActiveWish] = useState<string | null>(null);

  // Initialize 7 floating balloons
  useEffect(() => {
    const initialBalloons: BalloonItem[] = Array.from({ length: 7 }, (_, i) => ({
      id: i + 1,
      x: 10 + (i * 12) + (Math.random() * 4),
      y: 110 + (i * 18), // below viewport initially
      speed: 0.18 + Math.random() * 0.14,
      color: BALLOON_PALETTES[i % BALLOON_PALETTES.length],
      size: 58 + Math.random() * 20,
      wish: FUN_WISHES[Math.floor(Math.random() * FUN_WISHES.length)],
      popped: false,
    }));
    setBalloons(initialBalloons);
  }, []);

  // Float animation loop
  useEffect(() => {
    let animId: number;
    const updatePositions = () => {
      setBalloons((prev) =>
        prev.map((b) => {
          if (b.popped) return b;
          let nextY = b.y - b.speed;
          // When balloon floats past top of screen, recycle to bottom
          if (nextY < -20) {
            nextY = 105;
            return {
              ...b,
              y: nextY,
              x: 8 + Math.random() * 80,
              color: BALLOON_PALETTES[Math.floor(Math.random() * BALLOON_PALETTES.length)],
              wish: FUN_WISHES[Math.floor(Math.random() * FUN_WISHES.length)],
            };
          }
          return { ...b, y: nextY };
        })
      );
      animId = requestAnimationFrame(updatePositions);
    };

    animId = requestAnimationFrame(updatePositions);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handlePop = useCallback(
    (e: React.MouseEvent, balloon: BalloonItem) => {
      e.stopPropagation();
      if (balloon.popped) return;

      audioEngine.playPop();
      confettiEngine.burst(e.clientX, e.clientY, 35, [balloon.color, '#ffffff', '#fbbf24']);

      setPoppedCount((c) => c + 1);
      setActiveWish(balloon.wish);

      // Mark as popped
      setBalloons((prev) =>
        prev.map((b) => (b.id === balloon.id ? { ...b, popped: true } : b))
      );

      // Respawn after 2.5s
      setTimeout(() => {
        setBalloons((prev) =>
          prev.map((b) =>
            b.id === balloon.id
              ? {
                  ...b,
                  popped: false,
                  y: 105,
                  x: 8 + Math.random() * 80,
                  color: BALLOON_PALETTES[Math.floor(Math.random() * BALLOON_PALETTES.length)],
                  wish: FUN_WISHES[Math.floor(Math.random() * FUN_WISHES.length)],
                }
              : b
          )
        );
      }, 2500);
    },
    []
  );

  return (
    <>
      {/* Floating balloons container (pointer-events-none on wrapper, auto on balloons) */}
      <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
        {balloons.map((b) => {
          if (b.popped) return null;
          return (
            <div
              key={b.id}
              onClick={(e) => handlePop(e, b)}
              style={{
                left: `${b.x}%`,
                top: `${b.y}%`,
                width: `${b.size}px`,
                height: `${b.size * 1.3}px`,
              }}
              className="absolute pointer-events-auto cursor-pointer animate-float-sway transition-transform duration-200 hover:scale-110 active:scale-95 group"
              title="Click to pop for a surprise wish!"
            >
              <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-md">
                {/* Dangle String */}
                <path
                  d="M50 85 Q 40 100, 52 115 T 48 130"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.8"
                  strokeDasharray="2,2"
                />
                {/* Balloon Knot */}
                <polygon
                  points="45,84 55,84 50,89"
                  fill={b.color}
                  filter="brightness(0.85)"
                />
                {/* Balloon Body */}
                <ellipse
                  cx="50"
                  cy="45"
                  rx="38"
                  ry="43"
                  fill={b.color}
                />
                {/* 3D Glossy Light Reflection */}
                <ellipse
                  cx="36"
                  cy="30"
                  rx="9"
                  ry="16"
                  fill="rgba(255, 255, 255, 0.45)"
                  transform="rotate(-20 36 30)"
                />
                <circle
                  cx="32"
                  cy="18"
                  r="3.5"
                  fill="rgba(255, 255, 255, 0.6)"
                />
              </svg>
            </div>
          );
        })}
      </div>

      {/* Floating Wish Banner Modal when a balloon is popped */}
      {activeWish && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md animate-bounce-in">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-pink-200 p-4 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-pink-500" />
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-pink-600 uppercase tracking-wider">
                <span>Balloon Wish Revealed!</span>
                <span>🎈</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 mt-0.5 leading-snug">
                {activeWish}
              </p>
            </div>
            <button
              onClick={() => setActiveWish(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tiny pop counter indicator in the corner */}
      {poppedCount > 0 && (
        <div className="fixed top-20 right-4 z-20 bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm rounded-full px-3 py-1 text-xs font-semibold text-slate-700 flex items-center gap-1.5 animate-fade-in">
          <span>🎈 Popped:</span>
          <span className="text-pink-600 font-bold">{poppedCount}</span>
        </div>
      )}
    </>
  );
};

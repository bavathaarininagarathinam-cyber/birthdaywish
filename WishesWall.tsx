import React, { useState, useEffect } from 'react';
import { BirthdayConfig, WishNote, THEME_CONFIGS } from '../types';
import { loadWishesFromStorage, saveWishesToStorage } from '../utils/storage';
import { audioEngine } from '../utils/audio';
import { confettiEngine } from '../utils/confetti';
import { Heart, Plus, Send, Sparkles, MessageSquareHeart } from 'lucide-react';

interface WishesWallProps {
  config: BirthdayConfig;
}

const STICKY_COLORS = [
  { name: 'Yellow', bg: '#fef08a', text: '#713f12', border: '#fde047' },
  { name: 'Peach', bg: '#fed7aa', text: '#7c2d12', border: '#fdba74' },
  { name: 'Mint', bg: '#bbf7d0', text: '#14532d', border: '#86efac' },
  { name: 'Lavender', bg: '#e9d5ff', text: '#581c87', border: '#d8b4fe' },
  { name: 'Sky', bg: '#bae6fd', text: '#0c4a6e', border: '#7dd3fc' },
];

const QUICK_INSPIRATIONS = [
  'Best human ever! 💖',
  'Cake calories do not count today! 🎂',
  'May all your wishes come true! ✨',
  'Stay radiant and true to yourself! 🌟',
];

export const WishesWall: React.FC<WishesWallProps> = ({ config }) => {
  const theme = THEME_CONFIGS[config.theme];
  const [wishes, setWishes] = useState<WishNote[]>([]);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState(STICKY_COLORS[0].bg);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loaded = loadWishesFromStorage();
    setWishes(loaded);
  }, []);

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newWish: WishNote = {
      id: `wish-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: author.trim() || 'A Secret Admirer',
      message: message.trim(),
      color: selectedColor,
      rotation: (Math.random() - 0.5) * 5, // -2.5 to +2.5 deg
      timestamp: Date.now(),
      likes: 1,
    };

    const updated = [newWish, ...wishes];
    setWishes(updated);
    saveWishesToStorage(updated);

    audioEngine.playChime();
    confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.6, 40);

    setAuthor('');
    setMessage('');
    setIsSubmitting(false);
  };

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playPop();
    const updated = wishes.map((w) => (w.id === id ? { ...w, likes: w.likes + 1 } : w));
    setWishes(updated);
    saveWishesToStorage(updated);
  };

  const handleQuickAdd = (text: string) => {
    setMessage((prev) => (prev ? `${prev} ${text}` : text));
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-2">
      {/* Section Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-slate-700 text-xs font-semibold mb-2 shadow-xs">
          <MessageSquareHeart className="w-3.5 h-3.5 text-pink-500" />
          <span>Community Guestbook</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          Wishes Wall for {config.name}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Leave a sweet note, funny memory, or celebration wish on the pinboard!
        </p>
      </div>

      {/* Add Wish Form Card */}
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 sm:p-7 shadow-lg shadow-slate-200/40 border border-slate-100 mb-8 max-w-xl mx-auto">
        <form onSubmit={handleAddWish} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="wish-author" className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Your Name
              </label>
              <input
                id="wish-author"
                type="text"
                placeholder="e.g. Jessica or Bestie"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                Note Color
              </label>
              <div className="flex items-center gap-2 pt-1">
                {STICKY_COLORS.map((col) => (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => setSelectedColor(col.bg)}
                    style={{ backgroundColor: col.bg, borderColor: col.border }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                      selectedColor === col.bg ? 'scale-125 shadow-sm ring-2 ring-slate-800' : 'hover:scale-110'
                    }`}
                    title={col.name}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="wish-message" className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
              Your Wish
            </label>
            <textarea
              id="wish-message"
              rows={2}
              required
              placeholder={`Write your birthday wish for ${config.name}...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            />
          </div>

          {/* Quick inspiration buttons */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-400">Quick ideas:</span>
            {QUICK_INSPIRATIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleQuickAdd(item)}
                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-md ${theme.primary} ${theme.primaryHover} transition-all flex items-center justify-center gap-2 cursor-pointer`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Pin Birthday Wish to Wall</span>
          </button>
        </form>
      </div>

      {/* Sticky Notes Grid (Pinboard) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {wishes.map((w) => (
          <div
            key={w.id}
            style={{
              backgroundColor: w.color,
              transform: `rotate(${w.rotation}deg)`,
            }}
            className="relative p-5 rounded-xl shadow-md border border-black/5 flex flex-col justify-between min-h-[160px] transition-transform hover:scale-105 hover:rotate-0 hover:shadow-xl hover:z-10 group"
          >
            {/* Pushpin at top center */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-rose-500 shadow-sm border border-white flex items-center justify-center pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
            </div>

            {/* Note text */}
            <p className="font-handwriting text-2xl text-slate-900 leading-snug pt-2 break-words">
              {w.message}
            </p>

            {/* Footer with author and like counter */}
            <div className="mt-4 pt-2 border-t border-black/10 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 truncate max-w-[130px]">
                — {w.author}
              </span>

              <button
                type="button"
                onClick={(e) => handleLike(w.id, e)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/60 hover:bg-white text-rose-600 transition-colors cursor-pointer text-xs font-semibold"
                title="Send love"
              >
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>{w.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { BirthdayConfig } from '../types';
import { Camera, Sparkles, X, Heart } from 'lucide-react';

interface PolaroidSectionProps {
  config: BirthdayConfig;
}

export const PolaroidSection: React.FC<PolaroidSectionProps> = ({ config }) => {
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <div className="w-full max-w-md mx-auto my-12 flex flex-col items-center">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-slate-200 text-slate-700 text-xs font-semibold mb-2 shadow-xs">
          <Camera className="w-3.5 h-3.5 text-pink-500" />
          <span>Captured Moments</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
          A Treasured Memory
        </h3>
      </div>

      {/* Polaroid Frame */}
      <div
        onClick={() => config.photoUrl && setIsZoomed(true)}
        className={`relative bg-white p-4 pb-8 rounded-xl shadow-xl shadow-slate-300/40 border border-slate-200/80 transition-all duration-300 select-none ${
          config.photoUrl
            ? 'rotate-2 hover:rotate-0 hover:scale-105 cursor-pointer group'
            : '-rotate-1 hover:rotate-0'
        }`}
        style={{ width: '310px' }}
      >
        {/* Pushpin / Tape graphic at top center */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-rose-500/90 shadow-md border-2 border-white flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-white/70 shadow-inner" />
          </div>
        </div>

        {/* Photo Container */}
        <div className="w-full h-72 bg-slate-100 rounded-sm overflow-hidden relative border border-slate-200/60 flex items-center justify-center">
          {config.photoUrl ? (
            <>
              <img
                src={config.photoUrl}
                alt={`Photo of ${config.name}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-3">
                <span className="text-[11px] font-semibold text-white bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-xs">
                  Click to enlarge
                </span>
              </div>
            </>
          ) : (
            /* Illustrated party snapshot placeholder if no photo was uploaded */
            <div className="w-full h-full bg-gradient-to-tr from-pink-100 via-rose-50 to-amber-100 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-pink-500 mb-3 animate-bounce">
                <Sparkles className="w-8 h-8" />
              </div>
              <p className="font-display font-bold text-slate-800 text-base">
                Celebrating {config.name}!
              </p>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
                To many more adventures, smiles, and unforgettable milestones!
              </p>
            </div>
          )}
        </div>

        {/* Polaroid Bottom Chin with handwritten marker caption */}
        <div className="mt-4 text-center">
          <p className="font-handwriting text-2xl text-slate-800 font-bold tracking-wide">
            {config.photoUrl ? `Memories with ${config.name} ✨` : `Best vibes with ${config.name} 💖`}
          </p>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono mt-0.5">
            {config.birthdayDate}
          </p>
        </div>
      </div>

      {/* Zoom Modal if clicked */}
      {isZoomed && config.photoUrl && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-xl max-h-[85vh] bg-white p-4 pb-6 rounded-2xl shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-slate-800 shadow-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={config.photoUrl}
              alt={`Memory of ${config.name}`}
              className="max-h-[70vh] w-auto object-contain rounded-lg"
            />
            <p className="font-handwriting text-2xl text-slate-800 mt-3 font-bold">
              Memories with {config.name} 💖
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

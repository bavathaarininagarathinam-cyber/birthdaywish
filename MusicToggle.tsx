import React, { useState, useEffect } from 'react';
import { audioEngine } from '../utils/audio';
import { Volume2, VolumeX, Music } from 'lucide-react';

export const MusicToggle: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioEngine.setOnStateChange((playing) => {
      setIsPlaying(playing);
    });
  }, []);

  const handleToggle = () => {
    audioEngine.toggleTune();
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-xs font-bold transition-all shadow-xs cursor-pointer ${
        isPlaying
          ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/20 ring-2 ring-amber-400/40'
          : 'bg-white/90 backdrop-blur-sm text-slate-700 border-slate-200 hover:bg-slate-50'
      }`}
      title={isPlaying ? 'Pause birthday tune' : 'Play soft synthesized birthday tune'}
    >
      {isPlaying ? (
        <>
          {/* Animated sound wave bars */}
          <div className="flex items-center gap-0.5 h-3.5">
            <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '10px', animationDuration: '0.6s' }} />
            <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '14px', animationDuration: '0.4s', animationDelay: '0.2s' }} />
            <span className="w-1 bg-white rounded-full animate-bounce" style={{ height: '8px', animationDuration: '0.7s', animationDelay: '0.1s' }} />
          </div>
          <span>Playing Tune</span>
        </>
      ) : (
        <>
          <Music className="w-3.5 h-3.5 text-slate-500" />
          <span>Play Music</span>
        </>
      )}
    </button>
  );
};

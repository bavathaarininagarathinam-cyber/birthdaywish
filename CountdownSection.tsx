import React, { useState, useEffect } from 'react';
import { BirthdayConfig, THEME_CONFIGS } from '../types';
import { Sparkles, Cake } from 'lucide-react';

interface CountdownSectionProps {
  config: BirthdayConfig;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({ config }) => {
  const theme = THEME_CONFIGS[config.theme];

  const calculateTimeRemaining = (): TimeRemaining => {
    const now = new Date();
    const [yearStr, monthStr, dayStr] = config.birthdayDate.split('-');
    const bMonth = parseInt(monthStr, 10) - 1;
    const bDay = parseInt(dayStr, 10);

    // Check if today matches month and day
    const isToday = now.getMonth() === bMonth && now.getDate() === bDay;

    // Next target birthday
    let target = new Date(now.getFullYear(), bMonth, bDay, 0, 0, 0);
    // If birthday date has passed today, target next year's recurrence
    if (target.getTime() < now.getTime() && !isToday) {
      target = new Date(now.getFullYear() + 1, bMonth, bDay, 0, 0, 0);
    }

    const diff = Math.max(0, target.getTime() - now.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isToday };
  };

  const [time, setTime] = useState<TimeRemaining>(calculateTimeRemaining);

  useEffect(() => {
    setTime(calculateTimeRemaining());
    const timer = setInterval(() => {
      setTime(calculateTimeRemaining());
    }, 1000);
    return () => clearInterval(timer);
  }, [config.birthdayDate]);

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      {time.isToday ? (
        /* Birthday Is Today! */
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white shadow-xl shadow-rose-500/20 text-center animate-glow-pulse">
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-xl" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-3">
              <Cake className="w-4 h-4" />
              <span>Celebrating Right Now</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white drop-shadow-sm">
              It&apos;s your day! 🎂
            </h2>
            <p className="mt-2 text-sm sm:text-base text-rose-100 max-w-md">
              Today belongs entirely to you, {config.name}! May it be overflowing with joy, surprises, and your favorite treats!
            </p>
          </div>
        </div>
      ) : (
        /* Future Birthday Countdown */
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-md text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Counting Down to the Big Day</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display mb-6">
            The celebration begins in...
          </h3>

          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
            {[
              { label: 'Days', val: time.days },
              { label: 'Hours', val: time.hours },
              { label: 'Minutes', val: time.minutes },
              { label: 'Seconds', val: time.seconds },
            ].map((unit) => (
              <div
                key={unit.label}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-50 border border-slate-100 shadow-xs"
              >
                <span className="text-2xl sm:text-4xl font-black text-slate-900 font-mono tabular-nums">
                  {String(unit.val).padStart(2, '0')}
                </span>
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider mt-1">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

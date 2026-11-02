import React from 'react';
import { BirthdayConfig, THEME_CONFIGS } from '../types';
import { Heart, Clock, Sun, Moon, Wind, Compass, Sparkles } from 'lucide-react';

interface FunFactsSectionProps {
  config: BirthdayConfig;
}

export const FunFactsSection: React.FC<FunFactsSectionProps> = ({ config }) => {
  const theme = THEME_CONFIGS[config.theme];
  const age = Math.max(1, config.age);

  // Statistics calculation
  const totalDays = Math.floor(age * 365.25);
  const totalHours = totalDays * 24;
  const totalHeartbeats = Math.floor(totalDays * 105000); // ~73 bpm average
  const totalBreaths = Math.floor(totalDays * 21000); // ~15 breaths/min
  const solarOrbits = age;
  const sleepHours = Math.floor(totalDays * 8.2); // ~8 hours of sleep/night

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const facts = [
    {
      label: 'Days of Joy Lived',
      value: formatNumber(totalDays),
      subtext: 'Every single one filled with purpose',
      icon: Clock,
      color: 'text-rose-500 bg-rose-50',
    },
    {
      label: 'Hours on Earth',
      value: formatNumber(totalHours),
      subtext: 'Creating memories & friendships',
      icon: Compass,
      color: 'text-amber-500 bg-amber-50',
    },
    {
      label: 'Approximate Heartbeats',
      value: formatNumber(totalHeartbeats),
      subtext: 'Loving, dreaming, and living fully',
      icon: Heart,
      color: 'text-red-500 bg-red-50',
    },
    {
      label: 'Breaths Taken',
      value: formatNumber(totalBreaths),
      subtext: 'Inhaling courage & exhaling kindness',
      icon: Wind,
      color: 'text-sky-500 bg-sky-50',
    },
    {
      label: 'Trips Around the Sun',
      value: `${solarOrbits} orbits`,
      subtext: `${formatNumber(solarOrbits * 940)}M km traveled through space!`,
      icon: Sun,
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      label: 'Hours Spent in Dreamland',
      value: formatNumber(sleepHours),
      subtext: 'Recharging for great adventures',
      icon: Moon,
      color: 'text-purple-500 bg-purple-50',
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-12 px-2">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-slate-700 text-xs font-semibold mb-2 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Life In Numbers</span>
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
          {config.name}&apos;s Incredible Journey
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          A cosmic look at how much life you&apos;ve experienced in {age} wonderful years.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {facts.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.label}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  {f.label}
                </span>
                <span className={`w-9 h-9 rounded-xl ${f.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </span>
              </div>

              <div>
                <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums tracking-tight">
                  {f.value}
                </span>
                <p className="text-xs text-slate-500 mt-1.5">
                  {f.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

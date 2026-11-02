import React, { useState, useEffect, useRef } from 'react';
import { BirthdayConfig, THEME_CONFIGS } from './types';
import {
  loadConfigFromStorage,
  saveConfigToStorage,
  decodeConfigFromUrl,
  DEFAULT_CONFIG,
} from './utils/storage';
import { confettiEngine } from './utils/confetti';
import { SetupScreen } from './components/SetupScreen';
import { EnvelopeIntro } from './components/EnvelopeIntro';
import { HeroSection } from './components/HeroSection';
import { BalloonsOverlay } from './components/BalloonsOverlay';
import { BirthdayCake } from './components/BirthdayCake';
import { CountdownSection } from './components/CountdownSection';
import { MessageCard } from './components/MessageCard';
import { PolaroidSection } from './components/PolaroidSection';
import { WishesWall } from './components/WishesWall';
import { FunFactsSection } from './components/FunFactsSection';
import { Sparkles, Heart, ArrowUp, MailOpen } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<BirthdayConfig | null>(null);
  const [currentView, setCurrentView] = useState<'setup' | 'surprise'>('setup');
  const [hasOpenedEnvelope, setHasOpenedEnvelope] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cakeSectionRef = useRef<HTMLDivElement>(null);

  // Initialize canvas confetti
  useEffect(() => {
    if (canvasRef.current) {
      confettiEngine.init(canvasRef.current);
    }
    return () => {
      confettiEngine.destroy();
    };
  }, []);

  // Check URL share link or localStorage on mount
  useEffect(() => {
    const urlConfig = decodeConfigFromUrl();
    if (urlConfig) {
      setConfig(urlConfig);
      saveConfigToStorage(urlConfig);
      setCurrentView('surprise');
      setHasOpenedEnvelope(false); // recipient gets envelope open surprise!
      return;
    }

    const saved = loadConfigFromStorage();
    if (saved) {
      setConfig(saved);
      setCurrentView('surprise');
      // If refreshed, show directly or start with envelope
      setHasOpenedEnvelope(false);
    } else {
      // First visit: Show setup form
      setCurrentView('setup');
    }
  }, []);

  // Track scroll position for "Back to top" button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSetupComplete = (newConfig: BirthdayConfig) => {
    setConfig(newConfig);
    setCurrentView('surprise');
    setHasOpenedEnvelope(false); // show magical envelope reveal
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnvelopeOpened = () => {
    setHasOpenedEnvelope(true);
    // Burst opening confetti shower
    if (config) {
      const theme = THEME_CONFIGS[config.theme];
      confettiEngine.burst(window.innerWidth / 2, window.innerHeight * 0.35, 100, theme.candleColors);
      confettiEngine.startRain(3500, theme.candleColors);
    }
  };

  const handleScrollToCake = () => {
    cakeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in setup mode or no config yet, render SetupScreen
  if (currentView === 'setup' || !config) {
    return (
      <>
        {/* Fullscreen confetti canvas */}
        <canvas
          ref={canvasRef}
          className="fixed inset-0 pointer-events-none z-50 w-full h-full"
        />
        <SetupScreen
          initialConfig={config || DEFAULT_CONFIG}
          onComplete={handleSetupComplete}
        />
      </>
    );
  }

  const theme = THEME_CONFIGS[config.theme];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.gradientBg} text-slate-800 relative selection:bg-pink-300 selection:text-pink-950 font-sans`}>
      {/* Fullscreen Confetti Canvas Overlay */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* Opening Envelope (shown before revealing page contents) */}
      {!hasOpenedEnvelope ? (
        <EnvelopeIntro config={config} onOpenComplete={handleEnvelopeOpened} />
      ) : (
        <>
          {/* Floating interactive balloons overlay */}
          <BalloonsOverlay friendName={config.name} />

          {/* Main Birthday Experience Content */}
          <main className="relative z-10 pb-20">
            {/* 1. Hero Section */}
            <HeroSection
              config={config}
              onEdit={() => setCurrentView('setup')}
              onScrollToCake={handleScrollToCake}
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-14 sm:space-y-20">
              {/* 2. Live Countdown / "It's your day!" Section */}
              <section aria-label="Birthday Countdown">
                <CountdownSection config={config} />
              </section>

              {/* 3. Interactive Birthday Cake with Clickable Blow-Out Candles */}
              <section ref={cakeSectionRef} aria-label="Birthday Cake Ceremony">
                <div className="text-center mb-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-slate-200 text-slate-700 text-xs font-semibold mb-2 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>The Candle Ceremony</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                    Make a Wish, {config.name}!
                  </h2>
                </div>
                <BirthdayCake config={config} />
              </section>

              {/* 4. Handwritten Personal Message Card with Typewriter animation */}
              <section aria-label="Personal Message">
                <MessageCard config={config} />
              </section>

              {/* 5. Vintage Tilted Polaroid Section */}
              <section aria-label="Photo Memories">
                <PolaroidSection config={config} />
              </section>

              {/* 6. Life in Numbers / Fun Facts */}
              <section aria-label="Fun Facts">
                <FunFactsSection config={config} />
              </section>

              {/* 7. Community Wishes Wall (Sticky notes saved in localStorage) */}
              <section aria-label="Wishes Wall">
                <WishesWall config={config} />
              </section>
            </div>

            {/* Footer */}
            <footer className="mt-20 pt-10 pb-8 border-t border-slate-200/60 text-center text-xs text-slate-500">
              <div className="max-w-md mx-auto flex flex-col items-center gap-3">
                <p className="flex items-center gap-1 font-medium text-slate-600">
                  <span>Crafted with love for</span>
                  <strong className="text-slate-900">{config.name}</strong>
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <button
                    type="button"
                    onClick={() => setCurrentView('setup')}
                    className="text-pink-600 hover:text-pink-700 font-semibold underline underline-offset-4 cursor-pointer"
                  >
                    Edit celebration details
                  </button>
                  <span className="text-slate-300">·</span>
                  <button
                    type="button"
                    onClick={() => setHasOpenedEnvelope(false)}
                    className="text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <MailOpen className="w-3.5 h-3.5" />
                    <span>Re-open envelope</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-2">
                  Works entirely in your browser · No login needed · Shareable with friends
                </p>
              </div>
            </footer>
          </main>

          {/* Floating Back to Top Button */}
          {showScrollTop && (
            <button
              type="button"
              onClick={handleScrollToTop}
              className="fixed bottom-6 right-6 z-30 w-11 h-11 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-lg text-slate-700 hover:text-slate-900 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
              title="Back to top"
            >
              <ArrowUp className="w-5 h-5" />
            </button>
          )}
        </>
      )}
    </div>
  );
}

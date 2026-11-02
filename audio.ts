/**
 * Web Audio API synthesizer for the Birthday Wishing Website
 * No external audio files used. 100% synthesized in the browser.
 */

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlayingTune = false;
  private tuneTimeoutId: number | null = null;
  private onStateChangeCallback: ((playing: boolean) => void) | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setOnStateChange(cb: (playing: boolean) => void) {
    this.onStateChangeCallback = cb;
  }

  public get isPlaying(): boolean {
    return this.isPlayingTune;
  }

  /**
   * Plays a single music box bell note with harmonic overtone and exponential decay
   */
  private playBellNote(ctx: AudioContext, freq: number, startTime: number, duration: number, volume: number = 0.22) {
    if (freq <= 0) return;

    // Fundamental oscillator (sine for warmth)
    const osc1 = ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Harmonic overtone (triangle for chime sparkle)
    const osc2 = ctx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(freq * 2.003, startTime); // slight detune for shimmer

    // Gain envelope (instant attack, slow natural decay)
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.001, startTime);
    gainNode.gain.exponentialRampToValueAtTime(volume, startTime + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    // Subtle low-pass filter for warmth
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(freq * 3.5, startTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);
  }

  /**
   * "Happy Birthday to You" Melody in F Major / C Major (transposed for sweet music-box register)
   * Note frequencies in Hz
   */
  public playTune(): void {
    const ctx = this.getContext();
    this.stopTune();
    this.isPlayingTune = true;
    if (this.onStateChangeCallback) this.onStateChangeCallback(true);

    // Note frequencies (Hz) in C Major:
    const G3 = 196.0;
    const C4 = 261.63;
    const D4 = 293.66;
    const E4 = 329.63;
    const F4 = 349.23;
    const G4 = 392.0;
    const A4 = 440.0;
    const B4 = 493.88;
    const C5 = 523.25;
    const D5 = 587.33;
    const E5 = 659.25;
    const F5 = 698.46;
    const G5 = 783.99;
    const A5 = 880.0;
    const Bb4 = 466.16;

    // Melody: Note, Duration (in beats, where 1 beat = ~0.45s)
    const score: Array<{ note: number; beats: number; bass?: number }> = [
      // Hap-py Birth-day to you
      { note: G4, beats: 0.75, bass: C4 },
      { note: G4, beats: 0.25 },
      { note: A4, beats: 1.0, bass: F4 },
      { note: G4, beats: 1.0, bass: C4 },
      { note: C5, beats: 1.0, bass: E4 },
      { note: B4, beats: 2.0, bass: G4 },

      // Hap-py Birth-day to you
      { note: G4, beats: 0.75, bass: G3 },
      { note: G4, beats: 0.25 },
      { note: A4, beats: 1.0, bass: D4 },
      { note: G4, beats: 1.0, bass: G4 },
      { note: D5, beats: 1.0, bass: F4 },
      { note: C5, beats: 2.0, bass: E4 },

      // Hap-py Birth-day dear [Friend]
      { note: G4, beats: 0.75, bass: C4 },
      { note: G4, beats: 0.25 },
      { note: G5, beats: 1.0, bass: E4 },
      { note: E5, beats: 1.0, bass: C5 },
      { note: C5, beats: 1.0, bass: A4 },
      { note: B4, beats: 1.0, bass: G4 },
      { note: A4, beats: 2.0, bass: F4 },

      // Hap-py Birth-day to you!
      { note: F5, beats: 0.75, bass: F4 },
      { note: F5, beats: 0.25 },
      { note: E5, beats: 1.0, bass: C5 },
      { note: C5, beats: 1.0, bass: E4 },
      { note: D5, beats: 1.0, bass: G4 },
      { note: C5, beats: 2.5, bass: C4 },
    ];

    const beatDuration = 0.44; // seconds per beat
    let timeCursor = ctx.currentTime + 0.1;

    for (const item of score) {
      const noteDuration = item.beats * beatDuration;
      this.playBellNote(ctx, item.note, timeCursor, noteDuration * 1.5, 0.2);

      // Add gentle bass chime note if present
      if (item.bass) {
        this.playBellNote(ctx, item.bass / 2, timeCursor, noteDuration * 1.8, 0.12);
      }

      timeCursor += noteDuration;
    }

    const totalSeconds = timeCursor - ctx.currentTime;
    // Loop the tune seamlessly after a slight pause
    this.tuneTimeoutId = window.setTimeout(() => {
      if (this.isPlayingTune) {
        this.playTune();
      }
    }, (totalSeconds + 1.2) * 1000);
  }

  public stopTune(): void {
    this.isPlayingTune = false;
    if (this.tuneTimeoutId !== null) {
      window.clearTimeout(this.tuneTimeoutId);
      this.tuneTimeoutId = null;
    }
    if (this.onStateChangeCallback) this.onStateChangeCallback(false);
  }

  public toggleTune(): boolean {
    if (this.isPlayingTune) {
      this.stopTune();
      return false;
    } else {
      this.playTune();
      return true;
    }
  }

  /**
   * Sound effect: Balloon Pop
   */
  public playPop(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Resonant pitch drop
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      // Noise punch
      const bufferSize = ctx.sampleRate * 0.05;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(800, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
      noise.start(now);
      noise.stop(now + 0.05);
    } catch {
      // AudioContext fallback
    }
  }

  /**
   * Sound effect: Candle Blow Out (soft gentle breath sweep)
   */
  public playBlow(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const duration = 0.28;

      const bufferSize = ctx.sampleRate * duration;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + duration);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);
    } catch {
      // AudioContext fallback
    }
  }

  /**
   * Sound effect: Magical Chime (opening envelope / candle spark)
   */
  public playChime(): void {
    try {
      const ctx = this.getContext();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        this.playBellNote(ctx, freq, now + idx * 0.07, 0.6, 0.15);
      });
    } catch {
      // AudioContext fallback
    }
  }

  /**
   * Sound effect: Victory celebration fanfare when all candles are blown
   */
  public playCelebration(): void {
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      const chords = [
        { freqs: [261.63, 329.63, 392.0], duration: 0.25 }, // C
        { freqs: [349.23, 440.0, 523.25], duration: 0.25 },  // F
        { freqs: [392.0, 493.88, 587.33], duration: 0.25 },  // G
        { freqs: [523.25, 659.25, 783.99, 1046.5], duration: 1.2 }, // High C
      ];

      let t = now;
      chords.forEach((chord) => {
        chord.freqs.forEach((freq) => {
          this.playBellNote(ctx, freq, t, chord.duration * 1.5, 0.2);
        });
        t += chord.duration;
      });
    } catch {
      // AudioContext fallback
    }
  }
}

export const audioEngine = new BirthdayAudioEngine();

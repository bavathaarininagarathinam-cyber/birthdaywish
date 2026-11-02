/**
 * High-performance Canvas Confetti & Sparkles Engine
 * Zero external libraries needed. Full custom physics and shapes.
 */

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: 'rect' | 'circle' | 'star' | 'ribbon';
  rotation: number;
  vRot: number;
  tilt: number;
  vTilt: number;
  opacity: number;
  decay: number;
}

class ConfettiEngine {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: ConfettiParticle[] = [];
  private animationFrameId: number | null = null;
  private rainIntervalId: number | null = null;
  private width = 0;
  private height = 0;

  public init(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', this.handleResize);
  }

  public destroy() {
    window.removeEventListener('resize', this.handleResize);
    this.stopRain();
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.particles = [];
  }

  private handleResize = () => {
    this.resize();
  };

  private resize() {
    if (!this.canvas) return;
    const dpr = window.devicePixelRatio || 1;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    if (this.ctx) {
      this.ctx.resetTransform();
      this.ctx.scale(dpr, dpr);
    }
  }

  public burst(originX?: number, originY?: number, count = 80, customColors?: string[]) {
    const x = originX !== undefined ? originX : this.width / 2;
    const y = originY !== undefined ? originY : this.height * 0.45;

    const palette = customColors || [
      '#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981',
      '#f59e0b', '#fbbf24', '#06b6d4', '#e11d48', '#a855f7'
    ];

    const shapes: Array<'rect' | 'circle' | 'star' | 'ribbon'> = ['rect', 'circle', 'star', 'ribbon'];

    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.8;
      const speed = Math.random() * 12 + 6;

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed * (0.8 + Math.random() * 0.6),
        vy: (Math.sin(angle) * speed - 4) * (0.8 + Math.random() * 0.6),
        size: Math.random() * 8 + 6,
        color: palette[Math.floor(Math.random() * palette.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 12,
        tilt: Math.random() * 10,
        vTilt: Math.random() * 0.15 + 0.05,
        opacity: 1,
        decay: Math.random() * 0.006 + 0.008,
      });
    }

    this.startAnimation();
  }

  public startRain(durationMs = 4000, customColors?: string[]) {
    this.stopRain();
    const palette = customColors || [
      '#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#f59e0b', '#fbbf24'
    ];

    const spawn = () => {
      for (let i = 0; i < 6; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: -20,
          vx: (Math.random() - 0.5) * 3,
          vy: Math.random() * 4 + 3,
          size: Math.random() * 8 + 6,
          color: palette[Math.floor(Math.random() * palette.length)],
          shape: Math.random() > 0.4 ? 'rect' : 'ribbon',
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 8,
          tilt: Math.random() * 10,
          vTilt: Math.random() * 0.1 + 0.05,
          opacity: 1,
          decay: Math.random() * 0.004 + 0.004,
        });
      }
      this.startAnimation();
    };

    spawn();
    this.rainIntervalId = window.setInterval(spawn, 120);

    window.setTimeout(() => {
      this.stopRain();
    }, durationMs);
  }

  public stopRain() {
    if (this.rainIntervalId !== null) {
      clearInterval(this.rainIntervalId);
      this.rainIntervalId = null;
    }
  }

  private startAnimation() {
    if (this.animationFrameId === null) {
      this.loop();
    }
  }

  private loop = () => {
    if (!this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      // Physics
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.22; // gravity
      p.vx *= 0.985; // air drag
      p.rotation += p.vRot;
      p.tilt += p.vTilt;
      p.opacity -= p.decay;

      if (p.opacity <= 0 || p.y > this.height + 50) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.scale(Math.cos(p.tilt), 1);
      this.ctx.globalAlpha = Math.max(0, p.opacity);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.shape === 'star') {
        this.drawStar(this.ctx, 0, 0, 5, p.size / 2, p.size / 4);
      } else if (p.shape === 'ribbon') {
        this.ctx.fillRect(-p.size / 2, -p.size * 1.5, p.size, p.size * 3);
      } else {
        // rect
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      }

      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationFrameId = requestAnimationFrame(this.loop);
    } else {
      this.animationFrameId = null;
    }
  };

  private drawStar(
    ctx: CanvasRenderingContext2D,
    cx: number,
    cy: number,
    spikes: number,
    outerRadius: number,
    innerRadius: number
  ) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    const step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}

export const confettiEngine = new ConfettiEngine();

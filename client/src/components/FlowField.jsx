import { useEffect, useRef } from 'react';
import { prefersReducedMotion, isMobile } from '../lib/motion';

/**
 * Ivory particles drifting along a slowly evolving flow field, leaving silk-like
 * trails. The pointer gently pushes particles away. Pauses when off-screen.
 */
export default function FlowField({ className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let particles = [];
    let raf = 0;
    let visible = true;
    let t = Math.random() * 100;
    const mouse = { x: -9999, y: -9999 };

    const spawn = (p = {}) => {
      p.x = Math.random() * w;
      p.y = Math.random() * h;
      p.life = 0;
      p.max = 140 + Math.random() * 260;
      p.speed = 0.35 + Math.random() * 0.9;
      return p;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#2A2529';
      ctx.fillRect(0, 0, w, h);
      const count = Math.min(Math.round((w * h) / (isMobile() ? 2600 : 1700)), isMobile() ? 380 : 1100);
      particles = Array.from({ length: count }, () => spawn());
    };

    // Smooth pseudo-noise from layered sines: cheap and organic enough.
    const angle = (x, y) => {
      const s = 0.0016;
      return (
        Math.sin(x * s + t * 0.6) * 1.6 +
        Math.cos(y * s * 1.3 - t * 0.4) * 1.4 +
        Math.sin((x + y) * s * 0.7 + t * 0.25) * 1.2
      );
    };

    const step = () => {
      t += 0.0035;
      // Fade previous frame towards charcoal to create trails.
      ctx.fillStyle = 'rgba(42, 37, 41, 0.075)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(243, 240, 231, 0.55)';
      for (const p of particles) {
        const a = angle(p.x, p.y);
        let vx = Math.cos(a) * p.speed;
        let vy = Math.sin(a) * p.speed;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22000) {
          const f = (1 - d2 / 22000) * 2.4;
          const d = Math.sqrt(d2) || 1;
          vx += (dx / d) * f;
          vy += (dy / d) * f;
        }
        p.x += vx;
        p.y += vy;
        p.life++;
        // Fade particles in and out over their life so births/deaths aren't visible.
        const k = Math.min(p.life / 30, 1, (p.max - p.life) / 30);
        ctx.globalAlpha = Math.max(k, 0);
        ctx.fillRect(p.x, p.y, 1.2, 1.2);
        if (p.life > p.max || p.x < -10 || p.x > w + 10 || p.y < -10 || p.y > h + 10) spawn(p);
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      step();
      raf = requestAnimationFrame(loop);
    };

    resize();
    if (reduced) {
      // Static still: run a few hundred steps once to draw settled trails.
      for (let i = 0; i < 220; i++) step();
    } else raf = requestAnimationFrame(loop);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible && !reduced && !document.hidden) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && visible && !reduced) raf = requestAnimationFrame(loop);
    };
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const onLeave = () => {
      mouse.x = mouse.y = -9999;
    };
    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    };

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      clearTimeout(resizeTimer);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

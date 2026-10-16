import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { marquee } from '../data/portfolio';

/**
 * Infinite marquee whose speed and direction follow your scrolling.
 * Words alternate between filled serif and outlined italic.
 */
export default function Marquee({ theme = 'dark', reverse = false }) {
  const trackRef = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const track = trackRef.current;
    const setX = gsap.quickSetter(track, 'x', 'px');
    const base = reverse ? -1 : 1;
    let x = 0;
    let dir = 1;
    let boost = 0;

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        dir = self.direction;
        boost = Math.max(boost, Math.min(Math.abs(self.getVelocity()) / 250, 8));
      },
    });

    const tick = (_, dt) => {
      const half = track.scrollWidth / 2;
      if (!half) return;
      boost *= 0.94;
      x -= (dt / 16.7) * 0.7 * base * dir * (1 + boost);
      if (x <= -half) x += half;
      if (x > 0) x -= half;
      setX(x);
    };
    gsap.ticker.add(tick);
    return () => {
      st.kill();
      gsap.ticker.remove(tick);
    };
  }, [reverse]);

  const row = marquee.map((word, i) => (
    <span key={word} className={`marquee__item ${i % 2 ? 'is-outline' : ''}`}>
      {word}
      <span className="marquee__star">✦</span>
    </span>
  ));

  return (
    <div data-theme={theme} className={`marquee theme-${theme}`} role="img" aria-label={`Tech stack: ${marquee.join(', ')}`}>
      <div ref={trackRef} className="marquee__track" aria-hidden="true">
        <div className="marquee__group">{row}</div>
        <div className="marquee__group">{row}</div>
      </div>
    </div>
  );
}

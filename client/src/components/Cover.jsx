import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

// Ripple origins per project so each cover has its own composition.
const ORIGINS = ['82% 118%', '12% -20%', '110% 30%', '-10% 80%', '50% 130%', '90% -25%'];

/**
 * Designed project cover: charcoal panel, fine concentric ripple lines and the
 * project name in italic serif. Ripples drift with scroll when `parallax` is set.
 */
export default function Cover({ project, index = 0, parallax = false, compact = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!parallax || !el || prefersReducedMotion()) return;
    const rings = el.querySelector('.cover__rings');
    const tweens = [
      gsap.fromTo(
        el,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.6, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
      ),
      gsap.fromTo(rings, { yPercent: -8, scale: 1.15 }, { yPercent: 8, scale: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } }),
    ];
    return () =>
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
  }, [parallax]);

  return (
    <div ref={ref} className={`cover ${compact ? 'is-compact' : ''}`} style={{ '--origin': ORIGINS[index % ORIGINS.length] }} aria-hidden="true">
      <span className="cover__rings" />
      <span className="cover__top">
        <span>{project.id}</span>
        <span>{project.subtitle}</span>
      </span>
      <span className="cover__title">{project.title}</span>
    </div>
  );
}

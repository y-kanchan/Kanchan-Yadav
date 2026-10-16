import { useEffect, useRef, useState } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';

/**
 * Image mapped onto the two-colour palette (black → charcoal, white → ivory).
 * Reveals with a curtain wipe; optional scroll parallax inside its frame.
 * Falls back to a typographic panel when the image fails to load.
 */
export default function Duotone({ src, alt, ratio = 16 / 9, parallax = false, fallback, className = '' }) {
  const ref = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const img = el.querySelector('.duo__media');
    const tweens = [
      gsap.fromTo(
        el,
        { clipPath: 'inset(100% 0% 0% 0%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }
      ),
      gsap.fromTo(img, { scale: 1.3 }, { scale: 1, duration: 2, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }),
    ];
    if (parallax) {
      tweens.push(
        gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } })
      );
    }
    return () =>
      tweens.forEach((t) => {
        t.scrollTrigger?.kill();
        t.kill();
      });
  }, [parallax, failed]);

  return (
    <div
      ref={ref}
      className={`duo ${className}`}
      style={{ aspectRatio: ratio }}
      {...(failed ? { role: 'img', 'aria-label': alt } : {})}
    >
      {failed ? (
        <div className="duo__media duo__fallback" aria-hidden="true">
          {fallback}
        </div>
      ) : (
        <img src={src} alt={alt} loading="lazy" decoding="async" className="duo__media" onError={() => setFailed(true)} />
      )}
    </div>
  );
}

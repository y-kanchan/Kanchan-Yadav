import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { profile } from '../data/portfolio';

/** Counter 0 → 100 with a hairline progress, then the curtain lifts. */
export default function Loader({ onDone }) {
  const rootRef = useRef(null);
  const countRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (prefersReducedMotion()) {
      const t = gsap.to(root, { opacity: 0, duration: 0.4, delay: 0.2, onComplete: onDone });
      return () => t.kill();
    }
    const counter = { v: 0 };
    const tl = gsap.timeline({ onComplete: onDone });
    tl.to(counter, {
      v: 100,
      duration: 1.9,
      ease: 'power3.inOut',
      onUpdate: () => {
        countRef.current.textContent = String(Math.round(counter.v)).padStart(3, '0');
      },
    })
      .to(lineRef.current, { scaleX: 1, duration: 1.9, ease: 'power3.inOut' }, 0)
      .to('.loader__meta, .loader__count', { yPercent: -100, opacity: 0, duration: 0.6, ease: 'power3.in', stagger: 0.05 }, '+=0.15')
      .to(root, { yPercent: -100, duration: 1.1, ease: 'expo.inOut' }, '-=0.2');
    return () => tl.kill();
  }, [onDone]);

  return (
    <div ref={rootRef} className="loader" role="status" aria-label="Loading">
      <div className="loader__top">
        <p className="loader__meta">{profile.name.toLowerCase()}</p>
        <p className="loader__meta">portfolio — {new Date().getFullYear()}</p>
      </div>
      <div className="loader__bottom">
        <p className="loader__meta">full-stack &amp; ai engineer</p>
        <p className="loader__count" aria-hidden="true">
          <span ref={countRef}>000</span>
        </p>
      </div>
      <span ref={lineRef} className="loader__line" aria-hidden="true" />
    </div>
  );
}

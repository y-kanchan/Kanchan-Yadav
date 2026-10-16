import { useEffect, useRef } from 'react';
import { gsap, isCoarsePointer, prefersReducedMotion } from '../lib/motion';

// Where the cat sits relative to the pointer, so it never covers what you point at.
const OFFSET = { x: 16, y: 18 };

/**
 * A tiny precise dot at the pointer plus a line-drawn cat that trails behind it.
 * The cat tilts with movement, blinks, smiles over clickable things, squishes on
 * click, and shows a speech-bubble label for elements with data-cursor="Label".
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const catRef = useRef(null);
  const bodyRef = useRef(null);
  const labelRef = useRef(null);

  useEffect(() => {
    if (isCoarsePointer()) return;
    const dot = dotRef.current;
    const cat = catRef.current;
    const body = bodyRef.current;
    const label = labelRef.current;
    const reduced = prefersReducedMotion();
    document.documentElement.classList.add('has-custom-cursor');

    const dotX = gsap.quickTo(dot, 'x', { duration: reduced ? 0.01 : 0.1, ease: 'power3.out' });
    const dotY = gsap.quickTo(dot, 'y', { duration: reduced ? 0.01 : 0.1, ease: 'power3.out' });
    const catX = gsap.quickTo(cat, 'x', { duration: reduced ? 0.01 : 0.5, ease: 'power3.out' });
    const catY = gsap.quickTo(cat, 'y', { duration: reduced ? 0.01 : 0.5, ease: 'power3.out' });
    const tilt = gsap.quickTo(body, 'rotation', { duration: 0.6, ease: 'power3.out' });

    let lastX = 0;
    const onMove = (e) => {
      dotX(e.clientX);
      dotY(e.clientY);
      catX(e.clientX + OFFSET.x);
      catY(e.clientY + OFFSET.y);
      if (!reduced) {
        // Lean into horizontal movement, then settle back upright.
        const vx = e.clientX - lastX;
        tilt(gsap.utils.clamp(-22, 22, vx * 1.6));
        clearTimeout(onMove.settle);
        onMove.settle = setTimeout(() => tilt(0), 120);
      }
      lastX = e.clientX;
      document.documentElement.classList.remove('cursor-hidden');
    };
    const onOver = (e) => {
      const labelled = e.target.closest('[data-cursor]');
      const interactive = e.target.closest('a, button, input, textarea, label, [role="button"]');
      cat.classList.toggle('is-happy', !!(labelled || interactive));
      cat.classList.toggle('is-label', !!labelled);
      cat.classList.toggle('is-planet', !!e.target.closest('[data-cursor-theme="space"]'));
      label.textContent = labelled ? labelled.dataset.cursor : '';
    };
    const onLeave = () => document.documentElement.classList.add('cursor-hidden');
    const onDown = () => cat.classList.add('is-down');
    const onUp = () => cat.classList.remove('is-down');

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver);
    document.documentElement.addEventListener('mouseleave', onLeave);
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    return () => {
      clearTimeout(onMove.settle);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <div className="cursor" aria-hidden="true">
      <div ref={catRef} className="cat">
        <div ref={bodyRef} className="cat__body">
          <svg viewBox="0 0 40 36" className="cat__svg" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            {/* head + ears */}
            <path d="M6 14 L8 3.5 L15 9 Q20 7.6 25 9 L32 3.5 L34 14 Q37 22 32 28 Q26 33 20 33 Q14 33 8 28 Q3 22 6 14 Z" />
            {/* inner ears */}
            <path d="M9.2 7.5 L10 11.5 M30.8 7.5 L30 11.5" opacity="0.6" />
            {/* open eyes (blink via CSS) */}
            <g className="cat__eyes" fill="currentColor" stroke="none">
              <ellipse cx="14" cy="19" rx="1.7" ry="2.1" />
              <ellipse cx="26" cy="19" rx="1.7" ry="2.1" />
            </g>
            {/* happy eyes */}
            <g className="cat__happy">
              <path d="M11.6 19.6 Q14 16.8 16.4 19.6" />
              <path d="M23.6 19.6 Q26 16.8 28.4 19.6" />
            </g>
            {/* nose + mouth */}
            <path d="M18.6 23 L21.4 23 L20 24.5 Z" fill="currentColor" />
            <path d="M20 24.5 Q18.6 26.8 16.9 25.7 M20 24.5 Q21.4 26.8 23.1 25.7" />
            {/* whiskers */}
            <path d="M2.5 21 L9.5 22 M2.5 25 L9.5 24.4 M37.5 21 L30.5 22 M37.5 25 L30.5 24.4" opacity="0.75" />
          </svg>
        </div>
        {/* planet: shown over the "space" project covers */}
        <svg viewBox="0 0 44 38" className="planet" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="22" cy="19" r="9" />
          <path d="M15.5 14.5 Q22 17 28.5 14.5" opacity="0.55" />
          <g className="planet__ring">
            {/* back half of the ring is hidden behind the planet, front half crosses it */}
            <path d="M4.5 21.5 Q2 16.5 13.4 14.2" />
            <path d="M30.6 13.6 Q42 12 39.5 16.5" />
            <path d="M39.5 16.5 Q37 21.5 22 25 Q7 28.5 4.5 21.5" />
          </g>
          <g className="planet__moon">
            <circle cx="22" cy="2.5" r="1.8" fill="currentColor" stroke="none" />
          </g>
          <path className="planet__spark" d="M38 3 V7 M36 5 H40" />
          <path className="planet__spark" d="M5 31 V34 M3.5 32.5 H6.5" />
        </svg>
        <span ref={labelRef} className="cat__label" />
      </div>
      <div ref={dotRef} className="cursor__dot" />
    </div>
  );
}

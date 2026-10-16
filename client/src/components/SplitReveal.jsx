import { Fragment, useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion, parseTitle, EASE } from '../lib/motion';

/**
 * Heading whose words rise out of masks. Plays on scroll-into-view, or when
 * `play` flips to true if `manual` is set. `*word*` renders in italic.
 */
export default function SplitReveal({ text, as: Tag = 'h2', className = '', manual = false, play = false, delay = 0, stagger = 0.06, id }) {
  const ref = useRef(null);
  const tweenRef = useRef(null);
  const words = parseTitle(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const inner = el.querySelectorAll('.split__word');
    gsap.set(inner, { yPercent: 115 });
    tweenRef.current = gsap.to(inner, { yPercent: 0, duration: 1.3, ease: EASE, stagger, delay, paused: true });
    let st;
    if (!manual) {
      st = ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => tweenRef.current.play() });
    }
    return () => {
      st?.kill();
      tweenRef.current?.kill();
      gsap.set(inner, { clearProps: 'transform' });
    };
  }, [text, manual, delay, stagger]);

  useEffect(() => {
    if (manual && play) tweenRef.current?.play();
  }, [manual, play]);

  return (
    <Tag ref={ref} id={id} className={`split ${className}`}>
      <span className="sr-only">{text.replace(/\*/g, '')}</span>
      <span aria-hidden="true">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="split__mask">
              <span className={`split__word ${w.italic ? 'is-italic' : ''}`}>{w.text}</span>
            </span>
            {i < words.length - 1 && ' '}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}

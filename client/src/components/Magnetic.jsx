import { useEffect, useRef } from 'react';
import { gsap, isCoarsePointer, prefersReducedMotion } from '../lib/motion';

/**
 * Pill button/link that leans toward the pointer; the label rolls on hover.
 * Renders an <a> when `href` is given, otherwise a <button>.
 */
export default function Magnetic({ href, children, className = '', strength = 0.3, variant = 'solid', ...rest }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isCoarsePointer() || prefersReducedMotion()) return;
    const inner = el.querySelector('.btn__inner');
    const xTo = gsap.quickTo(el, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const ixTo = gsap.quickTo(inner, 'x', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    const iyTo = gsap.quickTo(inner, 'y', { duration: 0.8, ease: 'elastic.out(1, 0.4)' });

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      xTo(dx * strength);
      yTo(dy * strength);
      ixTo(dx * strength * 0.35);
      iyTo(dy * strength * 0.35);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
      ixTo(0);
      iyTo(0);
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  const cls = `btn btn--${variant} ${className}`;
  const content = (
    <span className="btn__inner">
      <span className="btn__roll">
        <span className="btn__label">{children}</span>
        <span className="btn__label" aria-hidden="true">
          {children}
        </span>
      </span>
    </span>
  );

  if (href) {
    const external = /^https?:/.test(href);
    return (
      <a ref={ref} href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {content}
      </a>
    );
  }
  return (
    <button ref={ref} className={cls} {...rest}>
      {content}
    </button>
  );
}

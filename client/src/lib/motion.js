import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

const mq = (q) => typeof window !== 'undefined' && window.matchMedia(q).matches;

export const prefersReducedMotion = () => mq('(prefers-reduced-motion: reduce)');
export const isCoarsePointer = () => mq('(hover: none), (pointer: coarse)');
export const isMobile = () => mq('(max-width: 768px)');

export const EASE = 'expo.out';

// ---------------------------------------------------------------------------
// Lenis smooth scroll, driven by the GSAP ticker so ScrollTrigger stays in sync.
// ---------------------------------------------------------------------------
let lenis = null;

export function initSmoothScroll() {
  if (lenis || prefersReducedMotion()) return lenis;
  lenis = new Lenis({ duration: 1.2, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  return lenis;
}

export const getLenis = () => lenis;

export function scrollToTarget(target) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  if (lenis) lenis.scrollTo(el, { duration: 1.6 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  // Move keyboard focus to the target for accessibility.
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();

// Turns "Selected *work*" into [{ text: 'Selected', italic: false }, { text: 'work', italic: true }].
export function parseTitle(title) {
  return title
    .split(' ')
    .filter(Boolean)
    .map((w) => {
      const italic = w.startsWith('*');
      return { text: w.replace(/\*/g, ''), italic };
    });
}

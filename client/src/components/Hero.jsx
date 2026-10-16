import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion, scrollToTarget, EASE } from '../lib/motion';
import { profile, links } from '../data/portfolio';
import FlowField from './FlowField';
import Magnetic from './Magnetic';

function Letters({ word, className = '' }) {
  return (
    <span className={`hero__line ${className}`} aria-hidden="true">
      {[...word].map((c, i) => (
        <span key={i} className="hero__mask">
          <span className="hero__char">{c}</span>
        </span>
      ))}
    </span>
  );
}

/** Roles slide up through a mask, one after another, forever. */
function RoleRotator({ roles }) {
  const ref = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const items = ref.current.querySelectorAll('.roles__item');
    gsap.set(items, { yPercent: 110 });
    gsap.set(items[0], { yPercent: 0 });
    const tl = gsap.timeline({ repeat: -1, delay: 2.6 });
    items.forEach((_, i) => {
      const next = items[(i + 1) % items.length];
      tl.to(items[i], { yPercent: -110, duration: 0.9, ease: 'expo.inOut' }, '+=1.8')
        .fromTo(next, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: 'expo.inOut' }, '<');
    });
    return () => tl.kill();
  }, [roles]);

  return (
    <span className="roles">
      <span className="sr-only">{roles.join(', ')}</span>
      <span ref={ref} className="roles__track" aria-hidden="true">
        {roles.map((r) => (
          <span key={r} className="roles__item">
            {r}
          </span>
        ))}
      </span>
    </span>
  );
}

export default function Hero({ ready }) {
  const ref = useRef(null);
  const [first, last] = profile.name.split(' ').map((s) => s.charAt(0) + s.slice(1).toLowerCase());

  useEffect(() => {
    const root = ref.current;
    if (prefersReducedMotion()) return;
    const chars = root.querySelectorAll('.hero__char');
    const fades = root.querySelectorAll('.hero__fade');
    gsap.set(chars, { yPercent: 110 });
    gsap.set(fades, { opacity: 0, y: 24 });
    if (!ready) return;

    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(chars, { yPercent: 0, duration: 1.6, ease: EASE, stagger: 0.045 })
      .to(fades, { opacity: 1, y: 0, duration: 1.2, ease: EASE, stagger: 0.08 }, 0.6)
      .fromTo('.hero__field', { opacity: 0 }, { opacity: 1, duration: 2.4, ease: 'power2.out' }, 0);

    // Name drifts and fades slightly as you scroll away.
    const scrollTween = gsap.to('.hero__name', {
      yPercent: -18,
      opacity: 0.35,
      ease: 'none',
      scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
    });
    return () => {
      tl.kill();
      scrollTween.scrollTrigger?.kill();
      scrollTween.kill();
    };
  }, [ready]);

  return (
    <section ref={ref} id="top" data-theme="dark" className="hero theme-dark" aria-labelledby="hero-title">
      <FlowField className="hero__field" />
      <div className="hero__veil" aria-hidden="true" />

      <div className="section__inner hero__inner">
        <div className="hero__meta hero__fade">
          <span>B.Tech Computer Science</span>
          <span>SRM University-AP</span>
          <span>2023 — present</span>
        </div>

        <h1 id="hero-title" className="hero__name">
          <span className="sr-only">{profile.name}</span>
          <Letters word={first} />
          <Letters word={last} className="is-italic" />
        </h1>

        <div className="hero__bottom">
          <p className="hero__role hero__fade">
            <span className="hero__role-label">Currently</span>
            <RoleRotator roles={profile.roles} />
          </p>

          <div className="hero__right">
            <p className="hero__tagline hero__fade">{profile.tagline}</p>
            <div className="hero__actions hero__fade">
              <Magnetic
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToTarget('#work');
                }}
              >
                View projects
              </Magnetic>
              <Magnetic href={links.github} variant="ghost">
                GitHub
              </Magnetic>
              <Magnetic href={profile.resume} variant="ghost" download>
                Resume
              </Magnetic>
            </div>
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="scroll-cue hero__fade"
        onClick={(e) => {
          e.preventDefault();
          scrollToTarget('#about');
        }}
      >
        <span>Scroll</span>
        <span className="scroll-cue__line" aria-hidden="true" />
      </a>
    </section>
  );
}

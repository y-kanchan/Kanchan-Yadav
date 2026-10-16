import { useEffect, useRef, useState } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion, scrollToTarget, stopScroll, startScroll } from '../lib/motion';
import { nav, profile, links } from '../data/portfolio';

function RollText({ children }) {
  return (
    <span className="roll">
      <span className="roll__a">{children}</span>
      <span className="roll__b" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

export default function Navbar({ ready }) {
  const [theme, setTheme] = useState('dark');
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef(null);
  const menuRef = useRef(null);

  // Nav colour follows whichever themed section sits under it.
  useEffect(() => {
    const triggers = [...document.querySelectorAll('[data-theme]')].map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 40px',
        end: 'bottom 40px',
        onToggle: (self) => self.isActive && setTheme(el.dataset.theme),
      })
    );
    // Hide on scroll down, reveal on scroll up.
    const hide = ScrollTrigger.create({
      start: 'top -120',
      onUpdate: (self) => setHidden(self.direction === 1),
      onLeaveBack: () => setHidden(false),
    });
    return () => {
      triggers.forEach((t) => t.kill());
      hide.kill();
    };
  }, []);

  useEffect(() => {
    if (!ready || prefersReducedMotion()) return;
    gsap.fromTo(headerRef.current.children, { yPercent: -120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.2, ease: 'expo.out', stagger: 0.08, delay: 0.5 });
  }, [ready]);

  // Fullscreen menu: panel wipes down, links rise in.
  useEffect(() => {
    const menu = menuRef.current;
    const panel = menu.querySelector('.menu__panel');
    const items = menu.querySelectorAll('.menu__item');
    const reduced = prefersReducedMotion();

    if (open) {
      stopScroll();
      document.documentElement.classList.add('is-locked');
      gsap.set(menu, { visibility: 'visible' });
      if (reduced) gsap.set([panel, ...items], { yPercent: 0, opacity: 1 });
      else {
        gsap
          .timeline()
          .fromTo(panel, { yPercent: -100 }, { yPercent: 0, duration: 0.9, ease: 'expo.inOut' })
          .fromTo(items, { yPercent: 110 }, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.06 }, '-=0.35');
      }
      menu.querySelector('a')?.focus({ preventScroll: true });
      const onKey = (e) => e.key === 'Escape' && setOpen(false);
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }

    startScroll();
    document.documentElement.classList.remove('is-locked');
    if (reduced) gsap.set(menu, { visibility: 'hidden' });
    else
      gsap
        .timeline()
        .to(items, { yPercent: -110, duration: 0.45, ease: 'power3.in', stagger: 0.03 })
        .to(panel, { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, '-=0.2')
        .set(menu, { visibility: 'hidden' });
  }, [open]);

  const go = (e, href) => {
    e.preventDefault();
    const wasOpen = open;
    setOpen(false);
    setTimeout(() => scrollToTarget(href), wasOpen ? 700 : 0);
  };

  return (
    <>
      <header ref={headerRef} className={`nav theme-${open ? 'dark' : theme} ${hidden && !open ? 'is-hidden' : ''}`}>
        <a href="#top" className="nav__logo" onClick={(e) => go(e, '#top')} aria-label={`${profile.name}, back to top`}>
          <RollText>Kanchan Yadav</RollText>
        </a>
        <nav aria-label="Primary" className="nav__links">
          {nav.map((item, i) => (
            <a key={item.href} href={item.href} onClick={(e) => go(e, item.href)} className="nav__link">
              <sup aria-hidden="true">0{i + 1}</sup>
              <RollText>{item.label}</RollText>
            </a>
          ))}
        </nav>
        <button className="nav__toggle" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <span className={`burger ${open ? 'is-open' : ''}`} aria-hidden="true">
            <i />
            <i />
          </span>
        </button>
      </header>

      <div id="menu" ref={menuRef} className="menu" aria-hidden={!open} inert={!open}>
        <div className="menu__panel theme-dark">
          <nav aria-label="Menu" className="menu__nav">
            {nav.map((item, i) => (
              <span key={item.href} className="menu__mask">
                <a href={item.href} className="menu__item" onClick={(e) => go(e, item.href)}>
                  <span className="menu__index">0{i + 1}</span>
                  {item.label}
                </a>
              </span>
            ))}
          </nav>
          <div className="menu__foot">
            <span className="menu__mask">
              <a className="menu__item menu__small" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </span>
            <span className="menu__mask">
              <a className="menu__item menu__small" href={links.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

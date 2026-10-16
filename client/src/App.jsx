import { useCallback, useEffect, useState } from 'react';
import { gsap, initSmoothScroll, ScrollTrigger, stopScroll, startScroll, prefersReducedMotion } from './lib/motion';
import Loader from './components/Loader';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Certifications from './components/Certifications';
import GitHubLog from './components/GitHubLog';
import Contact from './components/Contact';
import Footer from './components/Footer';

/** Generic fade-up for anything marked data-reveal. */
function useRevealOnScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const els = gsap.utils.toArray('[data-reveal]');
    gsap.set(els, { opacity: 0, y: 40 });
    const triggers = ScrollTrigger.batch(els, {
      start: 'top 90%',
      once: true,
      onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 1.3, ease: 'expo.out', stagger: 0.08 }),
    });
    return () => {
      triggers.forEach((t) => t.kill());
      gsap.set(els, { clearProps: 'opacity,transform' });
    };
  }, []);
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initSmoothScroll();
    stopScroll();
    document.documentElement.classList.add('is-locked');
  }, []);

  useRevealOnScroll();

  const handleLoaded = useCallback(() => {
    setReady(true);
    startScroll();
    document.documentElement.classList.remove('is-locked');
    // Layout may have shifted while fonts/images loaded behind the loader.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {!ready && <Loader onDone={handleLoaded} />}
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <Navbar ready={ready} />
      <main id="main">
        <Hero ready={ready} />
        <About />
        <Experience />
        <Marquee theme="dark" />
        <Projects />
        <Skills />
        <Certifications />
        <GitHubLog />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

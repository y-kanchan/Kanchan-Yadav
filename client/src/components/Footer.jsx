import { useEffect, useRef, useState } from 'react';
import { profile } from '../data/portfolio';
import { gsap, prefersReducedMotion, scrollToTarget } from '../lib/motion';

const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: profile.timezone,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

function Clock() {
  const [now, setNow] = useState(() => fmt.format(new Date()));
  useEffect(() => {
    const id = setInterval(() => setNow(fmt.format(new Date())), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <p className="footer__clock">
      <span className="footer__live" aria-hidden="true" />
      <time aria-label={`Local time in India: ${now}`}>{now}</time>
      <span>IST</span>
    </p>
  );
}

export default function Footer() {
  const markRef = useRef(null);

  // Giant wordmark rises letter by letter as the footer comes into view.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const chars = markRef.current.querySelectorAll('.wordmark__c');
    const tween = gsap.fromTo(
      chars,
      { yPercent: 100 },
      { yPercent: 0, ease: 'expo.out', duration: 1.6, stagger: 0.04, scrollTrigger: { trigger: markRef.current, start: 'top 95%', once: true } }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <footer className="footer theme-dark" data-theme="dark">
      <div className="section__inner">
        <div className="footer__row">
          <p className="footer__copy">© {new Date().getFullYear()} Kanchan Yadav — compiled with &lt;/&gt; and caffeine</p>
          <Clock />
          <a
            href="#top"
            className="link-arrow"
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget('#top');
            }}
          >
            Back to top <span>↑</span>
          </a>
        </div>
        <p ref={markRef} className="wordmark" aria-hidden="true">
          {[...'Kanchan'].map((c, i) => (
            <span key={i} className="wordmark__c">
              {c}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}

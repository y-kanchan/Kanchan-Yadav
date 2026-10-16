import { useEffect, useRef } from 'react';
import { about, titles } from '../data/portfolio';
import { gsap, prefersReducedMotion } from '../lib/motion';
import Section from './Section';
import Duotone from './Duotone';
import portrait from '../assets/portrait.jpeg';

/** Paragraph whose words brighten one by one as it scrolls through the viewport. */
function ScrubText({ text }) {
  const ref = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const words = ref.current.querySelectorAll('.scrub__w');
    const tween = gsap.fromTo(
      words,
      { opacity: 0.14 },
      {
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
      }
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [text]);

  return (
    <p ref={ref} className="scrub">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(' ').map((w, i) => (
          <span key={i} className="scrub__w">
            {w}{' '}
          </span>
        ))}
      </span>
    </p>
  );
}

export default function About() {
  return (
    <Section id="about" theme="light" index="01" label="About" title={titles.about}>
      <ScrubText text={about.statement} />

      <div className="about">
        <figure className="about__photo" data-reveal>
          <Duotone src={portrait} alt="Portrait of Kanchan Yadav" ratio={1123 / 1400} parallax />
          <figcaption>Kanchan Yadav — 2026</figcaption>
        </figure>

        <dl className="about__facts">
          {about.entries.map((e) => (
            <div key={e.key} className="fact" data-reveal>
              <dt>{e.key.replace('_', ' ')}</dt>
              <dd>
                {e.value ?? (
                  <ul>
                    {e.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  );
}

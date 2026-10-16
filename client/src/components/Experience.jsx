import { useEffect, useRef } from 'react';
import { experience, stats, titles } from '../data/portfolio';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import Section from './Section';

function Stat({ value, suffix, label, note }) {
  const numRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = numRef.current;
    if (prefersReducedMotion()) return;
    el.textContent = '0';
    const counter = { v: 0 };
    let tween;
    const st = ScrollTrigger.create({
      trigger: wrapRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        tween = gsap.to(counter, {
          v: value,
          duration: 2.2,
          ease: 'expo.out',
          onUpdate: () => (el.textContent = Math.round(counter.v)),
        });
      },
    });
    return () => {
      st.kill();
      tween?.kill();
      el.textContent = String(value);
    };
  }, [value]);

  return (
    <div ref={wrapRef} className="stat" role="listitem" data-reveal>
      <p className="stat__value">
        <span className="sr-only">{`${value}${suffix}`}</span>
        <span aria-hidden="true">
          <span ref={numRef}>{value}</span>
          <span className="stat__suffix">{suffix}</span>
        </span>
      </p>
      <p className="stat__label">{label}</p>
      <p className="stat__note">{note}</p>
    </div>
  );
}

export default function Experience() {
  return (
    <Section id="experience" theme="dark" index="02" label="Experience" title={titles.experience}>
      <ol className="jobs">
        {experience.map((job) => (
          <li key={job.role + job.period} className="job" data-reveal>
            <p className="job__period">{job.period}</p>
            <div>
              <h3 className="job__role">{job.role}</h3>
              <p className="job__org">{job.org}</p>
            </div>
            <ul className="job__points">
              {job.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div className="stats" role="list" aria-label="Impact in numbers">
        {stats.map((s) => (
          <Stat key={s.label} {...s} />
        ))}
      </div>
    </Section>
  );
}

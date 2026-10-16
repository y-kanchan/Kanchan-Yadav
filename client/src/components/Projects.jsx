import { useEffect, useRef, useState } from 'react';
import { projects, links, repoCount, titles } from '../data/portfolio';
import { gsap, isCoarsePointer, prefersReducedMotion } from '../lib/motion';
import Section from './Section';
import Cover from './Cover';
import Magnetic from './Magnetic';

function FeaturedCard({ project, flip, index }) {
  return (
    <article className={`feature ${flip ? 'is-flip' : ''}`} data-reveal>
      <a href={project.repo} target="_blank" rel="noopener noreferrer" className="feature__media" data-cursor="View" data-cursor-theme="space" tabIndex={-1} aria-hidden="true">
        <Cover project={project} index={index} parallax />
      </a>
      <div className="feature__body">
        <p className="feature__meta">
          <span>{project.id}</span>
          <span>Featured</span>
          <span>{project.subtitle}</span>
        </p>
        <h3 className="feature__title">
          <a href={project.repo} target="_blank" rel="noopener noreferrer">
            {project.title}
            <span className="sr-only"> (opens GitHub repository)</span>
          </a>
        </h3>
        <p className="feature__desc">{project.description}</p>
        <ul className="tags" aria-label="Tech stack">
          {project.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <a href={project.repo} target="_blank" rel="noopener noreferrer" className="link-arrow" tabIndex={-1} aria-hidden="true">
          View repository <span>↗</span>
        </a>
      </div>
    </article>
  );
}

/** Hover list: a floating preview of the hovered project trails the cursor. */
function ProjectList({ items }) {
  const previewRef = useRef(null);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    if (isCoarsePointer()) return;
    const el = previewRef.current;
    const reduced = prefersReducedMotion();
    const xTo = gsap.quickTo(el, 'x', { duration: reduced ? 0.01 : 0.7, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: reduced ? 0.01 : 0.7, ease: 'power3.out' });
    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div className="plist" onMouseLeave={() => setActive(-1)}>
      <ul>
        {items.map((p, i) => (
          <li key={p.id} className={`prow ${active === i ? 'is-active' : ''} ${active !== -1 && active !== i ? 'is-dim' : ''}`} data-reveal>
            <a
              href={p.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="prow__link"
              data-cursor="Open"
              data-cursor-theme="space"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(-1)}
            >
              <span className="prow__num">{p.id}</span>
              <span className="prow__title">
                {p.title}
                <span className="sr-only"> — {p.subtitle} (opens GitHub repository)</span>
              </span>
              <span className="prow__sub" aria-hidden="true">
                {p.subtitle}
              </span>
              <span className="prow__arrow" aria-hidden="true">
                ↗
              </span>
            </a>
            <div className="prow__detail">
              <p>{p.description}</p>
              <ul className="tags" aria-label="Tech stack">
                {p.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>

      <div ref={previewRef} className={`preview ${active !== -1 ? 'is-visible' : ''}`} aria-hidden="true">
        <div className="preview__frame">
          <div className="preview__strip" style={{ transform: `translateY(${-Math.max(active, 0) * 100}%)` }}>
            {items.map((p, i) => (
              <div key={p.id} className="preview__item">
                <Cover project={p} index={i + 2} compact />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <Section
      id="work"
      theme="light"
      index="03"
      label="Work"
      title={titles.work}
      aside={<p>A few things I&rsquo;ve designed, built and shipped — from AI interviewers to offline tutors.</p>}
    >
      <div className="features">
        {featured.map((p, i) => (
          <FeaturedCard key={p.id} project={p} index={i} flip={i % 2 === 1} />
        ))}
      </div>

      <ProjectList items={rest} />

      <div className="projects__more" data-reveal>
        <Magnetic href={links.githubRepos} className="btn--xl" strength={0.2}>
          View all {repoCount} repositories ↗
        </Magnetic>
      </div>
    </Section>
  );
}

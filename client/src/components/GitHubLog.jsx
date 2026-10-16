import { useMemo, useState } from 'react';
import { githubChart, links, titles } from '../data/portfolio';
import Section from './Section';
import Magnetic from './Magnetic';

// Stand-in grid if the chart service is unavailable.
function PlaceholderGraph() {
  const cells = useMemo(() => Array.from({ length: 53 * 7 }, () => Math.random()), []);
  return (
    <div className="graph__placeholder" role="img" aria-label="Contribution graph placeholder">
      {cells.map((v, i) => (
        <i key={i} style={{ opacity: v > 0.6 ? 0.2 + v * 0.8 : 0.07 }} />
      ))}
    </div>
  );
}

export default function GitHubLog() {
  const [failed, setFailed] = useState(false);
  return (
    <Section
      id="github"
      theme="dark"
      index="06"
      label="GitHub"
      title={titles.github}
      aside={
        <Magnetic href={links.github} variant="ghost">
          github.com/{links.githubUser} ↗
        </Magnetic>
      }
    >
      <figure className="graph" data-reveal>
        <div className="graph__frame">
          {failed ? (
            <PlaceholderGraph />
          ) : (
            <img
              src={githubChart}
              alt={`GitHub contribution graph for ${links.githubUser} over the past year`}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
            />
          )}
        </div>
        <figcaption>Contributions over the last twelve months</figcaption>
      </figure>
    </Section>
  );
}

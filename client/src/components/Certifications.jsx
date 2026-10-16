import { certifications, titles } from '../data/portfolio';
import Section from './Section';

export default function Certifications() {
  return (
    <Section id="certifications" theme="light" index="05" label="Certifications" title={titles.certifications}>
      <ul className="certs">
        {certifications.map((c, i) => (
          <li key={c.code} className="cert" data-reveal>
            <div className="cert__top">
              <span>{String(i + 1).padStart(2, '0')}</span>
              <span>{c.issuer}</span>
            </div>
            <h3 className="cert__title">{c.title}</h3>
            <p className="cert__foot">
              <span className="cert__seal" aria-hidden="true">✦</span> Certified
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

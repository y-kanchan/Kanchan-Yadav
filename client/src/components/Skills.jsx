import { skills, titles } from '../data/portfolio';
import Section from './Section';

export default function Skills() {
  return (
    <Section id="skills" theme="dark" index="04" label="Skills" title={titles.skills}>
      <div className="skills">
        {skills.map((g, gi) => (
          <div key={g.group} className="skills__group" data-reveal>
            <h3 className="skills__head">
              <span aria-hidden="true">{String(gi + 1).padStart(2, '0')}</span>
              {g.group}
            </h3>
            <ul className="skills__list">
              {g.items.map((s) => (
                <li key={s} className="chip">
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}

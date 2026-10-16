import SplitReveal from './SplitReveal';

/**
 * Section shell: theme (dark = ivory on charcoal, light = charcoal on ivory),
 * small numbered label and a large serif title that rises in on scroll.
 */
export default function Section({ id, theme = 'dark', index, label, title, children, className = '', aside }) {
  return (
    <section id={id} data-theme={theme} className={`section theme-${theme} ${className}`} aria-labelledby={`${id}-title`}>
      <div className="section__inner">
        <header className="section__head">
          <p className="eyebrow" data-reveal>
            <span>({index})</span>
            <span>{label}</span>
          </p>
          <div className="section__headrow">
            <SplitReveal id={`${id}-title`} text={title} className="title" />
            {aside && (
              <div className="section__aside" data-reveal>
                {aside}
              </div>
            )}
          </div>
        </header>
        {children}
      </div>
    </section>
  );
}

import { useRef, useState } from 'react';
import { profile, links, titles } from '../data/portfolio';
import SplitReveal from './SplitReveal';
import Magnetic from './Magnetic';
import Toast from './Toast';

const EMAIL_RE = /^\S+@\S+\.\S+$/;

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState('');
  const [toast, setToast] = useState(null);
  const toastId = useRef(0);

  const notify = (text) => setToast({ text, id: ++toastId.current });

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Clipboard API blocked (e.g. insecure context): fall back to a hidden textarea.
      const ta = document.createElement('textarea');
      ta.value = profile.email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    notify('Email copied');
  };

  const onChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: undefined }));
  };

  const openMailClient = () => {
    const subject = encodeURIComponent(`Portfolio contact from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!form.name.trim()) next.name = 'Please tell me your name';
    if (!EMAIL_RE.test(form.email)) next.email = 'Please enter a valid email';
    if (!form.message.trim()) next.message = 'Say a few words';
    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    setStatus('Sending…');
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      // Uses the bundled Express API when it's running; static deploys fall back to mailto.
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject: 'Portfolio contact' }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) throw new Error(data?.message || 'api unavailable');
      setStatus('Thank you — your message is on its way.');
      setForm({ name: '', email: '', message: '' });
      notify('Message sent');
    } catch {
      setStatus('Opening your email app to send it from there…');
      openMailClient();
    } finally {
      setSending(false);
    }
  };

  const field = (name, label, type = 'text', multiline = false) => {
    const Input = multiline ? 'textarea' : 'input';
    const errId = `${name}-err`;
    return (
      <div className={`field ${errors[name] ? 'has-error' : ''} ${form[name] ? 'is-filled' : ''}`}>
        <Input
          id={`f-${name}`}
          name={name}
          type={multiline ? undefined : type}
          rows={multiline ? 4 : undefined}
          value={form[name]}
          onChange={onChange}
          autoComplete={name === 'message' ? 'off' : name}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? errId : undefined}
          className="field__input"
          placeholder=" "
          required
        />
        <label htmlFor={`f-${name}`} className="field__label">
          {label}
        </label>
        {errors[name] && (
          <p id={errId} className="field__error">
            {errors[name]}
          </p>
        )}
      </div>
    );
  };

  return (
    <section id="contact" data-theme="light" className="section theme-light contact" aria-labelledby="contact-title">
      <div className="section__inner">
        <p className="eyebrow" data-reveal>
          <span>(07)</span>
          <span>Contact</span>
        </p>
        <SplitReveal id="contact-title" text={titles.contact} className="contact__title" stagger={0.1} />

        <div className="contact__grid">
          <div className="contact__left" data-reveal>
            <p className="contact__intro">
              Have an idea, an internship, or a research problem worth solving? I&rsquo;d love to hear about it.
            </p>
            <button type="button" className="contact__email" onClick={copyEmail} data-cursor="Copy">
              <span className="contact__email-text">{profile.email}</span>
              <span className="contact__email-hint">Click to copy</span>
            </button>
            <ul className="socials">
              <li>
                <a href={links.github} target="_blank" rel="noopener noreferrer" className="link-arrow">
                  GitHub <span>↗</span>
                </a>
              </li>
              <li>
                <a href={links.linkedin} target="_blank" rel="noopener noreferrer" className="link-arrow">
                  LinkedIn <span>↗</span>
                </a>
              </li>
              <li>
                <a href={profile.resume} className="link-arrow" download>
                  Resume <span>↓</span>
                </a>
              </li>
            </ul>
          </div>

          <form className="form" onSubmit={onSubmit} noValidate aria-label="Contact form" data-reveal>
            {field('name', 'Your name')}
            {field('email', 'Email address', 'email')}
            {field('message', 'Tell me about your project', 'text', true)}
            <div className="form__foot">
              <Magnetic type="submit" disabled={sending}>
                {sending ? 'Sending…' : 'Send message'}
              </Magnetic>
              <p className="form__status" role="status" aria-live="polite">
                {status}
              </p>
            </div>
          </form>
        </div>
      </div>
      <Toast toast={toast} />
    </section>
  );
}

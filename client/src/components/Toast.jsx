import { useEffect, useState } from 'react';

/** Small pill toast. Pass a new `{ text, id }` object to show it again. */
export default function Toast({ toast, duration = 2000 }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(t);
  }, [toast, duration]);

  return (
    <div className={`toast ${visible ? 'is-visible' : ''}`} role="status" aria-live="polite">
      {toast ? (
        <span key={toast.id}>
          <span className="toast__dot" aria-hidden="true" />
          {toast.text}
        </span>
      ) : null}
    </div>
  );
}

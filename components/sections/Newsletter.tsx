'use client';

import { useState } from 'react';
import { newsletter, ApiError } from '@/lib/api';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'duplicate'>('idle');
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setError('');
    try {
      const res = await newsletter.subscribe({ email, consent, website, source: 'footer' });
      setStatus(res.already_subscribed ? 'duplicate' : 'done');
    } catch (err) {
      setStatus('idle');
      const msg =
        err instanceof ApiError && err.status === 429
          ? 'You’ve submitted a few times already — try again later.'
          : err instanceof Error
            ? err.message
            : 'Could not submit. Please try again.';
      setError(msg);
    }
  };

  if (status === 'done' || status === 'duplicate') {
    return (
      <div className="rounded-[6px] border border-gold/40 bg-gold/5 px-5 py-4">
        <p className="text-[13px] font-medium text-charcoal">
          {status === 'duplicate'
            ? 'You’re already on the list — thank you.'
            : 'You’re on the list — we’ll email new batch documentation as it’s published.'}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@lab.com"
          className="min-w-0 flex-1 rounded-[4px] border border-charcoal/15 bg-ivory px-4 py-3 text-sm font-light text-charcoal outline-none focus:border-gold"
        />
        <button
          type="submit"
          disabled={status === 'sending' || !consent}
          className="shrink-0 rounded-full bg-charcoal px-6 py-3 text-[13px] font-medium text-ivory transition-colors duration-500 hover:bg-gold disabled:cursor-not-allowed disabled:bg-taupe-deep disabled:text-ivory/80 disabled:hover:bg-taupe-deep"
        >
          {status === 'sending' ? 'Submitting…' : 'Subscribe'}
        </button>
      </div>

      {/* Honeypot — kept off-screen for accessibility but invisible to humans */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <label className="flex items-start gap-2 text-[12px] font-light text-charcoal/55">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-gold"
          required
        />
        <span>
          I confirm I am a research professional and consent to receive
          catalogue and documentation updates.
        </span>
      </label>

      {error && (
        <p className="text-[12px] font-light text-red-600/80">{error}</p>
      )}
    </form>
  );
}

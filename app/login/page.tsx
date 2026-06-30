'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/account/wallet';
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-wide flex min-h-[80vh] items-center justify-center py-24">
      <div className="w-full max-w-md">
        <span className="eyebrow">Account</span>
        <h1 className="mt-3 text-display font-extralight tracking-tightest text-charcoal">
          Sign in
        </h1>
        <p className="mt-3 text-sm font-light text-charcoal/55">
          Access your wallet, affiliate dashboard, and order history.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <label className="flex flex-col gap-2">
            <span className="text-[12px] font-medium text-charcoal/55">
              Email address
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-[4px] border border-charcoal/15 bg-ivory px-4 py-3 text-sm font-light text-charcoal outline-none focus:border-gold"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-[12px] font-medium text-charcoal/55">
              Password
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-[4px] border border-charcoal/15 bg-ivory px-4 py-3 text-sm font-light text-charcoal outline-none focus:border-gold"
            />
          </label>

          {error && (
            <p className="rounded-[4px] border border-red-600/20 bg-red-600/5 px-4 py-3 text-[13px] font-light text-red-600/90">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-charcoal py-4 text-sm font-medium text-ivory transition-colors duration-500 hover:bg-gold disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] font-light text-charcoal/55">
          No account?{' '}
          <Link
            href={`/register?next=${encodeURIComponent(next)}`}
            className="link-underline font-medium text-charcoal"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/';
  const { register, user } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    date_of_birth: '',
    nationality: '',
    country_of_residence: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  const onChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      router.replace(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-wide flex min-h-[80vh] items-center justify-center py-24">
      <div className="w-full max-w-md">
        <span className="eyebrow">Account</span>
        <h1 className="mt-3 text-display font-extralight tracking-tightest text-charcoal">
          Create account
        </h1>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <Input label="Full name" value={form.name} onChange={onChange('name')} required autoComplete="name" />
          <Input label="Email address" type="email" value={form.email} onChange={onChange('email')} required autoComplete="email" />
          <Input label="Password" type="password" value={form.password} onChange={onChange('password')} required autoComplete="new-password" />
          <Input label="Date of birth" type="date" value={form.date_of_birth} onChange={onChange('date_of_birth')} required />
          <Input label="Nationality" value={form.nationality} onChange={onChange('nationality')} required placeholder="British" />
          <Input label="Country of residence" value={form.country_of_residence} onChange={onChange('country_of_residence')} required placeholder="United Kingdom" />

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
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-[13px] font-light text-charcoal/55">
          Already have an account?{' '}
          <Link
            href={`/login?next=${encodeURIComponent(next)}`}
            className="link-underline font-medium text-charcoal"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

function Input({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-[12px] font-medium text-charcoal/55">{label}</span>
      <input
        {...props}
        className="rounded-[4px] border border-charcoal/15 bg-ivory px-4 py-3 text-sm font-light text-charcoal outline-none focus:border-gold"
      />
    </label>
  );
}

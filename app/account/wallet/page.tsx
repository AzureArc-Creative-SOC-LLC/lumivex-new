'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { wallet, type WalletLedgerEntry } from '@/lib/api';
import { formatPrice } from '@/components/providers/CartProvider';

export default function WalletPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [balance, setBalance] = useState<number | null>(null);
  const [ledger, setLedger] = useState<WalletLedgerEntry[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login?next=/account/wallet');
      return;
    }
    wallet
      .get()
      .then((res) => {
        setBalance(res.balance);
        setLedger(res.ledger);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load wallet'))
      .finally(() => setLoading(false));
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="container-wide flex min-h-[60vh] items-center justify-center py-24">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-charcoal/20 border-t-charcoal" />
      </div>
    );
  }

  return (
    <div className="container-wide py-16 md:py-24">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Account</span>
          <h1 className="mt-3 text-display font-extralight tracking-tightest text-charcoal">
            Wallet
          </h1>
          {user && (
            <p className="mt-2 text-sm font-light text-charcoal/55">
              Signed in as {user.email}
            </p>
          )}
        </div>
        <button
          onClick={logout}
          className="link-underline text-[13px] font-medium text-charcoal/55 hover:text-charcoal"
        >
          Sign out
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-4">
          <div className="rounded-[6px] bg-cream p-8">
            <p className="text-[11px] uppercase tracking-eyebrow text-charcoal/40">
              Current balance
            </p>
            <p className="mt-3 text-5xl font-extralight text-charcoal">
              {balance != null ? formatPrice(balance) : '—'}
            </p>
            <Link
              href="/account/affiliate"
              className="link-underline mt-6 inline-block text-[13px] font-medium text-charcoal"
            >
              Manage affiliate →
            </Link>
          </div>
        </div>

        <div className="lg:col-span-8">
          <h2 className="text-[11px] uppercase tracking-eyebrow text-charcoal/40">
            Recent activity
          </h2>
          {error && (
            <p className="mt-4 rounded-[4px] border border-red-600/20 bg-red-600/5 px-4 py-3 text-[13px] font-light text-red-600/90">
              {error}
            </p>
          )}
          {ledger.length === 0 ? (
            <p className="mt-6 text-sm font-light text-charcoal/55">
              No activity yet.
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-charcoal/10">
              {ledger.map((entry, i) => (
                <li key={i} className="flex items-center justify-between gap-4 py-4">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-charcoal">
                      {entry.note || entry.source.replace(/_/g, ' ')}
                    </p>
                    <p className="text-[12px] font-light text-charcoal/45">
                      {entry.order_number ? `${entry.order_number} · ` : ''}
                      {new Date(entry.created_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <span
                    className={`text-[14px] font-medium ${
                      entry.amount >= 0 ? 'text-gold' : 'text-charcoal/55'
                    }`}
                  >
                    {entry.amount >= 0 ? '+' : ''}
                    {formatPrice(entry.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

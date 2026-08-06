'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';
import { orders } from '@/lib/api';
import { formatPrice } from '@/components/providers/CartProvider';

type Row = Record<string, unknown>;

type Step = 'placed' | 'payment' | 'preparing';

export default function TrackPage() {
  return (
    <Suspense fallback={null}>
      <TrackView />
    </Suspense>
  );
}

function TrackView() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedOrder = searchParams.get('order');

  const [summaries, setSummaries] = useState<Row[]>([]);
  const [selected, setSelected] = useState('');
  const [detail, setDetail] = useState<{ order: Row; items: Row[]; payments: Row[] } | null>(null);
  const [error, setError] = useState('');
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Load the account's order numbers so they can be picked from.
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace('/login?next=/account/track');
      return;
    }
    orders
      .byEmail(user.email)
      .then((res) => {
        setSummaries(res.orders);
        const numbers = res.orders.map((o) => String(o.order_number ?? ''));
        const initial = requestedOrder && numbers.includes(requestedOrder) ? requestedOrder : numbers[0] ?? '';
        setSelected(initial);
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load orders'))
      .finally(() => setLoadingList(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, router]);

  // Load the full detail (items, payment status) for whichever order is selected.
  useEffect(() => {
    if (!selected) return;
    setLoadingDetail(true);
    setError('');
    orders
      .byNumber(selected)
      .then((res) => setDetail(res as { order: Row; items: Row[]; payments: Row[] }))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load order.'))
      .finally(() => setLoadingDetail(false));
  }, [selected]);

  const status = String(detail?.order.payment_status ?? '').toLowerCase();
  const step: Step = status === 'received' || status === 'paid' ? 'preparing' : 'payment';
  const rejected = status === 'rejected';

  if (authLoading || loadingList) {
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
            Track
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

      {error && (
        <p className="mb-6 rounded-[4px] border border-red-600/20 bg-red-600/5 px-4 py-3 text-[13px] font-light text-red-600/90">
          {error}
        </p>
      )}

      {summaries.length === 0 ? (
        <p className="text-sm font-light text-charcoal/55">
          You haven&apos;t placed any orders yet — nothing to track.
        </p>
      ) : (
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <label htmlFor="order-select" className="text-[11px] uppercase tracking-eyebrow text-charcoal/40">
              Order
            </label>
            <select
              id="order-select"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="mt-3 w-full rounded-[4px] border border-charcoal/15 bg-ivory px-4 py-3 text-sm font-light text-charcoal outline-none focus:border-gold"
            >
              {summaries.map((row) => {
                const num = String(row.order_number ?? '');
                return (
                  <option key={num} value={num}>
                    {num}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="lg:col-span-8">
            {loadingDetail || !detail ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-charcoal/20 border-t-charcoal" />
              </div>
            ) : (
              <TrackDetail detail={detail} step={step} rejected={rejected} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function TrackDetail({
  detail,
  step,
  rejected,
}: {
  detail: { order: Row; items: Row[]; payments: Row[] };
  step: Step;
  rejected: boolean;
}) {
  const { order, items } = detail;
  const total = Number(order.total ?? 0);
  const createdAt = order.created_at ? new Date(String(order.created_at)) : null;

  const steps = useMemo(
    () => [
      { key: 'placed' as Step, label: 'Order placed' },
      {
        key: 'payment' as Step,
        label: rejected ? 'Payment rejected' : 'Verifying payment',
      },
      { key: 'preparing' as Step, label: 'Preparing your order' },
    ],
    [rejected]
  );

  const order_ = ['placed', 'payment', 'preparing'] as Step[];
  const activeIndex = order_.indexOf(step);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-charcoal/10 pb-6">
        <p className="font-mono text-[15px] font-medium tracking-wide text-charcoal">
          {String(order.order_number ?? '')}
        </p>
        <p className="text-[13px] font-light text-charcoal/45">
          {createdAt && !isNaN(createdAt.getTime())
            ? createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            : ''}
        </p>
      </div>

      {/* Status timeline */}
      <ol className="mt-8 flex w-full items-start">
        {steps.map((s, i) => {
          const done = rejected ? i === 0 : i <= activeIndex;
          const failed = rejected && i === 1;
          const isLast = i === steps.length - 1;
          return (
            <li key={s.key} className={`flex items-start ${isLast ? 'flex-none' : 'flex-1'}`}>
              <div className="flex flex-col items-start gap-3">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-medium ${
                    failed
                      ? 'bg-red-600/10 text-red-600'
                      : done
                        ? 'bg-gold text-ivory'
                        : 'bg-charcoal/8 text-charcoal/35'
                  }`}
                >
                  {failed ? '✕' : done ? '✓' : i + 1}
                </span>
                <span
                  className={`max-w-[8rem] text-[11px] font-medium uppercase tracking-wider ${
                    failed ? 'text-red-600' : done ? 'text-charcoal' : 'text-charcoal/35'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`mx-3 mt-[11px] h-px flex-1 sm:mx-5 ${
                    i < activeIndex && !rejected ? 'bg-gold' : 'bg-charcoal/10'
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Items */}
      <div className="mt-10">
        <span className="eyebrow">Items</span>
        <ul className="mt-4 divide-y divide-charcoal/10 border-t border-charcoal/10">
          {items.map((item, i) => (
            <li key={i} className="flex items-center justify-between gap-4 py-3">
              <span className="text-[13px] font-light text-charcoal/70">
                {String(item.name ?? '')} × {Number(item.quantity ?? 1)}
              </span>
              <span className="text-[13px] font-medium text-charcoal">
                {formatPrice(Number(item.unit_price ?? 0) * Number(item.quantity ?? 1))}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between border-t border-charcoal/10 pt-4">
          <span className="text-[13px] font-medium text-charcoal">Total</span>
          <span className="text-lg font-light text-charcoal">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}

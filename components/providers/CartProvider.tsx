'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Product } from '@/lib/data';

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clear: () => void;
  /** Increments on every add — lets the UI flash the cart badge. */
  lastAdded: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'lumivex-cart';

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [lastAdded, setLastAdded] = useState(0);

  // Load persisted cart once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // Persist on every change (after initial hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage may be unavailable */
    }
  }, [items, hydrated]);

  const addItem = (product: Product, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: product.priceValue,
          image: product.image,
          category: product.category,
          qty,
        },
      ];
    });
    setLastAdded((n) => n + 1);
  };

  const removeItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

  const updateQty = (id: string, qty: number) =>
    setItems((prev) =>
      prev
        .map((i) => (i.id === id ? { ...i, qty: Math.max(0, qty) } : i))
        .filter((i) => i.qty > 0)
    );

  const clear = () => setItems([]);

  const { count, subtotal } = useMemo(
    () => ({
      count: items.reduce((n, i) => n + i.qty, 0),
      subtotal: items.reduce((sum, i) => sum + i.price * i.qty, 0),
    }),
    [items]
  );

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    addItem,
    removeItem,
    updateQty,
    clear,
    lastAdded,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}

/** Formats a USD amount, e.g. 1240 → "$1,240". */
export const formatPrice = (value: number) =>
  `$${value.toLocaleString('en-US')}`;

import type { Metadata } from 'next';
import ShopHeader from '@/components/shop/ShopHeader';
import CartView from '@/components/shop/CartView';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Your Cart — Lumivex',
  description: 'Review your selected research compounds and proceed to checkout.',
};

export default function CartPage() {
  return (
    <>
      <ShopHeader />
      <main className="min-h-[70vh] bg-ivory">
        <CartView />
      </main>
      <Footer />
    </>
  );
}

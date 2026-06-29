import type { Metadata } from 'next';
import ShopHeader from '@/components/shop/ShopHeader';
import CheckoutView from '@/components/shop/CheckoutView';
import Footer from '@/components/sections/Footer';

export const metadata: Metadata = {
  title: 'Checkout — Lumivex',
  description: 'Complete your research compound order.',
};

export default function CheckoutPage() {
  return (
    <>
      <ShopHeader />
      <main className="min-h-[70vh] bg-ivory">
        <CheckoutView />
      </main>
      <Footer />
    </>
  );
}

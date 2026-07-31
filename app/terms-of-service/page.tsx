import type { Metadata } from 'next';
import PolicyLayout from '@/components/policies/PolicyLayout';

export const metadata: Metadata = {
  title: 'Terms of Service | Lumivex',
  description:
    'The terms governing your use of lumivex.store, including product use, orders, dispatch, refunds, and liability.',
};

export default function TermsOfServicePage() {
  return (
    <PolicyLayout
      eyebrow="Legal"
      title="Terms of Service"
      intro={[
        'You are using the official website of Lumivex ("we", "us", "our"). By using this site, you agree to comply with the following terms. Please read them carefully. If you do not agree with any part of these terms, please do not use our website or services.',
      ]}
      sections={[
        {
          heading: 'General',
          paragraphs: [
            'These Terms govern your use of lumivex.store. We may update these Terms from time to time without notice. Continued use of the website constitutes acceptance of the current Terms.',
          ],
        },
        {
          heading: 'Age Requirement',
          paragraphs: [
            'By accessing this site, you confirm that you are at least 18 years old and are legally able to enter into contracts. Our products and services are intended only for individuals who meet this requirement.',
          ],
        },
        {
          heading: 'Product Use',
          paragraphs: [
            'Products sold on lumivex.store are supplied strictly for research and development purposes under controlled conditions. They are not to be used for diagnosis, treatment, or prevention of any disease or medical condition.',
          ],
        },
        {
          heading: 'Orders & Payment',
          paragraphs: [
            'All orders are subject to acceptance and availability. We reserve the right to refuse or cancel orders at our discretion. Payment must be made in full before orders are dispatched. We accept payment by card, bank transfer, or USDT.',
          ],
        },
        {
          heading: 'Dispatch & Delivery',
          paragraphs: [
            'We aim to dispatch orders within a reasonable timeframe — as a standard, within 2 days, with next-day delivery within the UK. Shipping timelines are not guaranteed and may be affected by external factors. We are not liable for delays beyond our control or that of our shipping methods.',
          ],
        },
        {
          heading: 'Refund Policy',
          paragraphs: [
            'Due to the nature of our products, returns are only accepted for items that are unopened, unused, and in their original condition. Opened or tampered-with items are non-refundable. See our Refund Policy for details.',
          ],
        },
        {
          heading: 'Disclaimer',
          paragraphs: [
            'All products are sold solely for laboratory R&D. Lumivex does not accept or condone misuse, including but not limited to human consumption, veterinary use, or resale.',
          ],
        },
        {
          heading: 'Limitation of Liability',
          paragraphs: [
            'By using this site, you agree to indemnify and hold harmless Lumivex, its directors, and affiliates from any claims, damages, or liabilities arising from product use or non-use under these Terms.',
          ],
        },
        {
          heading: 'Account Responsibility',
          paragraphs: [
            'If you create an account on our website, you are responsible for maintaining the confidentiality of your log-in credentials. All activities conducted under your account are your responsibility.',
          ],
        },
        {
          heading: 'Intellectual Property',
          paragraphs: [
            'All trademarks, logos, and content displayed on lumivex.store are owned or licensed by Lumivex. You may not reproduce, distribute, or commercially exploit any content without prior written consent.',
          ],
        },
        {
          heading: 'Governing Law',
          paragraphs: [
            'These Terms are governed by and construed in accordance with the laws of England and Wales. Any disputes arising will be subject to the exclusive jurisdiction of the UK courts.',
          ],
        },
        {
          heading: 'Contact Us',
          paragraphs: [
            'For any queries relating to these Terms, please contact:',
            'Email: research@lumivex.store — Website: https://lumivex.store',
          ],
        },
      ]}
    />
  );
}

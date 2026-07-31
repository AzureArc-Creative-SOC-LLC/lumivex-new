import type { Metadata } from 'next';
import PolicyLayout from '@/components/policies/PolicyLayout';

export const metadata: Metadata = {
  title: 'Shipping Policy | Lumivex',
  description:
    'How Lumivex processes, dispatches, and delivers orders — cold-chain handling, tracked couriers, and delivery timelines.',
};

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      eyebrow="Legal"
      title="Shipping Policy"
      intro={[
        'This Shipping Policy outlines how orders placed on lumivex.store are processed, dispatched, and delivered.',
      ]}
      sections={[
        {
          heading: 'Dispatch Time',
          paragraphs: [
            'Orders placed and paid for before 3pm (UK time) on working days are typically dispatched the same day. Orders received after 3pm or on weekends/public holidays are dispatched the next working day.',
          ],
        },
        {
          heading: 'Shipping Carriers',
          paragraphs: [
            'We use tracked and signed-for courier services (e.g., UPS, Royal Mail, DPD) depending on destination, weight, and service availability. Once shipped, you will receive tracking information by email or SMS.',
          ],
        },
        {
          heading: 'Delivery Times',
          list: [
            'UK Orders: Typically delivered next working day after dispatch.',
            'International Orders: Delivery times vary by location and customs handling, but usually range from 3–10 working days.',
          ],
        },
        {
          heading: 'Shipping Fees',
          paragraphs: [
            'Shipping costs are shown at checkout, calculated based on your location and parcel weight. We occasionally offer free shipping promotions.',
          ],
        },
        {
          heading: 'Order Tracking',
          paragraphs: [
            "All shipments include tracking. You'll receive a tracking number once your parcel leaves our fulfilment centre.",
          ],
        },
        {
          heading: 'Failed Delivery Attempts',
          paragraphs: [
            'If no one is available to accept the parcel, the courier may leave a calling card or attempt redelivery. You must follow up with the courier directly using your tracking number.',
          ],
        },
        {
          heading: 'Customs & Import Duties',
          paragraphs: [
            'International buyers are responsible for any applicable customs duties, VAT, or import taxes. These charges are not included in our product or shipping prices.',
          ],
        },
        {
          heading: 'Delivery Issues',
          paragraphs: [
            'If your parcel is delayed, lost, or arrives damaged, please contact us at research@lumivex.store within 72 hours of the expected delivery date. Include your order number and tracking details.',
          ],
        },
        {
          heading: 'Address Accuracy',
          paragraphs: [
            'Ensure your delivery details are entered correctly. We cannot be held responsible for delivery issues resulting from incorrect or incomplete address information.',
          ],
        },
        {
          heading: 'Contact Us',
          paragraphs: [
            'For any shipping-related queries, please contact:',
            'Email: research@lumivex.store — Website: https://lumivex.store',
          ],
        },
      ]}
    />
  );
}

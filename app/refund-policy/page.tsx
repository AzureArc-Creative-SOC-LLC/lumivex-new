import type { Metadata } from 'next';
import PolicyLayout from '@/components/policies/PolicyLayout';

export const metadata: Metadata = {
  title: 'Refund Policy | Lumivex',
  description:
    'Lumivex returns and refunds process for research-use-only peptide pens and reference compounds.',
};

export default function RefundPolicyPage() {
  return (
    <PolicyLayout
      eyebrow="Legal"
      title="Refund Policy"
      intro={[
        'Thank you for choosing Lumivex. We take great pride in delivering premium-quality research-use-only products. Please read the following carefully to understand our returns and refund process.',
      ]}
      sections={[
        {
          heading: 'Research-Use Products',
          paragraphs: [
            'All items sold by Lumivex, including peptide pens and reference compounds, are intended strictly for research and development purposes. As such, they are not intended for human consumption, diagnosis, or treatment. By purchasing, you agree to these terms.',
          ],
        },
        {
          heading: 'Returns Eligibility',
          paragraphs: [
            'Due to the sensitive nature of our products and to maintain quality assurance, we do not accept returns on opened or used items. Only unopened, unused items in original condition may be considered for return.',
          ],
        },
        {
          heading: 'Return Window',
          paragraphs: [
            'Customers may request a return within 7 days of delivery. If 7 days have passed since your order was received, unfortunately we cannot offer a refund or exchange.',
          ],
        },
        {
          heading: 'Non-Returnable Items',
          paragraphs: ['We are unable to accept returns for:'],
          list: [
            'Opened or used items',
            'Products not stored correctly (e.g., not kept refrigerated)',
            'Items not in their original packaging',
            'Returns initiated after 7 days from delivery',
          ],
        },
        {
          heading: 'Reporting Issues',
          paragraphs: [
            'If your order arrives damaged, incorrect, or defective, please contact our support team at research@lumivex.store within 48 hours of delivery. Include your order number, description of the issue, and supporting photos.',
          ],
        },
        {
          heading: 'Return Approval',
          paragraphs: [
            'Once we receive your request, we will assess it and notify you of the approval status. If approved, we will issue return instructions. Return postage is the customer’s responsibility unless the error was ours.',
          ],
        },
        {
          heading: 'Refund Processing',
          paragraphs: [
            'Approved refunds will be processed to your original payment method within 5–10 business days. For crypto payments, the USD equivalent at the time of refund will be issued (minus any gas or transaction fees).',
          ],
        },
        {
          heading: 'Delayed Refunds',
          paragraphs: ["If you haven't received your refund after 10 business days:"],
          list: ['First, check your bank.', 'Then contact us at research@lumivex.store for assistance.'],
        },
        {
          heading: 'Contact Us',
          paragraphs: [
            'For any refund-related queries, please contact:',
            'Email: research@lumivex.store — Website: https://lumivex.store',
          ],
        },
      ]}
    />
  );
}

import type { Metadata } from 'next';
import PolicyLayout from '@/components/policies/PolicyLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy | Lumivex',
  description:
    'How Lumivex collects, uses, and protects your personal information in line with UK GDPR and the Data Protection Act 2018.',
};

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      eyebrow="Legal"
      title="Privacy Policy"
      intro={[
        'This Privacy Policy explains how Lumivex ("we", "us", "our") collects, uses, and protects your personal information when you visit or make a purchase from lumivex.store.',
        'We are committed to safeguarding your privacy and complying with UK GDPR and the Data Protection Act 2018.',
      ]}
      sections={[
        {
          heading: 'What We Collect',
          paragraphs: ['We may collect and process the following types of data:'],
          list: [
            'Your name and contact details',
            'Shipping and billing addresses',
            'Email correspondence or messages',
            'Purchase history and transaction details',
            'Technical data like IP address, browser type, and device information',
          ],
        },
        {
          heading: 'How We Use Your Information',
          paragraphs: ['We use your information to:'],
          list: [
            'Process and fulfil orders',
            'Provide customer service and order updates',
            'Respond to enquiries or requests',
            'Improve website functionality and experience',
            'Comply with legal or regulatory obligations',
          ],
          note: 'We do not sell or rent your data to third parties.',
        },
        {
          heading: 'Third-Party Sharing',
          paragraphs: [
            'We only share data with trusted third-party providers who help us operate our business, such as:',
          ],
          list: [
            'Payment processors',
            'Couriers and logistics providers',
            'Website and IT service platforms',
          ],
        },
        {
          heading: 'Data Security',
          paragraphs: [
            'We implement appropriate security measures to protect your personal information, including:',
          ],
          list: [
            'Secure Socket Layer (SSL) encryption on our website',
            'Limited access to data by authorised staff only',
            'Regular reviews of data security practices',
          ],
        },
        {
          heading: 'Your Rights',
          paragraphs: ['You have the right to:'],
          list: [
            'Access the personal data we hold on you',
            'Request corrections to inaccurate information',
            'Request data deletion (where appropriate)',
            'Object to certain processing activities',
            'Withdraw consent at any time',
          ],
          note: 'To exercise your rights, contact research@lumivex.store.',
        },
        {
          heading: 'Cookies',
          paragraphs: [
            'We use cookies to enhance your experience and track usage patterns. You can manage or disable cookies in your browser settings at any time.',
          ],
        },
        {
          heading: 'Data Retention',
          paragraphs: [
            'We retain your data only for as long as necessary to fulfil the purposes outlined in this policy, including legal, accounting, or regulatory obligations.',
          ],
        },
        {
          heading: 'Policy Updates',
          paragraphs: [
            'We may update this Privacy Policy periodically. Any changes will be posted here with a new effective date.',
          ],
        },
        {
          heading: 'Contact Us',
          paragraphs: [
            'For any data-related queries, please contact:',
            'Email: research@lumivex.store — Website: https://lumivex.store',
          ],
        },
      ]}
    />
  );
}

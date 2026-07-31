import type { Metadata } from 'next';
import PolicyLayout from '@/components/policies/PolicyLayout';

export const metadata: Metadata = {
  title: 'Press Release | Lumivex',
  description:
    'An official statement from Lumivex on our regulatory positioning, research-only focus, and brand protection against impersonation.',
};

export default function PressReleasePage() {
  return (
    <PolicyLayout
      eyebrow="Media"
      title="Official Statement from Lumivex"
      intro={[
        'This statement sets out Lumivex’s position as a research and development supplier, our regulatory approach, and how we protect customers from impersonation and misinformation.',
      ]}
      sections={[
        {
          heading: '1. Purpose of This Statement',
          paragraphs: [
            'Lumivex operates in a sector that attracts significant public interest and, at times, misinformation. This page exists to give customers, laboratories, and media a clear, factual reference for who we are, how we operate, and what we do and do not claim about our products.',
          ],
        },
        {
          heading: '2. Our Focus: Lawful Research Supply',
          paragraphs: [
            'Lumivex manufactures and supplies research-grade peptides and reference compounds exclusively for laboratory research and development. We do not manufacture, market, or sell pharmaceutical or medicinal products, and we make no therapeutic or clinical claims about any compound we supply.',
          ],
        },
        {
          heading: '3. No Social-Media Sales or Promotion',
          paragraphs: [
            'Lumivex has never operated on any social media platform. Any page, profile, or individual claiming to represent Lumivex on social media is unauthorised and is very likely attempting fraud.',
          ],
          note: 'Our only official site is lumivex.store. Verify any communication directly through research@lumivex.store before acting on it.',
        },
        {
          heading: '4. Regulatory Positioning',
          paragraphs: [
            'As a UK/EU research supplier, Lumivex operates in line with the regulatory frameworks generally applicable to laboratory chemical and reference-material suppliers, including principles drawn from the Health and Safety at Work Act 1974 and COSHH Regulations, the REACH and CLP Regulations governing classification and labelling, and the General Product Safety Regulations for non-hazardous packaging.',
            'Every product we supply is labelled: "For laboratory research and development purposes only. Not for human or veterinary use."',
          ],
        },
        {
          heading: '5. Brand Protection & Impersonation',
          paragraphs: [
            'From time to time, third parties misuse the Lumivex name, logo, or product imagery without authorisation. We actively monitor for this activity and pursue removal wherever it is identified. If you encounter a site, reseller, or social account claiming affiliation with Lumivex outside lumivex.store, please report it to research@lumivex.store.',
          ],
        },
        {
          heading: '6. About Our Research Compounds',
          paragraphs: [
            'The peptides and reference compounds we supply are established subjects of biochemical research, independently of any single manufacturer. Each batch we release is analysed by a third-party laboratory, with certificates of analysis published alongside the corresponding product listing so purity and composition can be independently verified.',
          ],
        },
        {
          heading: '7. Consumer Safety & Quality Standards',
          paragraphs: [
            'Internally, we follow procedures modelled on Good Laboratory Practice (GLP) principles: batch-level traceability and documentation, validated cold-chain handling (2–8°C), tamper-evident and non-hazardous packaging, and a prominent research-only disclaimer on every product.',
            'We strongly advise against purchasing injectable research materials via social media or unverified resellers. Lumivex distributes exclusively through lumivex.store.',
          ],
        },
        {
          heading: '8. Responsible Media Enquiries',
          paragraphs: [
            'We welcome factual, well-sourced reporting on the research-compound sector and are glad to respond to direct enquiries from journalists or regulators. Please route media requests through research@lumivex.store so we can provide accurate, verifiable information.',
          ],
        },
        {
          heading: '9. Summary',
          list: [
            'Supplies research-grade compounds only, fully labelled and traceable.',
            'Has no social-media sales presence — our only official site is lumivex.store.',
            'Publishes independent, third-party certificates of analysis for every batch.',
            'Actively monitors and reports impersonation and misuse of our brand.',
          ],
        },
        {
          heading: 'Contact Us',
          paragraphs: [
            'For any media or general enquiries, please contact:',
            'Email: research@lumivex.store — Website: https://lumivex.store',
          ],
        },
      ]}
    />
  );
}

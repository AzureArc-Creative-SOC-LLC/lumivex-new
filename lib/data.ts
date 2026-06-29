// Returns local image paths as-is; builds an Unsplash URL only for bare IDs.
export const img = (src: string, w = 1600) =>
  src.startsWith('/') || src.startsWith('http')
    ? src
    : `https://images.unsplash.com/photo-${src}?q=80&w=${w}&auto=format&fit=crop`;

export const IMAGES = {
  hero: '/images/hero.jpg',
  collage1: '/images/about3.jpeg',
  collage2: '/images/about1.avif',
  collage3: '/images/about2.jpeg',
  collage4: '/images/about4new-img.jpeg',
  aboutPortrait: '/images/about5.avif',
  aboutSecondary: '/images/collage2.jpg',
  whyus: '/images/whyus.jpg',
  contact: '/images/hero.jpg',
  texture: '/images/collage3.jpg',
};

export const ANNOUNCEMENTS = [
  'RESEARCH USE ONLY — NOT FOR HUMAN CONSUMPTION: All products are for laboratory research and in vitro studies only.',
  'OFFICIAL SITE: Beware of scam sites. Lumivex has never operated on any social media platforms.',
  'SUPPLYING LEADING LABORATORIES ACROSS THE UK & EU WITH HIGH-PURITY RESEARCH COMPOUNDS.',
];

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Shop', href: '#products' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Voices', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export type Product = {
  id: string;
  slug: string;
  name: string;
  tag: string;
  category: string;
  description: string;
  /** Display price, e.g. "£100". */
  price: string;
  /** Numeric price in GBP, used for cart maths. */
  priceValue: number;
  purity: string;
  image: string;
  /** Optional additional gallery shots shown as thumbnails on the detail page. */
  gallery?: string[];
  /** Long-form copy for the product detail page. */
  longDescription: string;
  /** Key/value research specifications. */
  specs: { label: string; value: string }[];
  /** Short bullet highlights. */
  highlights: string[];
};

export const PRODUCTS: Product[] = [
  {
    id: 'tirzepatide-40',
    slug: 'tirzepatide-40mg',
    name: 'Tirzepatide 40mg',
    tag: 'R&D Only',
    category: 'GIP / GLP-1 Research',
    description:
      'A dual GIP and GLP-1 receptor agonist supplied for in vitro metabolic and receptor-signalling research.',
    price: '£100',
    priceValue: 100,
    purity: '99.95%',
    image: '/products/tirzepatide.jpg',
    gallery: [
      '/images/tirzepetide/Artboard2.jpg',
      '/images/tirzepetide/Artboard2copy.jpg',
      '/images/tirzepetide/trizyopen.jpg',
      '/images/tirzepetide/trizyuv.jpg',
    ],
    longDescription:
      'Tirzepatide is a dual GIP and GLP-1 receptor agonist supplied as a lyophilised powder for in vitro metabolic and receptor-signalling research. Each vial is synthesised in-house under ISO clean-room conditions, batch-tested by HPLC and mass spectrometry, and dispatched with a full certificate of analysis. Intended strictly for laboratory research — not for human or veterinary use.',
    specs: [
      { label: 'CAS Number', value: '2023788-19-2' },
      { label: 'Molecular Formula', value: 'C₂₂₅H₃₄₈N₄₈O₆₈' },
      { label: 'Quantity', value: '40mg per vial' },
      { label: 'Form', value: 'Lyophilised powder' },
      { label: 'Storage', value: '−20°C, desiccated' },
    ],
    highlights: [
      'HPLC + mass-spec verified',
      'Certificate of analysis included',
      'Cold-chain dispatch',
    ],
  },
  {
    id: 'retatrutide-20',
    slug: 'retatrutide-20mg',
    name: 'Retatrutide 20mg',
    tag: 'R&D Only',
    category: 'Triple Agonist Research',
    description:
      'A triple GIP/GLP-1/glucagon receptor agonist for advanced metabolic pathway studies in controlled laboratory settings.',
    price: '£100',
    priceValue: 100,
    purity: '99.95%',
    image: '/products/retatrutide-20.jpg',
    gallery: [
      '/images/retatwenty/retafront.jpeg',
      '/images/retatwenty/Artboard4copy.jpg',
      '/images/retatwenty/Artboard4copy3.jpg',
      '/images/retatwenty/retatwentyuv.jpg',
    ],
    longDescription:
      'Retatrutide is a triple GIP / GLP-1 / glucagon receptor agonist developed for advanced metabolic pathway studies. This 20mg presentation is formulated for standard in vitro assay protocols and supplied with documented chain of custody. Synthesised, filled, and verified under controlled laboratory conditions. Research use only.',
    specs: [
      { label: 'CAS Number', value: '2381089-83-2' },
      { label: 'Molecular Formula', value: 'C₂₂₁H₃₄₂N₄₆O₆₈' },
      { label: 'Quantity', value: '20mg per vial' },
      { label: 'Form', value: 'Lyophilised powder' },
      { label: 'Storage', value: '−20°C, desiccated' },
    ],
    highlights: [
      'Triple-receptor agonist',
      'Documented chain of custody',
      'Batch-level purity data',
    ],
  },
  {
    id: 'retatrutide-40',
    slug: 'retatrutide-40mg',
    name: 'Retatrutide 40mg',
    tag: 'R&D Only',
    category: 'Triple Agonist Research',
    description:
      'Higher-concentration triple-receptor agonist formulated for extended in vitro research protocols and comparative assays.',
    price: '£180',
    priceValue: 180,
    purity: '99.95%',
    image: '/products/retatrutide-40.jpg',
    gallery: [
      '/images/retafourty/retafrontnew.jpg',
      '/images/retafourty/retpen.jpg',
      '/images/retafourty/retaopen.jpg',
      '/images/retafourty/retauv.jpg',
    ],
    longDescription:
      'This higher-concentration 40mg presentation of Retatrutide is formulated for extended in vitro research protocols and comparative assays where larger quantities are required. A triple GIP / GLP-1 / glucagon receptor agonist manufactured in-house with full traceability and tamper-evident labelling. Intended strictly for laboratory research.',
    specs: [
      { label: 'CAS Number', value: '2381089-83-2' },
      { label: 'Molecular Formula', value: 'C₂₂₁H₃₄₂N₄₆O₆₈' },
      { label: 'Quantity', value: '40mg per vial' },
      { label: 'Form', value: 'Lyophilised powder' },
      { label: 'Storage', value: '−20°C, desiccated' },
    ],
    highlights: [
      'Extended-protocol quantity',
      'Tamper-evident labelling',
      'Full traceability',
    ],
  },
  {
    id: 'glow-70',
    slug: 'glow-70mg',
    name: 'Glow 70mg',
    tag: 'R&D Only',
    category: 'Regenerative Blend',
    description:
      'A research blend formulated for dermal and connective-tissue signalling studies under controlled laboratory conditions.',
    price: '£100',
    priceValue: 100,
    purity: '99.95%',
    image: '/products/glow.jpg',
    gallery: [
      '/images/glow/glowfrontnew.jpg',
      '/images/glow/glowpen.jpg',
      '/images/glow/glowopen.jpg',
      '/images/glow/glowuv.jpg',
    ],
    longDescription:
      'Glow is a research blend formulated for dermal and connective-tissue signalling studies under controlled laboratory conditions. Each 70mg vial is filled on ISO-certified lines for precise dosing accuracy and sterility, and ships with verified purity documentation. For laboratory research use only.',
    specs: [
      { label: 'Composition', value: 'Regenerative peptide blend' },
      { label: 'Quantity', value: '70mg per vial' },
      { label: 'Form', value: 'Lyophilised powder' },
      { label: 'Storage', value: '−20°C, desiccated' },
      { label: 'Application', value: 'Dermal signalling research' },
    ],
    highlights: [
      'ISO-certified filling',
      'Verified purity',
      'Sterile presentation',
    ],
  },
  {
    id: 'bpc-tb-40',
    slug: 'bpc-157-tb-500-40mg',
    name: 'BPC-157 & TB-500 40mg',
    tag: 'R&D Only',
    category: 'Recovery Blend',
    description:
      'A combined pentadecapeptide and actin-regulating peptide blend for tissue-repair and angiogenesis research.',
    price: '£130',
    priceValue: 130,
    purity: '99.95%',
    image: '/products/bpc.jpg',
    gallery: [
      '/images/bpc/bpcfrontnew.jpg',
      '/images/bpc/bpcpen.jpg',
      '/images/bpc/bpcopen.jpg',
      '/images/bpc/uvbpc.jpg',
    ],
    longDescription:
      'A combined pentadecapeptide (BPC-157) and actin-regulating peptide (TB-500) blend formulated for tissue-repair and angiogenesis research. The 40mg presentation supports comparative recovery-pathway studies in vitro. Manufactured in-house, batch-tested, and dispatched with a full certificate of analysis. Research use only.',
    specs: [
      { label: 'Composition', value: 'BPC-157 + TB-500' },
      { label: 'Quantity', value: '40mg per vial' },
      { label: 'Form', value: 'Lyophilised powder' },
      { label: 'Storage', value: '−20°C, desiccated' },
      { label: 'Application', value: 'Tissue-repair research' },
    ],
    highlights: [
      'Dual-peptide blend',
      'Certificate of analysis',
      'Angiogenesis research grade',
    ],
  },
  {
    id: 'nad-1000',
    slug: 'nad-plus-1000mg',
    name: 'NAD+ 1,000mg',
    tag: 'R&D',
    category: 'Cellular Longevity',
    description:
      'Nicotinamide adenine dinucleotide supplied for cellular metabolism, mitochondrial, and longevity research applications.',
    price: '£140',
    priceValue: 140,
    purity: '99.95%',
    image: '/products/nad.jpg',
    gallery: [
      '/images/nad/nadfront.jpg',
      '/images/nad/pennad.jpg',
      '/images/nad/opennad.jpg',
      '/images/nad/uvnad.jpg',
    ],
    longDescription:
      'Nicotinamide adenine dinucleotide (NAD+) supplied at 1,000mg for cellular metabolism, mitochondrial, and longevity research applications. Manufactured under validated cold-chain conditions to keep the compound stable and compliant through delivery. Each unit is traceable with secure procurement logs. For laboratory research use only.',
    specs: [
      { label: 'CAS Number', value: '53-84-9' },
      { label: 'Molecular Formula', value: 'C₂₁H₂₇N₇O₁₄P₂' },
      { label: 'Quantity', value: '1,000mg per vial' },
      { label: 'Form', value: 'Lyophilised powder' },
      { label: 'Storage', value: '−20°C, desiccated' },
    ],
    highlights: [
      'Validated cold-chain',
      'Mitochondrial research grade',
      'Secure procurement logs',
    ],
  },
];

/** Look up a single product by its URL slug. */
export const getProduct = (slug: string): Product | undefined =>
  PRODUCTS.find((p) => p.slug === slug);

/** Products related to the given one (same category first, then others). */
export const getRelatedProducts = (slug: string, limit = 3): Product[] => {
  const current = getProduct(slug);
  if (!current) return PRODUCTS.slice(0, limit);
  const sameCategory = PRODUCTS.filter(
    (p) => p.slug !== slug && p.category === current.category
  );
  const others = PRODUCTS.filter(
    (p) => p.slug !== slug && p.category !== current.category
  );
  return [...sameCategory, ...others].slice(0, limit);
};

export const WHY_US = [
  {
    no: '01',
    title: 'Built for Peptide R&D',
    text: 'We manufacture the core APIs for our peptide range in-house, controlling quality at every step of synthesis.',
  },
  {
    no: '02',
    title: 'Real-Time Monitoring',
    text: 'Every compound undergoes batch-level monitoring with full transparency into metabolite levels and purity.',
  },
  {
    no: '03',
    title: 'Precision Synthesis',
    text: 'Research compounds are formulated, filled, and dispatched with precision timing and a documented chain of custody.',
  },
  {
    no: '04',
    title: 'Automated Filling',
    text: 'ISO-certified filling lines deliver precise dosing accuracy and sterility for laboratory applications.',
  },
  {
    no: '05',
    title: 'Secure Chain of Custody',
    text: 'Every unit is traceable with tamper-evident labelling and secure procurement logs designed for R&D compliance.',
  },
  {
    no: '06',
    title: 'Cold-Chain Critical',
    text: 'Validated cold-chain packaging keeps compounds stable and compliant during sensitive laboratory delivery.',
  },
];

export const STATS = [
  { value: '48', suffix: '+', label: 'Advanced formulations developed' },
  { value: '26.3', suffix: 'k+', label: 'R&D-tested research units' },
  { value: '99.95', suffix: '%', label: 'Lab-tested purity' },
];

export const TESTIMONIALS = [
  {
    quote:
      'Lumivex has eliminated the uncertainty of unverified vendors. The batch documentation and purity data are the most rigorous we have sourced in the UK.',
    author: 'Dr. Helena Voss',
    role: 'Principal Investigator, Zürich',
    image: '/testimonials/helena.jpg',
  },
  {
    quote:
      'Full traceability, ISO clean-room synthesis, and reliable cold-chain dispatch. This is what a compliant R&D supply chain should look like.',
    author: 'Marcus Lindgren',
    role: 'Laboratory Director, Stockholm',
    image: '/testimonials/marcus.jpg',
  },
  {
    quote:
      'The consistency across batches is extraordinary. Lumivex has become the only research-grade source our protocol trusts.',
    author: 'Dr. Amara Okafor',
    role: 'Research Lead, London',
    image: '/testimonials/amara.jpg',
  },
];

export const FOOTER_LINKS = {
  navigate: [
    { label: 'About Us', href: '#about' },
    { label: 'Shop', href: '#products' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Contact', href: '#contact' },
  ],
  legal: [
    'Press Release',
    'Refund Policy',
    'Shipping Policy',
    'Privacy Policy',
    'Terms of Service',
  ],
};

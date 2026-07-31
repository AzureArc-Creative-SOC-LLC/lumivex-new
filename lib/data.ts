// Returns local image paths as-is; builds an Unsplash URL only for bare IDs.
export const img = (src: string, w = 1600) =>
  src.startsWith('/') || src.startsWith('http')
    ? src
    : `https://images.unsplash.com/photo-${src}?q=80&w=${w}&auto=format&fit=crop`;

export const IMAGES = {
  hero: '/images/hero-seo-new.webp',
  collage1: '/images/inhouse-image1-seo.webp',
  collage2: '/images/inhouse-image2-seo.webp',
  collage3: '/images/inhouse-img3-seo.webp',
  collage4: '/images/inhouse-img4-seo.webp',
  aboutPortrait: '/images/about-seo.webp',
  aboutSecondary: '/images/inhouse-image2-seo.webp',
  whyus: '/images/whyus11-seo.webp',
  contact: '/images/hero-seo-new.webp',
  texture: '/images/inhouse-img3-seo.webp',
};

/**
 * Single source of truth for the research-only disclaimer. Rendered on every
 * product page and in the checkout flow — never edit in one place only.
 */
export const RESEARCH_DISCLAIMER =
  'FOR RESEARCH PURPOSES ONLY. Not intended for human or veterinary use. Not intended to diagnose, treat, cure, or prevent any disease. Products are supplied strictly for laboratory and analytical research conducted by qualified professionals.';

export const CHECKOUT_ACKNOWLEDGEMENT =
  'By proceeding with this purchase, you acknowledge that these products are intended solely for laboratory research purposes and are not intended for human or veterinary use. These products are not intended to diagnose, treat, cure, or prevent any disease.';

export const ANNOUNCEMENTS = [
  'RESEARCH USE ONLY — NOT FOR HUMAN CONSUMPTION: All products are for laboratory research and in vitro studies only.',
  'OFFICIAL SITE: Beware of scam sites. Lumivex has never operated on any social media platforms.',
  'SUPPLYING LEADING LABORATORIES ACROSS THE UK & EU WITH HIGH-PURITY RESEARCH COMPOUNDS.',
];

export const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'Standards', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export type Product = {
  id: string;
  slug: string;
  name: string;
  tag: string;
  category: string;
  description: string;
  /** Display price, e.g. "$100". */
  price: string;
  /** Numeric price in USD, used for cart maths. */
  priceValue: number;
  /** Assayed purity — set only where a third-party report states one. */
  purity?: string;
  image: string;
  /** Optional additional gallery shots shown as thumbnails on the detail page. */
  gallery?: string[];
  /** Long-form copy for the product detail page. */
  longDescription: string;
  /** Key/value research specifications. */
  specs: { label: string; value: string }[];
  /** Short bullet highlights. */
  highlights: string[];
  /** Kit contents and storage blocks shown on the product page. */
  details?: {
    contents?: string;
    storage?: string;
  };
  /** Janoshik third-party test data — enables the certificate modal. */
  janoshik?: {
    fillVolume?: string;
    batchNumber?: string;
    purity?: string;
    compounds?: { name: string; concentration: string; content: string }[];
    /** External verification link (janoshik.com). */
    verifyUrl?: string;
    /** Local certificate images displayed inside the modal. */
    certificateImages?: string[];
  };
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
    price: '$100',
    priceValue: 100,
    purity: '99.85%',
    image: '/products/tirzepatide.jpg',
    gallery: [
      '/images/tirzepetide/Artboard2.jpg',
      '/images/tirzepetide/Artboard2copy.jpg',
      '/images/tirzepetide/trizyopen.jpg',
      '/images/tirzepetide/trizyuv.jpg',
    ],
    longDescription:
      'A 40mg Tirzepatide formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound stability analysis, formulation studies, and delivery mechanism evaluation.',
    specs: [
      { label: 'CAS Number', value: '2023788-19-2' },
      { label: 'Molecular Formula', value: 'C₂₂₅H₃₄₈N₄₈O₆₈' },
      { label: 'Quantity', value: '40mg per research pen' },
      { label: 'Fill Volume', value: '3 mL' },
      { label: 'Batch Number', value: 'TR786PAOS' },
      { label: 'Form', value: 'Pre-filled research pen' },
      { label: 'Storage', value: '2–8°C refrigerated (do not freeze)' },
    ],
    highlights: [
      'Janoshik third-party tested',
      'Certificate of analysis included',
      'Batch-level purity data',
    ],
    details: {
      contents:
        'Each Tirzepatide 40mg Research kit includes:\nPre-filled Research pen (40mg Tirzepatide)\nResearch information sheet',
      storage:
        'Store refrigerated (2–8°C). Do not freeze.\nSupplied in fixed-volume sealed format for laboratory analysis.',
    },
    janoshik: {
      fillVolume: '3 mL',
      batchNumber: 'TR786PAOS',
      purity: '99.85%',
      compounds: [
        {
          name: 'Tirzepatide',
          concentration: '13.35 mg/mL',
          content: '40.05 mg',
        },
      ],
      verifyUrl:
        'https://verify.janoshik.com/tests/147174-ALLUVI_TIRZEPATIDE_40MG_KIT_T5MBWRAYD4HN',
      certificateImages: [
        '/images/tirzepetide/certificate/report.png',
        '/images/tirzepetide/certificate/coa-1.jpg',
        '/images/tirzepetide/certificate/coa-2.jpg',
        '/images/tirzepetide/certificate/coa-3.jpg',
      ],
    },
  },
  {
    id: 'retatrutide-20',
    slug: 'retatrutide-20mg',
    name: 'Retatrutide 20mg',
    tag: 'R&D Only',
    category: 'Triple Agonist Research',
    description:
      'A triple GIP/GLP-1/glucagon receptor agonist for advanced metabolic pathway studies in controlled laboratory settings.',
    price: '$100',
    priceValue: 100,
    purity: '99.21%',
    image: '/products/retatrutide-20.jpg',
    gallery: [
      '/images/retatwenty/retafront.jpeg',
      '/images/retatwenty/Artboard4copy.jpg',
      '/images/retatwenty/Artboard4copy3.jpg',
      '/images/retatwenty/retatwentyuv.jpg',
    ],
    longDescription:
      'A 20mg Retatrutide formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound stability analysis, formulation studies, and delivery mechanism evaluation.',
    specs: [
      { label: 'CAS Number', value: '2381089-83-2' },
      { label: 'Molecular Formula', value: 'C₂₂₁H₃₄₂N₄₆O₆₈' },
      { label: 'Quantity', value: '20mg per research pen' },
      { label: 'Fill Volume', value: '2.4 mL' },
      { label: 'Batch Number', value: 'AR1721TRT' },
      { label: 'Form', value: 'Pre-filled research pen' },
      { label: 'Storage', value: '2–8°C refrigerated (do not freeze)' },
    ],
    highlights: [
      'Triple-receptor agonist',
      'Janoshik third-party tested',
      'Batch-level purity data',
    ],
    details: {
      contents:
        'Each Retatrutide 20mg Research kit includes:\nPre-filled Research pen (20mg Retatrutide)\nResearch information sheet',
      storage:
        'Store refrigerated (2–8°C). Do not freeze.\nSupplied in fixed-volume sealed format for laboratory analysis.',
    },
    janoshik: {
      fillVolume: '2.4 mL',
      batchNumber: 'AR1721TRT',
      purity: '99.21%',
      compounds: [
        {
          name: 'Retatrutide',
          concentration: '9.57 mg/mL',
          content: '22.96 mg',
        },
      ],
      verifyUrl:
        'https://verify.janoshik.com/tests/163215-ALLUVI_RETATRUTIDE_20MG_KIT_GBHEFN58JXXZ',
      certificateImages: [
        '/images/retatwenty/certificate/report.png',
        '/images/retatwenty/certificate/coa-1.jpg',
        '/images/retatwenty/certificate/coa-2.jpg',
      ],
    },
  },
  {
    id: 'retatrutide-40',
    slug: 'retatrutide-40mg',
    name: 'Retatrutide 40mg',
    tag: 'R&D Only',
    category: 'Triple Agonist Research',
    description:
      'Higher-concentration triple-receptor agonist formulated for extended in vitro research protocols and comparative assays.',
    price: '$180',
    priceValue: 180,
    purity: '99.269%',
    image: '/products/retatrutide-40.jpg',
    gallery: [
      '/images/retafourty/retafrontnew.jpg',
      '/images/retafourty/retpen.jpg',
      '/images/retafourty/retaopen.jpg',
      '/images/retafourty/retauv.jpg',
    ],
    longDescription:
      'A 40mg Retatrutide formulation supplied in a pre-filled research device, provided exclusively for controlled laboratory R&D applications. Delivered in sealed format to support compound stability analysis, formulation studies, and delivery mechanism evaluation.',
    specs: [
      { label: 'CAS Number', value: '2381089-83-2' },
      { label: 'Molecular Formula', value: 'C₂₂₁H₃₄₂N₄₆O₆₈' },
      { label: 'Quantity', value: '40mg per research pen' },
      { label: 'Fill Volume', value: '2.4 mL' },
      { label: 'Batch Number', value: 'AR1739JAT' },
      { label: 'Form', value: 'Pre-filled research pen' },
      { label: 'Storage', value: '2–8°C refrigerated (do not freeze)' },
    ],
    highlights: [
      'Extended-protocol quantity',
      'Janoshik third-party tested',
      'Full traceability',
    ],
    details: {
      contents:
        'Each Retatrutide 40mg Research kit includes:\nPre-filled Research pen (40mg Retatrutide)\nResearch information sheet',
      storage:
        'Store refrigerated (2–8°C). Do not freeze.\nSupplied in fixed-volume sealed format for laboratory analysis.',
    },
    janoshik: {
      fillVolume: '2.4 mL',
      batchNumber: 'AR1739JAT',
      purity: '99.269%',
      compounds: [
        {
          name: 'Retatrutide',
          concentration: '18.22 mg/mL',
          content: '43.72 mg',
        },
      ],
      verifyUrl:
        'https://verify.janoshik.com/tests/163216-ALLUVI_RETATRUTIDE_40MG_KIT_TU3SQLQB9ZDQ',
      certificateImages: [
        '/images/retafourty/certificate/report.png',
        '/images/retafourty/certificate/coa-1.jpg',
        '/images/retafourty/certificate/coa-2.jpg',
      ],
    },
  },
  {
    id: 'glow-70',
    slug: 'glow-70mg',
    name: 'Glow 70mg',
    tag: 'R&D Only',
    category: 'Multi-Compound Research Blend',
    description:
      'A 70mg three-compound reference blend of GHK-Cu, BPC-157 and TB-500 supplied in a sealed pre-filled research device for controlled laboratory R&D applications.',
    price: '$100',
    priceValue: 100,
    image: '/products/glow.jpg',
    gallery: [
      '/images/glow/glowfrontnew.jpg',
      '/images/glow/glowpen.jpg',
      '/images/glow/glowopen.jpg',
      '/images/glow/glowuv.jpg',
    ],
    longDescription:
      'A 70mg three-compound reference blend supplied in a sealed pre-filled research device, provided exclusively for controlled laboratory R&D applications. Supplied in fixed-volume sealed format to support compound stability analysis, formulation studies, and analytical method development. This material is used solely for in vitro experiments and may not be (1) used in clinical trials involving humans, (2) administered to humans or animals as part of an experiment or investigation, or (3) supplied to another party for human investigational use.',
    specs: [
      { label: 'Composition', value: 'GHK-Cu + BPC-157 + TB-500' },
      { label: 'Total Contents', value: '10mg BPC-157, 10mg TB-500, 50mg GHK-Cu' },
      { label: 'Fill Volume', value: '3.4 mL' },
      { label: 'Batch Number', value: 'GL0621XSA' },
      { label: 'Form', value: 'Pre-filled research pen' },
      { label: 'Storage', value: '2–8°C refrigerated (do not freeze)' },
    ],
    highlights: [
      'Janoshik third-party tested',
      'Verified compound content',
    ],
    details: {
      contents:
        'Each 70mg blend research kit includes:\n2 × Pre-filled Research pens (Each pen contains 5mg BPC-157, 5mg TB-500, 25mg GHK-Cu)\n\nTotal contents: 10mg BPC-157, 10mg TB-500, 50mg GHK-Cu',
      storage:
        'Store refrigerated (2–8°C). Do not freeze.\nSupplied in fixed-volume sealed format for laboratory analysis.',
    },
    janoshik: {
      fillVolume: '3.4 mL',
      batchNumber: 'GL0621XSA',
      compounds: [
        { name: 'GHK-Cu', concentration: '7.59 mg/mL', content: '25.8 mg' },
        { name: 'BPC-157', concentration: '2.39 mg/mL', content: '8.13 mg' },
        { name: 'TB-500', concentration: '1.99 mg/mL', content: '6.76 mg' },
      ],
      verifyUrl:
        'https://verify.janoshik.com/tests/163217-ALLUVI_GLOW_70MG_KIT_DCL3AJSE4JQP',
      certificateImages: [
        '/images/glow/certificate/report.png',
        '/images/glow/certificate/coa-1.jpg',
        '/images/glow/certificate/coa-2.jpg',
      ],
    },
  },
  {
    id: 'bpc-tb-40',
    slug: 'bpc-157-tb-500-40mg',
    name: 'BPC-157 & TB-500 40mg',
    tag: 'R&D Only',
    category: 'Peptide Blend — Research',
    description:
      'A combined pentadecapeptide and actin-regulating peptide reference blend supplied for in vitro cell-signalling and angiogenesis assay work.',
    price: '$130',
    priceValue: 130,
    image: '/products/bpc.jpg',
    gallery: [
      '/images/bpc/bpcfrontnew.jpg',
      '/images/bpc/bpcpen.jpg',
      '/images/bpc/bpcopen.jpg',
      '/images/bpc/uvbpc.jpg',
    ],
    longDescription:
      'A 40mg BPC-157 & TB-500 reference formulation supplied in a sealed pre-filled research device, provided exclusively for controlled laboratory R&D applications. Supplied in fixed-volume sealed format to support compound stability analysis, formulation studies, and analytical method development.',
    specs: [
      { label: 'Composition', value: 'BPC-157 + TB-500' },
      { label: 'Total Contents', value: '20mg BPC-157, 20mg TB-500' },
      { label: 'Fill Volume', value: '3 mL' },
      { label: 'Batch Number', value: 'BP1701FSR' },
      { label: 'Form', value: 'Pre-filled research pen' },
      { label: 'Storage', value: '2–8°C refrigerated (do not freeze)' },
    ],
    highlights: [
      'Dual-peptide reference blend',
      'Janoshik third-party tested',
      'Verified compound content',
    ],
    details: {
      contents:
        'Each BPC-157 & TB-500 40mg Research kit includes:\nPre-filled Research pen (20mg BPC-157, 20mg TB-500)\nResearch information sheet',
      storage:
        'Store refrigerated (2–8°C). Do not freeze.\nSupplied in fixed-volume sealed format for laboratory analysis.',
    },
    janoshik: {
      fillVolume: '3 mL',
      batchNumber: 'BP1701FSR',
      compounds: [
        { name: 'BPC-157', concentration: '7.33 mg/mL', content: '21.99 mg' },
        { name: 'TB-500', concentration: '6.53 mg/mL', content: '19.59 mg' },
      ],
      verifyUrl:
        'https://verify.janoshik.com/tests/163218-ALLUVI_BPC157_TB500_40MG_KIT_EAI125ZEF8TB',
      certificateImages: [
        '/images/bpc/certificate/report.png',
        '/images/bpc/certificate/coa-1.jpg',
        '/images/bpc/certificate/coa-2.jpg',
      ],
    },
  },
  {
    id: 'nad-1000',
    slug: 'nad-plus-1000mg',
    name: 'NAD+ 1,000mg',
    tag: 'R&D Only',
    category: 'Cellular Metabolism Research',
    description:
      'Nicotinamide adenine dinucleotide supplied as a reference material for in vitro cellular metabolism and mitochondrial research.',
    price: '$140',
    priceValue: 140,
    image: '/products/nad.jpg',
    gallery: [
      '/images/nad/nadfront.jpg',
      '/images/nad/pennad.jpg',
      '/images/nad/opennad.jpg',
      '/images/nad/uvnad.jpg',
    ],
    longDescription:
      'NAD+ (Nicotinamide Adenine Dinucleotide) reference formulation supplied for laboratory analysis and in vitro study only. Provided exclusively for controlled laboratory R&D applications in fixed-volume sealed format.',
    specs: [
      { label: 'CAS Number', value: '53-84-9' },
      { label: 'Molecular Formula', value: 'C₂₁H₂₇N₇O₁₄P₂' },
      { label: 'Total Contents', value: '1,000mg across 2 research pens' },
      { label: 'Form', value: 'Pre-filled research pen' },
      { label: 'Storage', value: '2–8°C refrigerated (do not freeze)' },
    ],
    highlights: [
      'Validated cold-chain handling',
      'Analytical reference material',
      'Secure procurement logs',
    ],
    details: {
      contents:
        'Each NAD+ 1,000mg kit includes:\n2 × Pre-filled NAD+ pens (500mg each)\nResearch information sheet',
      storage: 'Store refrigerated (2–8°C). Do not freeze.',
    },
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
    text: 'Research compounds are formulated and filled with precision timing and a documented chain of custody.',
  },
  {
    no: '04',
    title: 'Automated Filling',
    text: 'Automated filling lines deliver precise fill-volume accuracy and controlled-environment handling for laboratory materials.',
  },
  {
    no: '05',
    title: 'Secure Chain of Custody',
    text: 'Every unit is traceable with tamper-evident labelling and secure procurement logs designed for R&D compliance.',
  },
  {
    no: '06',
    title: 'Cold-Chain Critical',
    text: 'Validated cold-chain packaging and storage keep compounds stable and compliant for sensitive laboratory work.',
  },
];

export const STATS = [
  { value: '6', suffix: '', label: 'Research formulations catalogued' },
  { value: '100', suffix: '%', label: 'Batches supplied with a COA' },
  { value: '99.2', suffix: '%+', label: 'Lowest assayed batch purity' },
];

/**
 * Supplier feedback. Compliance rule: comments may reference documentation,
 * packaging, presentation and service only — never outcomes, effects or use.
 */
export const TESTIMONIALS = [
  {
    quote:
      'Every consignment arrives with its batch documentation and a matching third-party certificate. The paperwork is the most complete we have received from a UK supplier.',
    author: 'Dr. Helena Voss',
    role: 'Principal Investigator, Zürich',
    image: '/images/testimonial1.webp',
  },
  {
    quote:
      'Sealed packaging, intact cold-chain, accurate order contents and traceable batch numbers throughout. Procurement and record-keeping are straightforward as a result.',
    author: 'Marcus Lindgren',
    role: 'Laboratory Director, Stockholm',
    image: '/images/testimonial2.webp',
  },
  {
    quote:
      'Certificates are published per batch and verifiable against the issuing laboratory. Presentation and labelling are consistent across every order we have placed.',
    author: 'Dr. Amara Okafor',
    role: 'Research Lead, London',
    image: '/images/testimonial-3.webp',
  },
];

export const FOOTER_LINKS = {
  navigate: [
    { label: 'About Us', href: '#about' },
    { label: 'Shop', href: '/shop' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Contact', href: '#contact' },
  ],
  legal: [
    { label: 'Press Release', href: '/press-release' },
    { label: 'Refund Policy', href: '/refund-policy' },
    { label: 'Shipping Policy', href: '/shipping-policy' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms of Service', href: '/terms-of-service' },
  ],
};

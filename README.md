# Lumivex — Premium Research Compounds

A premium, luxury editorial-style website for **Lumivex**, a UK/EU research-grade
peptide & compound supplier (content modelled on alluvi.bz). Research use only.
Built as a cinematic, magazine-inspired single page with buttery smooth scrolling,
character/line text reveals, image curtain reveals, and subtle parallax depth.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** — custom warm ivory / sand / taupe / gold palette & fluid type scale
- **GSAP + ScrollTrigger** — scroll-driven reveals, parallax, hero scaling
- **Lenis** — smooth scroll, synced to the GSAP ticker
- **Framer Motion** — product / card entrance animations
- **SplitType** — character & line-level text reveals
- **General Sans** (Fontshare) — ultra-light editorial display typeface

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

## Structure

```
app/
  layout.tsx          # fonts, metadata, smooth-scroll + cursor providers
  page.tsx            # section composition
  globals.css         # design tokens, Lenis styles, cursor, utilities
components/
  providers/SmoothScroll.tsx   # Lenis ⇄ GSAP ScrollTrigger sync
  animations/                  # RevealText, CurtainImage, FadeIn, Parallax
  ui/                          # Cursor (custom), MagneticButton
  sections/                    # Navigation, Hero, Collage, About, Products,
                               # WhyUs, Testimonials, Contact, Footer
lib/
  data.ts             # copy, products, stats, testimonials, image map
  lenis.ts            # smooth scroll-to helper for anchor navigation
```

## Sections

Cinematic Hero · Editorial Collage · About (split-screen) · Products · Why Us
(dark glassmorphism grid) · Testimonials (auto-scroll marquee) · Contact (floating
labels) · Footer (oversized wordmark).

## Design & motion notes

- Hero typography scales fluidly **~180px → 48px** across desktop → mobile.
- Section rhythm uses **160–220px** vertical spacing; container caps at **1280px**.
- Text reveals start at `opacity 0`, `blur(8px)`, vertical offset → `power4.out`, staggered.
- Images reveal behind a vertical mask while scaling `1.15 → 1.0` and de-blurring.
- Navigation is transparent over the hero and transitions to a blurred glass bar on scroll,
  with animated underlines and scroll-spy active states.
- Fully **responsive** (desktop / tablet / mobile) and respects
  `prefers-reduced-motion` (animations and smooth scroll are disabled gracefully).

## Images

Imagery is loaded from Unsplash (configured in `next.config.mjs`). Swap the IDs in
`lib/data.ts` (`IMAGES` map + `PRODUCTS`) to use your own assets.

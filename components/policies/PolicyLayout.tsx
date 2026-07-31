import ShopHeader from '@/components/shop/ShopHeader';
import Footer from '@/components/sections/Footer';

export type PolicySection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
  note?: string;
};

type Props = {
  eyebrow: string;
  title: string;
  intro?: string[];
  updated?: string;
  sections: PolicySection[];
};

export default function PolicyLayout({ eyebrow, title, intro, updated, sections }: Props) {
  return (
    <>
      <ShopHeader />
      <main className="bg-ivory">
        <section className="bg-charcoal py-20 text-ivory md:py-28">
          <div className="container-lux">
            <span className="eyebrow text-gold-light">{eyebrow}</span>
            <h1 className="mt-6 max-w-2xl text-display font-extralight leading-[1.02] tracking-tightest">
              {title}
            </h1>
            {updated && (
              <p className="mt-6 text-[12px] uppercase tracking-wider text-ivory/40">
                Last updated {updated}
              </p>
            )}
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container-lux">
            <div className="max-w-3xl">
              {intro?.map((p, i) => (
                <p
                  key={i}
                  className="mb-6 text-base font-light leading-relaxed text-charcoal/65 last:mb-0"
                >
                  {p}
                </p>
              ))}
            </div>

            <div className="mt-14 max-w-3xl space-y-14">
              {sections.map((s) => (
                <div key={s.heading}>
                  <h3 className="text-2xl font-light tracking-tight text-charcoal">
                    {s.heading}
                  </h3>
                  {s.paragraphs?.map((p, i) => (
                    <p
                      key={i}
                      className="mt-4 text-[15px] font-light leading-relaxed text-charcoal/65"
                    >
                      {p}
                    </p>
                  ))}
                  {s.list && (
                    <ul className="mt-4 space-y-2 pl-5">
                      {s.list.map((item, i) => (
                        <li
                          key={i}
                          className="list-disc text-[15px] font-light leading-relaxed text-charcoal/65 marker:text-gold"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                  {s.note && (
                    <p className="mt-4 text-[15px] font-light leading-relaxed text-charcoal/65">
                      <strong className="font-medium text-charcoal">Note: </strong>
                      {s.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

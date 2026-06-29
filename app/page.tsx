import AnnounceBar from '@/components/sections/AnnounceBar';
import Navigation from '@/components/sections/Navigation';
import Hero from '@/components/sections/Hero';
import Collage from '@/components/sections/Collage';
import About from '@/components/sections/About';
import Marquee from '@/components/sections/Marquee';
import Products from '@/components/sections/Products';
import WhyUs from '@/components/sections/WhyUs';
import Testimonials from '@/components/sections/Testimonials';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';

export default function Home() {
  return (
    <>
      <AnnounceBar />
      <Navigation />
      <main>
        <Hero />
        <Collage />
        <About />
        <Marquee />
        <Products />
        <WhyUs />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

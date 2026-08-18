import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CategorySection } from "@/components/home/CategorySection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { PromoBanner } from "@/components/home/PromoBanner";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhySipSmart } from "@/components/home/WhySipSmart";
import { ResponsibleDrinking } from "@/components/home/ResponsibleDrinking";
import { Testimonials } from "@/components/home/Testimonials";
import { Newsletter } from "@/components/home/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategorySection />
      <FeaturedProducts />
      <PromoBanner />
      <HowItWorks />
      <WhySipSmart />
      <ResponsibleDrinking />
      <Testimonials />
      <Newsletter />
    </>
  );
}

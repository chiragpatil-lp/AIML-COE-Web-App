import { PortfolioNavbar } from "@/components/PortfolioNavbar";
import { ProductTeaserCard } from "@/components/ProductTeaserCard";
import { COEHero } from "@/components/COEHero";
import { CaseStudiesCarousel } from "@/components/CaseStudiesCarousel";
import { IntegrationCarousel } from "@/components/IntegrationCarousel";
import { PillarCardsSection } from "@/components/PillarCardsSection";
import { FAQSection } from "@/components/FAQSection";
import { Footer } from "@/components/Footer";

export default function Page() {
  return (
    <>
      <PortfolioNavbar />
      <ProductTeaserCard />
      <COEHero />
      <CaseStudiesCarousel />
      <IntegrationCarousel />
      <PillarCardsSection />
      <FAQSection />
      <Footer />
    </>
  );
}

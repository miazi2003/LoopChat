import { ExperienceSection } from "@/components/landing/experience-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { HeroSection } from "@/components/landing/hero-section";

export default function Home() {
  return (
    <main className="overflow-hidden bg-[#f8fbfa] text-[#11373c]">
      <HeroSection />
      <FeaturesSection />
      <ExperienceSection />
      <FinalCta />
      <Footer />
    </main>
  );
}

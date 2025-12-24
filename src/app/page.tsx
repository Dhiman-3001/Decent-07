import { HeroSection } from "@/components/home/hero-section"
import { ScrollingBanner } from "@/components/home/scrolling-banner"
import { WhyChooseUs } from "@/components/home/why-choose-us"
import { Testimonials } from "@/components/home/testimonials"
import { CareSection } from "@/components/home/care-section"
import { CTASection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <>
      <ScrollingBanner />
      <HeroSection />
      <WhyChooseUs />
      <Testimonials />
      <CareSection />
      <CTASection />
    </>
  )
}

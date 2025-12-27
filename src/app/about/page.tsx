import { Metadata } from "next"
import { AboutHero } from "@/components/about/about-hero"
import { VisionMission } from "@/components/about/vision-mission"
import { PrincipalMessage } from "@/components/about/principal-message"
import { VicePrincipalMessage } from "@/components/about/vice-principal-message"
import { CoreValues } from "@/components/about/core-values"

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Decent Public School's philosophy, vision, mission, and commitment to providing quality education (CBSE based) in Guwahati, Assam.",
}

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <VisionMission />
      <PrincipalMessage />
      <VicePrincipalMessage />
      <CoreValues />
    </>
  )
}

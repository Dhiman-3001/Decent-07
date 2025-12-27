import { Metadata } from "next"
import { AcademicsHero } from "@/components/academics/academics-hero"
import { CurriculumOverview } from "@/components/academics/curriculum-overview"
import { AcademicSections } from "@/components/academics/academic-sections"
import { TeachingMethodology } from "@/components/academics/teaching-methodology"

export const metadata: Metadata = {
  title: "Academics",
  description:
    "Explore our comprehensive CBSE based curriculum, teaching methodology, and academic programs at Decent Public School, Guwahati.",
}

export default function AcademicsPage() {
  return (
    <>
      <AcademicsHero />
      <CurriculumOverview />
      <AcademicSections />
      <TeachingMethodology />
    </>
  )
}

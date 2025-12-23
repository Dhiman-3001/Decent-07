import { Metadata } from "next"
import { AdmissionsHero } from "@/components/admissions/admissions-hero"
import { AdmissionProcess } from "@/components/admissions/admission-process"
import { EligibilityDocs } from "@/components/admissions/eligibility-docs"
import { AdmissionCTA } from "@/components/admissions/admission-cta"

import { DigitalFruitApp } from "@/components/admissions/digital-fruit-app"

export const metadata: Metadata = {
  title: "Admissions",
  description:
    "Apply for admission at Decent Public School, Guwahati. Learn about our admission process, eligibility criteria, and required documents.",
}

export default function AdmissionsPage() {
  return (
    <>
      <AdmissionsHero />
      <AdmissionProcess />
      <EligibilityDocs />
      <DigitalFruitApp />
      <AdmissionCTA />
    </>
  )
}

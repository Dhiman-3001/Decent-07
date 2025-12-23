import { Metadata } from "next"
import { ContactHero } from "@/components/contact/contact-hero"
import { ContactInfo } from "@/components/contact/contact-info"
import { ContactForm } from "@/components/contact/contact-form"
import { MapSection } from "@/components/contact/map-section"

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Decent Public School, Japorigog, Guwahati. Find our address, phone numbers, email, and working hours.",
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <MapSection />
    </>
  )
}

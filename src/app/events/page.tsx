import { Metadata } from "next"
import { EventsHero } from "@/components/events/events-hero"
import { EventsGrid } from "@/components/events/events-grid"

export const metadata: Metadata = {
  title: "Events & News",
  description:
    "Stay updated with the latest events, news, and activities at Decent Public School, Guwahati.",
}

export default function EventsPage() {
  return (
    <>
      <EventsHero />
      <EventsGrid />
    </>
  )
}

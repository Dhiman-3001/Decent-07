import { Metadata } from "next"
import { GalleryHero } from "@/components/gallery/gallery-hero"
import { GalleryGrid } from "@/components/shared/gallery-grid"

export const metadata: Metadata = {
    title: "School Gallery",
    description: "Take a visual tour of Decent Public School through our image and video gallery.",
}

export default function GalleryPage() {
    return (
        <>
            <GalleryHero />
            <GalleryGrid />
        </>
    )
}

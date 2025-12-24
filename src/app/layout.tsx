import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhatsAppButton } from "@/components/layout/whatsapp-button"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://decentpublicschool.com"),
  title: {
    default: "Decent Public School | CBSE School in Japorigog, Guwahati",
    template: "%s | Decent Public School",
  },
  description:
    "Decent Public School is a premier CBSE affiliated school in Japorigog, Guwahati, Assam. We provide quality education with a focus on academic excellence, moral values, and holistic development. Admissions open for 2026-27.",
  keywords: [
    "CBSE school Guwahati",
    "Decent Public School",
    "best school in Japorigog",
    "CBSE school Assam",
    "school admission Guwahati",
    "quality education Guwahati",
    "affordable CBSE school",
  ],
  authors: [{ name: "Decent Public School" }],
  creator: "Decent Public School",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://decentpublicschool.com",
    siteName: "Decent Public School",
    title: "Decent Public School | CBSE School in Japorigog, Guwahati",
    description:
      "Premier CBSE affiliated school in Guwahati offering quality education with academic excellence and holistic development.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Decent Public School - Nurturing Minds, Building Futures",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Decent Public School | CBSE School in Guwahati",
    description:
      "Premier CBSE affiliated school in Guwahati offering quality education.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <WhatsAppButton />
        </ThemeProvider>
      </body>
    </html>
  )
}

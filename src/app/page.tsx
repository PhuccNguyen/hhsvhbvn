// src/app/page.tsx
import type { Metadata } from 'next'
import Script from 'next/script'

import HeroSection from '@/components/home/HeroSection'
import HowItWorks from '@/components/home/HowItWorks'
import FAQ from '@/components/home/FAQ'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hhsvhbvn.tingnect.com'
const OG_IMAGE = `${SITE_URL}/images/og/hhsvhbvn-og.jpg`

// ===== SEO Metadata =====
export const metadata: Metadata = {
  title: 'Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025',
  description:
    'Trang chính thức Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025. Đang mở tuyển sinh – gửi thông tin trong 30 giây để Check-in tham dự.',
  alternates: { canonical: '/' },
  keywords: [
    'hoa hậu sinh viên',
    'HHSV 2025',
    'hoa hậu hòa bình việt nam',
    'đăng ký dự thi',
    'check-in thí sinh',
  ],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Hoa Hậu Sinh Viên Hòa Bình Việt Nam',
    title: 'HHSV 2025 – Trang chủ',
    description: 'Đang mở tuyển sinh · Gửi thông tin trong 30 giây · Check-in ngay để tham dự.',
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: 'HHSV 2025' }],
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HHSV 2025 – Trang chủ',
    description: 'Đang mở tuyển sinh – gửi thông tin trong 30 giây để Check-in tham dự.',
    images: [OG_IMAGE],
  },
  robots: { index: true, follow: true },
}

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      {/* Hero phải đứng trước Sticky để SEO đọc đúng H1 */}
      <HeroSection />
      <HowItWorks />
      <FAQ />

      {/* JSON-LD Schema */}
      <Script id="ld-org" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Hoa Hậu Sinh Viên Hòa Bình Việt Nam',
            url: SITE_URL,
            logo: `${SITE_URL}/images/logo/hhsv-logo.png`,
            sameAs: ['https://www.facebook.com/...'] // thêm link thật
          })
        }}
      />
      <Script id="ld-website" type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'HHSV Hòa Bình Việt Nam 2025',
            url: SITE_URL,
            potentialAction: {
              '@type': 'SearchAction',
              target: `${SITE_URL}/search?q={query}`,
              'query-input': 'required name=query'
            }
          })
        }}
      />
    </main>
  )
}

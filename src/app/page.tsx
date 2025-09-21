import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css';
import Header from '@/components/layout/Header'
// import Footer from '@/components/layout/Footer'
import BackgroundEffects from '@/components/ui/BackgroundEffects'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://hhsvhbvn.tingnect.com'
const OG_IMAGE = `${SITE_URL}/images/og/hhsvhbvn-og.jpg` // 1200x630 hoặc 1200x628

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025',
    template: '%s | HHSV Hòa Bình Việt Nam 2025',
  },
  description:
    'Cuộc thi Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025 – sân chơi uy tín dành cho nữ sinh viên Việt Nam: Xinh đẹp – Trí tuệ – Bản lĩnh – Nhân ái.',
  keywords: [
    'hoa hậu sinh viên',
    'hoa hậu sinh viên 2025',
    'hoa hậu hòa bình việt nam',
    'cuộc thi sắc đẹp sinh viên',
    'HHSV 2025',
    'check-in thí sinh',
    'đăng ký dự thi',
    'voting online',
  ],
  alternates: {
    canonical: '/',
    languages: { vi: '/', en: '/en' }, // nếu có bản EN sau này
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Hoa Hậu Sinh Viên Hòa Bình Việt Nam',
    title: 'Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025',
    description: 'Xinh đẹp – Trí tuệ – Bản lĩnh – Nhân ái',
    locale: 'vi_VN',
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025',
    description:
      'Cuộc thi HHSV 2025 – sân chơi uy tín của nữ sinh viên Việt Nam.',
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  themeColor: '#0B1220',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180' }],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION, // thêm token nếu có
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${inter.className} bg-slate-900 text-white antialiased`}>
        {/* JSON-LD: Organization + WebSite + Event */}
        <Script id="ld-org" type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Hoa Hậu Sinh Viên Hòa Bình Việt Nam',
              url: SITE_URL,
              logo: `${SITE_URL}/images/logo/hhsv-logo.png`,
              sameAs: [
                'https://www.facebook.com/', // cập nhật link chính thức nếu có
                'https://www.instagram.com/',
              ],
            }),
          }}
        />
        <Script id="ld-website" type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025',
              url: SITE_URL,
              potentialAction: {
                '@type': 'SearchAction',
                target: `${SITE_URL}/search?q={query}`,
                'query-input': 'required name=query',
              },
            }),
          }}
        />
        <Script id="ld-event" type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Event',
              name: 'Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025',
              startDate: '2025-10-01', // cập nhật mốc thật
              endDate: '2026-01-31',   // cập nhật mốc thật
              eventStatus: 'https://schema.org/EventScheduled',
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              location: {
                '@type': 'Place',
                name: 'Tiên Sơn Palace, Đà Nẵng',
                address: 'Số …, Hải Châu, Đà Nẵng, Việt Nam',
              },
              image: [OG_IMAGE],
              description:
                'Sân chơi uy tín dành cho nữ sinh viên Việt Nam: Xinh đẹp – Trí tuệ – Bản lĩnh – Nhân ái.',
              organizer: {
                '@type': 'Organization',
                name: 'Ban Tổ Chức HHSV 2025',
                url: SITE_URL,
              },
              offers: {
                '@type': 'Offer',
                url: SITE_URL,
                availability: 'https://schema.org/InStock',
                price: '0',
                priceCurrency: 'VND',
              },
            }),
          }}
        />

        <BackgroundEffects />
        <Header />
        <main className="relative z-10">{children}</main>
        {/* <Footer /> */}
      </body>
    </html>
  )
}
           
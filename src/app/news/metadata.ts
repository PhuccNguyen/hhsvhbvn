import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025 - Sân chơi đẳng cấp cho nữ sinh viên Việt Nam',
  description: 'Khám phá cuộc thi Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025 - nơi tôn vinh vẻ đẹp trí tuệ và nhân ái của nữ sinh viên Việt Nam. Tổng giải thưởng lên đến 2 tỷ VNĐ.',
  openGraph: {
    title: 'Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025',
    description: 'Cuộc thi sắc đẹp đẳng cấp dành cho nữ sinh viên với tổng giải thưởng 2 tỷ VNĐ & cơ hội du học Mỹ',
    images: [
      {
        url: '/images/news/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025'
      }
    ],
    locale: 'vi_VN',
    type: 'website'
  }
}
// src/app/manifest.ts
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025',
    short_name: 'HHSV 2025',
    description:
      'Trang chính thức Hoa Hậu Sinh Viên Hòa Bình Việt Nam 2025. Đang mở tuyển sinh – gửi thông tin trong 30 giây để Check-in tham dự.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}

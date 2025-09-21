// src/app/sitemap.ts
import type { MetadataRoute } from 'next'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://hhsvhbvn.tingnect.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString()

  const routes = [
    '', // home
    'checkin',
    'checkin/hop-bao',
    'checkin/so-khao',
    'checkin/ban-ket',
    'checkin/chung-ket',
  ]

  return routes.map((route) => ({
    url: `${SITE_URL}/${route}`.replace(/\/+$/, ''), // xoá dư dấu /
    lastModified: now,
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.7,
  }))
}

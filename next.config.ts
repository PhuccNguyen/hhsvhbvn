import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',   // <<< QUAN TRỌNG
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'hhsvhbvn.tingnect.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
}

export default nextConfig

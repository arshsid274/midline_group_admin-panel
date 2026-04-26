import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
  },
  // Heavy bundled media must not be pulled into serverless function bundles.
  // public/* is served as CDN static files anyway — the function only needs
  // public/media-overrides.json (auto-traced because it's read at runtime).
  outputFileTracingExcludes: {
    '*': [
      'public/assets/**',
      'public/uploads/**',
    ],
  },
}

export default nextConfig

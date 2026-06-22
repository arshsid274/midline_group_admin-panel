import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // This project lives under ~/Desktop (iCloud-synced) and dev is sometimes run
  // in more than one process at a time. Webpack's *filesystem* cache writes pack
  // files and renames them atomically (`5.pack.gz_` -> `5.pack.gz`); both iCloud
  // sync and a second dev process racing the same file throw ENOENT. Using an
  // in-memory dev cache removes the on-disk pack files entirely, so there is
  // nothing to race on — HMR stays fast within the session.
  webpack: (config, { dev }) => {
    if (dev) config.cache = { type: 'memory' }
    return config
  },
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
      // ffmpeg binary (~80 MB) is only used by the local-only admin upload
      // route. Keeping it out of every serverless function avoids the
      // 250 MB Vercel size cap.
      'node_modules/ffmpeg-static/**',
    ],
  },
  // ffmpeg-static exports the absolute path to its prebuilt binary. Webpack
  // would otherwise rewrite that string to a bundle-internal path while
  // leaving the binary on disk, breaking `spawn(ffmpegPath, …)` at runtime.
  // sharp ships native bindings that webpack can't bundle correctly either.
  // Marking both external keeps them as normal CommonJS requires.
  serverExternalPackages: ['ffmpeg-static', 'sharp'],
}

export default nextConfig

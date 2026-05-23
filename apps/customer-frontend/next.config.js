const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'),
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
  allowedDevOrigins: [
    'localhost:3000',
    '192.168.70.30',
    '*.loca.lt',
    '*.ngrok-free.app',
    '*.ngrok.io',
    '0.0.0.0'
  ],
}

module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
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

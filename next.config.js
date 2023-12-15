/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracingIncludes: {
      '/api': ['@/*'],
    },
  },
}

module.exports = nextConfig

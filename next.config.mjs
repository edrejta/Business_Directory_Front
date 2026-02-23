/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: '/search', destination: 'http://localhost:5003/search' },
      { source: '/categories', destination: 'http://localhost:5003/categories' },
      { source: '/locations', destination: 'http://localhost:5003/locations' },
      { source: '/featured-businesses', destination: 'http://localhost:5003/featured-businesses' },
      { source: '/recommendations', destination: 'http://localhost:5003/recommendations' },
      { source: '/promotions', destination: 'http://localhost:5003/promotions' },
      { source: '/reviews', destination: 'http://localhost:5003/reviews' },
      { source: '/subscribe', destination: 'http://localhost:5003/subscribe' },
    ]
  },
}

export default nextConfig

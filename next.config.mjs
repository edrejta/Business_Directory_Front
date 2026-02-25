/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    if (!backendBase) {
      return [];
    }

    const baseRewrites = [
      { source: "/search", destination: `${backendBase}/search` },
      { source: "/categories", destination: `${backendBase}/categories` },
      { source: "/locations", destination: `${backendBase}/locations` },
      { source: "/featured-businesses", destination: `${backendBase}/featured-businesses` },
      { source: "/recommendations", destination: `${backendBase}/recommendations` },
      { source: "/promotions", destination: `${backendBase}/promotions` },
      { source: "/reviews", destination: `${backendBase}/reviews` },
      { source: "/subscribe", destination: `${backendBase}/subscribe` },
    ];

    if (process.env.NODE_ENV === "development") {
      return [
        { source: "/api/:path*", destination: `${backendBase}/api/:path*` },
        { source: "/health", destination: `${backendBase}/health` },
        ...baseRewrites,
      ];
    }

    return baseRewrites;
  },
}

export default nextConfig

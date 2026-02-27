/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  async rewrites() {
    const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    if (!backendBase) {
      return [];
    }

    const apiRewrites = [
      { source: "/api/:path*", destination: `${backendBase}/api/:path*` },
      { source: "/health", destination: `${backendBase}/health` },
    ];

    const baseRewrites = [
      { source: "/search", destination: `${backendBase}/search` },
      { source: "/categories", destination: `${backendBase}/categories` },
      { source: "/locations", destination: `${backendBase}/locations` },
      { source: "/featured-businesses", destination: `${backendBase}/featured-businesses` },
      { source: "/recommendations", destination: `${backendBase}/recommendations` },
      { source: "/promotions", destination: `${backendBase}/promotions` },
      { source: "/subscribe", destination: `${backendBase}/subscribe` },
    ];

    if (process.env.NODE_ENV === "development") {
      return [...apiRewrites, ...baseRewrites];
    }

    return [...apiRewrites, ...baseRewrites];
  },
}

export default nextConfig

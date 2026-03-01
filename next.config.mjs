/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  async rewrites() {
    const backendBase = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
    if (!backendBase) {
      return [];
    }

    return [{ source: "/api/:path*", destination: `${backendBase}/api/:path*` }];
  },
}

export default nextConfig

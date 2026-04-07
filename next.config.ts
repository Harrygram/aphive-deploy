/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ⚡ Ignore ESLint errors during Vercel production builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ⚡ Ignore TypeScript errors during Vercel production builds
  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "images.clerk.dev",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "www.clerk.com",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
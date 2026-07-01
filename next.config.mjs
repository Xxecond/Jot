  /** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd()  },
  allowedDevOrigins: ["172.20.10.7"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
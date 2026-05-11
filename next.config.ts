import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Ensures `firebase/auth`, `firebase/app`, etc. subpath exports resolve in Next’s bundlers. */
  transpilePackages: ["firebase"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img1.wsimg.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [{
      source: "/:path*",
      headers: [{ key: "Link", value: '</llms.txt>; rel="describedby"; type="text/plain"' }],
    }];
  },
  async redirects() {
    return [
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path+", destination: "/:path+", permanent: true },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/en" },
        ...["about", "projects", "blog"].map((path) => ({
          source: `/${path}`,
          destination: `/en/${path}`,
        })),
        { source: "/blog/:slug", destination: "/en/blog/:slug" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "opengraph.githubassets.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/w78zoc2a/**",
      },
    ],
  },
};

export default nextConfig;

import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.platform === "win32" ? undefined : "standalone",
  transpilePackages: ["@nursenest/types"],
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
  poweredByHeader: false,
  experimental: { cpus: 2 },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(self), geolocation=(self)" },
      ],
    }];
  },
  async rewrites() {
    const apiUrl = process.env.INTERNAL_API_URL ?? "http://127.0.0.1:8080";
    return [
      { source: "/api/v1/:path*", destination: `${apiUrl}/api/v1/:path*` },
    ];
  },
};

export default phase => ({
  ...nextConfig,
  distDir: phase === "phase-development-server" ? ".next-dev" : ".next",
});

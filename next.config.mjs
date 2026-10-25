/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // cacheComponents: true,
  // partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  allowedDevOrigins: [
    // "f7dd-93-39-133-97.ngrok-free.app",
  ]
};

export default nextConfig;

import type { NextConfig } from "next";

/**
 * GitHub Pages serves this repo at /hydrofit-do-web.
 * actions/configure-pages cannot edit next.config.ts, and writing a second
 * next.config.js beside it makes `next build` fail. BASE_PATH is set in CI.
 */
const basePath = process.env.BASE_PATH || undefined;
const pagesExport = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  ...(pagesExport
    ? {
        output: "export",
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {}),
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;

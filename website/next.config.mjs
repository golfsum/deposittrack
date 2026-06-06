import path from "node:path";
import { fileURLToPath } from "node:url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The repo root also has a package-lock.json (the Expo app), so Next would
  // otherwise infer the monorepo root and warn. Pin tracing to this folder.
  outputFileTracingRoot: dirname,
};

export default nextConfig;

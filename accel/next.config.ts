import type { NextConfig } from "next";
// @ts-ignore
import PWA from "next-pwa";

const nextConfig: NextConfig = {
  turbopack: {}, // silences Turbopack warning in dev
};

const isDev = process.env.NODE_ENV === 'development';

export default isDev
  ? nextConfig
  : PWA({ dest: 'public', register: true, skipWaiting: true })(nextConfig);
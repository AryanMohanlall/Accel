import type { NextConfig } from "next";
// @ts-ignore
import PWA from "next-pwa";

const withPWA = PWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA(nextConfig);
import { setupNextOnPages } from '@cloudflare/next-on-pages/next-utils';

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

// 개발 모드에서 Cloudflare bindings를 사용할 수 있게 설정
if (process.env.NODE_ENV === 'development') {
  setupNextOnPages();
}

export default nextConfig;

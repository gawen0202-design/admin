import { setupNextOnPages } from '@cloudflare/next-on-pages/next-utils';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 환경을 위한 설정
  typescript: {
    ignoreBuildErrors: true, // 빌드 시 타입 에러로 중단되는 것을 방지
  },
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 린트 에러로 중단되는 것을 방지
  },
};

export default nextConfig;

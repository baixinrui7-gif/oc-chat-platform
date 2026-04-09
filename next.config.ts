import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 排除 server 目录（这是 NestJS 后端代码）
  turbopack: {}
};

export default nextConfig;

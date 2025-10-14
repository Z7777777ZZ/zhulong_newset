/** @type {import('next').NextConfig} */
const nextConfig = {
  // 开发环境代理配置（临时解决CORS）
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.dragonai.tech/:path*',
      },
    ]
  },
}

export default nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  // nginx已配置API代理，前端不需要rewrites
  // 使用静态导出模式，打包成纯静态文件
  output: 'export',
  
  // 静态导出必须禁用图片优化
  images: {
    unoptimized: true,
  },
  
  // 开发环境优化
  ...(process.env.NODE_ENV === 'development' && {
    // 启用快速刷新
    reactStrictMode: true,
    // 优化开发体验
    swcMinify: true,
  }),

  // 静态导出不支持 headers() 配置，改用 nginx 配置缓存
}

export default nextConfig

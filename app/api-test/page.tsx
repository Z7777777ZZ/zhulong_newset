'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function ApiTestPage() {
  const [testing, setTesting] = useState(false)
  const [results, setResults] = useState<{
    baseUrl: string
    reachable: boolean
    cors: boolean
    error?: string
  } | null>(null)

  const testApi = async () => {
    setTesting(true)
    setResults(null)

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

    try {
      // 测试基础连接
      const response = await fetch(`${baseUrl}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@example.com' }),
      })

      setResults({
        baseUrl,
        reachable: true,
        cors: true,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
      })
    } catch (error) {
      console.error('API测试失败:', error)
      setResults({
        baseUrl,
        reachable: false,
        cors: false,
        error: error instanceof Error ? error.message : '未知错误',
      })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="min-h-screen gradient-background flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="glass-card rounded-3xl p-8 border border-white/10">
          <h1 className="text-3xl font-bold text-white mb-2">API 连接测试</h1>
          <p className="text-white/60 mb-8">检查前端是否能正常连接到后端服务器</p>

          <div className="space-y-6">
            {/* 配置信息 */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="text-white/60 text-sm mb-2">当前API地址:</div>
              <code className="text-orange-400 text-lg break-all">
                {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'}
              </code>
            </div>

            {/* 测试按钮 */}
            <Button
              onClick={testApi}
              disabled={testing}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {testing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  测试中...
                </>
              ) : (
                '开始测试'
              )}
            </Button>

            {/* 测试结果 */}
            {results && (
              <div className="space-y-4">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <h3 className="text-white font-semibold mb-4">测试结果</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">服务器可达性</span>
                      {results.reachable ? (
                        <span className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          正常
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-red-400">
                          <XCircle className="w-5 h-5" />
                          失败
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white/70">CORS配置</span>
                      {results.cors ? (
                        <span className="flex items-center gap-2 text-green-400">
                          <CheckCircle className="w-5 h-5" />
                          正常
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-red-400">
                          <XCircle className="w-5 h-5" />
                          失败
                        </span>
                      )}
                    </div>

                    {results.error && (
                      <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <div className="text-red-400 text-sm font-medium mb-1">错误信息:</div>
                        <code className="text-red-300 text-xs">{results.error}</code>
                      </div>
                    )}
                  </div>
                </div>

                {/* 故障排除建议 */}
                {!results.reachable && (
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
                    <h3 className="text-orange-400 font-semibold mb-3">故障排除建议:</h3>
                    <ul className="space-y-2 text-white/70 text-sm">
                      <li>1. 确认后端服务器已启动 ({results.baseUrl})</li>
                      <li>2. 检查 .env.local 中的 API 地址是否正确</li>
                      <li>3. 如果使用 HTTPS，确保证书有效</li>
                      <li>4. 检查后端 CORS 配置是否允许前端域名</li>
                      <li>5. 尝试在浏览器中直接访问: {results.baseUrl}/health/status</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* CORS配置示例 */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">后端CORS配置参考:</h3>
              <pre className="bg-black/30 rounded-lg p-3 text-xs text-white/70 overflow-x-auto">
{`// Spring Boot 示例
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("https://yourdomain.com");
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");
        config.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = 
            new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from './auth-provider'

/**
 * 路由保护组件 - 要求用户必须登录才能访问
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, initializing, token } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 等待初始化完成
    if (initializing) return

    // 未登录则跳转到登录页
    if (!token || !user) {
      const returnUrl = encodeURIComponent(pathname)
      router.push(`/login?return=${returnUrl}`)
    }
  }, [token, user, initializing, router, pathname])

  // 初始化中显示加载状态
  if (initializing) {
    return (
      <div className="min-h-screen gradient-background flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">加载中...</p>
        </div>
      </div>
    )
  }

  // 未登录不渲染内容（会被 useEffect 重定向）
  if (!token || !user) {
    return null
  }

  // 已登录，渲染子组件
  return <>{children}</>
}


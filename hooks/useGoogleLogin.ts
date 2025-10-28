'use client'

import { useEffect, useCallback, useRef, useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

/**
 * Google 登录 Hook
 * 封装 Google Identity Services 的初始化和登录逻辑
 */
export const useGoogleLogin = () => {
  const { loginWithGoogle } = useAuth()
  const router = useRouter()
  const isInitialized = useRef(false)
  const [loading, setLoading] = useState(false)

  // 处理 Google 登录成功的回调
  const handleCredentialResponse = useCallback(
    async (response: CredentialResponse) => {
      try {
        setLoading(true)
        // 调用后端 API 验证 Google ID Token
        await loginWithGoogle(response.credential)
        toast.success('Google 登录成功！正在跳转...', { duration: 2000 })
        
        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          router.push('/workspace')
        }, 500)
      } catch (error) {
        console.error('Google 登录失败:', error)
        const message = error instanceof Error ? error.message : 'Google 登录失败，请重试'
        toast.error(message, { duration: 4000 })
      } finally {
        setLoading(false)
      }
    },
    [loginWithGoogle, router]
  )

  // 初始化 Google Identity Services
  useEffect(() => {
    // 避免重复初始化
    if (isInitialized.current) return

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!clientId) {
      console.error('❌ NEXT_PUBLIC_GOOGLE_CLIENT_ID 未配置')
      console.error('请在 .env.local 文件中添加: NEXT_PUBLIC_GOOGLE_CLIENT_ID=你的客户端ID')
      return
    }

    const initGoogleAuth = () => {
      if (typeof window === 'undefined' || !window.google) {
        return false
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false, // 不自动选择账号
          cancel_on_tap_outside: true, // 点击外部取消
        })

        isInitialized.current = true
        console.log('✅ Google Identity Services 初始化成功')
        return true
      } catch (error) {
        console.error('❌ Google Identity Services 初始化失败:', error)
        return false
      }
    }

    // 等待 Google SDK 加载完成
    if (window.google) {
      initGoogleAuth()
    } else {
      // 轮询检查 Google SDK 是否加载完成
      let attempts = 0
      const maxAttempts = 50 // 最多等待 5 秒
      const checkGoogle = setInterval(() => {
        attempts++
        
        if (window.google) {
          const success = initGoogleAuth()
          if (success) {
            clearInterval(checkGoogle)
          }
        } else if (attempts >= maxAttempts) {
          console.error('❌ Google SDK 加载超时')
          toast.error('Google 登录服务加载失败，请刷新页面重试', { duration: 5000 })
          clearInterval(checkGoogle)
        }
      }, 100)

      return () => clearInterval(checkGoogle)
    }
  }, [handleCredentialResponse])

  /**
   * 触发 Google 登录弹窗
   */
  const login = useCallback(() => {
    if (!window.google) {
      toast.error('Google 登录服务未就绪，请刷新页面重试', { duration: 4000 })
      return
    }

    if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
      toast.error('Google 登录配置错误，请联系管理员', { duration: 4000 })
      return
    }

    try {
      // 显示 One Tap 登录弹窗
      window.google.accounts.id.prompt((notification) => {
        // 处理 One Tap 通知
        if (notification.isNotDisplayed()) {
          const reason = notification.getNotDisplayedReason()
          console.log('One Tap 未显示，原因:', reason)
          
          // 如果 One Tap 无法显示，可以在这里添加备用登录方式
          // 例如：显示标准的 Google 登录按钮
        } else if (notification.isSkippedMoment()) {
          const reason = notification.getSkippedReason()
          console.log('One Tap 被跳过，原因:', reason)
        }
      })
    } catch (error) {
      console.error('触发 Google 登录失败:', error)
      toast.error('无法打开 Google 登录窗口，请重试', { duration: 4000 })
    }
  }, [])

  /**
   * 在指定元素中渲染 Google 登录按钮
   * @param elementId 元素 ID
   * @param options 按钮配置
   */
  const renderButton = useCallback((elementId: string, options?: GoogleButtonConfig) => {
    if (!window.google) {
      console.error('Google SDK 未加载')
      return
    }

    const element = document.getElementById(elementId)
    if (!element) {
      console.error(`未找到元素: #${elementId}`)
      return
    }

    try {
      window.google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'rectangular',
        text: 'signin_with',
        logo_alignment: 'left',
        width: element.offsetWidth || 400,
        locale: 'zh_CN',
        ...options,
      })
    } catch (error) {
      console.error('渲染 Google 按钮失败:', error)
    }
  }, [])

  return {
    login,
    renderButton,
    loading,
    isReady: isInitialized.current,
  }
}






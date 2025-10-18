'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { authApi, type EmailLoginRequest, type JwtResponse, type RegisterRequest, type UserInfoResponse, userApi } from '@/lib/api'
import { clearStoredToken, getStoredToken, setStoredToken } from '@/lib/token-storage'

type AuthContextValue = {
  user: UserInfoResponse | null
  token: string | null
  initializing: boolean
  loading: boolean
  loginWithEmail: (input: EmailLoginRequest & { rememberMe?: boolean }) => Promise<UserInfoResponse>
  loginWithUsername: (input: { username: string; password: string; rememberMe?: boolean }) => Promise<UserInfoResponse>
  logout: (redirect?: string) => void
  refreshUser: () => Promise<UserInfoResponse>
  register: (input: RegisterRequest) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function fetchUserInfo() {
  const response = await userApi.getUserInfo()
  return response.data
}

const useInitToken = () => {
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  return { token, setToken }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, setToken } = useInitToken()
  const [user, setUser] = useState<UserInfoResponse | null>(null)
  const [initializing, setInitializing] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let cancelled = false
    const bootstrap = async () => {
      if (!token) {
        setUser(null)
        setInitializing(false)
        return
      }

      try {
        const profile = await fetchUserInfo()
        if (!cancelled) {
          setUser(profile)
        }
      } catch (error) {
        console.error('初始化用户信息失败', error)
        clearStoredToken()
        if (!cancelled) {
          setUser(null)
          setToken(null)
        }
      } finally {
        if (!cancelled) {
          setInitializing(false)
        }
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [token, setToken])

  const handleLoginSuccess = useCallback(
    async (payload: JwtResponse, rememberMe?: boolean) => {
      setStoredToken(payload.token, Boolean(rememberMe))
      setToken(payload.token)
      const profile = await fetchUserInfo()
      setUser(profile)
      return profile
    },
    [setToken]
  )

  const loginWithEmail = useCallback(
    async (input: EmailLoginRequest & { rememberMe?: boolean }) => {
      setLoading(true)
      try {
        const response = await authApi.loginWithEmail(input)
        return await handleLoginSuccess(response.data, input.rememberMe)
      } finally {
        setLoading(false)
      }
    },
    [handleLoginSuccess]
  )

  const loginWithUsername = useCallback(
    async (input: { username: string; password: string; rememberMe?: boolean }) => {
      setLoading(true)
      try {
        const response = await authApi.loginWithUsername({
          username: input.username,
          password: input.password,
          rememberMe: input.rememberMe,
        })
        return await handleLoginSuccess(response.data, input.rememberMe)
      } finally {
        setLoading(false)
      }
    },
    [handleLoginSuccess]
  )

  const logout = useCallback(
    (redirect?: string) => {
      clearStoredToken()
      setToken(null)
      setUser(null)
      if (redirect) {
        router.push(redirect)
      }
    },
    [router, setToken]
  )

  const refreshUser = useCallback(async () => {
    const profile = await fetchUserInfo()
    setUser(profile)
    return profile
  }, [])

  const register = useCallback(async (input: RegisterRequest) => {
    setLoading(true)
    try {
      const response = await authApi.register(input)
      toast.success(response.message || '注册成功，请登录', { duration: 3000 })
    } finally {
      setLoading(false)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      initializing,
      loading,
      loginWithEmail,
      loginWithUsername,
      logout,
      refreshUser,
      register,
    }),
    [user, token, initializing, loading, loginWithEmail, loginWithUsername, logout, refreshUser, register]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth 必须在 AuthProvider 内使用')
  }
  return context
}

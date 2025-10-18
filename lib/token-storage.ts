'use client'

/**
 * Token 持久化工具，兼容「记住我」与 SSR 环境。
 * 优先读取 sessionStorage（短期会话），其次读取 localStorage（持久登录）。
 */
const TOKEN_KEY = 'zhulong.token'

let inMemoryToken: string | null = null

const getClientStorage = (type: 'localStorage' | 'sessionStorage') => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window[type]
  } catch {
    return null
  }
}

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') {
    return inMemoryToken
  }

  const sessionToken = getClientStorage('sessionStorage')?.getItem(TOKEN_KEY)
  if (sessionToken) {
    console.log('📦 从sessionStorage读取token')
    return sessionToken
  }

  const localToken = getClientStorage('localStorage')?.getItem(TOKEN_KEY)
  if (localToken) {
    console.log('📦 从localStorage读取token')
    return localToken
  }

  console.log('📦 未找到token')
  return null
}

export const setStoredToken = (token: string, rememberMe: boolean) => {
  inMemoryToken = token

  const session = getClientStorage('sessionStorage')
  const local = getClientStorage('localStorage')

  session?.removeItem(TOKEN_KEY)
  local?.removeItem(TOKEN_KEY)

  if (rememberMe) {
    local?.setItem(TOKEN_KEY, token)
    console.log('✅ Token已保存到localStorage (记住我)')
  } else {
    session?.setItem(TOKEN_KEY, token)
    console.log('✅ Token已保存到sessionStorage (不记住)')
  }
}

export const clearStoredToken = () => {
  inMemoryToken = null
  getClientStorage('sessionStorage')?.removeItem(TOKEN_KEY)
  getClientStorage('localStorage')?.removeItem(TOKEN_KEY)
}

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
    return sessionToken
  }

  return getClientStorage('localStorage')?.getItem(TOKEN_KEY) ?? null
}

export const setStoredToken = (token: string, rememberMe: boolean) => {
  inMemoryToken = token

  const session = getClientStorage('sessionStorage')
  const local = getClientStorage('localStorage')

  session?.removeItem(TOKEN_KEY)
  local?.removeItem(TOKEN_KEY)

  if (rememberMe) {
    local?.setItem(TOKEN_KEY, token)
  } else {
    session?.setItem(TOKEN_KEY, token)
  }
}

export const clearStoredToken = () => {
  inMemoryToken = null
  getClientStorage('sessionStorage')?.removeItem(TOKEN_KEY)
  getClientStorage('localStorage')?.removeItem(TOKEN_KEY)
}

// API服务层 - 封装所有HTTP请求逻辑
import { toast } from "sonner"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'

// 请求拦截器：添加认证头
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token')
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

// 响应拦截器：统一错误处理
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
  }

  return response.json()
}

// API请求封装
class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    const config: RequestInit = {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      return await handleResponse(response)
    } catch (error) {
      console.error(`API请求失败 [${endpoint}]:`, error)

      // 显示用户友好的错误提示
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('网络请求失败，请检查网络连接')
      }

      throw error
    }
  }

  // GET请求
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const searchParams = params ? new URLSearchParams(params).toString() : ''
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint

    return this.request<T>(url, { method: 'GET' })
  }

  // POST请求
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT请求
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE请求
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// 认证相关接口
export interface LoginRequest {
  username: string
  password: string
  rememberMe?: boolean
}

export interface EmailLoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  email: string
  phone?: string
  emailVerificationCode: string
}

export interface EmailVerificationRequest {
  email: string
}

export interface JwtResponse {
  token: string
  type: string
  id: number
  username: string
  email: string
  role: string
}

// 用户相关接口
export interface UserInfoResponse {
  id: number
  username: string
  email: string
  phone?: string
  avatar?: string
  role: string
  totalQuota: number
  usedQuota: number
  remainingQuota: number
  usedCount: number
  dailyLimit: number
}

// 检测相关接口
export interface DetectionRequest {
  text?: string
  file?: File
  type?: 'text' | 'image' | 'video' | 'audio'
  enableFragmentAnalysis?: boolean
  splitStrategy?: 'paragraph' | 'semantic' | 'default' | 'sentence' | 'fixed'
}

export interface DetectionFragmentResult {
  fragmentIndex: number
  fragmentText: string
  text: string
  aiProbability: number
  humanProbability: number
  confidence: number
  category: string
  categoryDescription: string
  categoryColor: string
}

export interface DetectionResultResponse {
  aiProbability: number
  analysis: string
  fragments?: DetectionFragmentResult[]
  totalFragments?: number
  aiFragments?: number
  humanFragments?: number
  uncertainFragments?: number
  fragmentAnalysis?: boolean
}

// 历史记录相关接口
export interface DetectionRecordResponse {
  id: number
  fileName?: string
  type: number
  typeName: string
  time: string
  result: string
  probability: number
  status: number
  errorMessage?: string
  fileUrl?: string
  content?: string
}

// 创建API服务实例
export const apiService = new ApiService()

// 认证API
export const authApi = {
  // 用户名密码登录
  loginWithUsername: (data: LoginRequest) =>
    apiService.post<{ success: boolean; message: string; data: JwtResponse }>('/auth/login', data),

  // 邮箱密码登录
  loginWithEmail: (data: EmailLoginRequest) =>
    apiService.post<{ success: boolean; message: string; data: JwtResponse }>('/auth/email-login', data),

  // 用户注册
  register: (data: RegisterRequest) =>
    apiService.post<{ success: boolean; message: string; data: string }>('/auth/register', data),

  // 发送邮箱验证码
  sendEmailVerification: (data: EmailVerificationRequest) =>
    apiService.post<{ success: boolean; message: string; data: null }>('/auth/verify-email', data),
}

// 用户API
export const userApi = {
  // 获取用户信息与额度
  getUserInfo: () =>
    apiService.get<{ success: boolean; message: string; data: UserInfoResponse }>('/user/info'),

  // 获取个人资料
  getProfile: () =>
    apiService.get<{ success: boolean; message: string; data: any }>('/profile'),

  // 更新个人资料
  updateProfile: (data: any) =>
    apiService.put<{ success: boolean; message: string; data: null }>('/profile', data),

  // 修改密码
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiService.put<{ success: boolean; message: string; data: null }>('/profile/password', data),
}

// 检测API
export const detectionApi = {
  // 发起AIGC检测
  detect: (data: DetectionRequest) => {
    const formData = new FormData()

    if (data.text) {
      formData.append('text', data.text)
    }

    if (data.file) {
      formData.append('file', data.file)
    }

    if (data.type) {
      formData.append('type', data.type)
    }

    if (data.enableFragmentAnalysis !== undefined) {
      formData.append('enableFragmentAnalysis', String(data.enableFragmentAnalysis))
    }

    if (data.splitStrategy) {
      formData.append('splitStrategy', data.splitStrategy)
    }

    return apiService.request<{ success: boolean; message: string; data: DetectionResultResponse }>(
      '/detection/detect',
      {
        method: 'POST',
        body: formData,
        headers: {
          // Content-Type由浏览器自动设置，不需要手动设置
        },
      }
    )
  },

  // 查询近期检测记录
  getRecentDetections: (limit?: number) =>
    apiService.get<{ success: boolean; message: string; data: any[] }>('/detection/recent', { limit }),
}

// 历史记录API
export const historyApi = {
  // 查询全部检测历史
  getHistory: () =>
    apiService.get<{ success: boolean; message: string; data: DetectionRecordResponse[] }>('/history'),

  // 按类型筛选检测历史
  getHistoryByType: (typeId: number) =>
    apiService.get<{ success: boolean; message: string; data: DetectionRecordResponse[] }>(`/history/type/${typeId}`),

  // 按时间范围筛选检测历史
  getHistoryByTimeRange: (timeRange: 'today' | 'week' | 'month' | 'all' = 'all') =>
    apiService.get<{ success: boolean; message: string; data: DetectionRecordResponse[] }>('/history/time', { timeRange }),

  // 按检测结果筛选历史
  getHistoryByResult: (result: 'ai' | 'human' | 'all' = 'all') =>
    apiService.get<{ success: boolean; message: string; data: DetectionRecordResponse[] }>(`/history/result/${result}`),

  // 获取检测记录详情
  getHistoryDetail: (id: number) =>
    apiService.get<{ success: boolean; message: string; data: DetectionRecordResponse }>(`/history/${id}`),

  // 删除检测记录
  deleteHistoryRecord: (id: number) =>
    apiService.delete<{ success: boolean; message: string; data: null }>(`/history/${id}`),
}

// 充值API
export const rechargeApi = {
  // 查询所有充值套餐
  getPackages: () =>
    apiService.get<{ success: boolean; message: string; data: any[] }>('/recharge/packages'),

  // 创建充值订单
  createOrder: (data: { packageId: number; paymentMethod: string }) =>
    apiService.post<{ success: boolean; message: string; data: string }>('/recharge/order', data),

  // 查询充值交易记录
  getTransactions: (filter?: string) =>
    apiService.get<{ success: boolean; message: string; data: any[] }>('/recharge/transactions', { filter }),
}

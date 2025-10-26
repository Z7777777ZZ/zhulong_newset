// API服务层 - 封装所有HTTP请求逻辑
import { toast } from "sonner"
import { clearStoredToken, getStoredToken } from "./token-storage"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api'

export interface ApiEnvelope<T> {
  success: boolean
  message: string
  data: T
}

export class ApiError<T = unknown> extends Error {
  status: number
  payload: T | null

  constructor(message: string, status: number, payload: T | null = null) {
    super(message)
    this.status = status
    this.payload = payload
  }
}

// 不需要认证的接口列表
const PUBLIC_ENDPOINTS = ['/auth/login', '/auth/email-login', '/auth/register', '/auth/verify-email', '/auth/reset-password', '/auth/google-login']

// 请求拦截器：添加认证头
const getAuthHeaders = (endpoint: string): Record<string, string> => {
  const token = getStoredToken()
  const headers: Record<string, string> = {}

  const isPublicEndpoint = PUBLIC_ENDPOINTS.some(path => endpoint.includes(path))

  console.log('🔐 Token检查:', {
    endpoint,
    hasToken: !!token,
    tokenLength: token?.length || 0,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'NO TOKEN',
    isPublic: isPublicEndpoint,
  })

  if (token) {
    headers.Authorization = `Bearer ${token}`
  } else if (!isPublicEndpoint) {
    console.warn('⚠️ 受保护的API请求缺少token，可能需要重新登录')
  }

  return headers
}

// 后端响应格式（使用code字段）
interface BackendResponse<T> {
  code?: number
  message: string
  data: T
  success?: boolean
}

// 响应拦截器：统一错误处理和格式转换
const parseJson = async <T>(response: Response): Promise<T | null> => {
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    const json = await response.json().catch(() => null)
    
    // 如果后端返回的是 { code, message, data } 格式，转换为 { success, message, data }
    if (json && 'code' in json && !('success' in json)) {
      return {
        success: json.code === 200,
        message: json.message,
        data: json.data
      } as T
    }
    
    return json
  }

  return null
}

// API请求封装
class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    silent: boolean = false // 是否静默失败，不显示错误提示
  ): Promise<ApiEnvelope<T>> {
    const url = `${API_BASE_URL}${endpoint}`

    const body = options.body
    const authHeaders = getAuthHeaders(endpoint)
    const defaultHeaders: Record<string, string> = {
      ...authHeaders,
    }

    if (body && !(body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json'
    }

    // 调试：打印请求信息
    console.log('API Request:', {
      url,
      method: options.method || 'GET',
      hasToken: !!authHeaders.Authorization,
      authHeader: authHeaders.Authorization ? `${authHeaders.Authorization.substring(0, 30)}...` : 'NONE',
      allHeaders: defaultHeaders,
    })

    // 设置超时时间：所有接口统一30秒
    const timeoutMs = 30000
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      // 确保credentials被发送，这对代理转发很重要
      credentials: 'include',
      signal: controller.signal,
    }

    try {
      const response = await fetch(url, config)
      if (!response.ok) {
        const payload = await parseJson<ApiEnvelope<unknown>>(response)
        const message = payload?.message || `HTTP ${response.status}: ${response.statusText}`

        if (response.status === 401) {
          console.error('401 Unauthorized - Token已过期，请重新登录')
          
          // 检测接口不立即跳转，给用户看到完整错误信息
          const isDetectionRequest = endpoint.includes('/detection/detect')
          
          if (!isDetectionRequest) {
            clearStoredToken()
            toast.error('登录已过期，请重新登录', {
              duration: 3000,
            })
            // 延迟跳转到登录页，给用户足够时间查看错误信息
            setTimeout(() => {
              if (typeof window !== 'undefined') {
                window.location.href = '/login'
              }
            }, 3000)
          } else {
            // 检测接口返回401，可能是处理超时或其他问题
            toast.error('检测请求失败，可能是会话超时或文件处理失败', {
              duration: 5000,
            })
          }
        } else if (response.status === 507) {
          // 文本内容太大
          const message507 = payload?.message || '文本内容太大，无法处理。请尝试上传内容更少的文档或删减部分内容后重试'
          if (!silent) {
            toast.error(message507, {
              duration: 6000,
            })
          }
        } else if (!silent) {
          // 只在非静默模式下显示错误提示
          toast.error(message, {
            duration: 3000,
          })
        }

        throw new ApiError(message, response.status, payload)
      }

      const payload = await parseJson<ApiEnvelope<T>>(response)
      if (!payload) {
        return { success: true, message: '', data: null as T }
      }

      if (!payload.success) {
        const message = payload.message || '接口请求失败'
        if (!silent) {
          // 只在非静默模式下显示错误提示
          toast.error(message, {
            duration: 3000,
          })
        }
        throw new ApiError(message, response.status, payload)
      }

      return payload
    } catch (error) {
      console.error(`API请求失败 [${endpoint}]:`, error)

      // 显示用户友好的错误提示
      if (error instanceof ApiError) {
        // 已经在上面显示过错误了，不需要重复显示
      } else if (error instanceof Error && error.name === 'AbortError') {
        // 请求超时
        const timeoutSeconds = Math.round(timeoutMs / 1000)
        const isDetectionRequest = endpoint.includes('/detection/detect')
        const message = isDetectionRequest 
          ? `检测超时（${timeoutSeconds}秒），文件可能过大或内容过多，请尝试上传较小的文件`
          : `请求超时（${timeoutSeconds}秒），请检查网络连接后重试`
        toast.error(message, { duration: 5000 })
        throw new ApiError(message, 504, null)
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        // 网络错误，可能是CORS或网络不可达
        const errorMessage = `无法连接到服务器 (${API_BASE_URL})\n\n可能原因:\n1. 后端服务未启动\n2. CORS配置问题\n3. 网络连接问题`
        toast.error(errorMessage, { duration: 3000 })
      } else if (error instanceof Error) {
        toast.error(error.message, { duration: 3000 })
      } else {
        toast.error('网络请求失败，请检查网络连接', { duration: 3000 })
      }

      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }

  // GET请求
  async get<T>(endpoint: string, params?: Record<string, any | undefined>, silent?: boolean): Promise<ApiEnvelope<T>> {
    const searchParams = params
      ? new URLSearchParams(
          Object.entries(params).reduce<Record<string, string>>((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value)
            }
            return acc
          }, {})
        ).toString()
      : ''
    const url = searchParams ? `${endpoint}?${searchParams}` : endpoint

    return this.request<T>(url, { method: 'GET' }, silent)
  }

  // POST请求
  async post<T>(endpoint: string, data?: any): Promise<ApiEnvelope<T>> {
    console.log('📤 POST Request:', endpoint, 'Data:', data)
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // PUT请求
  async put<T>(endpoint: string, data?: any): Promise<ApiEnvelope<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  // DELETE请求
  async delete<T>(endpoint: string): Promise<ApiEnvelope<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }

  async postForm<T>(endpoint: string, data: FormData): Promise<ApiEnvelope<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data,
    })
  }

  // POST请求 - application/x-www-form-urlencoded
  async postUrlEncoded<T>(endpoint: string, data?: Record<string, any>): Promise<ApiEnvelope<T>> {
    console.log('📤 POST (URLEncoded) Request:', endpoint, 'Data:', data)

    const formBody = data
      ? new URLSearchParams(
          Object.entries(data).reduce<Record<string, string>>((acc, [key, value]) => {
            if (value !== undefined && value !== null) {
              acc[key] = String(value)
            }
            return acc
          }, {})
        ).toString()
      : ''

    return this.request<T>(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody,
    })
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

export interface GoogleLoginRequest {
  idToken: string
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

export interface ResetPasswordRequest {
  email: string
  verificationCode: string
  newPassword: string
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

export interface UserProfileResponse {
  id: number
  username: string
  email: string
  phone?: string
  avatar?: string
  role: string
  registerTime: string
  lastLoginTime?: string
  totalQuota: number
  usedQuota: number
  remainingQuota: number
  dailyFreeQuota: number
  detectionCount: number
  memberDays: number
}

export interface DashboardStatsResponse {
  imageCounts: string
  textCounts: string
  videoCounts: string
  audioCounts: string
  imageTrend: number
  textTrend: number
  videoTrend: number
  audioTrend: number
  averageAccuracy: number
  accuracyTrend: number
}

// 检测相关接口
export interface DetectionRequest {
  text?: string
  file?: File
  type?: 'text' | 'image' | 'video' | 'audio'
  enableFragmentAnalysis?: boolean
  splitStrategy?: 'paragraph' | 'semantic' | 'default' | 'sentence' | 'fixed'
}

// 异步检测任务提交请求
export interface AsyncDetectionSubmitRequest {
  type: 'image' | 'audio' | 'video'
  file: File
}

// 异步检测任务提交响应
export interface AsyncDetectionSubmitResponse {
  taskId: string
  type: 'image' | 'audio' | 'video'
  status: 'processing' | 'failed'
  submitTime: string
  message: string
  errorMessage?: string
}

// 异步检测任务查询响应
export interface AsyncDetectionQueryResponse {
  taskId: string
  type: 'image' | 'audio' | 'video'
  status: 'processing' | 'completed' | 'failed'
  submitTime: string
  completeTime?: string
  result?: DetectionResultResponse
  errorMessage?: string
}

// 句子级别的高亮标注
export interface SentenceHighlight {
  sentence: string
  aiProbability: number
  aiGenerated?: boolean
  isAiGenerated?: boolean  // 兼容字段
}

// 分片检测结果
export interface DetectionFragmentResult {
  text: string
  aiProbability: number
  humanProbability: number
  confidence: number
  category: 'ai' | 'human' | 'uncertain'
  sentenceHighlights?: SentenceHighlight[]
  perplexity?: number
  burstiness?: number
}

// 文本检测响应
export interface DetectionResultResponse {
  aiProbability: number
  analysis: string
  fragmentAnalysis?: boolean
  totalFragments?: number
  aiFragments?: number
  humanFragments?: number
  uncertainFragments?: number
  fragments?: DetectionFragmentResult[]
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

export interface DetectionRecord {
  id: number
  userId: number
  detectionTypeId: number
  fileUrl?: string
  fileName?: string
  fileSize?: number
  content?: string
  result: number
  confidence: number
  detectionTime: string
  status: number
  errorMessage?: string
  analysis?: string
  fragmentResults?: string
  totalFragments?: number
  aiFragments?: number
  humanFragments?: number
  uncertainFragments?: number
}

// 充值相关接口
export interface RechargePackageResponse {
  id: number
  name: string
  price: number
  quota: number
  validity: string
  popular: boolean
  features: string[]
}

export interface TransactionResponse {
  id: string
  date: string
  packageName: string
  quota: number
  amount: number
  paymentMethod: string
  status: string
}

export interface AlipayQrCodeResponse {
  success: boolean
  outTradeNo: string
  qrCode: string
  code: string
  msg: string
}

export interface AlipayOrderStatusResponse {
  orderId: string
  tradeNo: string
  tradeStatus: 'WAIT_BUYER_PAY' | 'TRADE_SUCCESS' | 'TRADE_FINISHED' | 'TRADE_CLOSED'
  totalAmount: number
  buyerLogonId: string
  isPaid: boolean
}

// 创建API服务实例
export const apiService = new ApiService()

// 认证API
export const authApi = {
  // 用户名密码登录
  loginWithUsername: (data: LoginRequest) =>
    apiService.post<JwtResponse>('/auth/login', data),

  // 邮箱密码登录
  loginWithEmail: (data: EmailLoginRequest) =>
    apiService.post<JwtResponse>('/auth/email-login', data),

  // Google 登录
  loginWithGoogle: (data: GoogleLoginRequest) =>
    apiService.post<JwtResponse>('/auth/google-login', data),

  // 用户注册
  register: (data: RegisterRequest) =>
    apiService.post<string>('/auth/register', data),

  // 发送邮箱验证码
  sendEmailVerification: (data: EmailVerificationRequest) =>
    apiService.post<null>('/auth/verify-email', data),

  // 重置密码
  resetPassword: (data: ResetPasswordRequest) =>
    apiService.post<null>('/auth/reset-password', data),
}

// 用户API
export const userApi = {
  // 获取用户信息与额度
  getUserInfo: () =>
    apiService.get<UserInfoResponse>('/user/info'),

  // 获取个人资料
  getProfile: () =>
    apiService.get<UserProfileResponse>('/profile'),

  // 更新个人资料
  updateProfile: (data: { username?: string; email?: string; phone?: string; avatar?: string }) =>
    apiService.put<null>('/profile', data),

  // 修改密码
  updatePassword: (data: { currentPassword: string; newPassword: string }) =>
    apiService.put<null>('/profile/password', data),

  // 获取仪表盘统计
  getDashboardStats: () =>
    apiService.get<DashboardStatsResponse>('/user/dashboard/stats'),
}

// 检测API
export const detectionApi = {
  // 发起AIGC检测（同步，用于文本检测）
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

    return apiService.postForm<DetectionResultResponse>('/detection/detect', formData)
  },

  // 提交异步检测任务（用于视频、音频检测）
  submitAsyncDetection: (data: AsyncDetectionSubmitRequest) => {
    const formData = new FormData()
    formData.append('type', data.type)
    formData.append('file', data.file)
    
    return apiService.postForm<AsyncDetectionSubmitResponse>('/detection/submit', formData)
  },

  // 查询异步检测任务结果
  queryAsyncDetection: (taskId: string) =>
    apiService.get<AsyncDetectionQueryResponse>(`/detection/task/${taskId}`, undefined, true),

  // 查询近期检测记录
  getRecentDetections: (limit?: number) =>
    apiService.get<DetectionRecord[]>('/detection/recent', { limit }),
}

// 历史记录API
export const historyApi = {
  // 查询全部检测历史
  getHistory: () =>
    apiService.get<DetectionRecordResponse[]>('/history'),

  // 按类型筛选检测历史
  getHistoryByType: (typeId: number) =>
    apiService.get<DetectionRecordResponse[]>(`/history/type/${typeId}`),

  // 按时间范围筛选检测历史
  getHistoryByTimeRange: (timeRange: 'today' | 'week' | 'month' | 'all' = 'all') =>
    apiService.get<DetectionRecordResponse[]>('/history/time', { timeRange }),

  // 按检测结果筛选历史
  getHistoryByResult: (result: 'ai' | 'human' | 'all' = 'all') =>
    apiService.get<DetectionRecordResponse[]>(`/history/result/${result}`),

  // 获取检测记录详情
  getHistoryDetail: (id: number) =>
    apiService.get<DetectionRecordResponse>(`/history/${id}`),

  // 删除检测记录
  deleteHistoryRecord: (id: number) =>
    apiService.delete<null>(`/history/${id}`),
}

// 充值API
export const rechargeApi = {
  // 查询所有充值套餐
  getPackages: () =>
    apiService.get<RechargePackageResponse[]>('/recharge/packages'),

  // 查询套餐详情
  getPackageDetail: (id: number) =>
    apiService.get<RechargePackageResponse>(`/recharge/packages/${id}`),

  // 创建充值订单
  createOrder: (data: { packageId: number; paymentMethod: string }) =>
    apiService.postUrlEncoded<string>('/recharge/order', data),

  // 创建支付宝扫码支付
  createAlipayQrCode: (orderId: string) =>
    apiService.postUrlEncoded<AlipayQrCodeResponse>('/recharge/alipay/precreate', { orderId }),

  // 查询支付宝订单状态（静默模式，失败不显示错误提示）
  queryAlipayStatus: (orderId: string) =>
    apiService.get<AlipayOrderStatusResponse>(`/recharge/alipay/query/${orderId}`, undefined, true),

  // 取消订单
  cancelOrder: (orderId: string) =>
    apiService.post<null>(`/recharge/cancel/${orderId}`),

  // 查询充值交易记录
  getTransactions: (filter?: 'all' | '7days' | '30days' | '90days') =>
    apiService.get<TransactionResponse[]>('/recharge/transactions', { filter }),
}

// 文本人性化改写相关接口
export interface HumanizeRequest {
  data: string
  model?: '0' | '1' | '2'
}

export interface HumanizeResult {
  originalText: string
  humanizedText: string
  model: string
  quotaUsed: number
  remainingQuota: number
}

// 邀请码相关接口
export interface UseInvitationCodeRequest {
  code: string
}

// 文本改写API
export const humanizeApi = {
  // 文本人性化改写
  humanize: (data: HumanizeRequest) =>
    apiService.post<HumanizeResult>('/detection/humanize', data),
}

// 邀请码API
export const invitationCodeApi = {
  // 使用邀请码
  useInvitationCode: (data: UseInvitationCodeRequest) =>
    apiService.post<null>('/invitation-code/use', data),
}

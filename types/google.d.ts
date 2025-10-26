/**
 * Google Identity Services (GIS) TypeScript 类型定义
 * 文档: https://developers.google.com/identity/gsi/web/reference/js-reference
 */

/**
 * Google 凭证响应
 * 当用户成功登录后返回的凭证对象
 */
interface CredentialResponse {
  /** JWT 格式的 ID Token，包含用户信息 */
  credential: string
  /** 用户选择凭证的方式 */
  select_by: 'auto' | 'user' | 'user_1tap' | 'user_2tap' | 'btn' | 'btn_confirm' | 'btn_add_session' | 'btn_confirm_add_session'
  /** 客户端 ID */
  client_id?: string
}

/**
 * Google Identity Services 初始化配置
 */
interface GoogleAuthConfig {
  /** OAuth 2.0 客户端 ID */
  client_id: string
  /** 用户登录成功后的回调函数 */
  callback: (response: CredentialResponse) => void
  /** 是否自动选择用户（如果只有一个 Google 账号） */
  auto_select?: boolean
  /** 点击 One Tap 外部时是否取消 */
  cancel_on_tap_outside?: boolean
  /** 登录 URI，用于 redirect 模式 */
  login_uri?: string
  /** 原生回调函数（用于 redirect 模式） */
  native_callback?: (response: { id: string; password: string }) => void
  /** 取消 prompt 时的回调 */
  prompt_parent_id?: string
  /** 随机数，用于防止 CSRF 攻击 */
  nonce?: string
  /** 上下文，用于登录提示 */
  context?: 'signin' | 'signup' | 'use'
  /** 状态参数 */
  state_cookie_domain?: string
  /** UX 模式：popup 或 redirect */
  ux_mode?: 'popup' | 'redirect'
  /** 允许的父域 */
  allowed_parent_origin?: string | string[]
  /** 中间 iframe 的父元素 */
  intermediate_iframe_close_callback?: () => void
  /** 是否使用 FedCM */
  use_fedcm_for_prompt?: boolean
}

/**
 * Google 按钮渲染配置
 */
interface GoogleButtonConfig {
  /** 按钮主题 */
  theme?: 'outline' | 'filled_blue' | 'filled_black'
  /** 按钮尺寸 */
  size?: 'large' | 'medium' | 'small'
  /** 按钮类型 */
  type?: 'standard' | 'icon'
  /** 按钮形状 */
  shape?: 'rectangular' | 'pill' | 'circle' | 'square'
  /** 按钮文字 */
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  /** Logo 对齐方式 */
  logo_alignment?: 'left' | 'center'
  /** 按钮宽度（像素） */
  width?: number
  /** 语言代码 */
  locale?: string
}

/**
 * 撤销访问权限的回调
 */
interface RevocationResponse {
  /** 是否成功撤销 */
  successful: boolean
  /** 错误信息（如果有） */
  error?: string
}

/**
 * Google Identity Services API
 */
interface GoogleAccounts {
  id: {
    /**
     * 初始化 Google Identity Services
     * @param config 配置对象
     */
    initialize: (config: GoogleAuthConfig) => void

    /**
     * 显示 One Tap 登录 UI
     * @param momentListener 可选的通知回调
     */
    prompt: (momentListener?: (notification: PromptMomentNotification) => void) => void

    /**
     * 渲染登录按钮
     * @param parent 父元素
     * @param options 按钮配置
     */
    renderButton: (parent: HTMLElement, options: GoogleButtonConfig) => void

    /**
     * 禁用自动选择
     * 用户主动登出时调用，防止自动重新登录
     */
    disableAutoSelect: () => void

    /**
     * 撤销用户的授权
     * @param email 用户邮箱
     * @param callback 回调函数
     */
    revoke: (email: string, callback: (response: RevocationResponse) => void) => void

    /**
     * 取消 One Tap 流程
     */
    cancel: () => void

    /**
     * 储存用户凭证（用于原生应用）
     */
    storeCredential: (credential: { id: string; password: string }, callback: () => void) => void
  }
}

/**
 * One Tap 提示通知
 */
interface PromptMomentNotification {
  /** 是否显示了 UI */
  isDisplayed: () => boolean
  /** 是否未显示 UI */
  isNotDisplayed: () => boolean
  /** 是否显示了 moment */
  isDisplayMoment: () => boolean
  /** 是否跳过了 moment */
  isSkippedMoment: () => boolean
  /** 是否关闭了 moment */
  isDismissedMoment: () => boolean
  /** 未显示的原因 */
  getNotDisplayedReason: () => 
    | 'browser_not_supported'
    | 'invalid_client'
    | 'missing_client_id'
    | 'opt_out_or_no_session'
    | 'secure_http_required'
    | 'suppressed_by_user'
    | 'unregistered_origin'
    | 'unknown_reason'
  /** 跳过的原因 */
  getSkippedReason: () =>
    | 'auto_cancel'
    | 'user_cancel'
    | 'tap_outside'
    | 'issuing_failed'
  /** 消失的原因 */
  getDismissedReason: () =>
    | 'credential_returned'
    | 'cancel_called'
    | 'flow_restarted'
  /** moment 类型 */
  getMomentType: () => 'display' | 'skipped' | 'dismissed'
}

/**
 * 扩展 Window 接口，添加 Google Identity Services
 */
interface Window {
  google?: {
    accounts: GoogleAccounts
  }
}


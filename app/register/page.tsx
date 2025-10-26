"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Lock, Mail, User } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

import { useAuth } from "@/components/providers/auth-provider"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authApi, ApiError } from "@/lib/api"

const registerSchema = z
  .object({
    username: z
      .string()
      .min(4, "用户名至少 4 个字符")
      .max(20, "用户名最多 20 个字符")
      .regex(/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, "用户名只能包含字母、数字、下划线和中文"),
    email: z.string().email("请输入有效的邮箱地址"),
    emailVerificationCode: z.string().min(4, "请输入验证码"),
    password: z.string().min(8, "密码至少 8 位字符"),
    confirmPassword: z.string().min(8, "确认密码至少 8 位字符"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "两次输入的密码不一致",
    path: ["confirmPassword"],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [sendingCode, setSendingCode] = useState(false)
  const router = useRouter()
  const { register, loading } = useAuth()

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      emailVerificationCode: "",
      password: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    if (!countdown) return
    const timer = window.setInterval(() => {
      setCountdown((value) => {
        if (value <= 1) {
          window.clearInterval(timer)
          return 0
        }
        return value - 1
      })
    }, 1000)

    return () => window.clearInterval(timer)
  }, [countdown])

  const handleSendCode = async () => {
    const email = form.getValues("email")
    const emailCheck = z.string().email().safeParse(email)
    if (!emailCheck.success) {
      form.setError("email", { message: "请先填写正确的邮箱地址" })
      return
    }

    try {
      setSendingCode(true)
      setSubmitError(null)
      await authApi.sendEmailVerification({ email })
      toast.success("验证码已发送到邮箱，请注意查收", { duration: 3000 })
      setCountdown(60)
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message)
        return
      }

      if (error instanceof Error) {
        setSubmitError(error.message)
      } else {
        setSubmitError("验证码发送失败，请稍后再试")
      }
    } finally {
      setSendingCode(false)
    }
  }

  const handleSubmit = async (values: RegisterFormValues) => {
    try {
      setSubmitError(null)
      await register({
        username: values.username,
        email: values.email,
        password: values.password,
        emailVerificationCode: values.emailVerificationCode,
      })
      router.push("/login")
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message)
        return
      }

      if (error instanceof Error) {
        setSubmitError(error.message)
      } else {
        setSubmitError("注册失败，请稍后重试")
      }
    }
  }

  const handleGoogleRegister = () => {
    toast.info("Google 注册功能开发中，敬请期待！即将上线 🚀", { duration: 3000 })
  }

  return (
    <div className="min-h-screen gradient-background flex items-center justify-center px-6 py-12">
      <Link href="/" className="fixed top-8 left-8 text-2xl font-bold text-white hover:opacity-80 transition-opacity">
        DragonAI
      </Link>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">创建账户</h1>
            <p className="text-white/60 text-sm">开始您的 AI 文本检测之旅</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-white/80 font-medium">
                      用户名 
                      <span className="text-white/50 text-xs ml-2">（4-20个字符）</span>
                    </FormLabel>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="请输入用户名"
                          className="w-full h-12 pl-12 pr-4 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:bg-white/10 focus:border-orange-500/50 transition-all"
                          {...field}
                        />
                      </FormControl>
                    </div>
                    <FormMessage className="text-white" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-white/80 font-medium">邮箱地址</FormLabel>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            className="w-full h-12 pl-12 pr-4 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:bg-white/10 focus:border-orange-500/50 transition-all"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleSendCode}
                        disabled={sendingCode || countdown > 0}
                        className="h-12 px-4 text-sm font-medium bg-white/10 hover:bg-white/15 text-white border border-white/10 rounded-xl whitespace-nowrap disabled:opacity-50"
                      >
                        {countdown > 0 ? `${countdown}s` : "获取验证码"}
                      </Button>
                    </div>
                    <FormMessage className="text-white" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emailVerificationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-white/80 font-medium">邮箱验证码</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="输入邮箱中的验证码"
                        className="w-full h-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:bg-white/10 focus:border-orange-500/50 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-white" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-white/80 font-medium">密码</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="至少 8 个字符"
                          className="w-full h-12 pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:bg-white/10 focus:border-orange-500/50 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <FormMessage className="text-white" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-white/80 font-medium">确认密码</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="再次输入密码"
                          className="w-full h-12 pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 rounded-xl focus:bg-white/10 focus:border-orange-500/50 transition-all"
                          {...field}
                        />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <FormMessage className="text-white" />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500/50"
                />
                <label htmlFor="terms" className="text-sm text-white/60">
                  我同意{" "}
                  <Link href="/terms" className="text-orange-400 hover:text-orange-300 transition-colors">
                    服务条款
                  </Link>{" "}
                  和{" "}
                  <Link href="/privacy" className="text-orange-400 hover:text-orange-300 transition-colors">
                    隐私政策
                  </Link>
                </label>
              </div>

              {submitError ? <p className="text-sm text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-2">{submitError}</p> : null}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/50 disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    注册中...
                  </span>
                ) : (
                  "创建账户"
                )}
              </Button>
            </form>
          </Form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-transparent text-white/40">或</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleRegister}
              className="w-full h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl transition-all"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              使用 Google 注册
            </Button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/60">
              已有账户？{" "}
              <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

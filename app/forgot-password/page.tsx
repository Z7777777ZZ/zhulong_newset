"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"

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

const resetPasswordSchema = z.object({
  email: z.string().email("请输入有效的邮箱地址"),
  verificationCode: z.string().min(6, "验证码为6位数字").max(6, "验证码为6位数字"),
  newPassword: z.string().min(6, "密码至少 6 位字符").max(20, "密码最多 20 位字符"),
})

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function ForgotPasswordPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(0)
  const [sendingCode, setSendingCode] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
      verificationCode: "",
      newPassword: "",
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

  const handleSubmit = async (values: ResetPasswordFormValues) => {
    try {
      setLoading(true)
      setSubmitError(null)
      
      await authApi.resetPassword({
        email: values.email,
        verificationCode: values.verificationCode,
        newPassword: values.newPassword,
      })
      
      toast.success("密码重置成功，请使用新密码登录", { duration: 3000 })
      
      // 延迟跳转到登录页
      setTimeout(() => {
        router.push("/login")
      }, 1500)
    } catch (error) {
      if (error instanceof ApiError) {
        setSubmitError(error.message)
        return
      }

      if (error instanceof Error) {
        setSubmitError(error.message)
      } else {
        setSubmitError("密码重置失败，请稍后重试")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-background flex items-center justify-center px-6 py-12">
      <Link href="/" className="fixed top-8 left-8 text-2xl font-bold text-white hover:opacity-80 transition-opacity">
        DragonAI
      </Link>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">重置密码</h1>
            <p className="text-white/60 text-sm">通过邮箱验证码重置您的密码</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                name="verificationCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-white/80 font-medium">邮箱验证码</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="输入6位数字验证码"
                        maxLength={6}
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
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-white/80 font-medium">新密码</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <FormControl>
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="6-20个字符"
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

              {submitError ? <p className="text-sm text-orange-400 bg-orange-500/10 border border-orange-500/20 rounded-lg px-4 py-2">{submitError}</p> : null}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-500/50 disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    重置中...
                  </span>
                ) : (
                  "重置密码"
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-8 text-center">
            <p className="text-sm text-white/60">
              想起密码了？{" "}
              <Link href="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
                返回登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


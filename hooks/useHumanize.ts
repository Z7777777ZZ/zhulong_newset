'use client'

import { useState } from 'react'
import { humanizeApi, type HumanizeResult } from '@/lib/api'
import { toast } from 'sonner'

/**
 * AI文本人性化改写功能 Hook
 */
export function useHumanize() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<HumanizeResult | null>(null)

  const humanize = async (text: string, model: '0' | '1' | '2' = '0') => {
    if (!text.trim()) {
      toast.error('请输入待改写的文本', { duration: 3000 })
      return null
    }

    // 检查文本长度，至少需要100字
    if (text.length < 100) {
      toast.error(`文本内容至少需要100字才能进行改写，当前字数：${text.length}字`, { duration: 4000 })
      return null
    }

    // 检查文本长度上限
    if (text.length > 10000) {
      toast.error(`文本内容不能超过10000字，当前字数：${text.length}字`, { duration: 4000 })
      return null
    }

    setIsProcessing(true)
    setResult(null)

    try {
      const response = await humanizeApi.humanize({
        data: text,
        model,
      })
      
      setResult(response.data)
      toast.success('改写完成', { duration: 3000 })
      return response.data
    } catch (error: any) {
      console.error('改写失败:', error)
      
      // 根据错误状态码显示具体错误信息
      if (error?.status === 400) {
        toast.error(error.message || '请求参数错误，请检查输入内容', { duration: 4000 })
      } else if (error?.status === 403) {
        toast.error(error.message || '配额不足，请充值后再试', { duration: 4000 })
      } else if (error?.status === 500) {
        toast.error('文本改写失败，请稍后重试', { duration: 4000 })
      } else if (error?.message) {
        toast.error(error.message, { duration: 4000 })
      }
      
      setResult(null)
      return null
    } finally {
      setIsProcessing(false)
    }
  }

  const reset = () => {
    setResult(null)
  }

  return {
    isProcessing,
    result,
    humanize,
    reset,
  }
}


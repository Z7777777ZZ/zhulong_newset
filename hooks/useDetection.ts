'use client'

import { useState } from 'react'
import { detectionApi, type DetectionResultResponse } from '@/lib/api'
import { toast } from 'sonner'

/**
 * AI检测功能 Hook
 */
export function useDetection() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<DetectionResultResponse | null>(null)

  const detect = async (text: string, options?: {
    enableFragmentAnalysis?: boolean
    splitStrategy?: 'paragraph' | 'semantic' | 'default' | 'sentence' | 'fixed'
  }) => {
    if (!text.trim()) {
      toast.error('请输入待检测的文本', { duration: 3000 })
      return null
    }

    // 检查文本长度，至少需要100字
    if (text.length < 100) {
      toast.error(`文本内容至少需要100字才能进行检测，当前字数：${text.length}字`, { duration: 4000 })
      return null
    }

    setIsProcessing(true)
    setResult(null)

    try {
      const response = await detectionApi.detect({
        text,
        type: 'text',
        enableFragmentAnalysis: options?.enableFragmentAnalysis ?? true,
        splitStrategy: options?.splitStrategy ?? 'paragraph',
      })
      
      setResult(response.data)
      toast.success('检测完成', { duration: 3000 })
      return response.data
    } catch (error: any) {
      console.error('检测失败:', error)
      
      // 根据错误状态码显示具体错误信息
      if (error?.status === 400) {
        toast.error(error.message || '请求参数错误，请检查输入内容', { duration: 4000 })
      } else if (error?.status === 429) {
        toast.error('检测额度已用完，请充值后再试', { duration: 4000 })
      } else if (error?.status === 500) {
        toast.error('服务器处理失败，请稍后重试', { duration: 4000 })
      } else if (error?.status === 507) {
        toast.error('文本内容太大，无法处理。请删减部分内容后重试', { duration: 6000 })
      } else if (error?.message) {
        toast.error(error.message, { duration: 4000 })
      }
      
      setResult(null)
      return null
    } finally {
      setIsProcessing(false)
    }
  }

  const detectFile = async (file: File, options?: {
    type?: 'text' | 'image' | 'video' | 'audio'
    enableFragmentAnalysis?: boolean
    splitStrategy?: 'paragraph' | 'semantic' | 'default' | 'sentence' | 'fixed'
  }) => {
    if (!file) {
      toast.error('请选择要检测的文件', { duration: 3000 })
      return null
    }

    // 检查文件大小（10MB限制）
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      toast.error(`文件大小超出限制，最大支持10MB。当前文件：${(file.size / 1024 / 1024).toFixed(2)}MB`, { duration: 5000 })
      return null
    }

    setIsProcessing(true)
    setResult(null)

    // 显示处理提示（大文件可能需要更长时间）
    const isLargeFile = file.size > 1024 * 1024 // 大于1MB
    if (isLargeFile) {
      toast.info('文件较大，正在处理中，请耐心等待...', { duration: 3000 })
    }

    try {
      const response = await detectionApi.detect({
        file,
        type: options?.type ?? 'text',
        enableFragmentAnalysis: options?.enableFragmentAnalysis ?? true,
        splitStrategy: options?.splitStrategy ?? 'paragraph',
      })
      
      setResult(response.data)
      toast.success('检测完成', { duration: 3000 })
      return response.data
    } catch (error: any) {
      console.error('检测失败:', error)
      
      // 根据错误状态码显示具体错误信息
      if (error?.status === 400) {
        toast.error(error.message || '文件格式不支持或内容有误', { duration: 4000 })
      } else if (error?.status === 413) {
        toast.error('文件过大，请上传小于10MB的文件', { duration: 4000 })
      } else if (error?.status === 429) {
        toast.error('检测额度已用完，请充值后再试', { duration: 4000 })
      } else if (error?.status === 500) {
        toast.error('服务器处理失败，文件可能损坏或格式不正确', { duration: 5000 })
      } else if (error?.status === 504 || error?.message?.includes('timeout')) {
        toast.error('文件处理超时，请尝试上传较小的文件或内容较少的文档', { duration: 5000 })
      } else if (error?.status === 507) {
        toast.error('文本内容太大，无法处理。请尝试上传内容更少的文档或删减部分内容后重试', { duration: 6000 })
      } else if (error?.message) {
        toast.error(error.message, { duration: 4000 })
      } else {
        toast.error('检测失败，请检查网络连接或稍后重试', { duration: 4000 })
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
    detect,
    detectFile,
    reset,
  }
}


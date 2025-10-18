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
    } catch (error) {
      console.error('检测失败:', error)
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
    setIsProcessing(true)
    setResult(null)

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
    } catch (error) {
      console.error('检测失败:', error)
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


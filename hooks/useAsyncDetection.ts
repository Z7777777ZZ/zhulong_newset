'use client'

import { useState, useEffect, useRef } from 'react'
import { detectionApi, type AsyncDetectionSubmitResponse, type AsyncDetectionQueryResponse, type DetectionResultResponse } from '@/lib/api'
import { toast } from 'sonner'

/**
 * 异步AI检测功能 Hook
 * 用于视频、音频等需要较长时间处理的检测任务
 */
export function useAsyncDetection() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [progress, setProgress] = useState<{
    status: 'idle' | 'uploading' | 'processing' | 'completed' | 'failed'
    message: string
    percentage?: number
  }>({ status: 'idle', message: '' })
  const [result, setResult] = useState<DetectionResultResponse | null>(null)
  
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const pollingCountRef = useRef(0)

  // 停止轮询
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    pollingCountRef.current = 0
  }

  // 开始轮询检测结果
  const startPolling = (taskId: string) => {
    stopPolling()
    
    pollingIntervalRef.current = setInterval(async () => {
      try {
        pollingCountRef.current++
        const response = await detectionApi.queryAsyncDetection(taskId)
        
        if (response.data.status === 'completed' && response.data.result) {
          // 检测完成
          setResult(response.data.result)
          setProgress({
            status: 'completed',
            message: '检测完成',
            percentage: 100,
          })
          setIsProcessing(false)
          stopPolling()
          toast.success('检测完成', { duration: 3000 })
        } else if (response.data.status === 'failed') {
          // 检测失败
          setProgress({
            status: 'failed',
            message: response.data.errorMessage || '检测失败',
          })
          setIsProcessing(false)
          stopPolling()
          toast.error(response.data.errorMessage || '检测失败，请稍后重试', { duration: 4000 })
        } else {
          // 仍在处理中
          // 根据轮询次数估算进度
          const estimatedProgress = Math.min(30 + pollingCountRef.current * 2, 95)
          setProgress({
            status: 'processing',
            message: '正在检测中，请稍候...',
            percentage: estimatedProgress,
          })
        }
        
        // 轮询超时检查（最多轮询150次，每3秒一次，总共7.5分钟）
        if (pollingCountRef.current >= 150) {
          stopPolling()
          setProgress({
            status: 'failed',
            message: '检测超时，请稍后重试',
          })
          setIsProcessing(false)
          toast.error('检测超时，可能文件过大或服务繁忙，请稍后重试', { duration: 5000 })
        }
      } catch (error: any) {
        console.error('查询检测结果失败:', error)
        // 不中断轮询，继续尝试
      }
    }, 3000) // 每3秒轮询一次
  }

  // 提交异步检测任务
  const submitDetection = async (file: File, type: 'image' | 'audio' | 'video') => {
    if (!file) {
      toast.error('请选择要检测的文件', { duration: 3000 })
      return null
    }

    // 文件大小限制检查
    const maxSizes: Record<typeof type, number> = {
      image: 50 * 1024 * 1024,   // 50MB
      audio: 500 * 1024 * 1024,  // 500MB
      video: 500 * 1024 * 1024,  // 500MB
    }
    
    if (file.size > maxSizes[type]) {
      const maxSizeMB = maxSizes[type] / 1024 / 1024
      toast.error(`文件大小超出限制，最大支持${maxSizeMB}MB。当前文件：${(file.size / 1024 / 1024).toFixed(2)}MB`, { duration: 5000 })
      return null
    }

    setIsProcessing(true)
    setResult(null)
    setTaskId(null)
    setProgress({
      status: 'uploading',
      message: '正在上传文件...',
      percentage: 10,
    })

    // 显示处理提示
    const typeNames = { image: '图片', audio: '音频', video: '视频' }
    toast.info(`正在提交${typeNames[type]}检测任务，请稍候...`, { duration: 3000 })

    try {
      const response = await detectionApi.submitAsyncDetection({ file, type })
      
      if (response.data.status === 'failed') {
        // 提交失败
        setProgress({
          status: 'failed',
          message: response.data.errorMessage || '提交失败',
        })
        setIsProcessing(false)
        toast.error(response.data.errorMessage || '提交检测任务失败', { duration: 4000 })
        return null
      }

      // 提交成功，开始轮询
      const newTaskId = response.data.taskId
      setTaskId(newTaskId)
      setProgress({
        status: 'processing',
        message: response.data.message || '任务已提交，正在处理中...',
        percentage: 20,
      })

      toast.success('任务已提交，正在后台处理', { duration: 3000 })

      // 延迟1秒后开始轮询，给后端一些处理时间
      setTimeout(() => {
        startPolling(newTaskId)
      }, 1000)

      return response.data
    } catch (error: any) {
      console.error('提交检测任务失败:', error)
      
      // 根据错误状态码显示具体错误信息
      if (error?.status === 400) {
        toast.error(error.message || '文件格式不支持或参数有误', { duration: 4000 })
      } else if (error?.status === 413) {
        toast.error('文件过大，请上传较小的文件', { duration: 4000 })
      } else if (error?.status === 429) {
        toast.error('检测额度已用完，请充值后再试', { duration: 4000 })
      } else if (error?.status === 500) {
        toast.error('服务器处理失败，请稍后重试', { duration: 4000 })
      } else if (error?.message) {
        toast.error(error.message, { duration: 4000 })
      } else {
        toast.error('提交失败，请检查网络连接或稍后重试', { duration: 4000 })
      }
      
      setProgress({
        status: 'failed',
        message: error?.message || '提交失败',
      })
      setIsProcessing(false)
      setResult(null)
      return null
    }
  }

  // 重置状态
  const reset = () => {
    stopPolling()
    setResult(null)
    setTaskId(null)
    setIsProcessing(false)
    setProgress({ status: 'idle', message: '' })
  }

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopPolling()
    }
  }, [])

  return {
    isProcessing,
    progress,
    result,
    taskId,
    submitDetection,
    reset,
  }
}


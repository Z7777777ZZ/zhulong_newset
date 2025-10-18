'use client'

import { useState, useEffect } from 'react'
import { rechargeApi, type RechargePackageResponse, type TransactionResponse, type AlipayOrderStatusResponse } from '@/lib/api'
import { toast } from 'sonner'
import QRCode from 'qrcode'

/**
 * 充值套餐管理 Hook
 */
export function useRecharge() {
  const [packages, setPackages] = useState<RechargePackageResponse[]>([])
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  const fetchPackages = async () => {
    setLoading(true)
    try {
      const response = await rechargeApi.getPackages()
      setPackages(response.data)
    } catch (error) {
      console.error('获取套餐失败:', error)
      toast.error('获取套餐失败', { duration: 3000 })
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async (filter?: 'all' | '7days' | '30days' | '90days') => {
    setLoading(true)
    try {
      const response = await rechargeApi.getTransactions(filter)
      // 过滤掉"待支付"和"已取消"的交易记录
      const filteredTransactions = response.data.filter(
        (transaction) => transaction.status !== '待支付' && transaction.status !== '已取消'
      )
      setTransactions(filteredTransactions)
    } catch (error) {
      console.error('获取交易记录失败:', error)
      toast.error('获取交易记录失败', { duration: 3000 })
    } finally {
      setLoading(false)
    }
  }

  const createOrder = async (packageId: number, paymentMethod: string) => {
    setCreating(true)
    console.log('🛒 准备创建订单:', { packageId, paymentMethod })
    
    // 检查localStorage中的token
    const token = localStorage.getItem('zhulong.token') || sessionStorage.getItem('zhulong.token')
    console.log('🔑 当前token状态:', { 
      hasToken: !!token, 
      tokenLength: token?.length,
      tokenPreview: token ? token.substring(0, 30) + '...' : 'NO TOKEN'
    })
    
    try {
      const response = await rechargeApi.createOrder({ packageId, paymentMethod })
      toast.success('订单创建成功', { duration: 3000 })
      return response.data // 返回订单号
    } catch (error) {
      console.error('❌ 创建订单失败:', error)
      if (error instanceof Error) {
        console.error('错误详情:', error.message)
      }
      toast.error('创建订单失败，请查看详细错误信息', { duration: 3000 })
      return null
    } finally {
      setCreating(false)
    }
  }

  useEffect(() => {
    fetchPackages()
    fetchTransactions()
  }, [])

  return {
    packages,
    transactions,
    loading,
    creating,
    fetchPackages,
    fetchTransactions,
    createOrder,
  }
}

/**
 * 支付宝支付 Hook
 */
export function useAlipay() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [orderStatus, setOrderStatus] = useState<AlipayOrderStatusResponse | null>(null)
  const [polling, setPolling] = useState(false)

  const createQrCode = async (orderId: string) => {
    try {
      const response = await rechargeApi.createAlipayQrCode(orderId)
      if (response.data.success) {
        // 将支付宝URL转换为二维码图片（base64）
        const qrCodeDataUrl = await QRCode.toDataURL(response.data.qrCode, {
          width: 200,
          margin: 1,
        })
        setQrCode(qrCodeDataUrl)
        return qrCodeDataUrl
      }
      toast.error('创建支付二维码失败', { duration: 3000 })
      return null
    } catch (error) {
      console.error('创建支付二维码失败:', error)
      toast.error('创建支付二维码失败', { duration: 3000 })
      return null
    }
  }

  const queryStatus = async (orderId: string) => {
    try {
      const response = await rechargeApi.queryAlipayStatus(orderId)
      setOrderStatus(response.data)
      return response.data
    } catch (error) {
      // 静默处理，避免频繁报错
      // 注意：API 层可能已经显示了错误提示，这里返回 null 让调用者处理
      console.log('查询订单状态失败（订单可能已取消）:', orderId)
      return null
    }
  }

  const cancelOrder = async (orderId: string) => {
    try {
      await rechargeApi.cancelOrder(orderId)
      toast.success('订单已取消', { duration: 3000 })
      return true
    } catch (error) {
      console.error('取消订单失败:', error)
      toast.error('取消订单失败', { duration: 3000 })
      return false
    }
  }

  // 轮询订单状态
  const startPolling = (orderId: string, onSuccess?: () => void) => {
    setPolling(true)
    let timeoutId: NodeJS.Timeout

    const interval = setInterval(async () => {
      const status = await queryStatus(orderId)
      if (status?.isPaid) {
        clearInterval(interval)
        clearTimeout(timeoutId)
        setPolling(false)
        toast.success('支付成功!', { duration: 3000 })
        onSuccess?.()
      }
    }, 3000) // 每3秒查询一次

    // 5分钟后停止轮询
    timeoutId = setTimeout(() => {
      clearInterval(interval)
      setPolling(false)
    }, 300000)

    // 返回清理函数
    return () => {
      clearInterval(interval)
      clearTimeout(timeoutId)
      setPolling(false)
    }
  }

  return {
    qrCode,
    orderStatus,
    polling,
    createQrCode,
    queryStatus,
    cancelOrder,
    startPolling,
  }
}


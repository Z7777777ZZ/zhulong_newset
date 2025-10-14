'use client'

import { useState, useEffect } from 'react'
import { rechargeApi, type RechargePackageResponse, type TransactionResponse, type AlipayOrderStatusResponse } from '@/lib/api'
import { toast } from 'sonner'

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
      toast.error('获取套餐失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async (filter?: 'all' | '7days' | '30days' | '90days') => {
    setLoading(true)
    try {
      const response = await rechargeApi.getTransactions(filter)
      setTransactions(response.data)
    } catch (error) {
      console.error('获取交易记录失败:', error)
      toast.error('获取交易记录失败')
    } finally {
      setLoading(false)
    }
  }

  const createOrder = async (packageId: number, paymentMethod: string) => {
    setCreating(true)
    try {
      const response = await rechargeApi.createOrder({ packageId, paymentMethod })
      toast.success('订单创建成功')
      return response.data // 返回订单号
    } catch (error) {
      console.error('创建订单失败:', error)
      toast.error('创建订单失败')
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
        setQrCode(response.data.qrCode)
        return response.data.qrCode
      }
      toast.error('创建支付二维码失败')
      return null
    } catch (error) {
      console.error('创建支付二维码失败:', error)
      toast.error('创建支付二维码失败')
      return null
    }
  }

  const queryStatus = async (orderId: string) => {
    try {
      const response = await rechargeApi.queryAlipayStatus(orderId)
      setOrderStatus(response.data)
      return response.data
    } catch (error) {
      console.error('查询订单状态失败:', error)
      return null
    }
  }

  const cancelOrder = async (orderId: string) => {
    try {
      await rechargeApi.cancelOrder(orderId)
      toast.success('订单已取消')
      return true
    } catch (error) {
      console.error('取消订单失败:', error)
      toast.error('取消订单失败')
      return false
    }
  }

  // 轮询订单状态
  const startPolling = (orderId: string, onSuccess?: () => void) => {
    setPolling(true)
    const interval = setInterval(async () => {
      const status = await queryStatus(orderId)
      if (status?.isPaid) {
        clearInterval(interval)
        setPolling(false)
        toast.success('支付成功!')
        onSuccess?.()
      }
    }, 3000) // 每3秒查询一次

    // 5分钟后停止轮询
    setTimeout(() => {
      clearInterval(interval)
      setPolling(false)
    }, 300000)

    return () => clearInterval(interval)
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


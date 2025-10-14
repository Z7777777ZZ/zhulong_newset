'use client'

import { useState, useEffect } from 'react'
import { userApi, type DashboardStatsResponse } from '@/lib/api'
import { toast } from 'sonner'

/**
 * 仪表盘统计 Hook
 */
export function useDashboard() {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchStats = async () => {
    setLoading(true)
    try {
      const response = await userApi.getDashboardStats()
      setStats(response.data)
    } catch (error) {
      console.error('获取统计数据失败:', error)
      toast.error('获取统计数据失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    refresh: fetchStats,
  }
}


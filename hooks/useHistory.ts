'use client'

import { useState, useEffect } from 'react'
import { historyApi, type DetectionRecordResponse } from '@/lib/api'
import { toast } from 'sonner'

/**
 * 历史记录管理 Hook
 */
export function useHistory() {
  const [records, setRecords] = useState<DetectionRecordResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<{
    type?: number
    timeRange?: 'today' | 'week' | 'month' | 'all'
    result?: 'ai' | 'human' | 'all'
  }>({})

  const fetchHistory = async () => {
    setLoading(true)
    try {
      let response

      // 根据不同的筛选条件调用不同的API
      if (filter.type !== undefined) {
        response = await historyApi.getHistoryByType(filter.type)
      } else if (filter.timeRange) {
        response = await historyApi.getHistoryByTimeRange(filter.timeRange)
      } else if (filter.result) {
        response = await historyApi.getHistoryByResult(filter.result)
      } else {
        response = await historyApi.getHistory()
      }

      setRecords(response.data)
    } catch (error) {
      console.error('获取历史记录失败:', error)
      toast.error('获取历史记录失败', { duration: 3000 })
    } finally {
      setLoading(false)
    }
  }

  const deleteRecord = async (id: number) => {
    try {
      await historyApi.deleteHistoryRecord(id)
      toast.success('删除成功', { duration: 3000 })
      // 重新获取列表
      await fetchHistory()
    } catch (error) {
      console.error('删除失败:', error)
      toast.error('删除失败', { duration: 3000 })
    }
  }

  const getRecordDetail = async (id: number) => {
    try {
      const response = await historyApi.getHistoryDetail(id)
      return response.data
    } catch (error) {
      console.error('获取详情失败:', error)
      toast.error('获取详情失败', { duration: 3000 })
      return null
    }
  }

  // 当筛选条件变化时重新获取
  useEffect(() => {
    fetchHistory()
  }, [filter.type, filter.timeRange, filter.result])

  return {
    records,
    loading,
    filter,
    setFilter,
    fetchHistory,
    deleteRecord,
    getRecordDetail,
  }
}

/**
 * 近期检测记录 Hook
 */
export function useRecentDetections(limit = 5) {
  const [records, setRecords] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchRecent = async () => {
    setLoading(true)
    try {
      // 使用正确的近期检测记录API
      const { detectionApi } = await import('@/lib/api')
      const response = await detectionApi.getRecentDetections(limit)
      setRecords(response.data)
    } catch (error) {
      console.error('获取近期记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecent()
  }, [limit])

  return {
    records,
    loading,
    refresh: fetchRecent,
  }
}


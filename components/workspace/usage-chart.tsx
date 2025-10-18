'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { historyApi } from '@/lib/api'

interface UsageData {
  date: string
  credits: number
}

export function UsageChart() {
  const [data, setData] = useState<UsageData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsageData = async () => {
      try {
        setLoading(true)
        // 获取最近一周的历史记录
        const response = await historyApi.getHistoryByTimeRange('week')
        
        // 按日期聚合数据 - 由于后端没有返回具体的credits消耗，我们假设每次检测消耗1 credit
        // 如果后端有更详细的credits消耗信息，可以在这里调整
        const aggregatedData = new Map<string, number>()
        
        response.data.forEach((record) => {
          const date = new Date(record.time)
          const dateStr = `${date.getMonth() + 1}/${date.getDate()}`
          
          const current = aggregatedData.get(dateStr) || 0
          // 假设每次检测消耗1 credit，实际应该根据后端返回的数据调整
          // 使用parseFloat确保数值运算后保持精度，最后在渲染时统一格式化
          aggregatedData.set(dateStr, parseFloat((current + 1).toFixed(2)))
        })
        
        // 生成最近7天的数据，即使某天没有使用也显示0
        const today = new Date()
        const last7Days: UsageData[] = []
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today)
          date.setDate(today.getDate() - i)
          const dateStr = `${date.getMonth() + 1}/${date.getDate()}`
          
          last7Days.push({
            date: dateStr,
            credits: parseFloat((aggregatedData.get(dateStr) || 0).toFixed(2))
          })
        }
        
        setData(last7Days)
      } catch (error) {
        console.error('获取使用数据失败:', error)
        // 如果获取失败，显示空数据
        setData([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsageData()
  }, [])

  if (loading) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">使用趋势</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-white/40">加载中...</div>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">使用趋势</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="text-white/40">暂无数据</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">使用趋势</h3>
        <div className="text-sm text-white/60">最近7天</div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.4)"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.4)"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              tickFormatter={(value: number) => Number(value).toFixed(2)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                color: '#fff'
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
              formatter={(value: number) => [`${Number(value).toFixed(2)} credits`, '使用量']}
            />
            <Line
              type="monotone"
              dataKey="credits"
              stroke="#fb923c"
              strokeWidth={2}
              dot={{ fill: '#fb923c', r: 4 }}
              activeDot={{ r: 6, fill: '#fb923c' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* 统计信息 */}
      <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-3 gap-4">
        <div>
          <div className="text-white/60 text-xs mb-1">7天总计</div>
          <div className="text-white font-semibold">
            {data.reduce((sum, d) => sum + d.credits, 0).toFixed(2)} credits
          </div>
        </div>
        <div>
          <div className="text-white/60 text-xs mb-1">日均使用</div>
          <div className="text-white font-semibold">
            {(data.reduce((sum, d) => sum + d.credits, 0) / 7).toFixed(2)} credits
          </div>
        </div>
        <div>
          <div className="text-white/60 text-xs mb-1">单日峰值</div>
          <div className="text-white font-semibold">
            {Math.max(...data.map(d => d.credits)).toFixed(2)} credits
          </div>
        </div>
      </div>
    </div>
  )
}


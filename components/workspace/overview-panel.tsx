'use client'

import { FileSearch, Image } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { useRecentDetections } from '@/hooks/useHistory'
import { UsageChart } from './usage-chart'

export function OverviewPanel() {
  const { user } = useAuth()
  const { records, loading } = useRecentDetections(5)

  if (!user) return null

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 统计卡片 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="text-white/60 text-sm mb-2">剩余credits</div>
          <div className="flex items-baseline gap-2">
            <div className="text-4xl font-bold text-white">{user.remainingQuota}</div>
            <div className="text-white/40 text-lg">/ {user.totalQuota}</div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="text-white/60 text-sm mb-2">累计检测</div>
          <div className="flex items-baseline gap-2">
            <div className="text-4xl font-bold text-white">{user.usedQuota}</div>
            <div className="text-white/40 text-lg">credits</div>
          </div>
        </div>
      </div>

      {/* 使用趋势图表 */}
      <UsageChart />

      {/* 最近记录 */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">最近记录</h3>
        {loading ? (
          <div className="text-center text-white/40 py-8">加载中...</div>
        ) : records.length === 0 ? (
          <div className="text-center text-white/40 py-8">暂无记录</div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <HistoryRecordItem key={record.id} record={record} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function HistoryRecordItem({ record }: { record: any }) {
  const isAI = record.confidence > 50

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/8 transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            record.detectionTypeId === 1
              ? 'bg-blue-500/10 border border-blue-500/20'
              : 'bg-green-500/10 border border-green-500/20'
          }`}
        >
          {record.detectionTypeId === 1 ? (
            <Image className="w-4 h-4 text-blue-400" />
          ) : (
            <FileSearch className="w-4 h-4 text-green-400" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-medium truncate">{record.fileName || '未命名'}</h4>
            <span
              className={`px-2 py-0.5 rounded text-xs ${
                isAI ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
              }`}
            >
              {Math.round(record.confidence)}% AI
            </span>
          </div>
          <div className="flex items-center gap-3 text-white/50 text-sm">
            <span>{new Date(record.detectionTime).toLocaleString('zh-CN')}</span>
            <span>•</span>
            <span>状态: {record.status === 1 ? '完成' : '处理中'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}


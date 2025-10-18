'use client'

import { useState, useMemo } from 'react'
import { Search, Eye, Trash2, FileSearch, Image, ChevronLeft, ChevronRight } from 'lucide-react'
import { useHistory } from '@/hooks/useHistory'

const ITEMS_PER_PAGE = 10

export function HistoryPanel() {
  const { records, loading, filter, setFilter, deleteRecord } = useHistory()
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredRecords = useMemo(() => 
    records.filter((record) =>
      record.fileName?.toLowerCase().includes(searchQuery.toLowerCase())
    ), [records, searchQuery]
  )

  const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentRecords = filteredRecords.slice(startIndex, endIndex)

  // 当筛选条件改变时重置页码
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleFilterChange = (newFilter: any) => {
    setFilter(newFilter)
    setCurrentPage(1)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* 筛选器 */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex items-center gap-4">
        <Search className="w-5 h-5 text-white/40" />
        <input
          type="text"
          placeholder="搜索记录..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex-1 bg-transparent border-none text-white placeholder-white/40 focus:outline-none"
        />
        <select
          value={filter.type || ''}
          onChange={(e) => handleFilterChange({ ...filter, type: e.target.value ? Number(e.target.value) : undefined })}
          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none"
        >
          <option value="">全部类型</option>
          <option value="1">图片</option>
          <option value="2">文本</option>
          <option value="3">视频</option>
          <option value="4">音频</option>
        </select>
        <select
          value={filter.timeRange || 'all'}
          onChange={(e) =>
            handleFilterChange({ ...filter, timeRange: e.target.value as 'today' | 'week' | 'month' | 'all' })
          }
          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none"
        >
          <option value="all">全部时间</option>
          <option value="today">今天</option>
          <option value="week">本周</option>
          <option value="month">本月</option>
        </select>
      </div>

      {/* 记录列表 */}
      {loading ? (
        <div className="text-center text-white/40 py-12">加载中...</div>
      ) : filteredRecords.length === 0 ? (
        <div className="text-center text-white/40 py-12">暂无记录</div>
      ) : (
        <>
          <div className="space-y-3">
            {currentRecords.map((record) => (
              <HistoryRecordItem key={record.id} record={record} onDelete={() => deleteRecord(record.id)} />
            ))}
          </div>

          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
              <div className="text-sm text-white/60">
                显示 {startIndex + 1}-{Math.min(endIndex, filteredRecords.length)} / 共 {filteredRecords.length} 条
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  上一页
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // 显示逻辑：始终显示第一页、最后一页、当前页及其前后各一页
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                            currentPage === page
                              ? 'bg-orange-500 text-white'
                              : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="text-white/40 px-1">...</span>
                    }
                    return null
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                >
                  下一页
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

function HistoryRecordItem({ record, onDelete }: { record: any; onDelete: () => void }) {
  const isAI = record.probability > 50

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/8 transition-all">
      <div className="flex items-center gap-4">
        <div
          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
            record.type === 1 ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-green-500/10 border border-green-500/20'
          }`}
        >
          {record.type === 1 ? <Image className="w-4 h-4 text-blue-400" /> : <FileSearch className="w-4 h-4 text-green-400" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-medium truncate">{record.fileName || '未命名'}</h4>
            <span
              className={`px-2 py-0.5 rounded text-xs ${
                isAI ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
              }`}
            >
              {record.probability}% AI
            </span>
          </div>
          <div className="flex items-center gap-3 text-white/50 text-sm">
            <span>{new Date(record.time).toLocaleString('zh-CN')}</span>
            <span>•</span>
            <span>{record.typeName}</span>
            <span>•</span>
            <span>{record.result}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}


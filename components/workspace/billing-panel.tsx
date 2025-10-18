'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Zap, CreditCard, QrCode, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRecharge, useAlipay } from '@/hooks/useRecharge'
import { useAuth } from '@/components/providers/auth-provider'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function BillingPanel() {
  const { packages, transactions, loading, createOrder, fetchTransactions } = useRecharge()
  const { refreshUser } = useAuth()
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [timeFilter, setTimeFilter] = useState<'all' | '7days' | '30days' | '90days'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const { qrCode, createQrCode, queryStatus, cancelOrder } = useAlipay()

  // 处理时间筛选
  const handleTimeFilterChange = (value: 'all' | '7days' | '30days' | '90days') => {
    setTimeFilter(value)
    setCurrentPage(1) // 重置到第一页
    fetchTransactions(value)
  }

  // 分页计算
  const { paginatedTransactions, totalPages } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return {
      paginatedTransactions: transactions.slice(startIndex, endIndex),
      totalPages: Math.ceil(transactions.length / itemsPerPage),
    }
  }, [transactions, currentPage])

  const handleSelectPackage = async (packageId: number) => {
    setSelectedPackage(packageId)
    const order = await createOrder(packageId, '支付宝')
    if (order) {
      setOrderId(order)
      const qr = await createQrCode(order)
      if (qr) {
        setShowPaymentDialog(true)
        // 不再自动轮询，等待用户点击"我已支付完成"
      } else {
        // 创建二维码失败，取消订单并清除状态
        await cancelOrder(order)
        setSelectedPackage(null)
        setOrderId(null)
      }
    } else {
      // 创建订单失败，清除选中状态
      setSelectedPackage(null)
    }
  }

  const handleCheckPayment = async () => {
    if (!orderId) return

    setChecking(true)
    try {
      const status = await queryStatus(orderId)
      if (status === null) {
        // 查询失败（订单可能已取消或不存在），关闭对话框
        // API 层已显示错误提示，这里只需关闭对话框
        setOrderId(null)
        setSelectedPackage(null)
        setShowPaymentDialog(false)
      } else if (status?.isPaid) {
        toast.success('支付成功!', { duration: 3000 })
        setOrderId(null) // 先清除 orderId，避免关闭对话框时误取消已支付订单
        setSelectedPackage(null) // 清除选中的套餐
        setShowPaymentDialog(false)
        await refreshUser()
        // 刷新交易记录，显示新的已完成订单
        await fetchTransactions(timeFilter)
      } else {
        toast.error('未检测到支付，请完成支付后再试', { duration: 3000 })
      }
    } finally {
      setChecking(false)
    }
  }

  const handleCancelPayment = async () => {
    if (orderId) {
      await cancelOrder(orderId)
      // 刷新交易记录，移除已取消的订单
      await fetchTransactions(timeFilter)
    }
    // 清除所有状态
    setOrderId(null)
    setSelectedPackage(null) // 清除选中的套餐，恢复按钮状态
    setShowPaymentDialog(false)
  }

  const handleDialogChange = async (open: boolean) => {
    if (!open && orderId) {
      // 用户关闭对话框，取消订单
      await cancelOrder(orderId)
      setOrderId(null)
      setSelectedPackage(null) // 清除选中的套餐，恢复按钮状态
      // 刷新交易记录，移除已取消的订单
      await fetchTransactions(timeFilter)
    }
    setShowPaymentDialog(open)
  }

  return (
    <div className="space-y-10">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">充值套餐</h2>
        <p className="text-white/60 text-sm">选择适合您的套餐，随时升级</p>
      </div>

      {/* 充值套餐 */}
      <div className="grid grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-3 text-center text-white/40 py-12">加载中...</div>
        ) : packages.length === 0 ? (
          <div className="col-span-3 text-center text-white/40 py-12">暂无套餐</div>
        ) : (
          packages.map((pkg) => (
            <PricingCard
              key={pkg.id}
              package={pkg}
              onSelect={() => handleSelectPackage(pkg.id)}
              loading={selectedPackage === pkg.id && !showPaymentDialog}
            />
          ))
        )}
      </div>

      {/* 交易记录 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">交易记录</h3>
          <Select value={timeFilter} onValueChange={handleTimeFilterChange}>
            <SelectTrigger className="w-[180px] bg-white/5 border-white/10 text-white">
              <SelectValue placeholder="选择时间范围" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-white/10 text-white">
              <SelectItem value="all">全部记录</SelectItem>
              <SelectItem value="7days">最近7天</SelectItem>
              <SelectItem value="30days">最近30天</SelectItem>
              <SelectItem value="90days">最近90天</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-sm">暂无交易记录</p>
            </div>
          ) : (
            <>
              {/* 交易列表 */}
              <div className="divide-y divide-white/10">
                {paginatedTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
                    <div className="flex-1">
                      <div className="text-white font-medium mb-1">{transaction.packageName}</div>
                      <div className="text-white/50 text-sm">{new Date(transaction.date).toLocaleString('zh-CN')}</div>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-white font-bold mb-1">¥{transaction.amount}</div>
                      <div className={`text-sm ${
                        transaction.status === '已完成' ? 'text-green-400' :
                        transaction.status === '待支付' ? 'text-yellow-400' :
                        'text-white/50'
                      }`}>
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 分页控制 */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-white/10">
                  <div className="text-white/50 text-sm">
                    共 {transactions.length} 条记录，第 {currentPage} / {totalPages} 页
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10 disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="bg-white/5 border-white/10 text-white hover:bg-white/10 disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 支付弹窗 */}
      <Dialog open={showPaymentDialog} onOpenChange={handleDialogChange}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>扫码支付</DialogTitle>
            <DialogDescription className="text-white/60">请使用支付宝扫描二维码完成支付</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            {qrCode ? (
              <>
                <div className="bg-white p-4 rounded-lg">
                  <img src={qrCode} alt="支付二维码" className="w-48 h-48" />
                </div>
                <p className="mt-4 text-white/60 text-sm">
                  请使用支付宝扫描二维码完成支付
                </p>
              </>
            ) : (
              <div className="text-white/40">加载二维码中...</div>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleCancelPayment}
              className="flex-1 bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              取消支付
            </Button>
            <Button
              onClick={handleCheckPayment}
              disabled={checking}
              className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white disabled:opacity-50"
            >
              {checking ? '检查中...' : '我已支付完成'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PricingCard({
  package: pkg,
  onSelect,
  loading,
}: {
  package: any
  onSelect: () => void
  loading?: boolean
}) {
  return (
    <div
      className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 border ${
        pkg.popular ? 'border-orange-400/50 ring-2 ring-orange-400/20' : 'border-white/10'
      } relative hover:bg-white/8 transition-all flex flex-col h-full`}
    >
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-white text-xs font-medium shadow-lg">
            推荐
          </div>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-base font-semibold text-white mb-3">{pkg.name}</h3>
        <div className="mb-3">
          <span className="text-3xl font-bold text-white">¥{pkg.price}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
          <Zap className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-white/80 text-sm font-medium">{pkg.quota} 次</span>
        </div>
      </div>

      <div className="space-y-3 mb-6 flex-1">
        {pkg.features.map((feature: string, i: number) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="mt-0.5">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
            </div>
            <span className="text-white/70 text-sm leading-relaxed">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        onClick={onSelect}
        disabled={loading}
        className={`w-full h-10 text-sm font-medium ${
          pkg.popular
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/20'
            : 'bg-white/10 hover:bg-white/15 border border-white/20 text-white'
        }`}
      >
        {loading ? '处理中...' : '选择套餐'}
      </Button>
    </div>
  )
}


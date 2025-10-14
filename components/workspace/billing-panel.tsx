'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Zap, CreditCard, QrCode, X } from 'lucide-react'
import { useRecharge, useAlipay } from '@/hooks/useRecharge'
import { useAuth } from '@/components/providers/auth-provider'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function BillingPanel() {
  const { packages, transactions, loading, createOrder } = useRecharge()
  const { refreshUser } = useAuth()
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const { qrCode, orderStatus, polling, createQrCode, startPolling, cancelOrder } = useAlipay()

  const handleSelectPackage = async (packageId: number) => {
    setSelectedPackage(packageId)
    const order = await createOrder(packageId, '支付宝')
    if (order) {
      setOrderId(order)
      const qr = await createQrCode(order)
      if (qr) {
        setShowPaymentDialog(true)
        // 开始轮询订单状态
        startPolling(order, async () => {
          setShowPaymentDialog(false)
          await refreshUser()
        })
      }
    }
  }

  const handleCancelPayment = async () => {
    if (orderId) {
      await cancelOrder(orderId)
      setShowPaymentDialog(false)
      setOrderId(null)
    }
  }

  return (
    <div className="space-y-8">
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
        <h3 className="text-xl font-bold text-white mb-4">交易记录</h3>
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-sm">暂无交易记录</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-white/10">
                  <div>
                    <div className="text-white font-medium">{transaction.packageName}</div>
                    <div className="text-white/50 text-sm">{new Date(transaction.date).toLocaleString('zh-CN')}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">¥{transaction.amount}</div>
                    <div className="text-white/50 text-sm">{transaction.status}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 支付弹窗 */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
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
                  {polling ? '等待支付中...' : orderStatus?.isPaid ? '支付成功！' : '请扫码支付'}
                </p>
              </>
            ) : (
              <div className="text-white/40">加载二维码中...</div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancelPayment} className="flex-1 bg-white/5 border-white/10 text-white">
              取消支付
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


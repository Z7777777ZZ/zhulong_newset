'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Clock, History, BarChart3, CreditCard, Settings, LogOut, Zap } from 'lucide-react'
import { AuthGuard } from '@/components/providers/auth-guard'
import { useAuth } from '@/components/providers/auth-provider'
import { DetectionPanel } from '@/components/workspace/detection-panel'
import { OverviewPanel } from '@/components/workspace/overview-panel'
import { HistoryPanel } from '@/components/workspace/history-panel'
import { BillingPanel } from '@/components/workspace/billing-panel'
import { SettingsPanel } from '@/components/workspace/settings-panel'

function WorkspaceContent() {
  const [activeTab, setActiveTab] = useState<'use' | 'dashboard'>('use')
  const [dashboardView, setDashboardView] = useState<'overview' | 'history' | 'usage' | 'billing' | 'settings'>('overview')
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className="min-h-screen gradient-background">
      {/* 顶部导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
        <div className="px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {/* <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div> */}
            <span className="text-lg font-bold text-white">DragonAI</span>
          </div>

          {/* Tab切换 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('use')}
              className={`px-4 py-1.5 text-sm font-medium transition-all ${
                activeTab === 'use' ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              使用
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-1.5 text-sm font-medium transition-all ${
                activeTab === 'dashboard' ? 'text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              面板
            </button>
          </div>

          {/* 右侧占位 */}
          <div className="w-[120px]"></div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="pt-14">
        {/* 使用界面 */}
        {activeTab === 'use' && <DetectionPanel />}

        {/* 面板界面 */}
        {activeTab === 'dashboard' && (
          <div className="flex justify-center min-h-[calc(100vh-3.5rem)] px-6 py-12">
            <div className="flex gap-6 w-full max-w-7xl">
              {/* 左侧边栏 */}
              <aside className="w-56 flex-shrink-0">
                <div className="sticky top-28 space-y-4">
                  {/* 用户信息卡片 */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="mb-3">
                      <div className="text-white text-sm font-medium truncate">{user.username}</div>
                      <div className="text-white/50 text-xs truncate">{user.email}</div>
                    </div>

                    {/* 余额卡片 */}
                    <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-3 border border-orange-400/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white/70 text-xs">账户余额</span>
                        <Zap className="w-3 h-3 text-orange-400" />
                      </div>
                      <div className="text-2xl font-bold text-white mb-0.5">{user.remainingQuota}</div>
                      <div className="text-orange-400 text-xs">{user.role}</div>
                    </div>
                  </div>

                  {/* 导航菜单 */}
                  <nav className="space-y-1">
                    <NavMenuItem
                      icon={Clock}
                      label="最近检测"
                      active={dashboardView === 'overview'}
                      onClick={() => setDashboardView('overview')}
                    />
                    <NavMenuItem
                      icon={History}
                      label="历史记录"
                      active={dashboardView === 'history'}
                      onClick={() => setDashboardView('history')}
                    />
                    <NavMenuItem
                      icon={BarChart3}
                      label="使用情况"
                      active={dashboardView === 'usage'}
                      onClick={() => setDashboardView('usage')}
                    />
                    <NavMenuItem
                      icon={CreditCard}
                      label="充值与发票"
                      active={dashboardView === 'billing'}
                      onClick={() => setDashboardView('billing')}
                    />
                    <NavMenuItem
                      icon={Settings}
                      label="设置"
                      active={dashboardView === 'settings'}
                      onClick={() => setDashboardView('settings')}
                    />
                  </nav>

                  {/* 退出登录 */}
                  <Link href="/login">
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-3 px-3 py-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>退出登录</span>
                    </button>
                  </Link>
                </div>
              </aside>

              {/* 右侧内容区 */}
              <div className="flex-1 overflow-y-auto pt-4">
                {dashboardView === 'overview' && <OverviewPanel />}
                {dashboardView === 'history' && <HistoryPanel />}
                {dashboardView === 'usage' && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">配额使用</h3>
                          <p className="text-white/50 text-sm">
                            已使用 {user.usedQuota} / {user.totalQuota} credits
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white">
                            {Math.round((user.usedQuota / user.totalQuota) * 100)}%
                          </div>
                        </div>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all"
                          style={{ width: `${(user.usedQuota / user.totalQuota) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {dashboardView === 'billing' && <BillingPanel />}
                {dashboardView === 'settings' && <SettingsPanel />}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// 侧边栏菜单项
function NavMenuItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
        active ? 'bg-white/8 text-white' : 'text-white/50 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  )
}

export default function WorkspacePage() {
  return (
    <AuthGuard>
      <WorkspaceContent />
    </AuthGuard>
  )
}


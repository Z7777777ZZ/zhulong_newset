"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sparkles,
  FileSearch,
  FileEdit,
  BarChart3,
  Zap,
  Check,
  CreditCard,
  Settings,
  Copy,
  ArrowRight,
  User,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Download,
  Bell,
  LogOut,
  History,
  Shield,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Lock,
  Camera,
  Trash2,
  Share2,
  Filter,
  Search,
  Image,
  Video,
  Music,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  Star,
  Package,
} from "lucide-react"
import Link from "next/link"

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState<"use" | "dashboard">("use")
  const [dashboardView, setDashboardView] = useState<"overview" | "history" | "usage" | "billing" | "settings">("overview")
  
  // AI检测相关状态
  const [mode, setMode] = useState<"detect" | "rewrite">("detect")
  const [inputText, setInputText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [detectionResult, setDetectionResult] = useState<any>(null)
  const [rewriteResult, setRewriteResult] = useState<any>(null)

  // 个人资料编辑状态
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [profileData, setProfileData] = useState({
    username: "张三",
    email: "zhangsan@example.com",
    phone: "13800138000",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  })

  // 密码修改状态
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const userData = {
    name: "张三",
    email: "zhangsan@example.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    balance: 128,
    plan: "专业版",
    totalQuota: 500,
    usedQuota: 372,
    remainingQuota: 128,
    usageToday: 15,
    usageLimit: 100,
    detectionCount: 1247,
    memberDays: 89,
  }

  const exampleText = `人工智能技术正在以前所未有的速度发展，深刻改变着我们的生活方式。从智能语音助手到自动驾驶汽车，AI的应用已经渗透到各个领域。机器学习算法能够从海量数据中学习模式，并做出准确的预测。深度神经网络的突破使得计算机视觉和自然语言处理取得了重大进展。`

  // 模拟历史记录数据
  const historyRecords = [
    { id: 1, type: 2, typeName: "文本检测", fileName: "AI技术研究.txt", content: "人工智能技术的发展...", probability: 82, time: new Date(Date.now() - 300000).toISOString(), status: 1 },
    { id: 2, type: 2, typeName: "文本降重", fileName: "论文初稿.docx", content: "机器学习是人工智能...", probability: 24, time: new Date(Date.now() - 3600000).toISOString(), status: 1 },
    { id: 3, type: 2, typeName: "文本检测", fileName: "深度学习概述.txt", content: "深度学习模型在图像...", probability: 45, time: new Date(Date.now() - 7200000).toISOString(), status: 1 },
    { id: 4, type: 1, typeName: "图片检测", fileName: "design.png", content: null, probability: 68, time: new Date(Date.now() - 10800000).toISOString(), status: 1 },
    { id: 5, type: 2, typeName: "文本检测", fileName: "自然语言处理.txt", content: "自然语言处理技术...", probability: 91, time: new Date(Date.now() - 18000000).toISOString(), status: 1 },
  ]

  const handleDetect = async () => {
    if (!inputText.trim()) return
    setIsProcessing(true)
    setDetectionResult(null)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const result = {
      aiProbability: 82,
      humanProbability: 18,
      sentences: [
        { text: "人工智能技术正在以前所未有的速度发展，深刻改变着我们的生活方式。", aiProb: 85 },
        { text: "从智能语音助手到自动驾驶汽车，AI的应用已经渗透到各个领域。", aiProb: 78 },
        { text: "机器学习算法能够从海量数据中学习模式，并做出准确的预测。", aiProb: 92 },
        { text: "深度神经网络的突破使得计算机视觉和自然语言处理取得了重大进展。", aiProb: 88 },
      ],
    }

    setDetectionResult(result)
    setIsProcessing(false)
  }

  const handleRewrite = async () => {
    if (!inputText.trim()) return
    setIsProcessing(true)
    setRewriteResult(null)

    await new Promise((resolve) => setTimeout(resolve, 2500))

    setRewriteResult({
      rewrittenText: `AI技术正以惊人的速度演进，彻底重塑着人类的日常生活。从语音交互系统到无人驾驶技术，人工智能的应用场景遍布各行各业。`,
      originalityIncrease: 94,
      changesCount: 12,
    })

    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen gradient-background">
      {/* 顶部导航栏 */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
        <div className="px-6 h-14 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white">DragonAI</span>
          </div>

          {/* Tab切换 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab("use")}
              className={`px-4 py-1.5 text-sm font-medium transition-all ${
                activeTab === "use" ? "text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              使用
            </button>
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`px-4 py-1.5 text-sm font-medium transition-all ${
                activeTab === "dashboard" ? "text-white" : "text-white/50 hover:text-white/80"
              }`}
            >
              面板
            </button>
          </div>

          {/* 右侧操作 */}
          <div className="w-[120px]"></div>
        </div>
      </nav>

      {/* 主内容区 */}
      <main className="pt-14">
        {/* 使用界面 */}
        {activeTab === "use" && (
          <div className="min-h-[calc(100vh-3.5rem)] px-6 py-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-center gap-4 mb-8">
                <button
                  onClick={() => {
                    setMode("detect")
                    setDetectionResult(null)
                    setRewriteResult(null)
                  }}
                  className={`px-8 py-3 rounded-full font-medium transition-all ${
                    mode === "detect"
                      ? "bg-white text-black shadow-lg scale-105"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  <FileSearch className="w-5 h-5 inline-block mr-2" />
                  AI检测
                </button>
                <button
                  onClick={() => {
                    setMode("rewrite")
                    setDetectionResult(null)
                    setRewriteResult(null)
                  }}
                  className={`px-8 py-3 rounded-full font-medium transition-all ${
                    mode === "rewrite"
                      ? "bg-white text-black shadow-lg scale-105"
                      : "bg-white/10 text-white/70 hover:bg-white/20"
                  }`}
                >
                  <FileEdit className="w-5 h-5 inline-block mr-2" />
                  AI降重
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 输入区 */}
                <div className="glass-card rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">输入文本</h3>
                    <button
                      onClick={() => setInputText(exampleText)}
                      className="text-orange-400 hover:text-orange-300 text-sm font-medium"
                    >
                      <Sparkles className="w-4 h-4 inline mr-1.5" />
                      试用样本
                    </button>
                  </div>

                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={mode === "detect" ? "粘贴或输入文本进行AI检测..." : "粘贴或输入文本进行AI降重..."}
                    className="w-full h-96 bg-black/30 border border-white/10 rounded-xl p-4 text-white leading-relaxed placeholder-white/30 focus:outline-none focus:border-orange-400/50 resize-none"
                  />

                  <div className="flex items-center justify-between mt-4">
                    <div className="text-white/40 text-sm">{inputText.length} / 5000 字符</div>
                    <Button
                      onClick={mode === "detect" ? handleDetect : handleRewrite}
                      disabled={!inputText.trim() || isProcessing}
                      className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    >
                      {isProcessing ? "处理中..." : mode === "detect" ? "开始检测" : "开始降重"}
                    </Button>
                  </div>
                </div>

                {/* 结果区 */}
                <div className="glass-card rounded-2xl p-6 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    {mode === "detect" ? "检测结果" : "降重结果"}
                  </h3>
                  {!detectionResult && !rewriteResult ? (
                    <div className="h-96 flex flex-col items-center justify-center text-white/40">
                      {mode === "detect" ? <FileSearch className="w-16 h-16 mb-4" /> : <FileEdit className="w-16 h-16 mb-4" />}
                      <p>结果将在这里显示</p>
                    </div>
                  ) : mode === "detect" && detectionResult ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-orange-500/20 rounded-xl p-4 border border-orange-400/30">
                          <div className="text-orange-400 text-xs mb-1">AI生成概率</div>
                          <div className="text-3xl font-bold text-white">{detectionResult.aiProbability}%</div>
                        </div>
                        <div className="bg-green-500/20 rounded-xl p-4 border border-green-400/30">
                          <div className="text-green-400 text-xs mb-1">人工创作概率</div>
                          <div className="text-3xl font-bold text-white">{detectionResult.humanProbability}%</div>
                        </div>
                      </div>
                      <div className="bg-black/30 rounded-xl p-4 border border-white/10 h-72 overflow-y-auto space-y-2">
                        {detectionResult.sentences.map((s: any, i: number) => (
                          <div key={i} className={`p-2 rounded ${s.aiProb > 70 ? 'bg-orange-500/20' : 'bg-green-500/20'}`}>
                            {s.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : rewriteResult ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-green-500/20 rounded-xl p-4 border border-green-400/30">
                          <div className="text-green-400 text-xs mb-1">原创度提升</div>
                          <div className="text-3xl font-bold text-white">+{rewriteResult.originalityIncrease}%</div>
                        </div>
                        <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-400/30">
                          <div className="text-blue-400 text-xs mb-1">修改位置</div>
                          <div className="text-3xl font-bold text-white">{rewriteResult.changesCount}</div>
                        </div>
                      </div>
                      <div className="bg-black/30 rounded-xl p-4 border border-white/10 h-72 overflow-y-auto">
                        <p className="text-white/90">{rewriteResult.rewrittenText}</p>
                      </div>
                      <Button className="w-full bg-green-500 hover:bg-green-600">
                        <Copy className="w-4 h-4 mr-2" />
                        复制文本
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 面板界面 */}
        {activeTab === "dashboard" && (
          <div className="flex justify-center min-h-[calc(100vh-3.5rem)] px-6 py-6">
            <div className="flex gap-6 w-full max-w-7xl">
              {/* 左侧边栏 - Cursor风格 */}
              <aside className="w-56 flex-shrink-0">
              <div className="sticky top-20 space-y-4">
                {/* 用户信息卡片 */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={userData.avatar} alt="Avatar" className="w-10 h-10 rounded-full" />
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{userData.name}</div>
                      <div className="text-white/50 text-xs truncate">{userData.email}</div>
                    </div>
                  </div>
                  
                  {/* 余额卡片 */}
                  <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 rounded-xl p-3 border border-orange-400/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/70 text-xs">账户余额</span>
                      <Zap className="w-3 h-3 text-orange-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-0.5">{userData.balance}</div>
                    <div className="text-orange-400 text-xs">{userData.plan}</div>
                  </div>
                </div>

                {/* 导航菜单 */}
                <nav className="space-y-1">
                  <NavMenuItem
                    icon={Clock}
                    label="最近检测"
                    active={dashboardView === "overview"}
                    onClick={() => setDashboardView("overview")}
                  />
                  <NavMenuItem
                    icon={History}
                    label="历史记录"
                    active={dashboardView === "history"}
                    onClick={() => setDashboardView("history")}
                  />
                  <NavMenuItem
                    icon={BarChart3}
                    label="使用情况"
                    active={dashboardView === "usage"}
                    onClick={() => setDashboardView("usage")}
                  />
                  <NavMenuItem
                    icon={CreditCard}
                    label="充值与发票"
                    active={dashboardView === "billing"}
                    onClick={() => setDashboardView("billing")}
                  />
                  <NavMenuItem
                    icon={Settings}
                    label="设置"
                    active={dashboardView === "settings"}
                    onClick={() => setDashboardView("settings")}
                  />
                </nav>

                {/* 退出登录 */}
                <Link href="/login">
                  <button className="w-full flex items-center gap-3 px-3 py-2 text-white/50 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm">
                    <LogOut className="w-4 h-4" />
                    <span>退出登录</span>
                  </button>
                </Link>
              </div>
            </aside>

              {/* 右侧内容区 */}
              <div className="flex-1 overflow-y-auto">
                {/* Overview - 最近检测 */}
                {dashboardView === "overview" && (
                  <div className="space-y-6 max-w-4xl">
                    {/* 统计卡片 - 更大更通透 */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <div className="text-white/60 text-sm mb-2">今日检测</div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-4xl font-bold text-white">{userData.usageToday}</div>
                          <div className="text-white/40 text-lg">/ {userData.usageLimit}</div>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <div className="text-white/60 text-sm mb-2">剩余额度</div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-4xl font-bold text-white">{userData.remainingQuota}</div>
                          <div className="text-white/40 text-lg">/ {userData.totalQuota}</div>
                        </div>
                      </div>

                      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <div className="text-white/60 text-sm mb-2">累计检测</div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-4xl font-bold text-white">{userData.detectionCount}</div>
                          <div className="text-white/40 text-lg">次</div>
                        </div>
                      </div>

                      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                        <div className="text-white/60 text-sm mb-2">会员天数</div>
                        <div className="flex items-baseline gap-2">
                          <div className="text-4xl font-bold text-white">{userData.memberDays}</div>
                          <div className="text-white/40 text-lg">天</div>
                        </div>
                      </div>
                    </div>

                    {/* 最近记录 */}
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4">最近记录</h3>
                      <div className="space-y-3">
                        {historyRecords.slice(0, 5).map((record) => (
                          <HistoryRecordItem key={record.id} record={record} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* History - 历史记录 */}
                {dashboardView === "history" && (
                  <div className="space-y-6 max-w-4xl">
                    {/* 筛选器 */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 flex items-center gap-4">
                      <Search className="w-5 h-5 text-white/40" />
                      <input
                        type="text"
                        placeholder="搜索记录..."
                        className="flex-1 bg-transparent border-none text-white placeholder-white/40 focus:outline-none"
                      />
                      <select className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none">
                        <option>全部类型</option>
                        <option>文本</option>
                        <option>图片</option>
                        <option>视频</option>
                      </select>
                    </div>

                    {/* 记录列表 */}
                    <div className="space-y-3">
                      {historyRecords.map((record) => (
                        <HistoryRecordItem key={record.id} record={record} showActions />
                      ))}
                    </div>
                  </div>
                )}

                {/* Usage - 使用情况 */}
                {dashboardView === "usage" && (
                  <div className="space-y-6 max-w-4xl">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">配额使用</h3>
                          <p className="text-white/50 text-sm">已使用 {userData.usedQuota} / {userData.totalQuota} 次</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white">{Math.round((userData.usedQuota / userData.totalQuota) * 100)}%</div>
                        </div>
                      </div>
                      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all"
                          style={{ width: `${(userData.usedQuota / userData.totalQuota) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-6">使用趋势</h3>
                      <div className="h-64 flex items-center justify-center text-white/40">
                        <div className="text-center">
                          <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">使用趋势图表</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Billing - 充值与发票 */}
                {dashboardView === "billing" && (
                  <div className="space-y-8">
                    {/* 标题 */}
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">充值套餐</h2>
                      <p className="text-white/60 text-sm">选择适合您的套餐，随时升级</p>
                    </div>

                    {/* 充值套餐 */}
                    <div className="grid grid-cols-3 gap-6">
                      <PricingCard
                        name="基础版"
                        price={9.9}
                        quota={100}
                        features={["100次检测", "基础报告", "邮件支持"]}
                      />
                      <PricingCard
                        name="专业版"
                        price={29.9}
                        quota={500}
                        popular
                        features={["500次检测", "详细报告", "优先支持", "API接口"]}
                      />
                      <PricingCard
                        name="企业版"
                        price={99.9}
                        quota={2000}
                        features={["2000次检测", "定制报告", "专属客服", "批量检测"]}
                      />
                    </div>

                    {/* 交易记录 */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4">交易记录</h3>
                      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                        <div className="text-center py-12 text-white/40">
                          <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-sm">暂无交易记录</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Settings - 设置 */}
                {dashboardView === "settings" && (
                  <div className="space-y-6 max-w-4xl">
                    {/* 个人资料 */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">个人资料</h3>
                        {!isEditingProfile ? (
                          <Button onClick={() => setIsEditingProfile(true)} className="bg-orange-500 hover:bg-orange-600">
                            编辑
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button onClick={() => setIsEditingProfile(false)} variant="outline" className="bg-white/5 border-white/10 text-white">
                              取消
                            </Button>
                            <Button className="bg-orange-500 hover:bg-orange-600">保存</Button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-6 mb-6">
                        <div className="relative">
                          <img src={profileData.avatar} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-orange-400" />
                          {isEditingProfile && (
                            <button className="absolute bottom-0 right-0 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center">
                              <Camera className="w-4 h-4 text-white" />
                            </button>
                          )}
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-white">{profileData.username}</h4>
                          <p className="text-white/60">{profileData.email}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-white/80 mb-2">用户名</label>
                          <Input
                            value={profileData.username}
                            onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                            disabled={!isEditingProfile}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/80 mb-2">邮箱</label>
                          <Input
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            disabled={!isEditingProfile}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/80 mb-2">手机号</label>
                          <Input
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            disabled={!isEditingProfile}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 安全设置 */}
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                      <h3 className="text-lg font-semibold text-white mb-6">安全设置</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-white/80 mb-2">当前密码</label>
                          <Input
                            type="password"
                            placeholder="请输入当前密码"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/80 mb-2">新密码</label>
                          <Input
                            type="password"
                            placeholder="请输入新密码"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-white/80 mb-2">确认新密码</label>
                          <Input
                            type="password"
                            placeholder="请再次输入新密码"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            className="bg-white/5 border-white/10 text-white"
                          />
                        </div>
                        <Button className="w-full bg-orange-500 hover:bg-orange-600">修改密码</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

// 侧边栏菜单项 - Cursor风格
function NavMenuItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
        active
          ? "bg-white/8 text-white"
          : "text-white/50 hover:text-white hover:bg-white/5"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  )
}

// 统计卡片 - 简化版
function StatCard({ label, value, subtitle }: any) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <div className="text-white/60 text-sm mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className="text-4xl font-bold text-white">{value}</div>
        <div className="text-white/40 text-lg">{subtitle}</div>
      </div>
    </div>
  )
}

// 历史记录项 - Cursor风格
function HistoryRecordItem({ record, showActions }: any) {
  const isAI = record.probability > 50
  
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:bg-white/8 transition-all cursor-pointer">
      <div className="flex items-center gap-4">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
          record.type === 1 ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-green-500/10 border border-green-500/20'
        }`}>
          {record.type === 1 ? <Image className="w-4 h-4 text-blue-400" /> : <FileSearch className="w-4 h-4 text-green-400" />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-white font-medium truncate">{record.fileName}</h4>
            <span className={`px-2 py-0.5 rounded text-xs ${
              isAI ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'
            }`}>
              {record.probability}% AI
            </span>
          </div>
          <div className="flex items-center gap-3 text-white/50 text-sm">
            <span>{new Date(record.time).toLocaleString('zh-CN')}</span>
            <span>•</span>
            <span>{record.typeName}</span>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-2">
            <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// 价格卡片 - 精简优雅，按钮对齐
function PricingCard({ name, price, quota, features, popular }: any) {
  return (
    <div className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 border ${
      popular ? 'border-orange-400/50 ring-2 ring-orange-400/20' : 'border-white/10'
    } relative hover:bg-white/8 transition-all flex flex-col h-full`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full text-white text-xs font-medium shadow-lg">
            推荐
          </div>
        </div>
      )}
      
      <div className="text-center mb-6">
        <h3 className="text-base font-semibold text-white mb-3">{name}</h3>
        <div className="mb-3">
          <span className="text-3xl font-bold text-white">¥{price}</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10">
          <Zap className="w-3.5 h-3.5 text-orange-400" />
          <span className="text-white/80 text-sm font-medium">{quota} 次</span>
        </div>
      </div>

      <div className="space-y-3 mb-6 flex-1">
        {features.map((feature: string, i: number) => (
          <div key={i} className="flex items-start gap-2.5">
            <div className="mt-0.5">
              <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
            </div>
            <span className="text-white/70 text-sm leading-relaxed">{feature}</span>
          </div>
        ))}
      </div>

      <Button className={`w-full h-10 text-sm font-medium ${
        popular 
          ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/20' 
          : 'bg-white/10 hover:bg-white/15 border border-white/20 text-white'
      }`}>
        选择套餐
      </Button>
    </div>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { useState, useEffect } from "react"

export function PricingSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 },
    )

    const section = document.getElementById("pricing-section")
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  const plans = [
    {
      name: "免费版",
      price: "¥0",
      period: "永久免费",
      description: "适合个人用户体验产品功能",
      features: ["每日 5 次 AI 检测", "每日 3 次智能降重", "基础检测准确率", "标准响应速度", "社区支持"],
      cta: "开始使用",
      popular: false,
    },
    {
      name: "专业版",
      price: "¥99",
      period: "每月",
      description: "适合内容创作者和自媒体",
      features: [
        "无限次 AI 检测",
        "无限次智能降重",
        "高级检测准确率 99.2%",
        "优先响应速度",
        "批量处理功能",
        "API 接口访问",
        "优先客服支持",
        "数据导出功能",
      ],
      cta: "立即订阅",
      popular: true,
    },
    {
      name: "企业版",
      price: "定制",
      period: "联系我们",
      description: "适合团队和企业级用户",
      features: [
        "专业版所有功能",
        "团队协作管理",
        "自定义检测模型",
        "私有化部署选项",
        "专属客户经理",
        "SLA 服务保障",
        "定制化开发",
        "培训与咨询服务",
      ],
      cta: "联系销售",
      popular: false,
    },
  ]

  const comparisonFeatures = [
    { name: "AI 检测次数", free: "5次/天", pro: "无限", enterprise: "无限" },
    { name: "智能降重次数", free: "3次/天", pro: "无限", enterprise: "无限" },
    { name: "检测准确率", free: "95%", pro: "99.2%", enterprise: "99.5%" },
    { name: "响应速度", free: "标准", pro: "优先", enterprise: "极速" },
    { name: "批量处理", free: false, pro: true, enterprise: true },
    { name: "API 接口", free: false, pro: true, enterprise: true },
    { name: "数据导出", free: false, pro: true, enterprise: true },
    { name: "团队协作", free: false, pro: false, enterprise: true },
    { name: "自定义模型", free: false, pro: false, enterprise: true },
    { name: "私有化部署", free: false, pro: false, enterprise: true },
    { name: "专属客户经理", free: false, pro: false, enterprise: true },
    { name: "SLA 保障", free: false, pro: false, enterprise: true },
  ]

  const faqs = [
    {
      question: "如何选择适合我的方案？",
      answer:
        "如果您是个人用户，想要体验产品功能，免费版就足够了。如果您是内容创作者或自媒体，需要频繁使用，建议选择专业版。企业用户可以联系我们定制专属方案。",
    },
    {
      question: "可以随时取消订阅吗？",
      answer: "是的，您可以随时取消订阅。取消后，您的账户将在当前计费周期结束后自动降级为免费版，不会产生额外费用。",
    },
    {
      question: "支持哪些支付方式？",
      answer: "我们支持支付宝、微信支付、银行卡等多种支付方式。企业用户还可以选择对公转账。",
    },
    {
      question: "检测准确率是如何计算的？",
      answer: "我们的检测准确率是基于大规模测试数据集计算得出的。专业版使用更先进的检测模型，准确率可达 99.2%。",
    },
  ]

  return (
    <section id="pricing-section" className="relative min-h-screen py-32 px-6 overflow-hidden">
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-20">
        <div
          className={`transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-orange-400 text-sm font-medium mb-4 tracking-wider">价格方案</div>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            选择适合你的
            <br />
            <span className="gradient-text">定价方案</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl">灵活的定价选项，满足个人到企业的各种需求</p>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="max-w-7xl mx-auto mb-32">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-400 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                    最受欢迎
                  </div>
                </div>
              )}

              <div
                className={`relative h-full glass-card rounded-3xl p-8 transition-all duration-300 hover:scale-105 ${
                  plan.popular ? "border-orange-500/50 shadow-2xl shadow-orange-500/20" : "border-white/10"
                }`}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/50 text-sm">{plan.description}</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    {plan.price !== "定制" && <span className="text-white/50 text-lg">/ 月</span>}
                  </div>
                  <p className="text-white/40 text-sm">{plan.period}</p>
                </div>

                <Button
                  className={`w-full h-12 rounded-full font-medium mb-8 transition-all duration-300 ${
                    plan.popular
                      ? "bg-white hover:bg-white/90 text-black"
                      : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                  }`}
                >
                  {plan.cta}
                </Button>

                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className="mt-0.5 flex-shrink-0">
                        <Check className="w-5 h-5 text-orange-400" />
                      </div>
                      <span className="text-white/80 text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-32">
        <div
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">功能对比</h3>
          <div className="glass-card rounded-3xl p-8 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/60 font-medium">功能</th>
                  <th className="text-center py-4 px-4 text-white font-medium">免费版</th>
                  <th className="text-center py-4 px-4 text-white font-medium">
                    <div className="inline-flex items-center gap-2">
                      专业版
                      <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">推荐</span>
                    </div>
                  </th>
                  <th className="text-center py-4 px-4 text-white font-medium">企业版</th>
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={feature.name} className="border-b border-white/5">
                    <td className="py-4 px-4 text-white/80">{feature.name}</td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.free === "boolean" ? (
                        feature.free ? (
                          <Check className="w-5 h-5 text-orange-400 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-white/20 mx-auto" />
                        )
                      ) : (
                        <span className="text-white/60">{feature.free}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.pro === "boolean" ? (
                        feature.pro ? (
                          <Check className="w-5 h-5 text-orange-400 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-white/20 mx-auto" />
                        )
                      ) : (
                        <span className="text-white/80 font-medium">{feature.pro}</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">
                      {typeof feature.enterprise === "boolean" ? (
                        feature.enterprise ? (
                          <Check className="w-5 h-5 text-orange-400 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-white/20 mx-auto" />
                        )
                      ) : (
                        <span className="text-white/80 font-medium">{feature.enterprise}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-20">
        <div
          className={`transition-all duration-1000 delay-500 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">常见问题</h3>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-6 hover:border-orange-500/30 transition-all duration-300"
              >
                <h4 className="text-xl font-semibold text-white mb-3">{faq.question}</h4>
                <p className="text-white/60 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact hint */}
      <div
        className={`max-w-7xl mx-auto text-center transition-all duration-1000 delay-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <p className="text-white/60 text-lg mb-6">还有其他问题？我们随时为您解答</p>
        <Button className="bg-white hover:bg-white/90 text-black h-12 px-8 rounded-full font-medium">联系我们</Button>
      </div>
    </section>
  )
}

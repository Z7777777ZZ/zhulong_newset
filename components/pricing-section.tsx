"use client"

import { Button } from "@/components/ui/button"
import { Check, X, Mail, Copy } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export function PricingSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  // 企业联系邮箱
  const contactEmail = "zhulongaigc@163.com"

  // 复制邮箱到剪贴板
  const copyEmailToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      // 降级方案：创建临时input元素
      const textArea = document.createElement("textarea")
      textArea.value = contactEmail
      textArea.style.position = "fixed"
      textArea.style.left = "-999999px"
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand("copy")
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (err) {
        console.error("复制失败", err)
      }
      document.body.removeChild(textArea)
    }
  }

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
      name: "免费",
      price: "¥0",
      period: "永久免费",
      description: "体验基础功能",
      features: [
        "10 credits",
        "上传文件：无",
        "智能降重：无",
        "响应速度：标准",
        "批量处理：不支持",
      ],
      cta: "开始使用",
      popular: false,
    },
    {
      name: "Plus",
      price: "¥9.9",
      period: "每月",
      yearlyPrice: "¥99.9",
      eduDiscount: "教育认证可8折",
      description: "适合个人用户",
      features: [
        "30 credits/月",
        "上传文件：有限（2次/月）",
        "智能降重：有限（1次/月）",
        "响应速度：标准",
        "批量处理：不支持",
      ],
      cta: "立即订阅",
      popular: false,
    },
    {
      name: "Pro",
      price: "¥19.9",
      period: "每月",
      yearlyPrice: "¥199",
      eduDiscount: "教育认证可8折",
      description: "适合内容创作者",
      features: [
        "65 credits/月",
        "上传文件：不限",
        "智能降重：不限",
        "响应速度：优先",
        "批量处理：不支持",
      ],
      cta: "立即订阅",
      popular: true,
    },
    {
      name: "Max",
      price: "¥39.9",
      period: "每月",
      yearlyPrice: "¥399",
      eduDiscount: "教育认证可8折",
      description: "适合专业用户和团队",
      features: [
        "150 credits/月",
        "上传文件：不限",
        "智能降重：不限",
        "响应速度：极速",
        "批量处理：支持",
      ],
      cta: "立即订阅",
      popular: false,
    },
  ]

  const benchmarkData = [
    { name: "代码", gptzero: "78.5%", originality: "75.2%", sapling: "72.1%", hive: "68.9%", zhulong: "94.8%" },
    { name: "公文", gptzero: "76.7%", originality: "78.9%", sapling: "75.5%", hive: "80.1%", zhulong: "91.7%" },
    { name: "小说", gptzero: "79.2%", originality: "81.3%", sapling: "79.8%", hive: "77.4%", zhulong: "95.6%" },
    { name: "论文（中文）", gptzero: "81.3%", originality: "85.1%", sapling: "82.4%", hive: "80.5%", zhulong: "98.4%" },
    { name: "论文（英文）", gptzero: "82.2%", originality: "86.5%", sapling: "83.1%", hive: "81.2%", zhulong: "97.2%" },
    { name: "外语作文（英语）", gptzero: "78.7%", originality: "82.7%", sapling: "80.2%", hive: "78.6%", zhulong: "98.3%" },
    { name: "外语作文（法语）", gptzero: "74.9%", originality: "70.4%", sapling: "68.3%", hive: "65.7%", zhulong: "98.9%" },
  ]

  const faqs = [
    {
      question: "如何选择适合我的方案？",
      answer:
        "如果您是个人用户，想要体验产品功能，Plus版本就足够了。如果您是内容创作者或自媒体，需要频繁使用，建议选择Pro版本。企业用户可以选择Max版本。",
    },
    {
      question: "可以随时取消订阅吗？",
      answer: "目前系统正在逐步完善，可以联系我们进行订阅降级或升级。",
    },
    {
      question: "支持哪些支付方式？",
      answer: "目前我们支持支付宝。",
    },
    {
      question: "检测准确率是如何计算的？",
      answer: "我们的检测准确率是基于大规模测试数据集计算得出的。专业版使用更先进的检测模型。",
    },
  ]

  return (
    <section id="pricing-section" className="relative min-h-screen py-32 px-6 overflow-hidden">
      {/* Section header */}
      <div className="max-w-7xl mx-auto mb-20">
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-orange-400 text-sm font-medium mb-4 tracking-wider">价格方案</div>
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            选择适合你的
            <br />
            <span className="gradient-text">定价方案</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto">灵活的定价选项，满足个人到企业的各种需求</p>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="max-w-[1400px] mx-auto mb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
                className={`relative h-full min-h-[600px] glass-card rounded-2xl p-7 transition-all duration-300 hover:scale-[1.02] flex flex-col ${
                  plan.popular ? "border-orange-500/50 shadow-2xl shadow-orange-500/20" : "border-white/10"
                }`}
              >
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-white/50 text-base">{plan.description}</p>
                </div>

                <div className="mb-8 min-h-[140px]">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-5xl font-bold text-white">{plan.price}</span>
                    {plan.price !== "¥0" && <span className="text-white/50 text-lg">/ 月</span>}
                  </div>
                  <p className="text-white/40 text-sm mb-2">{plan.period}</p>
                  {plan.yearlyPrice ? (
                    <p className="text-orange-400/80 text-sm font-medium">年付：{plan.yearlyPrice}</p>
                  ) : (
                    <div className="h-5"></div>
                  )}
                  {plan.eduDiscount ? (
                    <p className="text-blue-400/80 text-xs mt-1">{plan.eduDiscount}</p>
                  ) : (
                    <div className="h-4 mt-1"></div>
                  )}
                </div>

                <Link href="/login">
                  <Button
                    className={`w-full h-12 rounded-full font-medium text-base mb-8 transition-all duration-300 ${
                      plan.popular
                        ? "bg-white hover:bg-white/90 text-black"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <div className="space-y-4 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        <Check className="w-5 h-5 text-orange-400" />
                      </div>
                      <span className="text-white/80 text-base leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 邀请码和分销提示 */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div
            className={`transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <div className="glass-card rounded-2xl p-6 text-center">
              <p className="text-white/70 text-sm mb-3">
                💡 使用官方邀请码可获得 <span className="text-orange-400 font-semibold">10 credits</span> 额度
              </p>
              <div className="space-y-2 text-white/60 text-xs">
                <p>• 二级分销制度，每邀请一个好友可获得 2-5 credits，上不封顶</p>
                <p>• 官方邀请码内置 10 credits 额度</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-32">
        <div
          className={`transition-all duration-1000 delay-300 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          }`}
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">检测精度对比</h3>
          <div className="glass-card rounded-3xl p-8 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/60 font-medium">测试类型</th>
                  <th className="text-center py-4 px-4 text-white font-medium text-sm">GPTZero</th>
                  <th className="text-center py-4 px-4 text-white font-medium text-sm">Originality.ai</th>
                  <th className="text-center py-4 px-4 text-white font-medium text-sm">Sapling AI Detector</th>
                  <th className="text-center py-4 px-4 text-white font-medium text-sm">Hive Moderation</th>
                  <th className="text-center py-4 px-4 text-white font-medium">
                    <div className="inline-flex items-center gap-2">
                      烛龙智元
                      <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">最佳</span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {benchmarkData.map((item, index) => (
                  <tr key={item.name} className="border-b border-white/5">
                    <td className="py-4 px-4 text-white/80 font-medium">{item.name}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-white/60">{item.gptzero}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-white/60">{item.originality}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-white/60">{item.sapling}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-white/60">{item.hive}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-orange-400 font-semibold text-lg">{item.zhulong}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-white/40 text-sm text-center mt-4">
            * 数据基于大规模测试数据集，准确率为AI生成内容的识别准确度
          </p>
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
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={() => {
              window.location.href = `mailto:${contactEmail}?subject=烛龙智元咨询&body=您好，我想咨询关于...`
            }}
            className="bg-white hover:bg-white/90 text-black h-12 px-6 rounded-full font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            发送邮件
          </Button>
          <Button
            onClick={copyEmailToClipboard}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 h-12 px-6 rounded-full font-medium transition-all duration-300 hover:scale-105 flex items-center gap-2"
          >
            {copySuccess ? (
              <>
                <Check className="w-4 h-4" />
                已复制
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                复制邮箱
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  )
}

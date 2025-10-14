"use client"

import { Card } from "@/components/ui/card"
import { Shield, Zap, Brain, Lock, Globe, TrendingUp } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Shield,
      title: "精准检测",
      description: "采用最先进的AI模型，准确识别各类AI生成文本，检测准确率高达99.8%",
    },
    {
      icon: Brain,
      title: "智能降重",
      description: "深度理解文本语义，保持原意的同时进行智能改写，提升原创度",
    },
    {
      icon: Zap,
      title: "极速处理",
      description: "毫秒级响应速度，支持批量处理，大幅提升工作效率",
    },
    {
      icon: Lock,
      title: "隐私保护",
      description: "端到端加密传输，不存储用户数据，确保您的内容安全",
    },
    {
      icon: Globe,
      title: "多语言支持",
      description: "支持中文、英文等30+种语言的检测与改写",
    },
    {
      icon: TrendingUp,
      title: "持续优化",
      description: "模型持续训练更新，始终保持业界领先的检测和改写能力",
    },
  ]

  return (
    <section id="features" className="py-32 px-6 bg-secondary/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance">为什么选择我们</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">专业的技术，极致的体验</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="p-8 bg-card/50 backdrop-blur-sm border-border/60 hover:bg-card/80 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

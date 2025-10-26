"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"

const sampleDetectionText = [
  { text: "人工智能技术的发展", isAI: false },
  { text: "正在深刻改变着我们的生活方式。", isAI: true },
  { text: "从智能手机到自动驾驶汽车，", isAI: false },
  { text: "AI的应用已经渗透到各个领域。", isAI: true },
  { text: "然而，", isAI: false },
  { text: "我们也需要关注AI技术带来的伦理和安全问题。", isAI: true },
]

const originalText = [
  { text: "人工智能", highlight: true },
  { text: "是计算机科学的一个", highlight: false },
  { text: "重要分支", highlight: true },
  { text: "，它致力于", highlight: false },
  { text: "开发智能机器", highlight: true },
  { text: "。", highlight: false },
]

const rewrittenText = [
  { text: "AI技术", highlight: true },
  { text: "是计算机科学的一个", highlight: false },
  { text: "核心领域", highlight: true },
  { text: "，它致力于", highlight: false },
  { text: "创造智能系统", highlight: true },
  { text: "。", highlight: false },
]

export function DemoSection() {
  const [activeDemo, setActiveDemo] = useState<"detect" | "rewrite">("detect")
  const [showResult, setShowResult] = useState(false)
  const [animateWords, setAnimateWords] = useState(false)
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right")

  useEffect(() => {
    setShowResult(false)
    setAnimateWords(false)
    const timer = setTimeout(() => {
      setShowResult(true)
      setAnimateWords(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [activeDemo])

  const handleTabChange = (tab: "detect" | "rewrite") => {
    if (tab !== activeDemo) {
      setSlideDirection(tab === "detect" ? "left" : "right")
      setActiveDemo(tab)
    }
  }

  return (
    <section id="demo" className="min-h-screen py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span className="text-sm text-white/90">开始使用</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-bold mb-6 text-white text-balance">体验 AI 的力量</h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
            实时检测文本真实性，智能改写提升原创度
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-16">
          <button
            onClick={() => handleTabChange("detect")}
            className={`px-8 py-3 rounded-full text-lg font-medium transition-all duration-500 ${
              activeDemo === "detect"
                ? "bg-white text-black shadow-2xl shadow-white/20 scale-105"
                : "bg-white/10 text-white/70 hover:bg-white/20 hover:scale-105"
            }`}
          >
            AI 检测
          </button>
          <button
            onClick={() => handleTabChange("rewrite")}
            className={`px-8 py-3 rounded-full text-lg font-medium transition-all duration-500 ${
              activeDemo === "rewrite"
                ? "bg-white text-black shadow-2xl shadow-white/20 scale-105"
                : "bg-white/10 text-white/70 hover:bg-white/20 hover:scale-105"
            }`}
          >
            AI 降重
          </button>
        </div>

        <div className="relative overflow-hidden">
          {activeDemo === "detect" && (
            <div
              className={`max-w-4xl mx-auto transition-all duration-700 ease-out ${
                slideDirection === "left" ? "animate-slide-in-left" : "animate-slide-in-right"
              }`}
            >
              <div className="glass-card rounded-3xl p-12 animate-fade-in">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-white mb-4">智能检测示例</h3>
                  <p className="text-white/60">我们的AI会自动识别并标记疑似由AI生成的句子</p>
                </div>

                <div className="bg-black/30 rounded-2xl p-8 mb-8 backdrop-blur-sm border border-white/10">
                  <p className="text-xl leading-relaxed">
                    {showResult &&
                      sampleDetectionText.map((segment, index) => (
                        <span
                          key={index}
                          className={`transition-all duration-500 ${animateWords ? "opacity-100" : "opacity-0"} ${
                            segment.isAI
                              ? "bg-orange-500/30 text-orange-200 px-2 py-1 rounded-lg border-b-2 border-orange-400"
                              : "text-white/90"
                          }`}
                          style={{ transitionDelay: `${index * 100}ms` }}
                        >
                          {segment.text}
                        </span>
                      ))}
                  </p>
                </div>

                {showResult && (
                  <div className="grid grid-cols-3 gap-6 animate-fade-in-up">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-400 mb-2">68%</div>
                      <div className="text-sm text-white/60">AI生成概率</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">3/6</div>
                      <div className="text-sm text-white/60">疑似AI句子</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-400 mb-2">0.8s</div>
                      <div className="text-sm text-white/60">检测耗时</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeDemo === "rewrite" && (
            <div
              className={`max-w-6xl mx-auto transition-all duration-700 ease-out ${
                slideDirection === "right" ? "animate-slide-in-right" : "animate-slide-in-left"
              }`}
            >
              <div className="glass-card rounded-3xl p-12 animate-fade-in">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-white mb-4">智能降重示例</h3>
                  <p className="text-white/60">对比原文与改写后的文本，橙色标记为修改部分</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                  {/* Original text */}
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-white/40"></div>
                      <span className="text-sm font-medium text-white/60">原文</span>
                    </div>
                    <div className="bg-black/30 rounded-2xl p-8 backdrop-blur-sm border border-white/10 min-h-[200px]">
                      <p className="text-xl leading-relaxed">
                        {showResult &&
                          originalText.map((segment, index) => (
                            <span
                              key={index}
                              className={`transition-all duration-500 ${animateWords ? "opacity-100" : "opacity-0"} ${
                                segment.highlight ? "text-white/50 line-through" : "text-white/90"
                              }`}
                              style={{ transitionDelay: `${index * 100}ms` }}
                            >
                              {segment.text}
                            </span>
                          ))}
                      </p>
                    </div>
                  </div>

                  {/* Arrow - now properly positioned between the two boxes */}
                  <div className="flex items-center justify-center md:flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/50 rotate-90 md:rotate-0">
                      <ArrowRight className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Rewritten text */}
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-sm font-medium text-white/60">改写后</span>
                    </div>
                    <div className="bg-black/30 rounded-2xl p-8 backdrop-blur-sm border border-white/10 min-h-[200px]">
                      <p className="text-xl leading-relaxed">
                        {showResult &&
                          rewrittenText.map((segment, index) => (
                            <span
                              key={index}
                              className={`transition-all duration-500 ${animateWords ? "opacity-100" : "opacity-0"} ${
                                segment.highlight
                                  ? "bg-orange-500/30 text-orange-200 px-2 py-1 rounded-lg border-b-2 border-orange-400"
                                  : "text-white/90"
                              }`}
                              style={{ transitionDelay: `${index * 100}ms` }}
                            >
                              {segment.text}
                            </span>
                          ))}
                      </p>
                    </div>
                  </div>
                </div>

                {showResult && (
                  <div className="grid grid-cols-3 gap-6 mt-8 animate-fade-in-up">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-400 mb-2">+92%</div>
                      <div className="text-sm text-white/60">原创度提升</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-2">3</div>
                      <div className="text-sm text-white/60">修改位置</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-400 mb-2">1.2s</div>
                      <div className="text-sm text-white/60">改写耗时</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-16">
          <Link href="/login">
            <Button className="h-14 px-10 text-lg bg-white hover:bg-white/90 text-black font-medium rounded-full shadow-xl">
              立即开始使用
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

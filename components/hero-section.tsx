"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"

export function HeroSection() {
  const [hasScrolled, setHasScrolled] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLDivElement>(null)
  const productRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasScrolled) {
            setHasScrolled(true)
          }
        })
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [hasScrolled])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (productRef.current) {
        const rect = productRef.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        setMousePosition({ x, y })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-8 pt-32 pb-16 w-full">
        <div
          className={`transition-all duration-1000 ease-out ${
            hasScrolled ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
          }`}
        >
          <div className="inline-block px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <span className="text-sm text-white/80">✨ 全新 AI 检测体验</span>
          </div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-none mb-4 max-w-4xl">
            重新定义
            <br />
            文本真实性
          </h1>

          <p className="text-xl md:text-2xl text-white/60 max-w-2xl mb-8 leading-relaxed">
            精准识别 AI 生成内容，智能改写提升原创度。让每一个字都经得起考验。
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Button
              size="lg"
              className="text-base px-8 h-12 bg-white hover:bg-white/90 text-black font-medium rounded-full transition-all duration-300 hover:scale-105"
            >
              开始使用
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="text-base px-8 h-12 border border-white/30 hover:bg-white/10 hover:border-white/50 text-white font-medium rounded-full backdrop-blur-sm transition-all duration-300"
            >
              了解更多
            </Button>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex items-end justify-center pb-16 px-8">
        <div
          ref={productRef}
          className={`transition-all duration-1500 ease-out ${
            hasScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-32"
          }`}
          style={{
            transform: hasScrolled
              ? `perspective(1200px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg) translateY(0px)`
              : "perspective(1200px) rotateX(15deg) translateY(100px)",
            transformStyle: "preserve-3d",
            transition: "transform 0.3s ease-out, opacity 1.5s ease-out",
          }}
        >
          <div className="relative w-[900px] h-[500px] max-w-full">
            {/* Main card with glassmorphism */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 shadow-2xl overflow-hidden">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-yellow-500/20 opacity-50" />

              {/* Content inside the card */}
              <div className="relative h-full p-8 flex flex-col">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="text-white/40 text-sm font-mono">AI 文本检测器</div>
                </div>

                {/* Main content area */}
                <div className="flex-1 grid grid-cols-2 gap-6">
                  {/* Left side - Detection */}
                  <div className="space-y-4">
                    <div className="text-white/60 text-sm font-medium mb-2">检测结果</div>
                    <div className="space-y-3">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full animate-pulse-glow"
                          style={{ width: "85%" }}
                        />
                      </div>
                      <div className="text-white text-4xl font-bold">85%</div>
                      <div className="text-white/50 text-sm">AI 生成概率</div>
                    </div>
                  </div>

                  {/* Right side - Rewrite */}
                  <div className="space-y-4">
                    <div className="text-white/60 text-sm font-medium mb-2">降重效果</div>
                    <div className="space-y-3">
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse-glow"
                          style={{ width: "95%" }}
                        />
                      </div>
                      <div className="text-white text-4xl font-bold">95%</div>
                      <div className="text-white/50 text-sm">原创度提升</div>
                    </div>
                  </div>
                </div>

                {/* Bottom stats */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
                  <div>
                    <div className="text-white text-2xl font-bold">99.2%</div>
                    <div className="text-white/40 text-xs">准确率</div>
                  </div>
                  <div>
                    <div className="text-white text-2xl font-bold">&lt;1s</div>
                    <div className="text-white/40 text-xs">检测速度</div>
                  </div>
                  <div>
                    <div className="text-white text-2xl font-bold">10M+</div>
                    <div className="text-white/40 text-xs">处理文本</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shadow and depth effect */}
            <div
              className="absolute inset-0 rounded-3xl bg-black/40 blur-3xl -z-10"
              style={{ transform: "translateZ(-50px) scale(0.95)" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

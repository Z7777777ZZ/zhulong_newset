"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useRef, useState, useMemo } from "react"
import { FileText, Image as ImageIcon, Music, Video, ChevronLeft, ChevronRight } from "lucide-react"

type FeatureType = 'text' | 'image' | 'audio' | 'video'

interface FeatureCard {
  type: FeatureType
  icon: typeof FileText
  title: string
  description: string
  stats: {
    accuracy: string
    speed: string
    processed: string
  }
  gradient: string
  iconColor: string
  demoContent: React.ReactNode
}

export function HeroSection() {
  const [hasScrolled, setHasScrolled] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [activeFeature, setActiveFeature] = useState<number>(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const productRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)

  // Feature cards data
  const features: FeatureCard[] = useMemo(() => [
    {
      type: 'text',
      icon: FileText,
      title: '文本检测',
      description: '精准识别AI生成文本，支持多语言检测',
      stats: {
        accuracy: '99.2%',
        speed: '<0.5s',
        processed: '10M+'
      },
      gradient: 'from-orange-500/20 via-yellow-500/20 to-orange-500/20',
      iconColor: 'text-orange-400',
      demoContent: (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-white/70 text-sm">样本文本分析</div>
            <div className="bg-black/40 rounded-xl p-4 space-y-2">
              <p className="text-white/90 text-sm leading-relaxed">
                <span className="bg-yellow-500/20 px-1 rounded">人工智能技术的发展</span>
                <span className="bg-orange-500/30 px-1 rounded border-b border-orange-400">正在深刻改变着我们的生活。</span>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold text-orange-400">65%</div>
              <div className="text-white/50 text-xs">AI生成概率</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">2/3</div>
              <div className="text-white/50 text-xs">疑似AI句子</div>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'image',
      icon: ImageIcon,
      title: '图像检测',
      description: 'AI生成图像识别，支持多种图像格式',
      stats: {
        accuracy: '98.5%',
        speed: '<2s',
        processed: '5M+'
      },
      gradient: 'from-amber-500/20 via-yellow-500/20 to-amber-500/20',
      iconColor: 'text-amber-400',
      demoContent: (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-white/70 text-sm">图像特征分析</div>
            <div className="bg-black/40 rounded-xl p-3">
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-amber-500/20 to-yellow-500/20 rounded-lg border border-white/10 flex items-center justify-center">
                    <span className="text-white/40 text-xs">R{i}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold text-amber-400">92%</div>
              <div className="text-white/50 text-xs">AI生成概率</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">4/4</div>
              <div className="text-white/50 text-xs">检测区域</div>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'audio',
      icon: Music,
      title: '音频检测',
      description: '识别AI合成语音，检测深度伪造音频',
      stats: {
        accuracy: '97.8%',
        speed: '<3s',
        processed: '2M+'
      },
      gradient: 'from-purple-500/20 via-pink-500/20 to-purple-500/20',
      iconColor: 'text-purple-400',
      demoContent: (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-white/70 text-sm">音频波形分析</div>
            <div className="bg-black/40 rounded-xl p-4">
              <div className="flex items-end justify-between h-24 gap-1">
                {[...Array(32)].map((_, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-purple-500 to-pink-500 rounded-sm animate-pulse-glow"
                    style={{
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.05}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold text-purple-400">88%</div>
              <div className="text-white/50 text-xs">AI生成概率</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">1.2s</div>
              <div className="text-white/50 text-xs">音频时长</div>
            </div>
          </div>
        </div>
      )
    },
    {
      type: 'video',
      icon: Video,
      title: '视频检测',
      description: '深度伪造视频识别，帧级精准分析',
      stats: {
        accuracy: '96.3%',
        speed: '<5s',
        processed: '1M+'
      },
      gradient: 'from-red-500/20 via-orange-500/20 to-red-500/20',
      iconColor: 'text-red-400',
      demoContent: (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-white/70 text-sm">视频帧分析</div>
            <div className="bg-black/40 rounded-xl p-4">
              <div className="grid grid-cols-4 gap-2 mb-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-video bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded border border-white/10 flex items-center justify-center">
                    <span className="text-white/40 text-xs">F{i}</span>
                  </div>
                ))}
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full" style={{ width: '75%' }} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold text-red-400">75%</div>
              <div className="text-white/50 text-xs">AI生成概率</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white">4/4</div>
              <div className="text-white/50 text-xs">关键帧</div>
            </div>
          </div>
        </div>
      )
    }
  ], [])

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

  // Auto-rotate features
  useEffect(() => {
    const startAutoPlay = () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
      autoPlayRef.current = setInterval(() => {
        setIsTransitioning(true)
        setTimeout(() => {
          setActiveFeature((prev) => (prev + 1) % features.length)
          setIsTransitioning(false)
        }, 500)
      }, 5000) // Change every 5 seconds
    }

    startAutoPlay()

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current)
      }
    }
  }, [features.length])

  // Handle manual feature change
  const handleFeatureChange = (index: number) => {
    if (index === activeFeature) return
    
    // Clear current autoplay
    if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current)
    }

    // Change feature
    setIsTransitioning(true)
    setTimeout(() => {
      setActiveFeature(index)
      setIsTransitioning(false)
    }, 300)

    // Restart autoplay
    autoPlayRef.current = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveFeature((prev) => (prev + 1) % features.length)
        setIsTransitioning(false)
      }, 500)
    }, 5000)
  }

  // Navigate to previous feature
  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Previous clicked, current:', activeFeature)
    const newIndex = activeFeature === 0 ? features.length - 1 : activeFeature - 1
    handleFeatureChange(newIndex)
  }

  // Navigate to next feature
  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Next clicked, current:', activeFeature)
    const newIndex = (activeFeature + 1) % features.length
    handleFeatureChange(newIndex)
  }

  const currentFeature = features[activeFeature]

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

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-none mb-4 max-w-4xl">
            重新定义
            <br />
            人类创作价值
          </h1>

          <p className="text-xl md:text-2xl text-white/60 max-w-2xl mb-8 leading-relaxed">
            精准识别 AI 生成内容，智能改写提升原创度。让每一个创意都经得起时间的考验。
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="text-base px-8 h-12 bg-white hover:bg-white/90 text-black font-medium rounded-full transition-all duration-300 hover:scale-105"
              >
                开始使用
              </Button>
            </Link>
            <a href="#demo">
              <Button
                size="lg"
                variant="ghost"
                className="text-base px-8 h-12 border border-white/30 hover:bg-white/10 hover:border-white/50 text-white font-medium rounded-full backdrop-blur-sm transition-all duration-300"
              >
                了解更多
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex items-end justify-center pb-16 px-8">
        <div className="relative">
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
              {/* Animated gradient background based on active feature */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${currentFeature.gradient} opacity-50 transition-all duration-1000`}
              />

              {/* Content inside the card */}
              <div className="relative h-full p-8 flex flex-col">
                {/* Top bar */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 animate-pulse" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-3 h-3 rounded-full bg-green-500/80 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-white/40 text-sm font-mono flex items-center gap-2">
                      <currentFeature.icon className={`w-4 h-4 ${currentFeature.iconColor}`} />
                      {currentFeature.title}
                    </div>
                  </div>
                </div>

                {/* Main content area with transition */}
                <div className={`flex-1 grid grid-cols-2 gap-6 transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                  {/* Left side - Feature demo */}
                  <div className="space-y-4">
                    <div className="text-white/80 text-lg font-medium mb-2">{currentFeature.description}</div>
                    {currentFeature.demoContent}
                  </div>

                  {/* Right side - Large icon display */}
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${currentFeature.gradient} blur-3xl opacity-60 animate-pulse-glow`} />
                      <currentFeature.icon className={`w-48 h-48 ${currentFeature.iconColor} relative z-10`} strokeWidth={1} />
                    </div>
                  </div>
                </div>

                {/* Bottom stats */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${currentFeature.iconColor} transition-colors duration-500`}>
                      {currentFeature.stats.accuracy}
                    </div>
                    <div className="text-white/40 text-xs">准确率</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-2xl font-bold">{currentFeature.stats.speed}</div>
                    <div className="text-white/40 text-xs">检测速度</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-2xl font-bold">{currentFeature.stats.processed}</div>
                    <div className="text-white/40 text-xs">已处理</div>
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
          
          {/* Feature indicators with navigation - Outside 3D transform */}
          <div className="flex items-center justify-center gap-4 mt-6">
            {/* Previous button */}
            <button
              type="button"
              onClick={handlePrevious}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center group cursor-pointer"
              aria-label="Previous feature"
            >
              <ChevronLeft className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>

            {/* Indicators */}
            <div className="flex items-center gap-2">
              {features.map((feature, index) => (
                <button
                  type="button"
                  key={feature.type}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    console.log('Indicator clicked:', index)
                    handleFeatureChange(index)
                  }}
                  className={`transition-all duration-300 cursor-pointer ${
                    index === activeFeature 
                      ? 'w-8 h-2 bg-white rounded-full' 
                      : 'w-2 h-2 bg-white/30 rounded-full hover:bg-white/50'
                  }`}
                  aria-label={`Switch to ${feature.title}`}
                />
              ))}
            </div>

            {/* Next button */}
            <button
              type="button"
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center justify-center group cursor-pointer"
              aria-label="Next feature"
            >
              <ChevronRight className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

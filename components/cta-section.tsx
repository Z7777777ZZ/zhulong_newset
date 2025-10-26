"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 text-balance">准备好开始了吗？</h2>
        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">立即体验AI文本检测与降重的强大功能</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="text-base px-8 h-12 bg-accent hover:bg-accent/90 text-accent-foreground group">
              免费开始使用
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            className="text-base px-8 h-12 border-border/60 hover:bg-secondary/50 bg-transparent"
          >
            联系销售团队
          </Button>
        </div>
      </div>
    </section>
  )
}

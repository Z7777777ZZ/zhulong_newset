"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link href="/" className="text-xl font-bold text-white hover:opacity-80 transition-opacity">
            DragonAI
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#demo" className="text-sm text-white/70 hover:text-white transition-colors">
              功能
            </a>
            <a href="#pricing-section" className="text-sm text-white/70 hover:text-white transition-colors">
              价格
            </a>
            <Link href="/workspace" className="text-sm text-white/70 hover:text-white transition-colors">
              使用
            </Link>
          </div>
        </div>

        <Link href="/login">
          <Button className="text-sm px-5 h-9 bg-white hover:bg-white/90 text-black font-medium rounded-full transition-all duration-200">
            登录
          </Button>
        </Link>
      </div>
    </nav>
  )
}

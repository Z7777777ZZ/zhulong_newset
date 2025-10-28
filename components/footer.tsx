import Link from "next/link"
import { Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-black/40 backdrop-blur-xl border-t border-white/10">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">DragonAI</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              专注于AI内容检测与优化，为您的创作保驾护航。
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>北京市朝阳区xx街道xx号</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>400-xxx-xxxx</span>
              </div>
              <div className="flex items-center gap-2 text-white/60 text-sm">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>contact@dragonai.com</span>
              </div>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">产品</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="#demo" 
                  className="text-white/60 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  AIGC检测
                </Link>
              </li>
              <li>
                <Link 
                  href="#demo" 
                  className="text-white/60 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  AIGC改写
                </Link>
              </li>
              <li>
                <Link 
                  href="#pricing" 
                  className="text-white/60 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  定价方案
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">资源</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/docs" 
                  className="text-white/60 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  使用文档
                </Link>
              </li>
              <li>
                <Link 
                  href="/help" 
                  className="text-white/60 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  帮助中心
                </Link>
              </li>
              <li>
                <Link 
                  href="/faq" 
                  className="text-white/60 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  常见问题
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">法律信息</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy" 
                  className="text-white/60 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  隐私政策
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-white/60 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  用户协议
                </Link>
              </li>
              <li>
                <Link 
                  href="/service-agreement" 
                  className="text-white/60 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  服务条款
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookie-policy" 
                  className="text-white/60 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  Cookie 政策
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-white/60 hover:text-white text-sm transition-colors cursor-pointer"
                >
                  关于我们
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="text-white/40 text-sm text-center md:text-left">
              © {currentYear} DragonAI. 保留所有权利.
            </div>

            {/* ICP Filing & Other Info */}
            <div className="flex flex-col md:flex-row items-center gap-4 text-white/40 text-sm">
              <a 
                href="https://beian.miit.gov.cn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors cursor-pointer"
              >
                京ICP备xxxxxxxx号
              </a>
              <span className="hidden md:inline">|</span>
              <a 
                href="http://www.beian.gov.cn/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors cursor-pointer flex items-center gap-1"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                  <path d="M10 5a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0V6a1 1 0 0 1 1-1zm0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
                </svg>
                京公网安备 xxxxxxxxxxxxxxxx号
              </a>
              <span className="hidden md:inline">|</span>
              <span>增值电信业务经营许可证：京B2-xxxxxxxx</span>
            </div>
          </div>

          {/* Additional Legal Text */}
          <div className="mt-4 text-center text-white/30 text-xs">
            本网站所有内容均受版权保护 | 未经许可不得复制或转载
          </div>
        </div>
      </div>
    </footer>
  )
}


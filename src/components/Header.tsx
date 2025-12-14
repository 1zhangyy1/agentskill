import Link from 'next/link'
import { Github } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E4DE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Logo Mark */}
            <div className="relative">
              <div className="w-9 h-9 bg-[#1A1A1A] rounded-lg flex items-center justify-center group-hover:bg-[#E8634A] transition-colors">
                <span className="font-[var(--font-fraunces)] text-white text-lg font-medium">A</span>
              </div>
              {/* 装饰点 */}
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#E8634A] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-[var(--font-fraunces)] text-xl font-medium text-[#1A1A1A]">
              {SITE_CONFIG.name}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-[#5C5C5C] hover:text-[#1A1A1A] rounded-lg transition-colors relative group"
            >
              Skills
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#E8634A] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>
            <Link
              href="/about"
              className="px-4 py-2 text-sm font-medium text-[#5C5C5C] hover:text-[#1A1A1A] rounded-lg transition-colors relative group"
            >
              About
              <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-[#E8634A] scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </Link>

            {/* 分隔线 */}
            <div className="w-px h-5 bg-[#E8E4DE] mx-3" />

            {/* GitHub */}
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[#5C5C5C] hover:text-[#1A1A1A] hover:bg-[#E8E4DE]/50 rounded-lg transition-all"
            >
              <Github className="w-5 h-5" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

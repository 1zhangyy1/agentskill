import Link from 'next/link'
import { Github } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/constants'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F7]/80 backdrop-blur-sm border-b border-[#E5E5E5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-semibold text-[#1A1A1A]">
              {SITE_CONFIG.name}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
            >
              Skills
            </Link>
            <Link
              href="/about"
              className="text-sm text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
            >
              About
            </Link>
            <a
              href={SITE_CONFIG.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#6B7280] hover:text-[#1A1A1A] transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}

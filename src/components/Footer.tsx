import { SITE_CONFIG } from '@/lib/constants'

export function Footer() {
  return (
    <footer className="border-t border-[#E8E4DE] bg-[#FAF7F2]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo and Copyright */}
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#1A1A1A] rounded-lg flex items-center justify-center">
              <span className="font-[var(--font-fraunces)] text-white text-sm font-medium">A</span>
            </div>
            <div>
              <p className="font-[var(--font-fraunces)] text-[#1A1A1A] font-medium">
                {SITE_CONFIG.name}
              </p>
              <p className="text-xs text-[#8C8C8C]">
                © {new Date().getFullYear()}
              </p>
            </div>
          </div>

          {/* Disclaimer */}
          <p className="text-sm text-[#8C8C8C]">
            Not affiliated with Anthropic
          </p>
        </div>
      </div>
    </footer>
  )
}

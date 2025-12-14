import { getSkillsIndex } from '@/lib/skills'
import { SITE_CONFIG } from '@/lib/constants'
import { HomeClient } from '@/components/HomeClient'

export const dynamic = 'force-static'
export const revalidate = 3600

export default async function HomePage() {
  const { skills, total } = await getSkillsIndex()

  return (
    <div className="relative">
      {/* Hero Section - Editorial Style */}
      <section className="relative overflow-hidden border-b border-[#E8E4DE]">
        {/* 装饰性网格背景 */}
        <div className="absolute inset-0 bg-grid opacity-50" />

        {/* 装饰元素 - 右上角 */}
        <div className="absolute top-12 right-12 w-32 h-32 border-2 border-[#E8E4DE] rounded-full animate-float opacity-60" />
        <div className="absolute top-24 right-24 w-16 h-16 bg-[#E8634A]/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />

        {/* 装饰元素 - 左下角 */}
        <div className="absolute bottom-20 left-8 flex gap-2">
          <div className="w-2 h-2 bg-[#E8634A] rounded-full" />
          <div className="w-2 h-2 bg-[#E8634A]/60 rounded-full" />
          <div className="w-2 h-2 bg-[#E8634A]/30 rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          {/* 编号装饰 */}
          <div className="absolute top-20 left-4 sm:left-0 number-badge animate-fade delay-1">
            001
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-end">
            {/* 左侧 - 主标题区域 */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="animate-rise">
                <span className="block text-sm font-medium tracking-[0.2em] uppercase text-[#8C8C8C] mb-4">
                  Claude Code Skills
                </span>
                <span className="block font-[var(--font-fraunces)] text-5xl sm:text-6xl lg:text-7xl font-medium text-[#1A1A1A] leading-[1.1] tracking-tight">
                  Discover skills
                  <br />
                  <span className="italic text-[#E8634A]">that amplify</span>
                  <br />
                  your workflow
                </span>
              </h1>

              <p className="text-lg text-[#5C5C5C] max-w-md leading-relaxed animate-rise delay-2">
                A curated collection of Claude Code Skills. Browse, discover, and enhance your AI-powered development experience.
              </p>
            </div>

            {/* 右侧 - 统计数据 */}
            <div className="lg:col-span-5 lg:text-right space-y-8">
              <div className="animate-rise delay-3">
                <div className="inline-block text-right">
                  <span className="block font-[var(--font-fraunces)] text-6xl sm:text-7xl font-medium text-[#1A1A1A]">
                    {total}
                  </span>
                  <span className="block text-sm tracking-[0.15em] uppercase text-[#8C8C8C] mt-1">
                    Skills Indexed
                  </span>
                </div>
              </div>

              {/* 快捷分类标签 */}
              <div className="flex flex-wrap lg:justify-end gap-2 animate-rise delay-4">
                {['Coding', 'Writing', 'DevOps'].map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 text-sm border border-[#E8E4DE] rounded-full text-[#5C5C5C] hover:border-[#E8634A] hover:text-[#E8634A] transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 底部装饰线 */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#E8634A]/30 to-transparent" />
      </section>

      {/* 搜索和列表区域 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <HomeClient skills={skills} />
      </section>
    </div>
  )
}

import Link from 'next/link'
import { Star, GitFork, ArrowUpRight } from 'lucide-react'
import { SkillSummary } from '@/types'
import { CATEGORIES } from '@/lib/constants'

interface SkillCardProps {
  skill: SkillSummary
  index?: number
}

export function SkillCard({ skill, index = 0 }: SkillCardProps) {
  const categoryLabel = CATEGORIES.find(c => c.value === skill.category)?.label || skill.category
  const delayClass = `delay-${Math.min((index % 6) + 1, 6)}`

  return (
    <Link href={`/skill/${skill.slug}`} className={`group block animate-rise ${delayClass}`}>
      <article className="relative h-full bg-white border border-[#E8E4DE] rounded-2xl overflow-hidden card-hover">
        {/* 顶部装饰条 - 悬停时展开 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#E8634A] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />

        {/* 编号 */}
        <div className="absolute top-4 right-4 number-badge opacity-40 group-hover:opacity-100 transition-opacity">
          {String(index + 1).padStart(3, '0')}
        </div>

        {/* 内容区域 */}
        <div className="p-6 pt-8">
          {/* 分类标签 */}
          <span className="inline-block text-xs font-medium tracking-[0.1em] uppercase text-[#E8634A] mb-3">
            {categoryLabel}
          </span>

          {/* 标题 */}
          <h3 className="font-[var(--font-fraunces)] text-xl font-medium text-[#1A1A1A] mb-2 group-hover:text-[#E8634A] transition-colors line-clamp-1">
            {skill.name}
          </h3>

          {/* 描述 */}
          <p className="text-sm text-[#5C5C5C] leading-relaxed line-clamp-2 mb-4">
            {skill.description}
          </p>

          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(skill.tags || []).slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-xs bg-[#FAF7F2] border border-[#E8E4DE] rounded-full text-[#5C5C5C]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 底部信息栏 */}
        <div className="px-6 py-4 border-t border-[#E8E4DE] bg-[#FAF7F2]/50 flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-[#8C8C8C]">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4" />
              <span className="font-medium text-[#1A1A1A]">{skill.stars}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GitFork className="w-4 h-4" />
              <span>{skill.forks}</span>
            </div>
          </div>

          {/* 作者 + 箭头 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#8C8C8C] truncate max-w-[80px]">
              {skill.author}
            </span>
            <ArrowUpRight className="w-4 h-4 text-[#8C8C8C] group-hover:text-[#E8634A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
        </div>
      </article>
    </Link>
  )
}

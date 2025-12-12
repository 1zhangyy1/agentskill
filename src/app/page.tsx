import { getSkillsIndex } from '@/lib/skills'
import { SITE_CONFIG } from '@/lib/constants'
import { HomeClient } from '@/components/HomeClient'

export const dynamic = 'force-static'
export const revalidate = 3600 // 每小时重新验证

export default async function HomePage() {
  const { skills, total } = await getSkillsIndex()

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">
          {SITE_CONFIG.name}
        </h1>
        <p className="text-lg text-[#6B7280] max-w-2xl mx-auto mb-2">
          Discover and share Claude Code Skills. Find the perfect skill to enhance your AI-powered development workflow.
        </p>
        <p className="text-sm text-[#9CA3AF]">
          {total} skills indexed
        </p>
      </div>

      {/* Client-side interactive part */}
      <HomeClient skills={skills} />
    </div>
  )
}

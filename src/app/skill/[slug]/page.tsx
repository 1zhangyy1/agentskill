import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Star, GitFork, ExternalLink, Copy, Check, Calendar, User } from 'lucide-react'
import { getSkillDetail, getAllSkillSlugs } from '@/lib/skills'
import { Badge } from '@/components/ui'
import { CATEGORIES } from '@/lib/constants'
import { CopyButton } from './CopyButton'

interface SkillPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllSkillSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function SkillPage({ params }: SkillPageProps) {
  const { slug } = await params
  const skill = await getSkillDetail(slug)

  if (!skill) {
    notFound()
  }

  const categoryLabel = CATEGORIES.find(c => c.value === skill.category)?.label || skill.category
  const formattedDate = new Date(skill.updatedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Link */}
      <Link
        href="/"
        className="inline-flex items-center text-sm text-[#6B7280] hover:text-[#1A1A1A] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Skills
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">
              {skill.name}
            </h1>
            <p className="text-[#6B7280]">
              {skill.description}
            </p>
          </div>
          <Badge variant="primary" className="self-start">
            {categoryLabel}
          </Badge>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-[#6B7280] mb-4">
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <a
              href={skill.authorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#1A1A1A] transition-colors"
            >
              {skill.author}
            </a>
          </div>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4" />
            <span>{skill.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <GitFork className="w-4 h-4" />
            <span>{skill.forks}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Updated {formattedDate}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {skill.tags.map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <a
            href={skill.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white rounded-lg hover:bg-[#333] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View on GitHub
          </a>
          {skill.hasMarketplaceJson && (
            <Badge variant="primary" className="self-center">
              Plugin Ready
            </Badge>
          )}
        </div>
      </div>

      {/* Install Command */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 mb-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-3">
          Installation
        </h2>
        <div className="flex items-center gap-2 bg-[#F9FAFB] rounded-lg p-3 font-mono text-sm">
          <code className="flex-1 text-[#1A1A1A] overflow-x-auto">
            {skill.installCommand}
          </code>
          <CopyButton text={skill.installCommand} />
        </div>
      </div>

      {/* README Content */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">
          SKILL.md
        </h2>
        <div className="prose prose-sm max-w-none text-[#374151]">
          <pre className="bg-[#F9FAFB] rounded-lg p-4 overflow-x-auto whitespace-pre-wrap">
            {skill.readme}
          </pre>
        </div>
      </div>
    </div>
  )
}

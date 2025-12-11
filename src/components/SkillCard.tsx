import Link from 'next/link'
import { Star, GitFork, User } from 'lucide-react'
import { SkillSummary } from '@/types'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui'
import { Badge } from '@/components/ui'
import { CATEGORIES } from '@/lib/constants'

interface SkillCardProps {
  skill: SkillSummary
}

export function SkillCard({ skill }: SkillCardProps) {
  const categoryLabel = CATEGORIES.find(c => c.value === skill.category)?.label || skill.category

  return (
    <Link href={`/skill/${skill.slug}`}>
      <Card hover className="h-full flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-[#1A1A1A] line-clamp-1">
              {skill.name}
            </h3>
            <Badge variant="primary">{categoryLabel}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-[#6B7280] line-clamp-2 mb-3">
            {skill.description}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {(skill.tags || []).slice(0, 3).map((tag) => (
              <Badge key={tag} variant="default">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full text-sm text-[#6B7280]">
            <div className="flex items-center space-x-1">
              <User className="w-4 h-4" />
              <span>{skill.author}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>{skill.stars}</span>
              </div>
              <div className="flex items-center space-x-1">
                <GitFork className="w-4 h-4" />
                <span>{skill.forks}</span>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

import { SkillSummary } from '@/types'
import { SkillCard } from './SkillCard'

interface SkillListProps {
  skills: SkillSummary[]
}

export function SkillList({ skills }: SkillListProps) {
  if (skills.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6B7280]">No skills found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((skill) => (
        <SkillCard key={skill.id} skill={skill} />
      ))}
    </div>
  )
}

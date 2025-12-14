import { SkillSummary } from '@/types'
import { SkillCard } from './SkillCard'

interface SkillListProps {
  skills: SkillSummary[]
}

export function SkillList({ skills }: SkillListProps) {
  if (skills.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-block mb-6">
          <div className="w-16 h-16 border-2 border-[#E8E4DE] rounded-full flex items-center justify-center">
            <span className="text-2xl">?</span>
          </div>
        </div>
        <p className="font-[var(--font-fraunces)] text-xl text-[#1A1A1A] mb-2">No skills found</p>
        <p className="text-[#8C8C8C]">Try adjusting your search or filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {skills.map((skill, index) => (
        <SkillCard key={skill.id} skill={skill} index={index} />
      ))}
    </div>
  )
}

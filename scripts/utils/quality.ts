import { QualityTier, SkillStatus } from '../../src/types'
import { getDaysSince } from './helpers'

/**
 * 计算质量层级
 *
 * Tier 1: ⭐ 100+, 30天内更新
 * Tier 2: ⭐ 20+,  90天内更新
 * Tier 3: ⭐ 5+,   180天内更新
 * Tier 4: ⭐ 2+,   1年内更新
 * Tier 5: 其他
 */
export function calculateTier(stars: number, lastCommitAt: string): QualityTier {
  const daysSinceCommit = getDaysSince(lastCommitAt)

  if (stars >= 100 && daysSinceCommit <= 30) return 1
  if (stars >= 20 && daysSinceCommit <= 90) return 2
  if (stars >= 5 && daysSinceCommit <= 180) return 3
  if (stars >= 2 && daysSinceCommit <= 365) return 4
  return 5
}

/**
 * 推断 Skill 状态
 */
export function inferStatus(
  archived: boolean,
  lastCommitAt: string
): SkillStatus {
  if (archived) return 'archived'

  const daysSinceCommit = getDaysSince(lastCommitAt)

  if (daysSinceCommit <= 30) return 'active'
  if (daysSinceCommit <= 180) return 'maintained'
  if (daysSinceCommit <= 365) return 'maintained'

  return 'unknown'
}

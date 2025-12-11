import Fuse, { IFuseOptions } from 'fuse.js'
import { SkillSummary, SkillFilters, SortOption } from '@/types'

// Fuse.js 搜索配置
const fuseOptions: IFuseOptions<SkillSummary> = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'description', weight: 0.3 },
    { name: 'tags', weight: 0.2 },
    { name: 'author', weight: 0.1 },
  ],
  threshold: 0.3,
  includeScore: true,
}

// 搜索 Skills
export function searchSkills(skills: SkillSummary[], query: string): SkillSummary[] {
  if (!query.trim()) return skills

  const fuse = new Fuse(skills, fuseOptions)
  const results = fuse.search(query)
  return results.map(r => r.item)
}

// 排序 Skills
export function sortSkills(skills: SkillSummary[], sort: SortOption): SkillSummary[] {
  const sorted = [...skills]

  switch (sort) {
    case 'stars':
      return sorted.sort((a, b) => b.stars - a.stars)
    case 'updated':
      return sorted.sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      )
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return sorted
  }
}

// 筛选和搜索 Skills
export function filterSkills(
  skills: SkillSummary[],
  filters: SkillFilters
): SkillSummary[] {
  let result = skills

  // 分类筛选
  if (filters.category) {
    result = result.filter(s => s.category === filters.category)
  }

  // 搜索
  if (filters.search) {
    result = searchSkills(result, filters.search)
  }

  // 排序
  if (filters.sort) {
    result = sortSkills(result, filters.sort)
  } else {
    // 默认按 stars 排序
    result = sortSkills(result, 'stars')
  }

  return result
}

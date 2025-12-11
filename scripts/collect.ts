import * as dotenv from 'dotenv'
import * as fs from 'fs/promises'
import * as path from 'path'
import { GitHubCollector } from './collectors/github'
import { SkillSummary, SkillDetail, SkillsIndex, DataSource, QualityTier, Category } from '../src/types'
import { generateSlug } from './utils/helpers'

// 加载环境变量
dotenv.config({ path: '.env.local' })

const DATA_DIR = path.join(__dirname, '../data')
const SKILLS_DIR = path.join(DATA_DIR, 'skills')

/**
 * 去重和合并 Skills
 */
function mergeSkills(allSkills: SkillSummary[]): SkillSummary[] {
  // 按 repoFullName 去重
  const skillMap = new Map<string, SkillSummary>()

  // 数据源优先级
  const sourcePriority: Record<DataSource, number> = {
    'anthropics-official': 1,
    'awesome-list': 2,
    'github-topic': 3,
    'github-search': 4,
    'skillsmp': 5,
    'manual': 0
  }

  // 按优先级排序
  const sorted = [...allSkills].sort((a, b) =>
    sourcePriority[a.source] - sourcePriority[b.source]
  )

  for (const skill of sorted) {
    const key = skill.repoFullName.toLowerCase()

    if (!skillMap.has(key)) {
      skillMap.set(key, skill)
    } else {
      // 合并 tags
      const existing = skillMap.get(key)!
      existing.tags = [...new Set([...existing.tags, ...skill.tags])]
    }
  }

  return Array.from(skillMap.values())
}

/**
 * 生成唯一 slugs
 */
function assignSlugs(skills: SkillSummary[]): SkillSummary[] {
  const existingSlugs = new Set<string>()

  return skills.map(skill => {
    const slug = generateSlug(skill.name, skill.author, existingSlugs)
    existingSlugs.add(slug)
    return { ...skill, slug }
  })
}

/**
 * 计算统计数据
 */
function calculateStats(skills: SkillSummary[]) {
  const bySource: Partial<Record<DataSource, number>> = {}
  const byTier: Partial<Record<QualityTier, number>> = {}
  const byCategory: Partial<Record<Category, number>> = {}

  for (const skill of skills) {
    bySource[skill.source] = (bySource[skill.source] || 0) + 1
    byTier[skill.tier] = (byTier[skill.tier] || 0) + 1
    byCategory[skill.category] = (byCategory[skill.category] || 0) + 1
  }

  return { bySource, byTier, byCategory }
}

/**
 * 主采集函数
 */
async function main() {
  console.log('='.repeat(60))
  console.log('🚀 AgentSkill Data Collection')
  console.log('='.repeat(60))

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    console.error('❌ GITHUB_TOKEN not found in .env.local')
    process.exit(1)
  }

  const startTime = Date.now()
  const collector = new GitHubCollector(token)
  const allSkills: SkillSummary[] = []

  // 1. 采集官方 anthropics/skills
  const anthropicsSkills = await collector.collectAnthropicsSkills()
  allSkills.push(...anthropicsSkills)

  // 2. 采集 GitHub Topics
  const topicSkills1 = await collector.collectByTopic('claude-skills')
  allSkills.push(...topicSkills1)

  const topicSkills2 = await collector.collectByTopic('claude-code-skills')
  allSkills.push(...topicSkills2)

  // 3. 搜索 SKILL.md 文件
  const searchSkills = await collector.collectByFilename()
  allSkills.push(...searchSkills)

  // 4. 去重和合并
  console.log('\n🔄 Merging and deduplicating...')
  const mergedSkills = mergeSkills(allSkills)
  console.log(`  Before: ${allSkills.length}, After: ${mergedSkills.length}`)

  // 5. 生成 slugs
  console.log('\n🏷️ Generating slugs...')
  const skillsWithSlugs = assignSlugs(mergedSkills)

  // 6. 按 stars 排序
  skillsWithSlugs.sort((a, b) => b.stars - a.stars)

  // 7. 创建数据目录
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.mkdir(SKILLS_DIR, { recursive: true })

  // 8. 写入索引文件
  console.log('\n💾 Writing index file...')
  const index: SkillsIndex = {
    version: '2.0',
    total: skillsWithSlugs.length,
    lastUpdated: new Date().toISOString(),
    generatedAt: new Date().toISOString(),
    stats: calculateStats(skillsWithSlugs),
    skills: skillsWithSlugs
  }

  await fs.writeFile(
    path.join(DATA_DIR, 'skills-index.json'),
    JSON.stringify(index, null, 2)
  )

  // 9. 写入详情文件（只处理 Tier 1-3 的高质量 Skills）
  console.log('\n💾 Writing detail files...')
  let detailCount = 0

  for (const skill of skillsWithSlugs) {
    if (skill.tier > 3) continue // 跳过低质量

    try {
      const detail = await collector.getSkillDetail(skill)
      if (detail) {
        await fs.writeFile(
          path.join(SKILLS_DIR, `${skill.slug}.json`),
          JSON.stringify(detail, null, 2)
        )
        detailCount++
        console.log(`  ✓ ${skill.slug}`)
      }
    } catch (err: any) {
      console.log(`  ✗ ${skill.slug}: ${err.message}`)
    }
  }

  // 10. 输出统计
  const duration = ((Date.now() - startTime) / 1000).toFixed(1)
  console.log('\n' + '='.repeat(60))
  console.log('📊 Collection Complete!')
  console.log('='.repeat(60))
  console.log(`  Total Skills: ${skillsWithSlugs.length}`)
  console.log(`  Detail Files: ${detailCount}`)
  console.log(`  Duration: ${duration}s`)
  console.log('\n📁 Output:')
  console.log(`  Index: ${path.join(DATA_DIR, 'skills-index.json')}`)
  console.log(`  Details: ${SKILLS_DIR}/`)
  console.log('\n✨ Done!')
}

// 运行
main().catch(err => {
  console.error('❌ Collection failed:', err)
  process.exit(1)
})

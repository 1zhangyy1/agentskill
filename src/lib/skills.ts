import { SkillSummary, SkillDetail, SkillsIndex, Category } from '@/types'
import fs from 'fs/promises'
import path from 'path'

const DATA_DIR = path.join(process.cwd(), 'data')
const INDEX_FILE = path.join(DATA_DIR, 'skills-index.json')
const SKILLS_DIR = path.join(DATA_DIR, 'skills')

// 缓存
let cachedIndex: SkillsIndex | null = null

// 获取所有 Skills（列表数据）
export async function getSkillsIndex(): Promise<SkillsIndex> {
  if (cachedIndex) return cachedIndex

  try {
    const content = await fs.readFile(INDEX_FILE, 'utf-8')
    cachedIndex = JSON.parse(content) as SkillsIndex
    return cachedIndex
  } catch (err) {
    console.error('Error reading skills index:', err)
    // 返回空索引
    return {
      version: '2.0',
      total: 0,
      lastUpdated: new Date().toISOString(),
      generatedAt: new Date().toISOString(),
      stats: { bySource: {}, byTier: {}, byCategory: {} },
      skills: []
    }
  }
}

// 获取单个 Skill 详情
export async function getSkillDetail(slug: string): Promise<SkillDetail | null> {
  // 首先尝试从详情文件读取
  try {
    const detailPath = path.join(SKILLS_DIR, `${slug}.json`)
    const content = await fs.readFile(detailPath, 'utf-8')
    return JSON.parse(content) as SkillDetail
  } catch {
    // 详情文件不存在，从索引构建基本详情
  }

  // 从索引获取基本信息
  const { skills } = await getSkillsIndex()
  const summary = skills.find(s => s.slug === slug)
  if (!summary) return null

  // 构建基本详情
  return {
    ...summary,
    authorUrl: `https://github.com/${summary.author}`,
    license: null,
    readme: summary.description,
    installCommand: `git clone ${summary.repoUrl} ~/.claude/skills/${summary.slug}`,
    defaultBranch: 'main',
    hasMarketplaceJson: false,
    skillPath: ''
  }
}

// 获取所有 slugs（用于静态生成）
export async function getAllSkillSlugs(): Promise<string[]> {
  const { skills } = await getSkillsIndex()
  return skills.map(s => s.slug)
}

// 按分类获取 Skills
export async function getSkillsByCategory(category: Category): Promise<SkillSummary[]> {
  const { skills } = await getSkillsIndex()
  return skills.filter(s => s.category === category || s.categories?.includes(category))
}

// 按 Tier 获取 Skills
export async function getSkillsByTier(tier: number): Promise<SkillSummary[]> {
  const { skills } = await getSkillsIndex()
  return skills.filter(s => s.tier === tier)
}

// 搜索 Skills（服务端简单搜索）
export async function searchSkills(query: string): Promise<SkillSummary[]> {
  const { skills } = await getSkillsIndex()
  const lowerQuery = query.toLowerCase()

  return skills.filter(s =>
    s.name.toLowerCase().includes(lowerQuery) ||
    s.description.toLowerCase().includes(lowerQuery) ||
    s.author.toLowerCase().includes(lowerQuery) ||
    s.tags?.some(t => t.toLowerCase().includes(lowerQuery))
  )
}

// 获取统计信息
export async function getStats() {
  const index = await getSkillsIndex()
  return {
    total: index.total,
    lastUpdated: index.lastUpdated,
    stats: index.stats
  }
}

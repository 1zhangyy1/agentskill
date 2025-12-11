import crypto from 'crypto'
import { Category } from '../../src/types'

/**
 * 生成 URL 友好的 slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')     // 移除特殊字符
    .replace(/[\s_-]+/g, '-')     // 空格、下划线转连字符
    .replace(/^-+|-+$/g, '')      // 移除首尾连字符
    .substring(0, 50)             // 最长 50 字符
}

/**
 * 生成 Skill 的唯一 slug
 * 优先用名称，冲突时加作者前缀
 */
export function generateSlug(
  name: string,
  author: string,
  existingSlugs: Set<string>
): string {
  const baseSlug = slugify(name)

  if (!existingSlugs.has(baseSlug)) {
    return baseSlug
  }

  // 冲突时添加作者前缀
  const authorSlug = `${slugify(author)}-${baseSlug}`

  if (!existingSlugs.has(authorSlug)) {
    return authorSlug
  }

  // 仍冲突加数字
  let counter = 2
  while (existingSlugs.has(`${authorSlug}-${counter}`)) {
    counter++
  }

  return `${authorSlug}-${counter}`
}

/**
 * 生成确定性 ID（基于仓库 URL）
 */
export function generateSkillId(repoFullName: string, skillPath: string = ''): string {
  const input = `${repoFullName}:${skillPath}`.toLowerCase()
  return crypto.createHash('sha256').update(input).digest('hex').substring(0, 16)
}

/**
 * 根据关键词自动分类
 */
export function categorizeByKeywords(text: string): Category {
  const lowerText = text.toLowerCase()

  if (/test|spec|jest|mocha|cypress|playwright/.test(lowerText)) return 'testing'
  if (/docker|kubernetes|k8s|ci|cd|deploy|aws|azure|gcp|devops/.test(lowerText)) return 'devops'
  if (/automat|script|workflow|task|cron/.test(lowerText)) return 'automation'
  if (/write|blog|document|markdown|content|readme/.test(lowerText)) return 'writing'
  if (/doc|documentation|api.?doc/.test(lowerText)) return 'documentation'
  if (/productiv|todo|note|organiz|gtd/.test(lowerText)) return 'productivity'
  if (/security|auth|encrypt|vulnerab|pentest/.test(lowerText)) return 'security'
  if (/ai|ml|machine.?learn|llm|gpt|model|train/.test(lowerText)) return 'ai-ml'
  if (/code|debug|refactor|lint|format|git|api|program/.test(lowerText)) return 'coding'

  return 'other'
}

/**
 * 从仓库名提取 Skill 名称
 */
export function extractSkillName(repoName: string): string {
  let name = repoName
    .replace(/^(claude-|cc-|skill-|skills-)/i, '')
    .replace(/(-skill|-skills|-claude|-code)$/i, '')
    .replace(/-/g, ' ')

  // 首字母大写
  return name
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/**
 * 计算距今天数
 */
export function getDaysSince(dateStr: string): number {
  const date = new Date(dateStr)
  const now = new Date()
  return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * 延迟函数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

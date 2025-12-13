import { Category, CategoryConfig, SortOption } from '@/types'

// 分类配置
export const CATEGORIES: CategoryConfig[] = [
  { value: 'coding', label: 'Coding', labelZh: '编程开发' },
  { value: 'automation', label: 'Automation', labelZh: '自动化' },
  { value: 'writing', label: 'Writing', labelZh: '写作' },
  { value: 'productivity', label: 'Productivity', labelZh: '效率工具' },
  { value: 'devops', label: 'DevOps', labelZh: '运维' },
  { value: 'testing', label: 'Testing', labelZh: '测试' },
  { value: 'other', label: 'Other', labelZh: '其他' },
]

// 排序选项
export const SORT_OPTIONS: { value: SortOption; label: string; labelZh: string }[] = [
  { value: 'stars', label: 'Most Stars', labelZh: '最多星标' },
  { value: 'updated', label: 'Recently Updated', labelZh: '最近更新' },
  { value: 'name', label: 'Name', labelZh: '名称' },
]

// 根据关键词自动分类
export function categorizeByKeywords(text: string): Category {
  const lowerText = text.toLowerCase()

  if (/test|spec|jest|mocha|cypress/.test(lowerText)) return 'testing'
  if (/docker|kubernetes|k8s|ci|cd|deploy|aws|azure/.test(lowerText)) return 'devops'
  if (/automat|script|workflow|task/.test(lowerText)) return 'automation'
  if (/write|blog|document|markdown|content/.test(lowerText)) return 'writing'
  if (/productiv|todo|note|organiz/.test(lowerText)) return 'productivity'
  if (/code|debug|refactor|lint|format|git|api/.test(lowerText)) return 'coding'

  return 'other'
}

// 站点信息
export const SITE_CONFIG = {
  name: 'AgentSkill',
  description: 'Discover and share Claude Code Skills to enhance your AI-powered development workflow',
  descriptionZh: '发现和分享 Claude Code Skills，提升 AI 辅助开发效率',
  url: 'https://www.agentskill.space',
  github: 'https://github.com/yourusername/agentskill',
  keywords: ['Claude Code', 'AI Skills', 'Claude Skills', 'AI Development', 'Anthropic', 'Code Assistant'],
}

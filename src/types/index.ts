// ============================================================
// 数据来源
// ============================================================
export type DataSource =
  | 'anthropics-official'   // 官方仓库
  | 'github-topic'          // GitHub topic 搜索
  | 'github-search'         // GitHub 文件搜索
  | 'awesome-list'          // Awesome Lists
  | 'skillsmp'              // SkillsMP（阶段二）
  | 'manual'                // 手动添加

// ============================================================
// 质量层级
// ============================================================
export type QualityTier = 1 | 2 | 3 | 4 | 5
// Tier 1: ⭐ 100+, 30天内更新
// Tier 2: ⭐ 20+,  90天内更新
// Tier 3: ⭐ 5+,   180天内更新
// Tier 4: ⭐ 2+,   1年内更新
// Tier 5: 其他

// ============================================================
// 状态
// ============================================================
export type SkillStatus =
  | 'active'      // 活跃
  | 'maintained'  // 维护中
  | 'archived'    // 已归档
  | 'unknown'     // 未知

// ============================================================
// 分类
// ============================================================
export type Category =
  | 'coding'
  | 'automation'
  | 'writing'
  | 'productivity'
  | 'devops'
  | 'testing'
  | 'documentation'
  | 'ai-ml'
  | 'security'
  | 'other'

// 排序选项
export type SortOption = 'stars' | 'updated' | 'name'

// ============================================================
// 列表数据（轻量）- 用于首页展示
// ============================================================
export interface SkillSummary {
  // 标识
  id: string                    // SHA256 哈希
  slug: string                  // URL 友好，如 "code-reviewer"

  // 基础信息
  name: string
  description: string
  author: string
  authorAvatar?: string

  // 仓库信息
  repoUrl: string
  repoFullName: string          // "owner/repo"

  // 统计
  stars: number
  forks: number

  // 分类（兼容旧版单分类）
  category: Category            // 主分类（兼容）
  categories: Category[]        // 支持多分类
  tags: string[]

  // 质量
  tier: QualityTier
  status: SkillStatus

  // 时间
  createdAt: string
  updatedAt: string
  lastCommitAt: string

  // 采集元数据
  source: DataSource
  collectedAt: string
}

// ============================================================
// 详情数据（完整）- 用于详情页
// ============================================================
export interface SkillDetail extends SkillSummary {
  // 作者
  authorUrl: string

  // 版本和许可
  license: string | null

  // 内容
  readme: string                // SKILL.md 内容
  installCommand: string

  // 仓库详情
  defaultBranch: string
  hasMarketplaceJson: boolean
  skillPath: string             // Skill 在仓库中的路径
}

// ============================================================
// 索引文件结构
// ============================================================
export interface SkillsIndex {
  version: string               // "2.0"
  total: number
  lastUpdated: string
  generatedAt: string

  stats: {
    bySource: Partial<Record<DataSource, number>>
    byTier: Partial<Record<QualityTier, number>>
    byCategory: Partial<Record<Category, number>>
  }

  skills: SkillSummary[]
}

// ============================================================
// 筛选参数
// ============================================================
export interface SkillFilters {
  search?: string
  category?: Category
  sort?: SortOption
}

// ============================================================
// 分类配置
// ============================================================
export interface CategoryConfig {
  value: Category
  label: string
  labelZh: string
}

// ============================================================
// 采集相关类型
// ============================================================
export interface CollectionResult {
  source: DataSource
  timestamp: string
  duration: number
  success: boolean
  skills: SkillSummary[]
  errors?: Array<{
    message: string
    repo?: string
  }>
}

# AgentSkill 数据采集方案

> 完整的数据采集、存储和自动化方案设计

## 一、整体架构

```
┌─────────────────────────────────────────────────────────────────────┐
│                         数据采集架构                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   【阶段一：GitHub API 采集】                                        │
│                                                                     │
│   数据源                          采集器                             │
│   ├── anthropics/skills ─────────┬──────────────┐                  │
│   ├── GitHub topic:claude-skills ┼─→ collectors/ │                  │
│   ├── Awesome Lists ─────────────┤   ├── github.ts                 │
│   └── filename:SKILL.md 搜索 ────┘   └── awesome.ts                │
│                                           │                         │
│                                           ▼                         │
│                                  ┌─────────────────┐                │
│                                  │  处理器 Pipeline │                │
│                                  │  ├── 去重       │                │
│                                  │  ├── 合并       │                │
│                                  │  ├── 质量评估   │                │
│                                  │  └── 校验       │                │
│                                  └────────┬────────┘                │
│                                           │                         │
│                                           ▼                         │
│                                  ┌─────────────────┐                │
│                                  │  data/          │                │
│                                  │  ├── index.json │  JSON 存储     │
│                                  │  └── skills/    │                │
│                                  └────────┬────────┘                │
│                                           │                         │
│   【自动化】                               │                         │
│                                           ▼                         │
│   GitHub Actions ──────────────────→ Git Commit                    │
│   (每日定时)                              │                         │
│                                           ▼                         │
│                                  ┌─────────────────┐                │
│                                  │    Vercel       │  自动部署      │
│                                  └─────────────────┘                │
│                                                                     │
│   【阶段二：扩展数据源】（后续实现）                                   │
│                                                                     │
│   └── SkillsMP 爬取 ──→ 23000+ Skills                              │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 二、数据来源分析

### 阶段一数据源（GitHub API）

| 来源 | 预估数量 | 质量 | 优先级 | 采集方式 |
|-----|---------|------|-------|---------|
| anthropics/skills | 25-30 | ⭐⭐⭐⭐⭐ | P0 | 直接读取仓库 |
| GitHub topic | 100+ | ⭐⭐⭐⭐ | P1 | Search API |
| travisvn/awesome | 12-15 | ⭐⭐⭐⭐ | P1 | 解析 README |
| ComposioHQ/awesome | 25+ | ⭐⭐⭐⭐ | P1 | 解析 README |
| filename:SKILL.md | 500+ | ⭐⭐⭐ | P2 | Code Search API |

**阶段一目标**：200-500 个高质量 Skill

### 阶段二数据源（后续）

| 来源 | 预估数量 | 说明 |
|-----|---------|------|
| SkillsMP | 23000+ | 需要爬虫，数据去重 |

### GitHub API 限制

```
认证请求：5000 次/小时
搜索请求：30 次/分钟
搜索结果：最多 1000 条

应对策略：
├── 使用 Personal Access Token（5000/小时）
├── 请求间隔 2 秒（避免触发滥用检测）
├── 指数退避重试
└── 缓存已获取的数据
```

## 三、数据模型设计

### 改进后的类型定义

```typescript
// ============================================================
// 数据来源
// ============================================================
type DataSource =
  | 'anthropics-official'   // 官方仓库
  | 'github-topic'          // GitHub topic 搜索
  | 'github-search'         // GitHub 文件搜索
  | 'awesome-list'          // Awesome Lists
  | 'skillsmp'              // SkillsMP（阶段二）
  | 'manual'                // 手动添加

// ============================================================
// 质量层级
// ============================================================
type QualityTier = 1 | 2 | 3 | 4 | 5

// Tier 1: ⭐ 100+, 30天内更新
// Tier 2: ⭐ 20+,  90天内更新
// Tier 3: ⭐ 5+,   180天内更新
// Tier 4: ⭐ 2+,   1年内更新
// Tier 5: 其他

// ============================================================
// 状态
// ============================================================
type SkillStatus =
  | 'active'      // 活跃
  | 'maintained'  // 维护中
  | 'archived'    // 已归档
  | 'unknown'     // 未知

// ============================================================
// 分类（支持多分类）
// ============================================================
type Category =
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

// ============================================================
// 列表数据（轻量）
// ============================================================
interface SkillSummary {
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

  // 分类
  categories: Category[]        // 支持多分类
  primaryCategory: Category
  tags: string[]

  // 质量
  tier: QualityTier
  status: SkillStatus

  // 时间
  updatedAt: string
  lastCommitAt: string

  // 采集元数据
  source: DataSource
  collectedAt: string
}

// ============================================================
// 详情数据（完整）
// ============================================================
interface SkillDetail extends SkillSummary {
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

  // 时间
  createdAt: string
}

// ============================================================
// 索引文件结构
// ============================================================
interface SkillsIndex {
  version: string               // "2.0"
  total: number
  lastUpdated: string
  generatedAt: string

  stats: {
    bySource: Record<DataSource, number>
    byTier: Record<QualityTier, number>
    byCategory: Record<Category, number>
  }

  skills: SkillSummary[]
}
```

### Slug 生成策略

```
优先级：
1. 仅用 Skill 名称: "code-reviewer"
2. 冲突时加作者: "anthropic-code-reviewer"
3. 仍冲突加序号: "anthropic-code-reviewer-2"

规则：
- 小写
- 空格转连字符
- 移除特殊字符
- 最长 50 字符
```

## 四、存储方案

### 文件结构

```
app/
├── data/
│   ├── skills-index.json       # 索引文件（所有 Skill 摘要）
│   │                           # 约 50-100KB per 500 skills
│   │
│   └── skills/                 # 详情文件
│       ├── code-reviewer.json
│       ├── tdd-master.json
│       └── ...
│
└── scripts/
    ├── collect.ts              # 主入口
    ├── collectors/
    │   ├── base.ts             # 基础采集器
    │   ├── github.ts           # GitHub API
    │   └── awesome.ts          # Awesome List 解析
    ├── processors/
    │   ├── merge.ts            # 去重合并
    │   ├── quality.ts          # 质量评估
    │   └── categorize.ts       # 自动分类
    └── utils/
        ├── rate-limiter.ts     # 限流
        ├── retry.ts            # 重试
        └── validator.ts        # 校验
```

### 索引 vs 详情 字段分配

| 字段 | 索引 | 详情 | 说明 |
|-----|:----:|:----:|------|
| id, slug, name, description | ✅ | ✅ | 基础 |
| author, repoUrl, stars, forks | ✅ | ✅ | 统计 |
| categories, tags, tier, status | ✅ | ✅ | 分类质量 |
| updatedAt, lastCommitAt, source | ✅ | ✅ | 时间元数据 |
| authorUrl, authorAvatar | ❌ | ✅ | 作者详情 |
| license, readme, installCommand | ❌ | ✅ | 内容 |
| hasMarketplaceJson, skillPath | ❌ | ✅ | 仓库详情 |

## 五、采集脚本设计

### 目录结构

```
scripts/
├── collect.ts                  # 主入口
│
├── collectors/
│   ├── base.ts                 # BaseCollector 抽象类
│   │   ├── 限流控制
│   │   ├── 重试逻辑
│   │   └── 统一接口
│   │
│   ├── github.ts               # GitHub 采集器
│   │   ├── searchByTopic()     # topic:claude-skills
│   │   ├── searchByFilename()  # filename:SKILL.md
│   │   ├── getRepoDetails()    # 仓库详情
│   │   └── getSkillContent()   # 读取 SKILL.md
│   │
│   └── awesome.ts              # Awesome List 采集器
│       ├── parseReadme()       # 解析 README.md
│       └── extractSkillLinks() # 提取 Skill 链接
│
├── processors/
│   ├── merge.ts                # 去重和合并
│   │   ├── 按 repoFullName 去重
│   │   ├── 高优先级数据源覆盖低优先级
│   │   └── 合并 tags 和 categories
│   │
│   ├── quality.ts              # 质量评估
│   │   ├── calculateTier()     # 计算质量层级
│   │   └── inferStatus()       # 推断状态
│   │
│   └── categorize.ts           # 自动分类
│       └── categorizeByKeywords() # 关键词匹配
│
└── utils/
    ├── rate-limiter.ts         # 令牌桶限流
    ├── retry.ts                # 指数退避重试
    ├── validator.ts            # Zod 数据校验
    └── slug.ts                 # Slug 生成
```

### 核心流程

```typescript
// collect.ts 伪代码

async function main() {
  // 1. 读取现有数据（增量更新）
  const existing = await loadExistingIndex()

  // 2. 采集各数据源
  const results = await Promise.all([
    // P0: 官方仓库
    collectAnthropicsSkills(),
    // P1: GitHub Topic
    collectGitHubTopic('claude-skills'),
    collectGitHubTopic('claude-code-skills'),
    // P1: Awesome Lists
    collectAwesomeList('travisvn/awesome-claude-skills'),
    collectAwesomeList('ComposioHQ/awesome-claude-skills'),
  ])

  // 3. 合并去重
  const merged = mergeSkills(results.flat())

  // 4. 质量评估
  const scored = merged.map(skill => ({
    ...skill,
    tier: calculateTier(skill),
    status: inferStatus(skill),
  }))

  // 5. 校验
  const validated = scored.filter(validateSkill)

  // 6. 写入文件
  await writeIndex(validated)
  await writeDetails(validated)

  // 7. 输出统计
  console.log(`Total: ${validated.length}`)
}
```

## 六、GitHub Actions 自动化

### 工作流配置

```yaml
# .github/workflows/collect-skills.yml

name: Collect Skills

on:
  # 每天 UTC 2:00（北京时间 10:00）
  schedule:
    - cron: '0 2 * * *'

  # 手动触发
  workflow_dispatch:
    inputs:
      full:
        description: '完整采集（忽略缓存）'
        type: boolean
        default: false

jobs:
  collect:
    runs-on: ubuntu-latest
    timeout-minutes: 30

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Run collection
        env:
          GITHUB_TOKEN: ${{ secrets.GH_PAT }}
        run: |
          if [ "${{ inputs.full }}" == "true" ]; then
            npm run collect -- --full
          else
            npm run collect
          fi

      - name: Commit changes
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: 'chore(data): update skills'
          file_pattern: 'data/**/*.json'
```

### 采集频率

| 时间 | 类型 | 说明 |
|-----|------|------|
| 每天 10:00 | 完整采集 | 全量更新 |
| 手动触发 | 可选完整/增量 | 紧急更新用 |

## 七、GitHub Token 获取指南

### 步骤

1. **登录 GitHub**
   - 访问 https://github.com/settings/tokens

2. **创建 Token**
   - 点击 "Generate new token (classic)"
   - 选择权限：
     - `public_repo` - 读取公开仓库
     - `read:user` - 读取用户信息（可选）
   - 设置过期时间（建议 90 天）
   - 点击 "Generate token"

3. **保存 Token**
   - 复制生成的 Token（只显示一次！）
   - 本地开发：创建 `.env.local` 文件
     ```
     GITHUB_TOKEN=ghp_xxxxxxxxxxxx
     ```
   - GitHub Actions：添加到仓库 Secrets
     - Settings → Secrets → Actions → New repository secret
     - Name: `GH_PAT`
     - Value: 你的 Token

### 权限说明

```
最小权限原则：

✅ public_repo  - 必需，读取公开仓库
✅ read:user    - 可选，获取用户头像
❌ repo         - 不需要，我们只读公开仓库
❌ write:*      - 不需要任何写权限
```

## 八、实现计划

### 第一步：环境准备
- [ ] 创建 GitHub Token
- [ ] 添加到 `.env.local`
- [ ] 安装采集依赖（octokit, zod, dotenv）

### 第二步：类型更新
- [ ] 更新 `src/types/index.ts`
- [ ] 添加新字段
- [ ] 支持多分类

### 第三步：采集脚本
- [ ] 实现 `scripts/collectors/github.ts`
- [ ] 实现 `scripts/processors/merge.ts`
- [ ] 实现 `scripts/collect.ts` 主入口

### 第四步：本地测试
- [ ] 运行采集脚本
- [ ] 验证数据质量
- [ ] 更新前端读取逻辑

### 第五步：自动化
- [ ] 配置 GitHub Actions
- [ ] 测试定时任务
- [ ] 部署到 Vercel

## 九、预期成果

### 阶段一完成后

```
数据量：200-500 个高质量 Skill
更新频率：每日自动
数据质量：Tier 1-3 为主

文件大小估算：
├── skills-index.json   ~100KB
└── skills/             ~500KB（200个详情文件）
```

### 页面加载性能

```
首页加载：
├── 索引文件 100KB（gzip 后约 20KB）
├── 客户端搜索/筛选
└── 首屏 <500ms

详情页加载：
├── 按需加载单个详情文件
├── 约 2-5KB/文件
└── 首屏 <300ms
```

---

**文档版本**: 2.0
**最后更新**: 2025-12-11

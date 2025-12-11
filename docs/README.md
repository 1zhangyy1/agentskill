# AgentSkill Marketplace

> Claude Code Skill 聚合展示平台

## 项目概述

AgentSkill 是一个 Claude Code Skill 的发现和分享平台，帮助开发者找到合适的 Skill 来增强 AI 辅助开发工作流。

## 技术栈

| 项 | 选择 |
|---|------|
| 框架 | Next.js 16 (App Router) |
| 样式 | Tailwind CSS v4 |
| 搜索 | Fuse.js |
| 图标 | Lucide React |
| 部署 | Vercel (计划) |

## 目录结构

```
app/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # 根布局
│   │   ├── page.tsx            # 首页（列表页）
│   │   ├── skill/[slug]/       # 详情页
│   │   │   ├── page.tsx
│   │   │   └── CopyButton.tsx
│   │   ├── error.tsx           # 错误边界
│   │   ├── not-found.tsx       # 404
│   │   └── loading.tsx         # 加载态
│   │
│   ├── components/
│   │   ├── Header.tsx          # 顶部导航
│   │   ├── Footer.tsx          # 底部
│   │   ├── SkillCard.tsx       # Skill 卡片
│   │   ├── SkillList.tsx       # Skill 列表
│   │   ├── SearchBar.tsx       # 搜索框
│   │   ├── FilterBar.tsx       # 分类筛选 + 排序
│   │   └── ui/                 # 原子组件
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       └── Card.tsx
│   │
│   ├── lib/
│   │   ├── skills.ts           # 数据读取（含 Mock）
│   │   ├── search.ts           # Fuse.js 搜索
│   │   └── constants.ts        # 分类、站点配置
│   │
│   ├── hooks/
│   │   └── useDebounce.ts      # 防抖 Hook
│   │
│   └── types/
│       └── index.ts            # TypeScript 类型
│
├── data/                       # 数据文件（待实现）
│   ├── skills-index.json
│   └── skills/
│
├── scripts/                    # 采集脚本（待实现）
│   └── fetch-skills.ts
│
└── docs/                       # 文档
    └── README.md
```

## 核心功能

### 已实现 ✅

1. **首页列表**
   - Skill 卡片展示
   - 关键词搜索（Fuse.js 模糊匹配）
   - 分类筛选
   - 排序（Stars / 更新时间 / 名称）

2. **详情页**
   - Skill 完整信息
   - GitHub 链接
   - 安装命令（可复制）
   - SKILL.md 内容展示

3. **UI 组件**
   - Claude 风格设计
   - 响应式布局
   - 加载/错误/404 状态

### 待实现 🚧

1. **数据采集**
   - GitHub API 集成
   - 定时采集脚本
   - GitHub Actions 自动化

2. **SEO 优化**
   - sitemap.ts
   - robots.ts
   - Open Graph 元数据

3. **部署**
   - Vercel 部署
   - 自定义域名

## 数据类型

```typescript
// 列表用（轻量）
interface SkillSummary {
  id: string
  slug: string
  name: string
  description: string
  author: string
  repoUrl: string
  stars: number
  forks: number
  category: Category
  tags: string[]
  updatedAt: string
}

// 详情用（完整）
interface SkillDetail extends SkillSummary {
  authorUrl: string
  readme: string
  installCommand: string
  hasMarketplaceJson: boolean
  createdAt: string
}

// 分类
type Category =
  | 'coding'
  | 'automation'
  | 'writing'
  | 'productivity'
  | 'devops'
  | 'testing'
  | 'other'
```

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 生产模式
npm start

# 代码检查
npm run lint
```

## UI 设计规范

### 色彩

| 名称 | 色值 | 用途 |
|-----|------|------|
| 背景 | #FAF9F7 | 页面背景 |
| 卡片 | #FFFFFF | 卡片背景 |
| 主文字 | #1A1A1A | 标题、正文 |
| 次要文字 | #6B7280 | 描述、元信息 |
| 强调色 | #D97706 | 按钮、徽章 |
| 边框 | #E5E5E5 | 分割线、边框 |

### 组件风格

- 圆角：8-12px
- 阴影：极轻微 (shadow-sm)
- 字体：系统字体栈
- 留白：充足

## 数据来源（计划）

1. **GitHub Topic**
   - `claude-code-skills`
   - `claude-skills`

2. **搜索**
   - `filename:SKILL.md`

3. **Awesome Lists**
   - travisvn/awesome-claude-skills
   - ComposioHQ/awesome-claude-skills

4. **官方仓库**
   - anthropics/skills

## 下一步

1. 实现 GitHub 数据采集脚本
2. 配置 GitHub Actions 定时任务
3. 部署到 Vercel
4. 购买域名并配置
5. 添加 SEO 优化

---

**项目状态**: MVP 架子已搭建完成，使用 Mock 数据可正常运行。

**最后更新**: 2025-12-11

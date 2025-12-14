import { Octokit } from '@octokit/rest'
import { SkillSummary, SkillDetail, DataSource } from '../../src/types'
import {
  generateSkillId,
  categorizeByKeywords,
  extractSkillName,
  sleep
} from '../utils/helpers'
import { calculateTier, inferStatus } from '../utils/quality'

type RepoOwnerLike = {
  login: string
  avatar_url: string
}

type RepoLike = {
  full_name: string
  name: string
  description: string | null
  html_url: string
  owner: RepoOwnerLike
  stargazers_count: number
  forks_count: number
  topics?: string[]
  archived?: boolean
  created_at: string
  updated_at: string
  pushed_at: string
  license?: { spdx_id?: string | null } | null
  default_branch?: string
}

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

export class GitHubCollector {
  private octokit: Octokit
  private requestDelay = 2000 // 2秒间隔，避免触发滥用检测

  constructor(token: string) {
    this.octokit = new Octokit({ auth: token })
  }

  /**
   * 采集 GitHub Topic 下的仓库
   */
  async collectByTopic(topic: string): Promise<SkillSummary[]> {
    console.log(`\n📦 Collecting from topic: ${topic}`)
    const skills: SkillSummary[] = []

    try {
      let page = 1
      const perPage = 100
      let hasMore = true

      while (hasMore && page <= 10) {
        console.log(`  Page ${page}...`)

        const response = await this.octokit.rest.search.repos({
          q: `topic:${topic}`,
          sort: 'stars',
          order: 'desc',
          per_page: perPage,
          page
        })

        for (const repo of response.data.items) {
          try {
            const skill = await this.transformRepo(repo as unknown as RepoLike, 'github-topic')
            if (skill) {
              skills.push(skill)
              console.log(`    ✓ ${repo.full_name} (⭐${repo.stargazers_count})`)
            }
          } catch (err: unknown) {
            console.log(`    ✗ ${repo.full_name}: ${getErrorMessage(err)}`)
          }
          await sleep(500)
        }

        hasMore = response.data.items.length === perPage
        page++
        await sleep(this.requestDelay)
      }
    } catch (err: unknown) {
      console.error(`  Error collecting topic ${topic}:`, getErrorMessage(err))
    }

    console.log(`  Total from ${topic}: ${skills.length}`)
    return skills
  }

  /**
   * 采集官方 anthropics/skills 仓库
   */
  async collectAnthropicsSkills(): Promise<SkillSummary[]> {
    console.log('\n📦 Collecting from anthropics/skills')
    const skills: SkillSummary[] = []

    try {
      const { data: repo } = await this.octokit.rest.repos.get({
        owner: 'anthropics',
        repo: 'skills'
      })

      const { data: contents } = await this.octokit.rest.repos.getContent({
        owner: 'anthropics',
        repo: 'skills',
        path: ''
      })

      if (!Array.isArray(contents)) {
        console.log('  No directories found')
        return skills
      }

      for (const item of contents) {
        if (item.type !== 'dir') continue

        try {
          const { data: skillMd } = await this.octokit.rest.repos.getContent({
            owner: 'anthropics',
            repo: 'skills',
            path: `${item.name}/SKILL.md`
          })

          if ('content' in skillMd) {
            const readme = Buffer.from(skillMd.content, 'base64').toString('utf-8')
            const skillName = this.extractNameFromReadme(readme) || extractSkillName(item.name)
            const description = this.extractDescriptionFromReadme(readme)

            const skill: SkillSummary = {
              id: generateSkillId('anthropics/skills', item.name),
              slug: '',
              name: skillName,
              description,
              author: 'anthropics',
              authorAvatar: repo.owner.avatar_url,
              repoUrl: `https://github.com/anthropics/skills/tree/main/${item.name}`,
              repoFullName: 'anthropics/skills',
              stars: repo.stargazers_count,
              forks: repo.forks_count,
              category: categorizeByKeywords(skillName + ' ' + description),
              categories: [categorizeByKeywords(skillName + ' ' + description)],
              tags: ['official', 'anthropic'],
              tier: 1,
              status: 'active',
              createdAt: repo.created_at,
              updatedAt: repo.updated_at,
              lastCommitAt: repo.pushed_at,
              source: 'anthropics-official',
              collectedAt: new Date().toISOString()
            }

            skills.push(skill)
            console.log(`  ✓ ${item.name}`)
          }
        } catch {
          // 该目录没有 SKILL.md，跳过
        }

        await sleep(300)
      }
    } catch (err: unknown) {
      console.error('  Error collecting anthropics/skills:', getErrorMessage(err))
    }

    console.log(`  Total from anthropics/skills: ${skills.length}`)
    return skills
  }

  /**
   * 采集官方 anthropics/claude-code/plugins
   */
  async collectOfficialPlugins(): Promise<SkillSummary[]> {
    console.log('\n📦 Collecting from anthropics/claude-code/plugins')
    const skills: SkillSummary[] = []

    try {
      const { data: repo } = await this.octokit.rest.repos.get({
        owner: 'anthropics',
        repo: 'claude-code'
      })

      const { data: contents } = await this.octokit.rest.repos.getContent({
        owner: 'anthropics',
        repo: 'claude-code',
        path: 'plugins'
      })

      if (!Array.isArray(contents)) {
        console.log('  No plugins directory found')
        return skills
      }

      for (const item of contents) {
        if (item.type !== 'dir') continue

        try {
          let pluginInfo: { name?: string; description?: string } = {}
          try {
            const { data: marketplaceJson } = await this.octokit.rest.repos.getContent({
              owner: 'anthropics',
              repo: 'claude-code',
              path: `plugins/${item.name}/marketplace.json`
            })
            if ('content' in marketplaceJson) {
              const content = Buffer.from(marketplaceJson.content, 'base64').toString('utf-8')
              pluginInfo = JSON.parse(content)
            }
          } catch {
            // 没有 marketplace.json
          }

          const skillName = pluginInfo.name || extractSkillName(item.name)
          const description = pluginInfo.description || `Official Claude Code plugin: ${item.name}`

          const skill: SkillSummary = {
            id: generateSkillId('anthropics/claude-code', item.name),
            slug: '',
            name: skillName,
            description,
            author: 'anthropics',
            authorAvatar: repo.owner.avatar_url,
            repoUrl: `https://github.com/anthropics/claude-code/tree/main/plugins/${item.name}`,
            repoFullName: 'anthropics/claude-code',
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            category: categorizeByKeywords(skillName + ' ' + description),
            categories: [categorizeByKeywords(skillName + ' ' + description)],
            tags: ['official', 'anthropic', 'plugin'],
            tier: 1,
            status: 'active',
            createdAt: repo.created_at,
            updatedAt: repo.updated_at,
            lastCommitAt: repo.pushed_at,
            source: 'anthropics-official',
            collectedAt: new Date().toISOString()
          }

          skills.push(skill)
          console.log(`  ✓ ${item.name}`)
        } catch {
          // 跳过无效目录
        }

        await sleep(300)
      }
    } catch (err: unknown) {
      console.error('  Error collecting official plugins:', getErrorMessage(err))
    }

    console.log(`  Total from official plugins: ${skills.length}`)
    return skills
  }

  /**
   * 搜索包含 marketplace.json 的仓库（高质量优先采集）
   */
  async collectByMarketplaceJson(maxPages: number = 10): Promise<SkillSummary[]> {
    console.log('\n📦 Collecting by filename:marketplace.json')
    const skills: SkillSummary[] = []
    const seenRepos = new Set<string>()

    try {
      let page = 1
      const perPage = 100

      while (page <= maxPages) {
        console.log(`  Page ${page}...`)

        const response = await this.octokit.rest.search.code({
          q: 'filename:marketplace.json path:/',
          per_page: perPage,
          page
        })

        for (const item of response.data.items) {
          const repoFullName = item.repository.full_name

          if (seenRepos.has(repoFullName)) continue
          seenRepos.add(repoFullName)

          if (repoFullName === 'anthropics/skills' || repoFullName === 'anthropics/claude-code') continue

          try {
            const { data: repo } = await this.octokit.rest.repos.get({
              owner: item.repository.owner.login,
              repo: item.repository.name
            })

            const skill = await this.transformRepo(repo as unknown as RepoLike, 'github-search')
            if (skill) {
              skill.tags = [...skill.tags, 'marketplace']
              if (skill.tier > 1) skill.tier = (skill.tier - 1) as 1 | 2 | 3 | 4 | 5
              skills.push(skill)
              console.log(`    ✓ ${repoFullName} (⭐${repo.stargazers_count}) [marketplace]`)
            }
          } catch (err: unknown) {
            console.log(`    ✗ ${repoFullName}: ${getErrorMessage(err)}`)
          }

          await sleep(500)
        }

        if (response.data.items.length < perPage) break
        page++
        await sleep(this.requestDelay)
      }
    } catch (err: unknown) {
      console.error('  Error searching by marketplace.json:', getErrorMessage(err))
    }

    console.log(`  Total from marketplace.json search: ${skills.length}`)
    return skills
  }

  /**
   * 搜索包含 SKILL.md 的仓库
   */
  async collectByFilename(): Promise<SkillSummary[]> {
    console.log('\n📦 Collecting by filename:SKILL.md')
    const skills: SkillSummary[] = []
    const seenRepos = new Set<string>()

    try {
      let page = 1
      const perPage = 100

      while (page <= 10) {
        console.log(`  Page ${page}...`)

        const response = await this.octokit.rest.search.code({
          q: 'filename:SKILL.md',
          per_page: perPage,
          page
        })

        for (const item of response.data.items) {
          const repoFullName = item.repository.full_name

          if (seenRepos.has(repoFullName)) continue
          seenRepos.add(repoFullName)

          if (repoFullName === 'anthropics/skills') continue

          try {
            const { data: repo } = await this.octokit.rest.repos.get({
              owner: item.repository.owner.login,
              repo: item.repository.name
            })

            const skill = await this.transformRepo(repo as unknown as RepoLike, 'github-search')
            if (skill) {
              skills.push(skill)
              console.log(`    ✓ ${repoFullName} (⭐${repo.stargazers_count})`)
            }
          } catch (err: unknown) {
            console.log(`    ✗ ${repoFullName}: ${getErrorMessage(err)}`)
          }

          await sleep(500)
        }

        if (response.data.items.length < perPage) break
        page++
        await sleep(this.requestDelay)
      }
    } catch (err: unknown) {
      console.error('  Error searching by filename:', getErrorMessage(err))
    }

    console.log(`  Total from filename search: ${skills.length}`)
    return skills
  }

  /**
   * 将 GitHub 仓库转换为 SkillSummary
   */
  private async transformRepo(
    repo: RepoLike,
    source: DataSource
  ): Promise<SkillSummary | null> {
    if (repo.stargazers_count < 1) return null
    if (repo.archived && repo.stargazers_count < 10) return null

    const description = repo.description || ''
    const category = categorizeByKeywords(repo.name + ' ' + description)

    return {
      id: generateSkillId(repo.full_name),
      slug: '',
      name: extractSkillName(repo.name),
      description: description.substring(0, 200),
      author: repo.owner.login,
      authorAvatar: repo.owner.avatar_url,
      repoUrl: repo.html_url,
      repoFullName: repo.full_name,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      category,
      categories: [category],
      tags: repo.topics || [],
      tier: calculateTier(repo.stargazers_count, repo.pushed_at),
      status: inferStatus(Boolean(repo.archived), repo.pushed_at),
      createdAt: repo.created_at,
      updatedAt: repo.updated_at,
      lastCommitAt: repo.pushed_at,
      source,
      collectedAt: new Date().toISOString()
    }
  }

  private extractNameFromReadme(content: string): string | null {
    const match = content.match(/^#\s+(.+)$/m)
    return match ? match[1].trim() : null
  }

  private extractDescriptionFromReadme(content: string): string {
    const lines = content.split('\n')
    let description = ''
    let inDescription = false

    for (const line of lines) {
      if (line.startsWith('##')) break
      if (line.startsWith('#') && !inDescription) {
        inDescription = true
        continue
      }
      if (inDescription && line.trim()) {
        description += line.trim() + ' '
      }
    }

    return description.trim().substring(0, 200) || 'No description available'
  }

  async getSkillDetail(skill: SkillSummary): Promise<SkillDetail | null> {
    try {
      const [owner, repo] = skill.repoFullName.split('/')

      const { data: repoData } = await this.octokit.rest.repos.get({
        owner,
        repo
      })

      let readme = ''
      let skillPath = ''

      try {
        const { data: skillMd } = await this.octokit.rest.repos.getContent({
          owner,
          repo,
          path: 'SKILL.md'
        })
        if ('content' in skillMd) {
          readme = Buffer.from(skillMd.content, 'base64').toString('utf-8')
          skillPath = 'SKILL.md'
        }
      } catch {
        try {
          const { data: readmeMd } = await this.octokit.rest.repos.getContent({
            owner,
            repo,
            path: 'README.md'
          })
          if ('content' in readmeMd) {
            readme = Buffer.from(readmeMd.content, 'base64').toString('utf-8')
            skillPath = 'README.md'
          }
        } catch {
          readme = skill.description
        }
      }

      let hasMarketplaceJson = false
      try {
        await this.octokit.rest.repos.getContent({
          owner,
          repo,
          path: 'marketplace.json'
        })
        hasMarketplaceJson = true
      } catch {
        // 没有 marketplace.json
      }

      return {
        ...skill,
        authorUrl: `https://github.com/${owner}`,
        license: repoData.license?.spdx_id || null,
        readme,
        installCommand: `git clone ${skill.repoUrl} ~/.claude/skills/${skill.slug}`,
        defaultBranch: repoData.default_branch,
        hasMarketplaceJson,
        skillPath
      }
    } catch (err: unknown) {
      console.error(`Error getting detail for ${skill.slug}:`, getErrorMessage(err))
      return null
    }
  }
}

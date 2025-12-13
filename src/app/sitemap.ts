import { MetadataRoute } from 'next'
import { getSkillsIndex } from '@/lib/skills'
import { SITE_CONFIG } from '@/lib/constants'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { skills } = await getSkillsIndex()

  // 首页
  const routes: MetadataRoute.Sitemap = [
    {
      url: SITE_CONFIG.url,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  // 所有 Skill 详情页
  const skillPages: MetadataRoute.Sitemap = skills.map((skill) => ({
    url: `${SITE_CONFIG.url}/skill/${skill.slug}`,
    lastModified: new Date(skill.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...routes, ...skillPages]
}

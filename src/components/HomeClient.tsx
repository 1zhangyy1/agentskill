'use client'

import { useState, useMemo } from 'react'
import { SearchBar, FilterBar, SkillList } from '@/components'
import { useDebounce } from '@/hooks/useDebounce'
import { filterSkills } from '@/lib/search'
import { SkillSummary, Category, SortOption } from '@/types'

interface HomeClientProps {
  skills: SkillSummary[]
}

export function HomeClient({ skills }: HomeClientProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [sort, setSort] = useState<SortOption>('stars')

  const debouncedSearch = useDebounce(search, 300)

  const filteredSkills = useMemo(() => {
    return filterSkills(skills, {
      search: debouncedSearch,
      category: category || undefined,
      sort,
    })
  }, [skills, debouncedSearch, category, sort])

  return (
    <>
      {/* Search */}
      <div className="max-w-2xl mx-auto mb-8">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search skills by name, description, or tags..."
        />
      </div>

      {/* Filter Bar */}
      <div className="mb-8">
        <FilterBar
          category={category}
          sort={sort}
          onCategoryChange={setCategory}
          onSortChange={setSort}
        />
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-[#6B7280]">
          {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Skill List */}
      <SkillList skills={filteredSkills} />
    </>
  )
}

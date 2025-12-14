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
    <div className="space-y-10">
      {/* Search */}
      <div className="max-w-2xl mx-auto animate-rise">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search skills by name, description, or tags..."
        />
      </div>

      {/* Filter Bar */}
      <div className="animate-rise delay-1">
        <FilterBar
          category={category}
          sort={sort}
          onCategoryChange={setCategory}
          onSortChange={setSort}
        />
      </div>

      {/* Results Count */}
      <div className="flex items-center gap-3 animate-rise delay-2">
        <div className="w-2 h-2 bg-[#E8634A] rounded-full" />
        <p className="text-sm text-[#5C5C5C]">
          <span className="font-medium text-[#1A1A1A]">{filteredSkills.length}</span>
          {' '}skill{filteredSkills.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Skill List */}
      <SkillList skills={filteredSkills} />
    </div>
  )
}

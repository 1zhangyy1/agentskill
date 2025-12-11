'use client'

import { Category, SortOption } from '@/types'
import { CATEGORIES, SORT_OPTIONS } from '@/lib/constants'

interface FilterBarProps {
  category: Category | ''
  sort: SortOption
  onCategoryChange: (category: Category | '') => void
  onSortChange: (sort: SortOption) => void
}

export function FilterBar({ category, sort, onCategoryChange, onSortChange }: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onCategoryChange('')}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
            category === ''
              ? 'bg-[#1A1A1A] text-white'
              : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              category === cat.value
                ? 'bg-[#1A1A1A] text-white'
                : 'bg-[#F3F4F6] text-[#6B7280] hover:bg-[#E5E7EB]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sort Select */}
      <div className="flex items-center space-x-2 sm:ml-auto">
        <span className="text-sm text-[#6B7280]">Sort by:</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-3 py-1.5 text-sm bg-white border border-[#E5E5E5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D97706] focus:border-transparent"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

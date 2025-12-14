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
          className={`
            px-4 py-2 text-sm font-medium rounded-full border-2
            transition-all duration-200
            ${category === ''
              ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
              : 'bg-transparent border-[#E8E4DE] text-[#5C5C5C] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
            }
          `}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => onCategoryChange(cat.value)}
            className={`
              px-4 py-2 text-sm font-medium rounded-full border-2
              transition-all duration-200
              ${category === cat.value
                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                : 'bg-transparent border-[#E8E4DE] text-[#5C5C5C] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
              }
            `}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sort Select */}
      <div className="flex items-center gap-3 sm:ml-auto">
        <span className="text-sm text-[#8C8C8C]">Sort</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="
            px-4 py-2
            text-sm font-medium
            bg-transparent
            border-2 border-[#E8E4DE]
            rounded-full
            text-[#1A1A1A]
            cursor-pointer
            focus:outline-none
            focus:border-[#1A1A1A]
            hover:border-[#1A1A1A]
            transition-colors duration-200
          "
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

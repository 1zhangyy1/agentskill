'use client'

import { Search } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Search skills...' }: SearchBarProps) {
  return (
    <div className="relative group">
      <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8C8C8C] group-focus-within:text-[#E8634A] transition-colors" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="
          w-full
          pl-14 pr-6 py-4
          bg-white
          border-2 border-[#E8E4DE]
          rounded-xl
          text-[#1A1A1A]
          placeholder-[#8C8C8C]
          focus:outline-none
          focus:border-[#E8634A]
          transition-colors duration-200
          text-base
        "
      />
      {/* 聚焦时的装饰线 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[#E8634A] group-focus-within:w-1/2 transition-all duration-300" />
    </div>
  )
}

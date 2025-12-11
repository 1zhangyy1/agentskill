'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">
        Oops!
      </h1>
      <p className="text-lg text-[#6B7280] mb-8">
        Something went wrong.
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="px-4 py-2 bg-[#D97706] text-white rounded-lg hover:bg-[#B45309] transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-4 py-2 bg-white text-[#1A1A1A] border border-[#E5E5E5] rounded-lg hover:bg-[#F5F5F5] transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

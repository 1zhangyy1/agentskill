import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-4xl font-bold text-[#1A1A1A] mb-4">
        404
      </h1>
      <p className="text-lg text-[#6B7280] mb-8">
        Skill not found.
      </p>
      <Link
        href="/"
        className="inline-flex items-center px-4 py-2 bg-[#D97706] text-white rounded-lg hover:bg-[#B45309] transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}

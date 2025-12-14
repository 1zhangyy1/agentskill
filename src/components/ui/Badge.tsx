import { HTMLAttributes, forwardRef } from 'react'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'secondary'
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = '', variant = 'default', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors'

    const variants = {
      default: 'bg-[#F5F5F4] text-[#78716C] border border-transparent',
      primary: 'bg-[#FEF3E2] text-[#D97706] border border-amber-200/50',
      secondary: 'bg-white text-[#292524] border border-[#E7E5E4]',
    }

    return (
      <span
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

export { Badge }

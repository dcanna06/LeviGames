import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type BigButtonProps = {
  children: ReactNode
  onClick?: () => void
  className?: string
  ariaLabel?: string
  /** idle attention animation, e.g. a gentle bounce/wiggle inviting a tap */
  idle?: 'bounce' | 'wiggle' | 'none'
  disabled?: boolean
}

const idleAnimations = {
  bounce: { y: [0, -10, 0] },
  wiggle: { rotate: [0, -4, 4, -4, 0] },
  none: {},
}

/**
 * The base tappable element used everywhere: hub icons, the home button,
 * game choices. Minimum 80x80px touch target, big spacing-friendly shape,
 * satisfying press feedback.
 */
export function BigButton({ children, onClick, className = '', ariaLabel, idle = 'none', disabled = false }: BigButtonProps) {
  return (
    <motion.button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={`flex min-h-20 min-w-20 items-center justify-center rounded-[2rem] shadow-lg select-none touch-manipulation ${disabled ? 'opacity-60' : ''} ${className}`}
      whileTap={disabled ? undefined : { scale: 0.88 }}
      animate={idle === 'none' ? undefined : idleAnimations[idle]}
      transition={idle === 'none' ? { type: 'spring', stiffness: 400, damping: 15 } : { duration: 1.6, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }}
    >
      {children}
    </motion.button>
  )
}

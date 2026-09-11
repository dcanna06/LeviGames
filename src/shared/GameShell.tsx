import type { ReactNode } from 'react'
import { HomeButton } from './HomeButton'

type GameShellProps = {
  children: ReactNode
  bgClassName?: string
}

/**
 * Consistent per-game wrapper: guarantees the home button is always present,
 * always in the same top-left spot, on every game screen.
 */
export function GameShell({ children, bgClassName = 'bg-sky-100' }: GameShellProps) {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${bgClassName}`}>
      <HomeButton />
      {children}
    </div>
  )
}

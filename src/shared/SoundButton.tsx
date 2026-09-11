import type { ReactNode } from 'react'
import { BigButton } from './BigButton'
import { sfx, unlockAudio, type SfxName } from './audio'

type SoundButtonProps = {
  children: ReactNode
  sound?: SfxName
  onClick?: () => void
  className?: string
  ariaLabel?: string
  idle?: 'bounce' | 'wiggle' | 'none'
  disabled?: boolean
}

/**
 * A BigButton that also plays a bundled sound effect on tap and transparently
 * unlocks the Web Audio context on the very first touch (required by iOS Safari).
 */
export function SoundButton({ children, sound = 'tap', onClick, className, ariaLabel, idle, disabled }: SoundButtonProps) {
  const handleClick = () => {
    unlockAudio()
    sfx[sound]()
    onClick?.()
  }
  return (
    <BigButton onClick={handleClick} className={className} ariaLabel={ariaLabel} idle={idle} disabled={disabled}>
      {children}
    </BigButton>
  )
}

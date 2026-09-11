import type { ReactElement } from 'react'
import type { SfxName } from '../../shared/audio'
import type { ProblemKey } from './layout'

/** Simple flat tool icons for the tool tray. */

type IconProps = { className?: string }

export function WrenchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M66 14a20 20 0 0 0-27 24L14 63a8 8 0 0 0 11 11l25-25a20 20 0 0 0 27-24L64 38 52 26z"
        fill="#64748b"
        stroke="#334155"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function PumpIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect x="28" y="30" width="18" height="46" rx="4" fill="#f97316" stroke="#c2410c" strokeWidth="3" />
      <rect x="21" y="17" width="32" height="15" rx="4" fill="#fb923c" stroke="#c2410c" strokeWidth="3" />
      <path d="M46 74 Q70 78 74 58" stroke="#78716c" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="76" cy="55" r="6" fill="#78716c" />
    </svg>
  )
}

export function HoseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M14 74 Q18 28 55 34 Q76 38 70 56" stroke="#22c55e" strokeWidth="10" fill="none" strokeLinecap="round" />
      <rect x="63" y="46" width="22" height="15" rx="4" fill="#16a34a" transform="rotate(22 74 53)" />
      <circle cx="88" cy="38" r="3.5" fill="#38bdf8" />
      <circle cx="94" cy="49" r="3.5" fill="#38bdf8" />
      <circle cx="88" cy="60" r="3.5" fill="#38bdf8" />
    </svg>
  )
}

export function HammerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect x="44" y="34" width="13" height="56" rx="5" fill="#a16207" transform="rotate(35 50.5 62)" />
      <rect x="20" y="12" width="48" height="26" rx="6" fill="#78716c" stroke="#44403c" strokeWidth="3" />
    </svg>
  )
}

export type ToolId = 'wrench' | 'pump' | 'hose' | 'hammer'

export type ToolDef = {
  id: ToolId
  problem: ProblemKey
  sound: SfxName
  ariaLabel: string
  bg: string
  Icon: (props: IconProps) => ReactElement
}

export const TOOLS: ToolDef[] = [
  { id: 'wrench', problem: 'wheel', sound: 'ratchet', ariaLabel: 'Wrench', bg: '#e2e8f0', Icon: WrenchIcon },
  { id: 'pump', problem: 'tire', sound: 'hiss', ariaLabel: 'Pump', bg: '#ffedd5', Icon: PumpIcon },
  { id: 'hose', problem: 'windshield', sound: 'waterSqueak', ariaLabel: 'Hose', bg: '#dcfce7', Icon: HoseIcon },
  { id: 'hammer', problem: 'bumper', sound: 'clank', ariaLabel: 'Hammer', bg: '#f5f5f4', Icon: HammerIcon },
]

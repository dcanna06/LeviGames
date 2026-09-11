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
      {/* foot base */}
      <ellipse cx="32" cy="88" rx="18" ry="6" fill="#57534e" />
      {/* barrel */}
      <rect x="24" y="30" width="16" height="56" rx="6" fill="#f97316" stroke="#c2410c" strokeWidth="3" />
      {/* T handle */}
      <rect x="12" y="14" width="40" height="10" rx="5" fill="#78716c" stroke="#44403c" strokeWidth="2" />
      <rect x="27" y="20" width="10" height="12" fill="#78716c" />
      {/* hose to nozzle */}
      <path d="M40 78 Q66 82 70 60" stroke="#44403c" strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* pressure gauge */}
      <circle cx="72" cy="52" r="9" fill="#fde68a" stroke="#b45309" strokeWidth="3" />
      <circle cx="72" cy="52" r="2" fill="#b45309" />
    </svg>
  )
}

export function HoseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {/* coiled hose */}
      <path d="M12 84 Q8 40 40 34 Q66 30 60 54" stroke="#22c55e" strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* spray-gun handle */}
      <rect x="56" y="44" width="26" height="14" rx="5" fill="#16a34a" transform="rotate(24 69 51)" />
      <rect x="66" y="54" width="12" height="18" rx="4" fill="#15803d" transform="rotate(24 72 63)" />
      {/* water droplets */}
      <circle cx="90" cy="34" r="3.5" fill="#38bdf8" />
      <circle cx="96" cy="46" r="3.5" fill="#38bdf8" />
      <circle cx="88" cy="56" r="3.5" fill="#38bdf8" />
    </svg>
  )
}

export function HammerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {/* diagonal handle */}
      <rect x="18" y="59" width="58" height="13" rx="6" fill="#a16207" transform="rotate(-38 47 65)" />
      {/* head */}
      <rect x="56" y="16" width="34" height="26" rx="5" fill="#71717a" stroke="#3f3f46" strokeWidth="3" />
      {/* claw notch */}
      <path d="M56 18 Q44 18 44 29 Q44 40 56 40" fill="none" stroke="#3f3f46" strokeWidth="4" />
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

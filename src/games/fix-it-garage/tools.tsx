import type { ReactElement } from 'react'
import type { SfxName } from '../../shared/audio'
import type { ProblemKey } from './layout'

/** Garage tools, drawn as recognisable workshop kit rather than abstract shapes. */

type IconProps = { className?: string }

const STEEL = '#94a3b8'
const STEEL_EDGE = '#475569'

/** Combination spanner: ring end one side, open jaw the other. */
export function WrenchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g transform="rotate(-35 50 50)" stroke={STEEL_EDGE} strokeWidth="3" strokeLinejoin="round">
        <rect x="43" y="24" width="14" height="54" fill={STEEL} />
        <circle cx="50" cy="22" r="15" fill={STEEL} />
        <path d="M 38,76 L 38,92 L 46,92 L 46,84 L 54,84 L 54,92 L 62,92 L 62,76 Z" fill={STEEL} />
      </g>
      <circle cx="62" cy="43" r="7" fill="#e2e8f0" transform="rotate(-35 50 50)" />
    </svg>
  )
}

/** Foot pump with a pressure gauge and an air line. */
export function PumpIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <ellipse cx="34" cy="88" rx="20" ry="6" fill="#57534e" />
      <rect x="26" y="30" width="16" height="56" rx="5" fill="#f97316" stroke="#c2410c" strokeWidth="3" />
      <rect x="14" y="14" width="40" height="10" rx="5" fill="#78716c" stroke="#44403c" strokeWidth="2" />
      <rect x="29" y="20" width="10" height="12" fill="#78716c" />
      <path d="M 42,78 Q 68,82 72,58" stroke="#44403c" strokeWidth="6" fill="none" strokeLinecap="round" />
      <circle cx="74" cy="50" r="11" fill="#fef3c7" stroke="#b45309" strokeWidth="3" />
      <path d="M 74,50 L 79,44" stroke="#b45309" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

/** Coiled wash hose with a trigger nozzle. */
export function HoseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M 12,86 Q 6,42 38,34 Q 64,28 58,52" stroke="#16a34a" strokeWidth="10" fill="none" strokeLinecap="round" />
      <rect x="54" y="42" width="28" height="14" rx="5" fill="#15803d" transform="rotate(22 68 49)" />
      <rect x="62" y="52" width="12" height="20" rx="4" fill="#166534" transform="rotate(22 68 62)" />
      <circle cx="90" cy="32" r="4" fill="#38bdf8" />
      <circle cx="96" cy="44" r="4" fill="#38bdf8" />
      <circle cx="88" cy="54" r="4" fill="#38bdf8" />
    </svg>
  )
}

/** Claw hammer. */
export function HammerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect x="16" y="58" width="60" height="14" rx="6" fill="#a16207" transform="rotate(-38 46 65)" />
      <rect x="54" y="14" width="36" height="28" rx="6" fill="#71717a" stroke="#3f3f46" strokeWidth="3" />
      <path d="M 54,16 Q 40,16 40,28 Q 40,40 54,40" fill="none" stroke="#3f3f46" strokeWidth="5" strokeLinecap="round" />
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

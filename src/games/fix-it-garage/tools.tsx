import type { ReactElement } from 'react'
import type { SfxName } from '../../shared/audio'
import type { ProblemKey } from './layout'

/**
 * Garage tools, drawn as recognisable workshop kit. Each tool has a tray icon
 * (its own 100×100 SVG with local gradients) and an in-hand version the
 * mechanic carries to the car, drawn with the grip at the origin and the
 * business end pointing along +x so the arm can aim it.
 */

type IconProps = { className?: string }

export type ToolId = 'wrench' | 'pump' | 'hose' | 'hammer'

/** Gradients the tool art relies on, duplicated per icon SVG (identical ids resolve fine). */
function ToolDefs() {
  return (
    <defs>
      <linearGradient id="tool-steel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f1f5f9" />
        <stop offset="0.45" stopColor="#94a3b8" />
        <stop offset="0.55" stopColor="#cbd5e1" />
        <stop offset="1" stopColor="#475569" />
      </linearGradient>
      <linearGradient id="tool-wood" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d9a25f" />
        <stop offset="0.5" stopColor="#a16207" />
        <stop offset="1" stopColor="#713f12" />
      </linearGradient>
      <linearGradient id="tool-orange" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c2410c" />
        <stop offset="0.4" stopColor="#fb923c" />
        <stop offset="1" stopColor="#9a3412" />
      </linearGradient>
      <linearGradient id="tool-green" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4ade80" />
        <stop offset="0.5" stopColor="#16a34a" />
        <stop offset="1" stopColor="#14532d" />
      </linearGradient>
      <linearGradient id="tool-rubber" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#52525b" />
        <stop offset="1" stopColor="#18181b" />
      </linearGradient>
    </defs>
  )
}

/** Combination spanner lying horizontally: open jaw on the left, ring end on the right. */
function WrenchArt() {
  return (
    <g>
      <path d="M 18,43 L 72,43 L 72,57 L 18,57 Z" fill="url(#tool-steel)" stroke="#334155" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 20,50 L 70,50" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
      {/* open jaw */}
      <path d="M 20,50 L 22,36 L 10,32 L 4,44 L 8,50 L 4,56 L 10,68 L 22,64 Z" fill="url(#tool-steel)" stroke="#334155" strokeWidth="2" strokeLinejoin="round" />
      {/* ring end with a 12-point hole */}
      <circle cx="84" cy="50" r="14" fill="url(#tool-steel)" stroke="#334155" strokeWidth="2" />
      <path d="M 84,43 l 6,3.5 v 7 l -6,3.5 l -6,-3.5 v -7 Z" fill="#1e293b" />
      <path d="M 74,42 A 12 12 0 0 1 90,40" stroke="#ffffff" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7" />
    </g>
  )
}

/** Claw hammer: hickory handle on the left, steel head on the right. */
function HammerArt() {
  return (
    <g>
      <path d="M 6,46 L 66,44 L 66,56 L 6,54 Z" fill="url(#tool-wood)" stroke="#713f12" strokeWidth="2" strokeLinejoin="round" />
      <path d="M 10,48 L 60,47" stroke="#fde68a" strokeWidth="1.2" opacity="0.5" />
      <path d="M 62,30 L 90,30 Q 96,30 96,36 L 96,64 Q 96,70 90,70 L 62,70 Z" fill="url(#tool-steel)" stroke="#334155" strokeWidth="2" strokeLinejoin="round" />
      {/* claw curving away from the face */}
      <path d="M 66,30 Q 54,22 48,34 Q 46,42 58,44" fill="none" stroke="#334155" strokeWidth="2" />
      <path d="M 66,30 Q 56,24 50,34 Q 50,40 58,43 L 62,42 L 62,30 Z" fill="url(#tool-steel)" />
      <path d="M 68,34 L 88,34" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
      <rect x="90" y="36" width="4" height="28" fill="#1e293b" opacity="0.3" />
    </g>
  )
}

/** Foot pump with a pressure gauge and a coiled air line. */
function PumpArt() {
  return (
    <g>
      <ellipse cx="38" cy="90" rx="26" ry="6" fill="#3f3f46" />
      <rect x="14" y="80" width="48" height="12" rx="5" fill="url(#tool-rubber)" stroke="#18181b" strokeWidth="1.5" />
      <rect x="30" y="24" width="18" height="60" rx="6" fill="url(#tool-orange)" stroke="#9a3412" strokeWidth="2" />
      <rect x="34" y="28" width="4" height="50" rx="2" fill="#ffffff" opacity="0.45" />
      <rect x="33" y="16" width="12" height="12" fill="url(#tool-steel)" stroke="#334155" strokeWidth="1.5" />
      <rect x="14" y="8" width="50" height="11" rx="5" fill="url(#tool-rubber)" stroke="#18181b" strokeWidth="1.5" />
      <path d="M 48,74 Q 78,80 76,58" stroke="#18181b" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M 48,74 Q 78,80 76,58" stroke="#52525b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <circle cx="78" cy="48" r="13" fill="#fef3c7" stroke="#334155" strokeWidth="2.5" />
      <circle cx="78" cy="48" r="9" fill="none" stroke="#b45309" strokeWidth="1" strokeDasharray="1.5 3" />
      <path d="M 78,48 L 84,41" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="78" cy="48" r="1.8" fill="#334155" />
    </g>
  )
}

/** Coiled wash hose with a trigger nozzle spraying. */
function HoseArt() {
  return (
    <g>
      <path d="M 14,90 Q 2,44 40,36 Q 72,30 62,54" stroke="#14532d" strokeWidth="13" fill="none" strokeLinecap="round" />
      <path d="M 14,90 Q 2,44 40,36 Q 72,30 62,54" stroke="url(#tool-green)" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M 16,86 Q 8,48 40,42" stroke="#86efac" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
      <g transform="rotate(20 70 52)">
        <rect x="56" y="44" width="30" height="14" rx="5" fill="url(#tool-rubber)" stroke="#18181b" strokeWidth="1.5" />
        <rect x="64" y="56" width="12" height="22" rx="4" fill="url(#tool-rubber)" stroke="#18181b" strokeWidth="1.5" />
        <rect x="84" y="46" width="8" height="10" rx="2" fill="url(#tool-steel)" stroke="#334155" strokeWidth="1.5" />
      </g>
      {[[92, 30, 4], [98, 42, 3.5], [90, 20, 3], [84, 12, 2.5], [96, 54, 3]].map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="#38bdf8" stroke="#0369a1" strokeWidth="1" />
      ))}
    </g>
  )
}

export function WrenchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <ToolDefs />
      <g transform="rotate(-35 50 50)">
        <WrenchArt />
      </g>
    </svg>
  )
}

export function HammerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <ToolDefs />
      <g transform="rotate(-40 50 50)">
        <HammerArt />
      </g>
    </svg>
  )
}

export function PumpIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <ToolDefs />
      <PumpArt />
    </svg>
  )
}

export function HoseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <ToolDefs />
      <HoseArt />
    </svg>
  )
}

/**
 * What the mechanic holds: grip at (0,0), business end along +x, sized for
 * the scene. The pump and hose become their hand-held ends (air chuck and
 * spray nozzle) because nobody swings a foot pump at a tyre.
 */
export function ToolInHand({ tool }: { tool: ToolId }) {
  if (tool === 'wrench') {
    return (
      <g transform="translate(-10 0) scale(0.42) translate(-14 -50)">
        <WrenchArt />
      </g>
    )
  }
  if (tool === 'hammer') {
    return (
      <g transform="translate(-8 0) scale(0.42) translate(-10 -50)">
        <HammerArt />
      </g>
    )
  }
  if (tool === 'pump') {
    return (
      <g>
        <path d="M -6,2 Q -18,10 -30,4" stroke="#18181b" strokeWidth="3.5" fill="none" strokeLinecap="round" />
        <rect x="-6" y="-3.5" width="20" height="7" rx="3" fill="url(#tool-rubber)" stroke="#18181b" strokeWidth="1" />
        <rect x="13" y="-2.5" width="8" height="5" rx="1.5" fill="url(#tool-steel)" stroke="#334155" strokeWidth="1" />
        <circle cx="4" cy="-8" r="4" fill="#fef3c7" stroke="#334155" strokeWidth="1.2" />
        <path d="M 4,-8 L 6,-10.5" stroke="#dc2626" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    )
  }
  return (
    <g>
      <path d="M -6,2 Q -20,12 -34,6" stroke="#14532d" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M -6,2 Q -20,12 -34,6" stroke="url(#tool-green)" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="-6" y="-3.5" width="20" height="7" rx="3" fill="url(#tool-rubber)" stroke="#18181b" strokeWidth="1" />
      <rect x="-2" y="3" width="6" height="9" rx="2" fill="url(#tool-rubber)" stroke="#18181b" strokeWidth="1" />
      <rect x="13" y="-2.5" width="6" height="5" rx="1.5" fill="url(#tool-steel)" stroke="#334155" strokeWidth="1" />
    </g>
  )
}

export { ToolDefs }

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

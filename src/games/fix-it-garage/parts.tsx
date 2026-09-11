import { motion } from 'framer-motion'

/**
 * Overlay parts drawn on top of the vehicle body (see vehicles.tsx), inside
 * the same shared 400x240 viewBox (see layout.ts). Each "problem" part has a
 * broken look and a fixed look; switching to the fixed look plays a small
 * one-time mount animation (the "fix" animation).
 */

const WHEEL_CX = 115
const WHEEL_CY = 175
const TIRE_CX = 285
const TIRE_CY = 175
const WHEEL_R = 29
const WS_POINTS = '150,56 245,56 286,116 92,116'
const BUMPER_X = 348
const BUMPER_Y = 150
const BUMPER_W = 24
const BUMPER_H = 50

/** Missing wheel (broken) <-> wheel spun on (fixed) — wrench. */
export function WheelPart({ ok }: { ok: boolean }) {
  if (!ok) {
    return (
      <g aria-hidden="true">
        <circle cx={WHEEL_CX} cy={WHEEL_CY} r={WHEEL_R} fill="none" stroke="#9ca3af" strokeWidth="4" strokeDasharray="8 7" />
      </g>
    )
  }
  return (
    <motion.g
      aria-hidden="true"
      initial={{ rotate: -520, scale: 0.3, opacity: 0 }}
      animate={{ rotate: 0, scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 110, damping: 14 }}
      style={{ transformOrigin: `${WHEEL_CX}px ${WHEEL_CY}px` }}
    >
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r={WHEEL_R} fill="#1f2937" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="12" fill="#d1d5db" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="4" fill="#4b5563" />
    </motion.g>
  )
}

/** Flat tire (broken) <-> tire inflated (fixed) — pump. */
export function TirePart({ ok }: { ok: boolean }) {
  if (!ok) {
    return (
      <g aria-hidden="true">
        <ellipse cx={TIRE_CX} cy="192" rx="33" ry="13" fill="#374151" />
        <ellipse cx={TIRE_CX} cy="192" rx="14" ry="5" fill="#9ca3af" />
      </g>
    )
  }
  return (
    <motion.g
      aria-hidden="true"
      initial={{ scaleY: 0.4, scaleX: 1.2, opacity: 0.6 }}
      animate={{ scaleY: 1, scaleX: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 12 }}
      style={{ transformOrigin: `${TIRE_CX}px 192px` }}
    >
      <circle cx={TIRE_CX} cy={TIRE_CY} r={WHEEL_R} fill="#1f2937" />
      <circle cx={TIRE_CX} cy={TIRE_CY} r="12" fill="#d1d5db" />
      <circle cx={TIRE_CX} cy={TIRE_CY} r="4" fill="#4b5563" />
    </motion.g>
  )
}

/** Dirty windshield (broken) <-> squeaky clean (fixed) — hose. */
export function WindshieldPart({ ok }: { ok: boolean }) {
  if (!ok) {
    return (
      <g aria-hidden="true">
        <polygon points={WS_POINTS} fill="#9ca3af" stroke="#6b7280" strokeWidth="3" />
        <path
          d="M120,90 L244,106 M132,108 L252,76"
          stroke="#6b7280"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.55"
        />
      </g>
    )
  }
  return (
    <motion.g aria-hidden="true" initial={{ opacity: 0.3 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <polygon points={WS_POINTS} fill="#bae6fd" stroke="#38bdf8" strokeWidth="3" />
      <motion.polygon
        points="150,56 178,56 204,116 176,116"
        fill="#ffffff"
        opacity="0.5"
        initial={{ x: -30 }}
        animate={{ x: 100 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </motion.g>
  )
}

/** Loose bumper (broken) <-> snapped in (fixed) — hammer. */
export function BumperPart({ ok }: { ok: boolean }) {
  if (!ok) {
    return (
      <g aria-hidden="true" transform={`rotate(22 ${BUMPER_X} ${BUMPER_Y + BUMPER_H})`}>
        <rect x={BUMPER_X} y={BUMPER_Y} width={BUMPER_W} height={BUMPER_H} rx="9" fill="#78716c" opacity="0.9" />
      </g>
    )
  }
  return (
    <motion.g
      aria-hidden="true"
      initial={{ x: 16, rotate: -14, opacity: 0.5 }}
      animate={{ x: 0, rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 480, damping: 13 }}
      style={{ transformOrigin: `${BUMPER_X + BUMPER_W / 2}px ${BUMPER_Y + BUMPER_H / 2}px` }}
    >
      <rect x={BUMPER_X} y={BUMPER_Y} width={BUMPER_W} height={BUMPER_H} rx="9" fill="#27272a" />
      <rect x={BUMPER_X + 2} y={BUMPER_Y + 34} width={BUMPER_W - 4} height="5" rx="2.5" fill="#dc2626" />
    </motion.g>
  )
}

/** Cosmetic customization parts — purely decorative, freely attached/removed. */
export type SpoilerColor = 'red' | 'blue'
export type FlagColor = 'yellow' | 'green'

export const SPOILER_FILL: Record<SpoilerColor, string> = { red: '#ef4444', blue: '#3b82f6' }
export const FLAG_FILL: Record<FlagColor, string> = { yellow: '#eab308', green: '#22c55e' }

export function SpoilerPart({ color }: { color: SpoilerColor }) {
  return (
    <motion.g
      aria-hidden="true"
      initial={{ scale: 0.3, opacity: 0, y: -10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 14 }}
      style={{ transformOrigin: '98px 40px' }}
    >
      {/* uprights planted into the hatch, tall at the rear, short at the roof join */}
      <path d="M84,56 L96,56 L106,86 L94,90 Z" fill={SPOILER_FILL[color]} />
      <path d="M128,56 L140,56 L142,62 L130,66 Z" fill={SPOILER_FILL[color]} />
      {/* wing blade sitting on the roof's trailing edge, cantilevered over the hatch */}
      <path d="M70,46 Q110,38 152,46 L152,58 Q110,50 70,58 Z" fill={SPOILER_FILL[color]} />
      <rect x="66" y="40" width="6" height="24" rx="2" fill={SPOILER_FILL[color]} />
      <rect x="150" y="40" width="6" height="24" rx="2" fill={SPOILER_FILL[color]} />
    </motion.g>
  )
}

export function FlagPart({ color }: { color: FlagColor }) {
  return (
    <motion.g
      aria-hidden="true"
      initial={{ scale: 0.3, opacity: 0, rotate: -20 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 14 }}
      style={{ transformOrigin: '195px 46px' }}
    >
      <rect x="192" y="6" width="5" height="42" fill="#78716c" />
      <path d="M197,9 L232,19 L197,31 Z" fill={FLAG_FILL[color]} />
    </motion.g>
  )
}

/** Small standalone previews used in the parts tray (self-contained, own viewBox). */
export function SpoilerIcon({ color, className }: { color: SpoilerColor; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M28,48 L40,48 L38,80 L26,80 Z" fill={SPOILER_FILL[color]} />
      <path d="M60,48 L72,48 L74,80 L62,80 Z" fill={SPOILER_FILL[color]} />
      <path d="M10,36 Q50,26 90,36 L90,48 Q50,38 10,48 Z" fill={SPOILER_FILL[color]} />
      <rect x="6" y="28" width="6" height="26" rx="2" fill={SPOILER_FILL[color]} />
      <rect x="88" y="28" width="6" height="26" rx="2" fill={SPOILER_FILL[color]} />
    </svg>
  )
}

export function FlagIcon({ color, className }: { color: FlagColor; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect x="45" y="10" width="7" height="70" fill="#78716c" />
      <path d="M52,14 L88,30 L52,46 Z" fill={FLAG_FILL[color]} />
    </svg>
  )
}

export type PartItemDef =
  | { id: 'spoiler-red'; kind: 'spoiler'; color: SpoilerColor; bg: string }
  | { id: 'spoiler-blue'; kind: 'spoiler'; color: SpoilerColor; bg: string }
  | { id: 'flag-yellow'; kind: 'flag'; color: FlagColor; bg: string }
  | { id: 'flag-green'; kind: 'flag'; color: FlagColor; bg: string }

export const PART_ITEMS: PartItemDef[] = [
  { id: 'spoiler-red', kind: 'spoiler', color: 'red', bg: '#fee2e2' },
  { id: 'spoiler-blue', kind: 'spoiler', color: 'blue', bg: '#dbeafe' },
  { id: 'flag-yellow', kind: 'flag', color: 'yellow', bg: '#fef9c3' },
  { id: 'flag-green', kind: 'flag', color: 'green', bg: '#dcfce7' },
]

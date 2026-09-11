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
const WS_POINTS = '150,58 250,58 268,118 132,118'
const BUMPER_X = 352
const BUMPER_Y = 156
const BUMPER_W = 38
const BUMPER_H = 24

/** Missing wheel (broken) <-> wheel spun on (fixed) — wrench. */
export function WheelPart({ ok }: { ok: boolean }) {
  if (!ok) {
    return (
      <g aria-hidden="true">
        <circle cx={WHEEL_CX} cy={WHEEL_CY} r="26" fill="none" stroke="#9ca3af" strokeWidth="4" strokeDasharray="8 7" />
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
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="26" fill="#1f2937" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="11" fill="#d1d5db" />
      <circle cx={WHEEL_CX} cy={WHEEL_CY} r="4" fill="#4b5563" />
    </motion.g>
  )
}

/** Flat tire (broken) <-> tire inflated (fixed) — pump. */
export function TirePart({ ok }: { ok: boolean }) {
  if (!ok) {
    return (
      <g aria-hidden="true">
        <ellipse cx={TIRE_CX} cy="193" rx="30" ry="12" fill="#374151" />
        <ellipse cx={TIRE_CX} cy="193" rx="13" ry="5" fill="#9ca3af" />
      </g>
    )
  }
  return (
    <motion.g
      aria-hidden="true"
      initial={{ scaleY: 0.4, scaleX: 1.2, opacity: 0.6 }}
      animate={{ scaleY: 1, scaleX: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 12 }}
      style={{ transformOrigin: `${TIRE_CX}px 193px` }}
    >
      <circle cx={TIRE_CX} cy={TIRE_CY} r="26" fill="#1f2937" />
      <circle cx={TIRE_CX} cy={TIRE_CY} r="11" fill="#d1d5db" />
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
          d="M148,78 L232,102 M158,98 L238,72"
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
        points="150,58 178,58 196,118 168,118"
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
      <g aria-hidden="true" transform={`rotate(10 ${BUMPER_X + BUMPER_W / 2} ${BUMPER_Y + BUMPER_H / 2})`}>
        <rect x={BUMPER_X} y={BUMPER_Y} width={BUMPER_W} height={BUMPER_H} rx="7" fill="#78716c" opacity="0.9" />
      </g>
    )
  }
  return (
    <motion.rect
      aria-hidden="true"
      y={BUMPER_Y}
      width={BUMPER_W}
      height={BUMPER_H}
      rx="7"
      fill="#292524"
      initial={{ x: BUMPER_X + 22, rotate: -16, opacity: 0.5 }}
      animate={{ x: BUMPER_X, rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 480, damping: 13 }}
      style={{ transformOrigin: `${BUMPER_X + BUMPER_W / 2}px ${BUMPER_Y + BUMPER_H / 2}px` }}
    />
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
      style={{ transformOrigin: '75px 45px' }}
    >
      {/* angled struts mounting the wing to the trunk */}
      <path d="M50,63 L58,38 L64,38 L59,63 Z" fill={SPOILER_FILL[color]} />
      <path d="M100,63 L92,38 L86,38 L91,63 Z" fill={SPOILER_FILL[color]} />
      {/* tapered aerodynamic wing blade */}
      <path d="M28,38 Q75,22 122,38 L122,46 Q75,32 28,46 Z" fill={SPOILER_FILL[color]} />
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
      style={{ transformOrigin: '195px 45px' }}
    >
      <rect x="192" y="5" width="5" height="42" fill="#78716c" />
      <path d="M197,8 L232,18 L197,30 Z" fill={FLAG_FILL[color]} />
    </motion.g>
  )
}

/** Small standalone previews used in the parts tray (self-contained, own viewBox). */
export function SpoilerIcon({ color, className }: { color: SpoilerColor; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M22,66 L30,40 L36,40 L30,66 Z" fill={SPOILER_FILL[color]} />
      <path d="M78,66 L70,40 L64,40 L70,66 Z" fill={SPOILER_FILL[color]} />
      <path d="M8,40 Q50,24 92,40 L92,49 Q50,35 8,49 Z" fill={SPOILER_FILL[color]} />
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

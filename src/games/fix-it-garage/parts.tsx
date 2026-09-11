import { motion } from 'framer-motion'
import {
  DECK_Y,
  FRONT_WHEEL_CX,
  GLASS_PATH,
  NOSE_X,
  REAR_WHEEL_CX,
  WHEEL_CY,
  WHEEL_R,
} from './layout'

/**
 * Overlay parts drawn on top of the vehicle body, positioned entirely from the
 * shared geometry in layout.ts. Each repairable part has a broken look and a
 * fixed look; switching to the fixed look plays a one-shot "fix" animation.
 */

const TYRE = '#18181b'
const ALLOY = '#52525b'
const ALLOY_DARK = '#3f3f46'
const CALIPER = '#dc2626'

/** Black multi-spoke alloy with a red brake caliper showing through. */
function Alloy({ cx, cy, r = WHEEL_R }: { cx: number; cy: number; r?: number }) {
  const spokes = Array.from({ length: 10 }, (_, i) => i * 36)
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={TYRE} />
      <circle cx={cx} cy={cy} r={r - 3} fill="#27272a" />
      <circle cx={cx} cy={cy} r={r - 9} fill={ALLOY_DARK} />
      {/* brake caliper behind the spokes */}
      <path
        d={`M ${cx - 15},${cy - 9} A 17 17 0 0 0 ${cx - 15},${cy + 9}`}
        stroke={CALIPER}
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      {spokes.map((angle) => (
        <rect
          key={angle}
          x={cx - 2}
          y={cy - (r - 11)}
          width="4"
          height={r - 18}
          rx="2"
          fill={ALLOY}
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      ))}
      <circle cx={cx} cy={cy} r="7" fill="#27272a" />
      <circle cx={cx} cy={cy} r="4" fill={CALIPER} />
    </g>
  )
}

/** Bare hub with wheel studs, shown when the wheel is off the car. */
function BareHub({ cx, cy }: { cx: number; cy: number }) {
  const studs = Array.from({ length: 5 }, (_, i) => i * 72)
  return (
    <g>
      <circle cx={cx} cy={cy} r="15" fill="#52525b" />
      <circle cx={cx} cy={cy} r="8" fill="#3f3f46" />
      {studs.map((angle) => (
        <circle
          key={angle}
          cx={cx}
          cy={cy - 11}
          r="2.6"
          fill="#d4d4d8"
          transform={`rotate(${angle} ${cx} ${cy})`}
        />
      ))}
    </g>
  )
}

/** Rear wheel: missing (broken) <-> bolted on and spun up (fixed) — wrench. */
export function WheelPart({ ok }: { ok: boolean }) {
  if (!ok) {
    return (
      <g aria-hidden="true">
        <BareHub cx={REAR_WHEEL_CX} cy={WHEEL_CY} />
      </g>
    )
  }
  return (
    <motion.g
      aria-hidden="true"
      initial={{ rotate: -520, scale: 0.3, opacity: 0 }}
      animate={{ rotate: 0, scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 110, damping: 14 }}
      style={{ transformOrigin: `${REAR_WHEEL_CX}px ${WHEEL_CY}px` }}
    >
      <Alloy cx={REAR_WHEEL_CX} cy={WHEEL_CY} />
    </motion.g>
  )
}

/** Front wheel: flat tyre (broken) <-> inflated (fixed) — pump. */
export function TirePart({ ok }: { ok: boolean }) {
  if (!ok) {
    const saggedCy = DECK_Y - 20
    return (
      <g aria-hidden="true">
        {/* squashed sidewall spreading onto the deck */}
        <ellipse cx={FRONT_WHEEL_CX} cy={DECK_Y - 13} rx={WHEEL_R + 6} ry="14" fill={TYRE} />
        <ellipse cx={FRONT_WHEEL_CX} cy={saggedCy} rx="21" ry="17" fill={ALLOY_DARK} />
        <circle cx={FRONT_WHEEL_CX} cy={saggedCy} r="5" fill={CALIPER} />
      </g>
    )
  }
  return (
    <motion.g
      aria-hidden="true"
      initial={{ scaleY: 0.45, scaleX: 1.15, opacity: 0.7 }}
      animate={{ scaleY: 1, scaleX: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 12 }}
      style={{ transformOrigin: `${FRONT_WHEEL_CX}px ${DECK_Y}px` }}
    >
      <Alloy cx={FRONT_WHEEL_CX} cy={WHEEL_CY} />
    </motion.g>
  )
}

/** Glazing: grimy (broken) <-> squeaky clean (fixed) — hose. */
export function WindshieldPart({ ok }: { ok: boolean }) {
  if (!ok) {
    return (
      <g aria-hidden="true">
        <path d={GLASS_PATH} fill="#a8a29e" stroke="#78716c" strokeWidth="2.5" />
        <path
          d="M 232,146 L 330,138 M 244,152 L 356,144 M 262,134 L 312,132"
          stroke="#78716c"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>
    )
  }
  return (
    <motion.g aria-hidden="true" initial={{ opacity: 0.35 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <path d={GLASS_PATH} fill="#bae6fd" stroke="#7dd3fc" strokeWidth="2.5" />
      {/* B-pillar splitting the glass into door windows */}
      <path d="M 288,128 L 288,155" stroke="#e0f2fe" strokeWidth="3" />
      <motion.polygon
        points="218,152 250,128 268,128 236,152"
        fill="#ffffff"
        opacity="0.55"
        initial={{ x: -40 }}
        animate={{ x: 165 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      />
    </motion.g>
  )
}

/** Front bumper: hanging loose (broken) <-> snapped back on (fixed) — hammer. */
export function BumperPart({ ok }: { ok: boolean }) {
  // Hinged at the top inner corner so a loose bumper dangles off the nose
  // instead of drifting away from the car as a free-floating slab.
  const PIVOT_X = 452
  const PIVOT_Y = 186

  const bumper = (
    <>
      <path
        d={`M ${PIVOT_X},${PIVOT_Y} L ${NOSE_X - 2},192 C ${NOSE_X + 2},202 ${NOSE_X - 2},212 480,216 L ${PIVOT_X},216 Z`}
        fill="#27272a"
      />
      {/* mesh lower grille */}
      <path d="M 458,198 L 486,203 M 458,206 L 483,211" stroke="#52525b" strokeWidth="3" strokeLinecap="round" />
      {/* red splitter lip */}
      <path d={`M 456,213 L 482,216`} stroke={CALIPER} strokeWidth="3" strokeLinecap="round" />
    </>
  )

  if (!ok) {
    return (
      <g aria-hidden="true" transform={`rotate(10 ${PIVOT_X} ${PIVOT_Y})`} opacity="0.95">
        {bumper}
      </g>
    )
  }
  return (
    <motion.g
      aria-hidden="true"
      initial={{ rotate: 14, opacity: 0.6 }}
      animate={{ rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 460, damping: 13 }}
      style={{ transformOrigin: `${PIVOT_X}px ${PIVOT_Y}px` }}
    >
      {bumper}
    </motion.g>
  )
}

/** Cosmetic add-ons — freely attached and removed, never right or wrong. */
export type WingColor = 'red' | 'blue'
export type DecalColor = 'yellow' | 'green'

export const WING_FILL: Record<WingColor, string> = { red: '#dc2626', blue: '#2563eb' }
export const DECAL_FILL: Record<DecalColor, string> = { yellow: '#eab308', green: '#16a34a' }

/** Big rear wing on tall uprights, planted on the tailgate. */
export function WingPart({ color }: { color: WingColor }) {
  return (
    <motion.g
      aria-hidden="true"
      initial={{ scale: 0.4, opacity: 0, y: -12 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 14 }}
      style={{ transformOrigin: '192px 104px' }}
    >
      {/* uprights down onto the tailgate */}
      <path d="M 148,102 L 160,102 L 156,168 L 142,170 Z" fill={WING_FILL[color]} />
      <path d="M 222,102 L 234,102 L 232,148 L 218,152 Z" fill={WING_FILL[color]} />
      {/* blade + end plates */}
      <path d="M 118,90 Q 192,82 262,90 L 262,102 Q 192,94 118,102 Z" fill={WING_FILL[color]} />
      <rect x="112" y="82" width="8" height="28" rx="3" fill={WING_FILL[color]} />
      <rect x="260" y="82" width="8" height="28" rx="3" fill={WING_FILL[color]} />
    </motion.g>
  )
}

/** Racing roundel on the door. */
export function DecalPart({ color }: { color: DecalColor }) {
  return (
    <motion.g
      aria-hidden="true"
      initial={{ scale: 0.3, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 14 }}
      style={{ transformOrigin: '318px 188px' }}
    >
      <circle cx="318" cy="188" r="19" fill="#f8fafc" stroke={DECAL_FILL[color]} strokeWidth="5" />
      <text
        x="318"
        y="196"
        textAnchor="middle"
        fontSize="22"
        fontWeight="900"
        fill={DECAL_FILL[color]}
        fontFamily="inherit"
      >
        1
      </text>
    </motion.g>
  )
}

/** Tray previews, drawn in their own square viewBox. */
export function WingIcon({ color, className }: { color: WingColor; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M 30,46 L 42,46 L 40,82 L 26,82 Z" fill={WING_FILL[color]} />
      <path d="M 62,46 L 74,46 L 76,82 L 62,82 Z" fill={WING_FILL[color]} />
      <path d="M 10,28 Q 50,18 90,28 L 90,42 Q 50,32 10,42 Z" fill={WING_FILL[color]} />
      <rect x="6" y="20" width="7" height="30" rx="3" fill={WING_FILL[color]} />
      <rect x="88" y="20" width="7" height="30" rx="3" fill={WING_FILL[color]} />
    </svg>
  )
}

export function DecalIcon({ color, className }: { color: DecalColor; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="34" fill="#f8fafc" stroke={DECAL_FILL[color]} strokeWidth="9" />
      <text x="50" y="65" textAnchor="middle" fontSize="42" fontWeight="900" fill={DECAL_FILL[color]}>
        1
      </text>
    </svg>
  )
}

export type PartItemDef =
  | { id: 'wing-red'; kind: 'wing'; color: WingColor; bg: string }
  | { id: 'wing-blue'; kind: 'wing'; color: WingColor; bg: string }
  | { id: 'decal-yellow'; kind: 'decal'; color: DecalColor; bg: string }
  | { id: 'decal-green'; kind: 'decal'; color: DecalColor; bg: string }

export const PART_ITEMS: PartItemDef[] = [
  { id: 'wing-red', kind: 'wing', color: 'red', bg: '#fee2e2' },
  { id: 'wing-blue', kind: 'wing', color: 'blue', bg: '#dbeafe' },
  { id: 'decal-yellow', kind: 'decal', color: 'yellow', bg: '#fef9c3' },
  { id: 'decal-green', kind: 'decal', color: 'green', bg: '#dcfce7' },
]

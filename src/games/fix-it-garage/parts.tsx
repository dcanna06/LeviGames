import { motion } from 'framer-motion'
import {
  DECK_Y,
  FLOOR_Y,
  FRONT_WHEEL_CX,
  GLASS_PATH,
  HATCH_X,
  HATCH_Y,
  NOSE_X,
  REAR_WHEEL_CX,
  WHEEL_CY,
  WHEEL_R,
} from './layout'

/**
 * Overlay parts drawn on top of the vehicle body, positioned entirely from the
 * shared geometry in layout.ts. Each repairable part has a broken look and a
 * fixed look. Switching to the fixed look plays a one-shot animation built on
 * anticipation → overshoot → settle, and every broken part carries a small
 * procedural idle (a dangling bumper sways, a flat tyre sags) so the damage
 * reads at a glance.
 */

/** How the wheels should be turning: driving out, rolling in, or parked. */
export type Spin = 'none' | 'out' | 'in'

const SPIN_TRANSITION = {
  out: { duration: 0.75, ease: 'easeIn' as const },
  in: { duration: 0.8, ease: 'easeOut' as const },
  none: { duration: 0 },
}

/** Brake disc and red caliper. Fixed to the hub, so it never spins. */
function Brake({ cx, cy }: { cx: number; cy: number }) {
  const holes = Array.from({ length: 8 }, (_, i) => i * 45)
  return (
    <g>
      <circle cx={cx} cy={cy} r="18" fill="url(#fg-rotor)" stroke="#3f3f46" strokeWidth="1" />
      <circle cx={cx} cy={cy} r="12" fill="none" stroke="#71717a" strokeWidth="0.8" opacity="0.7" />
      {holes.map((a) => (
        <circle key={a} cx={cx} cy={cy - 14.5} r="1.1" fill="#3f3f46" transform={`rotate(${a} ${cx} ${cy})`} />
      ))}
      <circle cx={cx} cy={cy} r="7" fill="#52525b" stroke="#27272a" strokeWidth="1" />
      {/* red four-pot caliper gripping the disc at 9 o'clock */}
      <path
        d={`M ${cx - 20},${cy - 12} A 22 22 0 0 0 ${cx - 20},${cy + 12} L ${cx - 12},${cy + 9} A 15 15 0 0 1 ${cx - 12},${cy - 9} Z`}
        fill="url(#fg-red)"
        stroke="#7f1d1d"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      <path d={`M ${cx - 17},${cy - 6} L ${cx - 17},${cy + 6}`} stroke="#fecaca" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
    </g>
  )
}

/** 19" Y-spoke alloy on a low-profile tyre. Tyre and spokes spin; the brake doesn't. */
function Alloy({ cx, cy, spin = 'none' }: { cx: number; cy: number; spin?: Spin }) {
  const r = WHEEL_R
  const spokes = Array.from({ length: 5 }, (_, i) => i * 72 - 90)
  const spinInitial = spin === 'in' ? { rotate: -1080 } : false
  const spinAnimate = spin === 'out' ? { rotate: 1080 } : { rotate: 0 }
  const origin = { transformOrigin: `${cx}px ${cy}px` }

  return (
    <g>
      {/* tyre: rubber gradient, sidewall ring, tread blocks around the edge */}
      <motion.g initial={spinInitial} animate={spinAnimate} transition={SPIN_TRANSITION[spin]} style={origin}>
        <circle cx={cx} cy={cy} r={r} fill="url(#fg-tyre)" />
        <circle cx={cx} cy={cy} r={r - 1.5} fill="none" stroke="#000000" strokeWidth="2.2" strokeDasharray="3 3.4" opacity="0.7" />
        <circle cx={cx} cy={cy} r={r - 5} fill="none" stroke="#3a3a41" strokeWidth="0.8" opacity="0.8" />
      </motion.g>
      {/* rim barrel (dark) and the rotor seen through the spokes */}
      <circle cx={cx} cy={cy} r={r - 8} fill="url(#fg-alloy)" stroke="#18181b" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r - 11} fill="#141417" />
      <Brake cx={cx} cy={cy} />
      <motion.g initial={spinInitial} animate={spinAnimate} transition={SPIN_TRANSITION[spin]} style={origin}>
        {spokes.map((a) => (
          <g key={a} transform={`rotate(${a} ${cx} ${cy})`}>
            <path
              d={`M ${cx - 2.6},${cy - 6} L ${cx - 4.2},${cy - (r - 10)} L ${cx + 0.4},${cy - (r - 10)} L ${cx + 1.4},${cy - 6} Z`}
              fill="url(#fg-spoke)"
              stroke="#27272a"
              strokeWidth="0.6"
              transform={`rotate(-10 ${cx} ${cy})`}
            />
            <path
              d={`M ${cx - 1.4},${cy - 6} L ${cx - 0.4},${cy - (r - 10)} L ${cx + 4.2},${cy - (r - 10)} L ${cx + 2.6},${cy - 6} Z`}
              fill="url(#fg-spoke)"
              stroke="#27272a"
              strokeWidth="0.6"
              transform={`rotate(10 ${cx} ${cy})`}
            />
          </g>
        ))}
        {/* outer rim lip catching the light */}
        <circle cx={cx} cy={cy} r={r - 8.5} fill="none" stroke="#c4c4cc" strokeWidth="1.4" opacity="0.9" />
        <path d={`M ${cx - 16},${cy - 18} A 24 24 0 0 1 ${cx + 4},${cy - 24}`} stroke="#ffffff" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.8" />
        {/* centre cap with the red H dot */}
        <circle cx={cx} cy={cy} r="5.5" fill="#1f1f24" stroke="#8a8a93" strokeWidth="1" />
        <circle cx={cx} cy={cy} r="2" fill="#ef4444" />
      </motion.g>
    </g>
  )
}

/** Rear wheel: off the car (broken) <-> bolted on and spun up (fixed) — wrench. */
export function WheelPart({ ok, spin = 'none' }: { ok: boolean; spin?: Spin }) {
  if (!ok) {
    return (
      <g aria-hidden="true">
        <Brake cx={REAR_WHEEL_CX} cy={WHEEL_CY} />
        {/* hub with five studs, waiting for the wheel */}
        {Array.from({ length: 5 }, (_, i) => i * 72).map((a) => (
          <circle key={a} cx={REAR_WHEEL_CX} cy={WHEEL_CY - 11} r="2" fill="#e4e4e7" stroke="#52525b" strokeWidth="0.6" transform={`rotate(${a} ${REAR_WHEEL_CX} ${WHEEL_CY})`} />
        ))}
        {/* lug nuts dropped on the runway */}
        {[REAR_WHEEL_CX + 40, REAR_WHEEL_CX + 49, REAR_WHEEL_CX + 57].map((x, i) => (
          <path
            key={x}
            d={`M ${x},${DECK_Y - 5} l 2.8,1.6 v 3.2 l -2.8,1.6 l -2.8,-1.6 v -3.2 Z`}
            fill="#d4d4d8"
            stroke="#52525b"
            strokeWidth="0.7"
            transform={`rotate(${i * 25} ${x} ${DECK_Y - 2})`}
          />
        ))}
      </g>
    )
  }
  return (
    <motion.g
      aria-hidden="true"
      initial={{ rotate: -400, scale: 0.5, opacity: 0, x: -24 }}
      animate={{ rotate: 0, scale: 1, opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 150, damping: 13 }}
      style={{ transformOrigin: `${REAR_WHEEL_CX}px ${WHEEL_CY}px` }}
    >
      <Alloy cx={REAR_WHEEL_CX} cy={WHEEL_CY} spin={spin} />
    </motion.g>
  )
}

/** The removed wheel, leaning against the tool chest until it goes back on. */
export function SpareWheel() {
  return (
    <motion.g
      aria-hidden="true"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      transform={`rotate(-12 50 ${FLOOR_Y - 30})`}
    >
      <ellipse cx="50" cy={FLOOR_Y - 2} rx="26" ry="4" fill="#000000" opacity="0.3" />
      <g transform={`translate(50 ${FLOOR_Y - 32}) scale(0.9) translate(-50 ${-(FLOOR_Y - 32)})`}>
        <Alloy cx={50} cy={FLOOR_Y - 32} />
      </g>
    </motion.g>
  )
}

/** Front wheel: flat tyre (broken) <-> inflated (fixed) — pump. */
export function TirePart({ ok, spin = 'none' }: { ok: boolean; spin?: Spin }) {
  const cx = FRONT_WHEEL_CX
  if (!ok) {
    const cy = DECK_Y - 22
    return (
      <motion.g
        aria-hidden="true"
        animate={{ scaleY: [1, 0.985, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${cx}px ${DECK_Y}px` }}
      >
        {/* sidewall spreading onto the runway */}
        <ellipse cx={cx} cy={DECK_Y - 12} rx={WHEEL_R + 9} ry="13" fill="url(#fg-tyre)" />
        <ellipse cx={cx} cy={DECK_Y - 9} rx={WHEEL_R + 6} ry="6" fill="#000000" opacity="0.45" />
        <ellipse cx={cx} cy={cy} rx="26" ry="20" fill="url(#fg-tyre)" />
        <ellipse cx={cx} cy={cy} rx="19" ry="14" fill="url(#fg-alloy)" stroke="#18181b" strokeWidth="1" />
        <ellipse cx={cx} cy={cy} rx="12" ry="9" fill="#141417" />
        <ellipse cx={cx} cy={cy} rx="6" ry="4.5" fill="#ef4444" />
        {/* the nail that did it */}
        <path d={`M ${cx + 24},${DECK_Y - 20} L ${cx + 34},${DECK_Y - 30}`} stroke="#94a3b8" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx={cx + 34} cy={DECK_Y - 30} r="2.4" fill="#cbd5e1" stroke="#475569" strokeWidth="0.8" />
      </motion.g>
    )
  }
  return (
    <motion.g
      aria-hidden="true"
      initial={{ scaleY: 0.55, scaleX: 1.2 }}
      animate={{ scaleY: [0.55, 1.14, 0.95, 1.03, 1], scaleX: [1.2, 0.92, 1.04, 0.99, 1] }}
      transition={{ duration: 0.8, times: [0, 0.35, 0.6, 0.82, 1], ease: 'easeOut' }}
      style={{ transformOrigin: `${cx}px ${DECK_Y}px` }}
    >
      <Alloy cx={cx} cy={WHEEL_CY} spin={spin} />
    </motion.g>
  )
}

/** Glazing: grimy (broken) <-> squeaky clean (fixed) — hose. */
export function WindshieldPart({ ok, glassPath = GLASS_PATH }: { ok: boolean; glassPath?: string }) {
  if (!ok) {
    return (
      <g aria-hidden="true">
        <path d={glassPath} fill="url(#fg-glass-dirty)" stroke="#5c5142" strokeWidth="1.5" />
        <clipPath id="fg-glass-clip">
          <path d={glassPath} />
        </clipPath>
        <g clipPath="url(#fg-glass-clip)">
          {/* mud splats and drips */}
          <path d="M 262,132 c 6,-6 14,-4 16,2 c 6,0 8,8 2,10 c -2,8 -14,6 -16,0 c -6,-2 -6,-10 -2,-12 Z" fill="#6b5b45" />
          <path d="M 270,142 L 271,164" stroke="#6b5b45" strokeWidth="3" strokeLinecap="round" />
          <path d="M 336,134 c 8,-6 18,0 14,8 c 6,4 0,12 -8,8 c -8,4 -14,-4 -10,-10 c -2,-4 0,-6 4,-6 Z" fill="#7a6a52" />
          <path d="M 342,150 L 344,166" stroke="#7a6a52" strokeWidth="3" strokeLinecap="round" />
          <path d="M 300,150 c 4,-4 10,-2 10,2 c 4,2 2,8 -4,6 c -6,4 -12,-2 -6,-8 Z" fill="#5c4d3a" />
          {/* a bird has been by */}
          <path d="M 308,128 c 4,-3 9,0 7,4 c 3,2 1,6 -3,5 c -4,3 -9,-1 -5,-5 c -2,-2 -1,-4 1,-4 Z" fill="#f5f5f4" />
          <path d="M 310,136 L 311,146" stroke="#f5f5f4" strokeWidth="2" strokeLinecap="round" />
          {/* dust speckles */}
          {[[236, 150], [250, 140], [286, 134], [322, 154], [360, 152], [374, 156], [244, 156]].map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" fill="#4a4034" opacity="0.7" />
          ))}
        </g>
      </g>
    )
  }
  return (
    <g aria-hidden="true">
      <path d={glassPath} fill="url(#fg-glass)" stroke="#e0f2fe" strokeWidth="1.2" />
      <clipPath id="fg-glass-clip-ok">
        <path d={glassPath} />
      </clipPath>
      <g clipPath="url(#fg-glass-clip-ok)">
        {/* wiper-blade sweep of clean glass */}
        <motion.rect
          x="196"
          y="118"
          width="22"
          height="50"
          fill="#ffffff"
          opacity="0.75"
          initial={{ x: 0, skewX: -20 }}
          animate={{ x: 210, skewX: -20 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />
        {/* standing reflection highlight */}
        <path d="M 246,130 L 262,127 L 236,158 L 222,158 Z" fill="#ffffff" opacity="0.5" />
        <path d="M 270,127 L 278,127 L 254,158 L 246,158 Z" fill="#ffffff" opacity="0.3" />
      </g>
    </g>
  )
}

/** Front bumper: hanging loose (broken) <-> snapped back on (fixed) — hammer. */
export function BumperPart({ ok }: { ok: boolean }) {
  // Hinged at the top inner corner so a loose bumper dangles off the nose
  // instead of drifting away from the car as a free-floating slab.
  const PIVOT_X = 452
  const PIVOT_Y = 191

  const bumper = (
    <>
      <path
        d={`M ${PIVOT_X},${PIVOT_Y} L ${NOSE_X},194 C ${NOSE_X + 1},202 ${NOSE_X - 2},212 482,217 L ${PIVOT_X},217 Z`}
        fill="url(#fg-aero)"
        stroke="#09090b"
        strokeWidth="1"
        strokeLinejoin="round"
      />
      {/* honeycomb intake */}
      <path d={`M 462,196 L ${NOSE_X - 4},198 L ${NOSE_X - 5},209 L 470,211 Z`} fill="#09090b" />
      <path d={`M 462,196 L ${NOSE_X - 4},198 L ${NOSE_X - 5},209 L 470,211 Z`} fill="url(#fg-mesh)" />
      {/* splitter lip with a red edge */}
      <path d={`M 456,213 L 486,214`} stroke="#3f3f46" strokeWidth="3" strokeLinecap="round" />
      <path d={`M 458,216 L 484,217`} stroke="#ef4444" strokeWidth="1.6" strokeLinecap="round" />
      <path d={`M ${PIVOT_X + 4},${PIVOT_Y + 2} L 488,195`} stroke="#71717a" strokeWidth="1" opacity="0.7" strokeLinecap="round" />
    </>
  )

  if (!ok) {
    return (
      <motion.g
        aria-hidden="true"
        animate={{ rotate: [12, 16, 12] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${PIVOT_X}px ${PIVOT_Y}px` }}
      >
        {/* the bracket it's hanging from */}
        <rect x={PIVOT_X - 3} y={PIVOT_Y - 4} width="6" height="8" rx="1.5" fill="#94a3b8" stroke="#334155" strokeWidth="0.8" />
        {bumper}
      </motion.g>
    )
  }
  return (
    <motion.g
      aria-hidden="true"
      initial={{ rotate: 16 }}
      animate={{ rotate: [16, -4, 2, 0] }}
      transition={{ duration: 0.5, times: [0, 0.45, 0.75, 1], ease: 'easeOut' }}
      style={{ transformOrigin: `${PIVOT_X}px ${PIVOT_Y}px` }}
    >
      {bumper}
    </motion.g>
  )
}

/** Cosmetic add-ons — freely attached and removed, never right or wrong. */
export type WingColor = 'red' | 'blue'
export type DecalColor = 'yellow' | 'green'

export const WING_FILL: Record<WingColor, string> = { red: 'url(#fg-red)', blue: 'url(#fg-blue)' }
export const DECAL_FILL: Record<DecalColor, string> = { yellow: '#eab308', green: '#16a34a' }
const WING_EDGE: Record<WingColor, string> = { red: '#7f1d1d', blue: '#1e3a8a' }

/** Big rear wing on swan-neck uprights, planted on the tailgate. */
export function WingPart({ color }: { color: WingColor }) {
  const x0 = HATCH_X
  const y0 = HATCH_Y
  return (
    <motion.g
      aria-hidden="true"
      initial={{ scale: 0.4, opacity: 0, y: -18 }}
      animate={{ scale: [0.4, 1.08, 0.97, 1], opacity: 1, y: 0 }}
      transition={{ duration: 0.5, times: [0, 0.5, 0.8, 1], ease: 'easeOut' }}
      style={{ transformOrigin: `${x0 + 12}px ${y0 - 40}px` }}
    >
      {/* uprights down onto the tailgate */}
      <path d={`M ${x0 - 12},${y0 - 44} L ${x0},${y0 - 44} L ${x0 - 4},${y0 + 2} L ${x0 - 16},${y0 + 4} Z`} fill={WING_FILL[color]} stroke={WING_EDGE[color]} strokeWidth="1" />
      <path d={`M ${x0 + 22},${y0 - 44} L ${x0 + 34},${y0 - 44} L ${x0 + 34},${y0 - 6} L ${x0 + 22},${y0 - 4} Z`} fill={WING_FILL[color]} stroke={WING_EDGE[color]} strokeWidth="1" />
      {/* blade */}
      <path
        d={`M ${x0 - 58},${y0 - 56} Q ${x0 + 12},${y0 - 64} ${x0 + 82},${y0 - 56} L ${x0 + 82},${y0 - 44} Q ${x0 + 12},${y0 - 52} ${x0 - 58},${y0 - 44} Z`}
        fill={WING_FILL[color]}
        stroke={WING_EDGE[color]}
        strokeWidth="1"
      />
      <path d={`M ${x0 - 50},${y0 - 55} Q ${x0 + 12},${y0 - 61} ${x0 + 74},${y0 - 55}`} stroke="#ffffff" strokeWidth="1.6" fill="none" opacity="0.7" strokeLinecap="round" />
      {/* end plates */}
      <rect x={x0 - 64} y={y0 - 64} width="7" height="30" rx="2.5" fill={WING_FILL[color]} stroke={WING_EDGE[color]} strokeWidth="1" />
      <rect x={x0 + 81} y={y0 - 64} width="7" height="30" rx="2.5" fill={WING_FILL[color]} stroke={WING_EDGE[color]} strokeWidth="1" />
    </motion.g>
  )
}

/** Racing roundel on the rear door. */
export function DecalPart({ color }: { color: DecalColor }) {
  return (
    <motion.g
      aria-hidden="true"
      initial={{ scale: 0.3, opacity: 0 }}
      animate={{ scale: [0.3, 1.15, 0.95, 1], opacity: 1 }}
      transition={{ duration: 0.45, times: [0, 0.5, 0.8, 1], ease: 'easeOut' }}
      style={{ transformOrigin: '318px 188px' }}
    >
      <circle cx="318" cy="189" r="20" fill="#000000" opacity="0.15" />
      <circle cx="318" cy="188" r="19" fill="#f8fafc" stroke={DECAL_FILL[color]} strokeWidth="5" />
      <circle cx="318" cy="188" r="15" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.8" />
      <text x="318" y="196" textAnchor="middle" fontSize="22" fontWeight="900" fill={DECAL_FILL[color]} fontFamily="inherit">
        1
      </text>
    </motion.g>
  )
}

/** Tray previews, drawn in their own square viewBox with local gradients. */
function IconGradient({ id, color }: { id: string; color: WingColor }) {
  const stops = color === 'red' ? ['#f87171', '#dc2626', '#991b1b'] : ['#60a5fa', '#2563eb', '#1e3a8a']
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={stops[0]} />
        <stop offset="0.5" stopColor={stops[1]} />
        <stop offset="1" stopColor={stops[2]} />
      </linearGradient>
    </defs>
  )
}

export function WingIcon({ color, className }: { color: WingColor; className?: string }) {
  const id = `wing-icon-${color}`
  const fill = `url(#${id})`
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <IconGradient id={id} color={color} />
      <path d="M 30,46 L 42,46 L 40,82 L 26,82 Z" fill={fill} stroke={WING_EDGE[color]} strokeWidth="1.5" />
      <path d="M 62,46 L 74,46 L 76,82 L 62,82 Z" fill={fill} stroke={WING_EDGE[color]} strokeWidth="1.5" />
      <path d="M 10,28 Q 50,16 90,28 L 90,42 Q 50,30 10,42 Z" fill={fill} stroke={WING_EDGE[color]} strokeWidth="1.5" />
      <path d="M 16,28 Q 50,19 84,28" stroke="#ffffff" strokeWidth="2.5" fill="none" opacity="0.7" strokeLinecap="round" />
      <rect x="5" y="18" width="8" height="32" rx="3" fill={fill} stroke={WING_EDGE[color]} strokeWidth="1.5" />
      <rect x="87" y="18" width="8" height="32" rx="3" fill={fill} stroke={WING_EDGE[color]} strokeWidth="1.5" />
    </svg>
  )
}

export function DecalIcon({ color, className }: { color: DecalColor; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="52" r="36" fill="#000000" opacity="0.15" />
      <circle cx="50" cy="50" r="34" fill="#f8fafc" stroke={DECAL_FILL[color]} strokeWidth="9" />
      <circle cx="50" cy="50" r="27" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.8" />
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

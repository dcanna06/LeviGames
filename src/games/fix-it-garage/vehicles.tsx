import type { ReactElement } from 'react'
import {
  ARCH_CTRL_Y,
  ARCH_HALF_W,
  DECK_Y,
  FRONT_WHEEL_CX,
  NOSE_X,
  REAR_WHEEL_CX,
  ROCKER_Y,
  TAIL_X,
  VIEW_H,
  VIEW_W,
} from './layout'

/**
 * Vehicle bodies, all drawn against the shared coordinate system in layout.ts
 * so the wheels, glazing and bumper overlays line up on every one of them.
 */

export type VehicleType = 'car' | 'truck' | 'digger'

export const VEHICLE_TYPES: VehicleType[] = ['car', 'truck', 'digger']

const WHITE = '#f8fafc'
const WHITE_EDGE = '#cbd5e1'
const AERO = '#18181b'
const TYPE_R_RED = '#dc2626'

/** One wheel arch, apex raised clear of the tyre. */
function arch(cx: number): string {
  const left = cx - ARCH_HALF_W
  const right = cx + ARCH_HALF_W
  return `L ${left},${ROCKER_Y} C ${left},${ARCH_CTRL_Y} ${right},${ARCH_CTRL_Y} ${right},${ROCKER_Y}`
}

/**
 * The dark inside of each wheel arch. Drawn under the wheels so that a missing
 * wheel reveals a believable empty well rather than a hole in the bodywork.
 */
function ArchVoids() {
  return (
    <g aria-hidden="true">
      {[REAR_WHEEL_CX, FRONT_WHEEL_CX].map((cx) => (
        <path
          key={cx}
          d={`M ${cx - ARCH_HALF_W},${DECK_Y} L ${cx - ARCH_HALF_W},${ROCKER_Y - 18} C ${cx - ARCH_HALF_W},${
            ARCH_CTRL_Y - 8
          } ${cx + ARCH_HALF_W},${ARCH_CTRL_Y - 8} ${cx + ARCH_HALF_W},${ROCKER_Y - 18} L ${cx + ARCH_HALF_W},${DECK_Y} Z`}
          fill="#27272a"
        />
      ))}
    </g>
  )
}

/** Championship White hot hatch, nose to the right. */
export function CarBody() {
  const shell =
    `M ${TAIL_X},194` +
    ` C ${TAIL_X},206 130,${ROCKER_Y} 142,${ROCKER_Y}` +
    arch(REAR_WHEEL_CX) +
    arch(FRONT_WHEEL_CX) +
    ` L 470,${ROCKER_Y}` +
    ` C 484,${ROCKER_Y} ${NOSE_X},208 ${NOSE_X},198` +
    ` L ${NOSE_X},180` +
    ` C 478,172 432,166 398,162` +
    ` C 386,146 364,124 340,120` +
    ` L 258,120` +
    ` C 246,130 218,150 194,162` +
    ` L 142,174` +
    ` L 128,184` +
    ` C 122,185 ${TAIL_X},189 ${TAIL_X},194 Z`

  return (
    <g aria-hidden="true">
      <ArchVoids />
      <path d={shell} fill={WHITE} stroke={WHITE_EDGE} strokeWidth="2" strokeLinejoin="round" />

      {/* shoulder crease running the length of the flanks */}
      <path d="M 150,176 L 300,182 L 468,186" stroke="#e2e8f0" strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* side skirt with the Type R red pinstripe */}
      <path d={`M 232,206 L 378,206 L 374,${ROCKER_Y} L 236,${ROCKER_Y} Z`} fill={AERO} />
      <path d="M 238,212 L 372,212" stroke={TYPE_R_RED} strokeWidth="2.5" strokeLinecap="round" />

      {/* rear diffuser and the centre triple exhaust */}
      <path d={`M ${TAIL_X},192 L 156,196 L 152,${ROCKER_Y} L 126,${ROCKER_Y} Z`} fill={AERO} />
      <circle cx="132" cy="200" r="4" fill="#71717a" />
      <circle cx="143" cy="201" r="5" fill="#71717a" />
      <circle cx="154" cy="202" r="4" fill="#71717a" />

      {/* doors */}
      <path d="M 276,158 L 276,206" stroke="#cbd5e1" strokeWidth="2.5" />
      <path d="M 358,162 L 358,206" stroke="#cbd5e1" strokeWidth="2.5" />
      <rect x="286" y="174" width="18" height="5" rx="2.5" fill="#94a3b8" />
      <rect x="368" y="177" width="18" height="5" rx="2.5" fill="#94a3b8" />

      {/* bonnet vent */}
      <path d="M 418,168 L 450,173 L 448,178 L 416,173 Z" fill="#3f3f46" />

      {/* swept headlamp wrapping the front wing */}
      <path d="M 442,171 L 484,178 L 486,188 L 446,182 Z" fill="#e0f2fe" stroke="#475569" strokeWidth="2" />
      <path d="M 448,176 L 480,182" stroke="#38bdf8" strokeWidth="3.5" strokeLinecap="round" />

      {/* tail lamp bar across the rear panel */}
      <path d="M 134,186 L 178,175" stroke={TYPE_R_RED} strokeWidth="7" strokeLinecap="round" />

      {/* TYPE R badge on the tailgate */}
      <rect x="146" y="194" width="24" height="7" rx="3" fill={TYPE_R_RED} />
    </g>
  )
}

/** Boxy delivery truck sharing the same wheelbase and glazing. */
export function TruckBody() {
  const shell =
    `M ${TAIL_X},150` +
    ` L ${TAIL_X},${ROCKER_Y}` +
    ` L 142,${ROCKER_Y}` +
    arch(REAR_WHEEL_CX) +
    arch(FRONT_WHEEL_CX) +
    ` L 470,${ROCKER_Y}` +
    ` C 484,${ROCKER_Y} ${NOSE_X},206 ${NOSE_X},196` +
    ` L ${NOSE_X},172` +
    ` L 404,157` +
    ` L 352,117` +
    ` L 268,117` +
    ` L 268,150 Z`

  return (
    <g aria-hidden="true">
      <ArchVoids />
      {/* cargo box */}
      <rect x={TAIL_X} y="96" width="150" height="119" rx="6" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
      <rect x={TAIL_X + 12} y="112" width="126" height="60" rx="4" fill="#2563eb" />
      <path d={shell} fill="#60a5fa" stroke="#1d4ed8" strokeWidth="2" strokeLinejoin="round" />
      <path d={`M 236,206 L 378,206 L 374,${ROCKER_Y} L 240,${ROCKER_Y} Z`} fill={AERO} />
      <path d="M 448,160 L 484,168 L 484,178 L 446,170 Z" fill="#fde68a" stroke="#475569" strokeWidth="2" />
      <rect x="300" y="168" width="18" height="5" rx="2.5" fill="#1e3a8a" />
    </g>
  )
}

/** Yellow digger: same running gear, plus a boom and bucket. */
export function DiggerBody() {
  const shell =
    `M ${TAIL_X},156` +
    ` L ${TAIL_X},${ROCKER_Y}` +
    ` L 142,${ROCKER_Y}` +
    arch(REAR_WHEEL_CX) +
    arch(FRONT_WHEEL_CX) +
    ` L 470,${ROCKER_Y}` +
    ` C 484,${ROCKER_Y} ${NOSE_X},206 ${NOSE_X},196` +
    ` L ${NOSE_X},174` +
    ` L 404,157` +
    ` L 352,117` +
    ` L 268,117` +
    ` L 268,156 Z`

  return (
    <g aria-hidden="true">
      <ArchVoids />
      <path d={shell} fill="#facc15" stroke="#a16207" strokeWidth="2" strokeLinejoin="round" />
      <rect x={TAIL_X} y="120" width="146" height="96" rx="8" fill="#eab308" stroke="#a16207" strokeWidth="2" />
      {/* boom and bucket reaching forward over the bonnet */}
      <path d="M 198,132 L 300,86 L 318,104 L 224,150 Z" fill="#ca8a04" stroke="#a16207" strokeWidth="2" />
      <path d="M 300,86 L 352,104 L 338,132 L 306,116 Z" fill="#a16207" stroke="#78350f" strokeWidth="2" />
      <path d={`M 236,206 L 378,206 L 374,${ROCKER_Y} L 240,${ROCKER_Y} Z`} fill={AERO} />
      <path d="M 450,162 L 484,170 L 484,180 L 448,172 Z" fill="#fde68a" stroke="#475569" strokeWidth="2" />
    </g>
  )
}

export const VEHICLE_BODIES: Record<VehicleType, () => ReactElement> = {
  car: CarBody,
  truck: TruckBody,
  digger: DiggerBody,
}

/** Two-post lift, shop floor and back wall behind the whole scene. */
export function GarageBackdrop() {
  return (
    <g aria-hidden="true">
      <rect x="0" y="0" width={VIEW_W} height={DECK_Y} fill="#fff7ed" />
      {/* back wall panel lines */}
      <path d="M 0,150 L 520,150" stroke="#fed7aa" strokeWidth="3" />
      <path d="M 90,0 L 90,150 M 300,0 L 300,150 M 440,0 L 440,150" stroke="#ffedd5" strokeWidth="4" />
      {/* hanging work lamp over the engine bay */}
      <path d="M 440,0 L 440,54" stroke="#a8a29e" strokeWidth="3" />
      <path d="M 420,54 L 460,54 L 452,74 L 428,74 Z" fill="#78716c" />
      <ellipse cx="440" cy="74" rx="12" ry="5" fill="#fde68a" />
      <path d="M 428,78 L 414,140 L 466,140 L 452,78 Z" fill="#fef3c7" opacity="0.55" />
      {/* floor */}
      <rect x="0" y={DECK_Y} width={VIEW_W} height={VIEW_H - DECK_Y} fill="#e7e5e4" />
      <path d={`M 0,${DECK_Y} L ${VIEW_W},${DECK_Y}`} stroke="#d6d3d1" strokeWidth="3" />
      {/* lift deck the car rests on */}
      <rect x="108" y={DECK_Y} width="400" height="12" rx="4" fill="#94a3b8" />
      <rect x="150" y={DECK_Y + 12} width="24" height="14" rx="3" fill="#64748b" />
      <rect x="430" y={DECK_Y + 12} width="24" height="14" rx="3" fill="#64748b" />
    </g>
  )
}

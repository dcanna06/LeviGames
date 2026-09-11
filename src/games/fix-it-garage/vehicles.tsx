/**
 * Simple flat vehicle silhouettes. Each body is drawn as an SVG <g> meant to
 * be placed inside the shared 400x240 viewBox (see layout.ts) alongside the
 * overlay parts (wheels, windshield, bumper) which are drawn on top by the
 * caller so they line up the same way on every vehicle.
 */
import type { ReactElement } from 'react'

export type VehicleType = 'car' | 'truck' | 'digger'

export const VEHICLE_TYPES: VehicleType[] = ['car', 'truck', 'digger']

/** The platform the vehicle sits on, drawn behind everything else. */
export function LiftStand() {
  return (
    <g aria-hidden="true">
      <rect x="35" y="212" width="330" height="16" rx="7" fill="#94a3b8" />
      <rect x="68" y="228" width="20" height="10" rx="2" fill="#64748b" />
      <rect x="312" y="228" width="20" height="10" rx="2" fill="#64748b" />
    </g>
  )
}

/**
 * The cab silhouette is deliberately traced just outside the windshield
 * overlay's own trapezoid (see WS_POINTS in parts.tsx: 150,58 250,58 268,118
 * 132,118) so the WindshieldPart problem/fix graphic sits framed inside a
 * real roofline instead of floating disconnected above the body.
 */
const CAB_OUTLINE = 'M110,155 L124,120 L140,48 L260,48 L276,120 L290,155 Z'

/** Dark arch liners behind the wheel positions; also reads as an empty well when a wheel is missing. */
function WheelWells() {
  return (
    <>
      <circle cx="115" cy="175" r="31" fill="#3f3f46" />
      <circle cx="285" cy="175" r="31" fill="#3f3f46" />
    </>
  )
}

/** Championship-white hot hatch, nose to the right: fastback roof, long low hood, dark skirts, red splitter line. */
export function CarBody() {
  return (
    <g aria-hidden="true">
      <path
        d="M62,196 L58,176 L62,150 L74,118 L100,78 Q118,50 150,46 L245,46 Q262,46 272,60 L292,118 L300,124 L345,140 Q360,145 362,160 L362,182 Q362,196 350,200 L330,206 L74,206 Q62,206 62,196 Z"
        fill="#f4f4f5"
        stroke="#d4d4d8"
        strokeWidth="2"
      />
      {/* black side skirt + red splitter pinstripe */}
      <path d="M62,196 Q62,206 74,206 L330,206 L350,200 L354,192 L70,192 Z" fill="#27272a" />
      <path d="M74,204 L332,204" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
      {/* rear diffuser + triple exhaust */}
      <path d="M58,186 L92,186 L88,200 L58,200 Z" fill="#18181b" />
      <circle cx="66" cy="193" r="3.5" fill="#52525b" />
      <circle cx="76" cy="193" r="3.5" fill="#52525b" />
      <circle cx="86" cy="193" r="3.5" fill="#52525b" />
      {/* tail light */}
      <path d="M62,150 L74,118 L82,122 L70,152 Z" fill="#dc2626" />
      {/* door shutline + handle */}
      <line x1="200" y1="120" x2="200" y2="192" stroke="#a1a1aa" strokeWidth="3" />
      <rect x="206" y="138" width="16" height="5" rx="2.5" fill="#71717a" />
      {/* hood vent */}
      <path d="M310,131 L336,140 L334,145 L308,136 Z" fill="#27272a" />
      {/* angular headlamp */}
      <path d="M340,146 L362,154 L362,163 L338,156 Z" fill="#e0f2fe" stroke="#3f3f46" strokeWidth="2" />
      <WheelWells />
    </g>
  )
}

export function TruckBody() {
  return (
    <g aria-hidden="true">
      <rect x="55" y="155" width="300" height="50" rx="10" fill="#3b82f6" />
      <rect x="55" y="86" width="300" height="70" rx="10" fill="#2563eb" />
      <path d={CAB_OUTLINE} fill="#1d4ed8" />
      <circle cx="343" cy="172" r="7" fill="#fde68a" />
      <WheelWells />
    </g>
  )
}

export function DiggerBody() {
  return (
    <g aria-hidden="true">
      <rect x="55" y="160" width="300" height="46" rx="10" fill="#eab308" />
      <rect x="55" y="90" width="300" height="70" rx="10" fill="#ca8a04" />
      <path d={CAB_OUTLINE} fill="#a16207" />
      <path d="M248,112 L326,74 L356,92 L296,132 Z" fill="#a16207" />
      <path d="M352,82 L382,96 L366,122 L340,106 Z" fill="#78350f" />
      <circle cx="343" cy="172" r="7" fill="#fde68a" />
      <WheelWells />
    </g>
  )
}

export const VEHICLE_BODIES: Record<VehicleType, () => ReactElement> = {
  car: CarBody,
  truck: TruckBody,
  digger: DiggerBody,
}

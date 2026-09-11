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

export function CarBody() {
  return (
    <g aria-hidden="true">
      <rect x="55" y="155" width="300" height="50" rx="18" fill="#ef4444" />
      <path d={CAB_OUTLINE} fill="#dc2626" />
      <line x1="200" y1="155" x2="200" y2="48" stroke="#7f1d1d" strokeWidth="4" opacity="0.5" />
      <circle cx="343" cy="172" r="7" fill="#fde68a" />
      <rect x="60" y="188" width="22" height="11" rx="4" fill="#7f1d1d" opacity="0.6" />
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
    </g>
  )
}

export const VEHICLE_BODIES: Record<VehicleType, () => ReactElement> = {
  car: CarBody,
  truck: TruckBody,
  digger: DiggerBody,
}

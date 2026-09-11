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

export function CarBody() {
  return (
    <g aria-hidden="true">
      <rect x="55" y="150" width="300" height="55" rx="24" fill="#ef4444" />
      <path
        d="M128,150 L158,96 Q168,88 182,88 L248,88 Q262,88 272,96 L302,150 Z"
        fill="#dc2626"
      />
      <circle cx="352" cy="170" r="8" fill="#fde68a" />
      <rect x="65" y="188" width="20" height="10" rx="3" fill="#7f1d1d" opacity="0.7" />
    </g>
  )
}

export function TruckBody() {
  return (
    <g aria-hidden="true">
      <rect x="55" y="150" width="300" height="55" rx="16" fill="#3b82f6" />
      <rect x="118" y="86" width="150" height="66" rx="12" fill="#2563eb" />
      <rect x="60" y="122" width="46" height="28" rx="6" fill="#1d4ed8" />
      <circle cx="352" cy="170" r="8" fill="#fde68a" />
    </g>
  )
}

export function DiggerBody() {
  return (
    <g aria-hidden="true">
      <rect x="55" y="160" width="300" height="46" rx="14" fill="#eab308" />
      <rect x="118" y="92" width="150" height="68" rx="14" fill="#ca8a04" />
      <path d="M248,112 L326,74 L356,92 L296,132 Z" fill="#a16207" />
      <path d="M352,82 L382,96 L366,122 L340,106 Z" fill="#78350f" />
      <circle cx="352" cy="170" r="8" fill="#fde68a" />
    </g>
  )
}

export const VEHICLE_BODIES: Record<VehicleType, () => ReactElement> = {
  car: CarBody,
  truck: TruckBody,
  digger: DiggerBody,
}

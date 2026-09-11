import type { CSSProperties } from 'react'

/**
 * Single source of truth for the garage scene.
 *
 * Every vehicle body, overlay part, cosmetic accessory and drag-and-drop hit
 * zone is derived from the constants below. Earlier revisions hardcoded each
 * piece's coordinates independently, which let the artwork and the drop zones
 * drift apart (a windshield floating above the roofline, a wing mounted in mid
 * air). Deriving everything from one set of numbers makes that impossible.
 */
export const VIEW_W = 520
export const VIEW_H = 270

/** Shop floor the mechanic stands on, and the lift deck the car sits on. */
export const FLOOR_Y = 252
export const DECK_Y = 234

/**
 * Hot-hatch proportions: overall length is roughly 3x overall height, the
 * wheels are large relative to the body, and the roof is low.
 */
export const WHEEL_R = 33
export const WHEEL_CY = DECK_Y - WHEEL_R
export const REAR_WHEEL_CX = 190
export const FRONT_WHEEL_CX = 420

export const TAIL_X = 124
export const NOSE_X = 492
export const ROCKER_Y = 215
export const ROOF_Y = 120
export const ROOF_FRONT_X = 340
export const ROOF_REAR_X = 258
export const COWL_X = 400
export const COWL_Y = 163
export const HATCH_X = 192
export const HATCH_Y = 158

/** Wheel arch openings, as cubic control points (apex clears the tyre). */
export const ARCH_HALF_W = 36
export const ARCH_CTRL_Y = 140

/**
 * Greenhouse glazing. Traced as a path that follows the same curved C-pillar
 * and raked windscreen as the body shell, inset a few pixels, so the glass can
 * never poke outside the roofline the way a straight-edged polygon did.
 */
export const GLASS_PATH =
  'M 206,157 C 226,146 242,132 260,126 L 336,126 C 354,133 372,146 384,157 Z'

export type ProblemKey = 'wheel' | 'tire' | 'windshield' | 'bumper'
export const ALL_PROBLEMS: ProblemKey[] = ['wheel', 'tire', 'windshield', 'bumper']

/** Cosmetic add-ons: a rear wing and a racing door roundel. */
export type AccessoryKey = 'wing' | 'decal'

export type ZoneKey = ProblemKey | AccessoryKey

export type ZoneBox = { left: number; top: number; width: number; height: number }

function zone(x: number, y: number, w: number, h: number): ZoneBox {
  return {
    left: (x / VIEW_W) * 100,
    top: (y / VIEW_H) * 100,
    width: (w / VIEW_W) * 100,
    height: (h / VIEW_H) * 100,
  }
}

/** Generous drop targets, centred on the part each one repairs or holds. */
export const ZONES: Record<ZoneKey, ZoneBox> = {
  wheel: zone(REAR_WHEEL_CX - 62, WHEEL_CY - 62, 124, 118),
  tire: zone(FRONT_WHEEL_CX - 62, WHEEL_CY - 62, 124, 118),
  windshield: zone(190, 118, 216, 60),
  bumper: zone(NOSE_X - 46, 160, 78, 66),
  wing: zone(110, 78, 166, 88),
  decal: zone(276, 162, 100, 54),
}

export function zoneStyle(box: ZoneBox): CSSProperties {
  return {
    left: `${box.left}%`,
    top: `${box.top}%`,
    width: `${box.width}%`,
    height: `${box.height}%`,
  }
}

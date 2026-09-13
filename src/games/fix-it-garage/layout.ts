import type { CSSProperties } from 'react'

/**
 * Single source of truth for the garage scene.
 *
 * Every vehicle body, overlay part, cosmetic accessory, effect burst and
 * drag-and-drop hit zone is derived from the constants below. Earlier
 * revisions hardcoded each piece's coordinates independently, which let the
 * artwork and the drop zones drift apart (a windshield floating above the
 * roofline, a wing mounted in mid air). Deriving everything from one set of
 * numbers makes that impossible.
 */
export const VIEW_W = 520
export const VIEW_H = 270

/** Shop floor the mechanic stands on, and the lift deck the car sits on. */
export const FLOOR_Y = 252
export const DECK_Y = 234

/**
 * FL5 Civic Type R side-view proportions: overall length ≈ 3.3× height,
 * wheelbase ≈ 60% of length, 19" wheels, cab-forward greenhouse with a long
 * raked windscreen and a fastback hatch.
 */
export const WHEEL_R = 33
export const WHEEL_CY = DECK_Y - WHEEL_R
export const REAR_WHEEL_CX = 190
export const FRONT_WHEEL_CX = 420

export const TAIL_X = 124
export const NOSE_X = 494
export const ROCKER_Y = 215
export const ROOF_Y = 119
export const ROOF_FRONT_X = 338
export const ROOF_REAR_X = 252
export const COWL_X = 398
export const COWL_Y = 162
/** Top of the tailgate, where the rear wing bolts on. */
export const HATCH_X = 168
export const HATCH_Y = 150

/** Wheel arch openings, as cubic control points (apex clears the tyre). */
export const ARCH_HALF_W = 37
export const ARCH_CTRL_Y = 138

/**
 * Side glazing (the daylight opening). Traced as a path that follows the same
 * curved pillars as the body shell, inset a few pixels, so the glass can never
 * poke outside the roofline.
 */
export const GLASS_PATH =
  'M 216,159 C 230,146 244,131 258,126 L 334,126 C 352,132 372,146 388,160 Z'

/** Where the mechanic stands when nothing needs doing. */
export const MECHANIC_HOME_X = 86

export type ProblemKey = 'wheel' | 'tire' | 'windshield' | 'bumper'
export const ALL_PROBLEMS: ProblemKey[] = ['wheel', 'tire', 'windshield', 'bumper']

/** Cosmetic add-ons: a rear wing and a racing door roundel. */
export type AccessoryKey = 'wing' | 'decal'

export type ZoneKey = ProblemKey | AccessoryKey

export type ZoneBox = { left: number; top: number; width: number; height: number }

type Rect = { x: number; y: number; w: number; h: number }

/** Drop targets in scene units, centred on the part each one repairs or holds. */
const ZONE_RECTS: Record<ZoneKey, Rect> = {
  wheel: { x: REAR_WHEEL_CX - 62, y: WHEEL_CY - 62, w: 124, h: 118 },
  tire: { x: FRONT_WHEEL_CX - 62, y: WHEEL_CY - 62, w: 124, h: 118 },
  windshield: { x: 200, y: 118, w: 200, h: 60 },
  bumper: { x: NOSE_X - 48, y: 160, w: 78, h: 66 },
  wing: { x: 92, y: 74, w: 160, h: 86 },
  decal: { x: 276, y: 162, w: 100, h: 54 },
}

function toBox({ x, y, w, h }: Rect): ZoneBox {
  return {
    left: (x / VIEW_W) * 100,
    top: (y / VIEW_H) * 100,
    width: (w / VIEW_W) * 100,
    height: (h / VIEW_H) * 100,
  }
}

/** Generous drop targets as percentages of the scene box (for HTML overlays). */
export const ZONES: Record<ZoneKey, ZoneBox> = {
  wheel: toBox(ZONE_RECTS.wheel),
  tire: toBox(ZONE_RECTS.tire),
  windshield: toBox(ZONE_RECTS.windshield),
  bumper: toBox(ZONE_RECTS.bumper),
  wing: toBox(ZONE_RECTS.wing),
  decal: toBox(ZONE_RECTS.decal),
}

/** The point in scene units where effects burst and the mechanic aims. */
export const ANCHORS: Record<ZoneKey, { x: number; y: number }> = {
  wheel: { x: REAR_WHEEL_CX, y: WHEEL_CY },
  tire: { x: FRONT_WHEEL_CX, y: WHEEL_CY },
  windshield: { x: 300, y: 143 },
  bumper: { x: NOSE_X - 14, y: 200 },
  wing: { x: HATCH_X + 12, y: 102 },
  decal: { x: 318, y: 188 },
}

export function zoneStyle(box: ZoneBox): CSSProperties {
  return {
    left: `${box.left}%`,
    top: `${box.top}%`,
    width: `${box.width}%`,
    height: `${box.height}%`,
  }
}

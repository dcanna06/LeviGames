import type { CSSProperties } from 'react'

/**
 * Shared coordinate system for the vehicle stage. Every vehicle body and
 * overlay part is drawn against this single viewBox so problem zones line
 * up the same way no matter which vehicle is currently shown.
 */
export const VIEW_W = 400
export const VIEW_H = 240

/** The four fixable problems. Kept intentionally to just these — the spec's
 * "hood popped open" idea has no matching tool/sound defined, so it's
 * skipped in favor of the four clearly-specified tool<->problem pairs. */
export type ProblemKey = 'wheel' | 'tire' | 'windshield' | 'bumper'
export const ALL_PROBLEMS: ProblemKey[] = ['wheel', 'tire', 'windshield', 'bumper']

export type ZoneKey = ProblemKey | 'spoiler' | 'flag'

export type ZoneBox = { left: number; top: number; width: number; height: number }

/** Converts a generous pixel-space hit box (in viewBox units) to percentages,
 * so it can be positioned identically regardless of the rendered size. */
function zone(x: number, y: number, w: number, h: number): ZoneBox {
  return {
    left: (x / VIEW_W) * 100,
    top: (y / VIEW_H) * 100,
    width: (w / VIEW_W) * 100,
    height: (h / VIEW_H) * 100,
  }
}

/** Generous drop-target zones (bigger than the drawn shapes) for the
 * forgiving drag-and-drop hit test. */
export const ZONES: Record<ZoneKey, ZoneBox> = {
  wheel: zone(50, 120, 130, 110),
  tire: zone(220, 120, 130, 110),
  windshield: zone(100, 15, 200, 120),
  bumper: zone(325, 115, 75, 95),
  spoiler: zone(10, 0, 130, 80),
  flag: zone(145, 0, 110, 60),
}

export function zoneStyle(box: ZoneBox): CSSProperties {
  return {
    left: `${box.left}%`,
    top: `${box.top}%`,
    width: `${box.width}%`,
    height: `${box.height}%`,
  }
}

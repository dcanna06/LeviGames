import { motion } from 'framer-motion'
import { FLOOR_Y, FRONT_WHEEL_CX, REAR_WHEEL_CX, TAIL_X, VIEW_W } from './layout'
import type { ToolId } from './tools'

/**
 * One-shot particle bursts, the "juice" layer. Every burst is a group of
 * motion elements that animate only transform and opacity (compositor
 * friendly on iPad), run once, and are unmounted by the game after they end.
 *
 * Kinds map to what just happened: a tool landing on its part, a cosmetic
 * part clicking on or popping off, exhaust when the engine revs, tyre smoke
 * when it launches, and dust when a fresh vehicle lands on the lift.
 */
export type BurstKind = ToolId | 'attach' | 'pop' | 'exhaust' | 'launch' | 'land'

export type BurstDef = { id: number; kind: BurstKind; x: number; y: number }

/** How long the game should keep a burst mounted, per kind. */
export const BURST_LIFETIME: Record<BurstKind, number> = {
  wrench: 900,
  pump: 900,
  hose: 1100,
  hammer: 900,
  attach: 800,
  pop: 600,
  exhaust: 900,
  launch: 900,
  land: 900,
}

const GOLD = '#fbbf24'

/** Deterministic spread so a burst looks the same every time it replays. */
function ring(count: number, radius: number, phase = 0) {
  return Array.from({ length: count }, (_, i) => {
    const a = phase + (i / count) * Math.PI * 2
    return { dx: Math.cos(a) * radius, dy: Math.sin(a) * radius, i }
  })
}

function starPoints(spikes: number, outer: number, inner: number): string {
  const pts: string[] = []
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2
    pts.push(`${(Math.cos(a) * r).toFixed(2)},${(Math.sin(a) * r).toFixed(2)}`)
  }
  return pts.join(' ')
}

const SPARKLE = 'M 0,-9 Q 1.6,-1.6 9,0 Q 1.6,1.6 0,9 Q -1.6,1.6 -9,0 Q -1.6,-1.6 0,-9 Z'
const IMPACT = starPoints(8, 30, 14)

function Sparks() {
  return (
    <g>
      {ring(12, 46, 0.3).map(({ dx, dy, i }) => (
        <motion.circle
          key={i}
          r={i % 3 === 0 ? 3 : 2}
          fill={i % 2 === 0 ? GOLD : '#fef08a'}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: [0, dx, dx * 1.1], y: [0, dy * 0.7, dy + 26], opacity: [1, 1, 0], scale: [1, 1, 0.2] }}
          transition={{ duration: 0.75, times: [0, 0.45, 1], ease: 'easeOut', delay: i * 0.01 }}
        />
      ))}
      {/* hex nuts spinning off */}
      {ring(3, 34, 3.6).map(({ dx, dy, i }) => (
        <motion.path
          key={`nut-${i}`}
          d="M 0,-5 l 4.3,2.5 v 5 l -4.3,2.5 l -4.3,-2.5 v -5 Z"
          fill="#d4d4d8"
          stroke="#52525b"
          strokeWidth="1"
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: dx, y: [0, dy - 20, dy + 30], rotate: 540, opacity: [1, 1, 0] }}
          transition={{ duration: 0.85, times: [0, 0.4, 1], ease: 'easeOut' }}
        />
      ))}
      <motion.circle
        r="18"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4"
        initial={{ scale: 0.2, opacity: 0.9 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
    </g>
  )
}

function AirRings() {
  return (
    <g>
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={i}
          r="16"
          fill="none"
          stroke="#ffffff"
          strokeWidth="3.5"
          initial={{ scale: 0.2, opacity: 0.95 }}
          animate={{ scale: 2.6, opacity: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.14 }}
        />
      ))}
      {/* whooshing air lines */}
      {[-26, 0, 26].map((dy, i) => (
        <motion.path
          key={dy}
          d={`M -40,${dy} q 10,-6 20,0 t 20,0 t 20,0`}
          fill="none"
          stroke="#e0f2fe"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ x: -30, opacity: 0 }}
          animate={{ x: 40, opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.08 }}
        />
      ))}
    </g>
  )
}

function Splash() {
  return (
    <g>
      {ring(14, 52, 0.2).map(({ dx, dy, i }) => (
        <motion.circle
          key={i}
          r={i % 2 === 0 ? 3 : 2.2}
          fill="#7dd3fc"
          stroke="#0284c7"
          strokeWidth="0.8"
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: dx, y: [0, dy * 0.6, dy + 34], opacity: [1, 1, 0] }}
          transition={{ duration: 0.85, times: [0, 0.4, 1], ease: 'easeOut', delay: i * 0.015 }}
        />
      ))}
      {/* squeaky-clean sparkles, staggered */}
      {[
        [-40, -14],
        [0, -22],
        [36, -10],
        [-16, 12],
        [22, 14],
      ].map(([x, y], i) => (
        <motion.path
          key={i}
          d={SPARKLE}
          fill="#ffffff"
          stroke="#bae6fd"
          strokeWidth="1"
          style={{ x, y }}
          initial={{ scale: 0, rotate: 0, opacity: 0 }}
          animate={{ scale: [0, 1.3, 0], rotate: 90, opacity: [0, 1, 0] }}
          transition={{ duration: 0.6, delay: 0.25 + i * 0.1, ease: 'easeInOut' }}
        />
      ))}
    </g>
  )
}

function Impact() {
  return (
    <g>
      <motion.polygon
        points={IMPACT}
        fill={GOLD}
        stroke="#f97316"
        strokeWidth="2.5"
        strokeLinejoin="round"
        initial={{ scale: 0, rotate: -20, opacity: 1 }}
        animate={{ scale: [0, 1.25, 1, 0], rotate: 10, opacity: [1, 1, 1, 0] }}
        transition={{ duration: 0.55, times: [0, 0.3, 0.7, 1], ease: 'easeOut' }}
      />
      {ring(8, 1, 0.4).map(({ dx, dy, i }) => (
        <motion.line
          key={i}
          x1={dx * 22}
          y1={dy * 22}
          x2={dx * 38}
          y2={dy * 38}
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          initial={{ scale: 0.4, opacity: 1 }}
          animate={{ scale: 1.6, opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        />
      ))}
      {/* dust kicked up */}
      {[-30, -10, 12, 30].map((dx, i) => (
        <motion.circle
          key={dx}
          r="7"
          fill="#d6d3d1"
          initial={{ x: 0, y: 10, scale: 0.3, opacity: 0.8 }}
          animate={{ x: dx * 1.4, y: 24 - i * 3, scale: 1.8, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.05 }}
        />
      ))}
    </g>
  )
}

function Sparkles({ tone }: { tone: 'gold' | 'grey' }) {
  const fill = tone === 'gold' ? '#fde68a' : '#e4e4e7'
  return (
    <g>
      {ring(6, 30, 0.5).map(({ dx, dy, i }) => (
        <motion.path
          key={i}
          d={SPARKLE}
          fill={fill}
          stroke={tone === 'gold' ? '#f59e0b' : '#a1a1aa'}
          strokeWidth="1"
          initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
          animate={{ x: dx, y: dy, scale: [0, 1.1, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.65, delay: i * 0.05, ease: 'easeOut' }}
        />
      ))}
    </g>
  )
}

/** Puffs of exhaust or tyre smoke drifting in `dir` (−1 = left, +1 = right). */
function Puffs({ dir, count, tone }: { dir: 1 | -1; count: number; tone: string }) {
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <motion.circle
          key={i}
          r="7"
          fill={tone}
          initial={{ x: 0, y: 0, scale: 0.3, opacity: 0.85 }}
          animate={{ x: dir * (30 + i * 16), y: -8 - i * 5, scale: 2.2 + i * 0.3, opacity: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut', delay: i * 0.09 }}
        />
      ))}
    </g>
  )
}

export function Burst({ kind, x, y }: BurstDef) {
  let body
  switch (kind) {
    case 'wrench':
      body = <Sparks />
      break
    case 'pump':
      body = <AirRings />
      break
    case 'hose':
      body = <Splash />
      break
    case 'hammer':
      body = <Impact />
      break
    case 'attach':
      body = <Sparkles tone="gold" />
      break
    case 'pop':
      body = <Sparkles tone="grey" />
      break
    case 'exhaust':
      body = <Puffs dir={-1} count={4} tone="#a8a29e" />
      break
    case 'launch':
      body = (
        <g>
          <g transform={`translate(${REAR_WHEEL_CX - x} 0)`}>
            <Puffs dir={-1} count={5} tone="#e7e5e4" />
          </g>
          <g transform={`translate(${FRONT_WHEEL_CX - x} 0)`}>
            <Puffs dir={-1} count={3} tone="#e7e5e4" />
          </g>
          {/* speed lines streaking off the tail */}
          {[-22, -8, 6].map((dy, i) => (
            <motion.line
              key={dy}
              x1={TAIL_X - x - 10}
              y1={dy - 24}
              x2={TAIL_X - x - 50}
              y2={dy - 24}
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: -80, opacity: [0, 0.9, 0] }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.06, ease: 'easeOut' }}
            />
          ))}
        </g>
      )
      break
    case 'land':
      body = (
        <g>
          <g transform={`translate(${REAR_WHEEL_CX - x} 0)`}>
            <Puffs dir={-1} count={3} tone="#d6d3d1" />
            <Puffs dir={1} count={3} tone="#d6d3d1" />
          </g>
          <g transform={`translate(${FRONT_WHEEL_CX - x} 0)`}>
            <Puffs dir={-1} count={3} tone="#d6d3d1" />
            <Puffs dir={1} count={3} tone="#d6d3d1" />
          </g>
        </g>
      )
      break
  }
  return (
    <g aria-hidden="true" transform={`translate(${x} ${y})`}>
      {body}
    </g>
  )
}

/** Where the scene-wide bursts originate. */
export const BURST_ORIGINS = {
  exhaust: { x: TAIL_X - 4, y: 206 },
  launch: { x: VIEW_W / 2, y: FLOOR_Y - 20 },
  land: { x: VIEW_W / 2, y: FLOOR_Y - 20 },
}

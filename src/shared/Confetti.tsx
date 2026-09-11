import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type Particle = {
  id: number
  angle: number
  distance: number
  size: number
  color: string
  rotate: number
  delay: number
  shape: 'circle' | 'square'
}

const COLORS = ['#fb7185', '#fbbf24', '#4ade80', '#60a5fa', '#c084fc', '#f472b6', '#34d399']

type ConfettiProps = {
  /** Increment this number to fire a new burst. */
  trigger: number
  /** Burst origin as a percentage of the viewport/container, default center. */
  origin?: { x: number; y: number }
  /** Number of particles — bigger celebrations can use more. */
  particleCount?: number
  /** Fixed to the viewport (default) or absolute within a relatively-positioned parent. */
  fixed?: boolean
}

/** Celebration overlay used across every game for consistent positive feedback. */
export function Confetti({ trigger, origin = { x: 50, y: 50 }, particleCount = 24, fixed = true }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const nextId = useRef(0)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const batch: Particle[] = Array.from({ length: particleCount }, () => ({
      id: nextId.current++,
      angle: Math.random() * Math.PI * 2,
      distance: 60 + Math.random() * 120,
      size: 8 + Math.random() * 10,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotate: Math.random() * 360,
      delay: Math.random() * 0.15,
      shape: Math.random() > 0.5 ? 'circle' : 'square',
    }))
    setParticles(batch)
    const timeout = setTimeout(() => setParticles([]), 1300)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger])

  return (
    <div
      className={`${fixed ? 'fixed' : 'absolute'} inset-0 pointer-events-none overflow-hidden z-50`}
      aria-hidden="true"
    >
      <AnimatePresence>
        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.4, rotate: 0 }}
            animate={{
              x: Math.cos(p.angle) * p.distance,
              y: Math.sin(p.angle) * p.distance + 60,
              opacity: 0,
              scale: 1,
              rotate: p.rotate,
            }}
            transition={{ duration: 1.1, delay: p.delay, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              left: `${origin.x}%`,
              top: `${origin.y}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.shape === 'circle' ? '9999px' : '3px',
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

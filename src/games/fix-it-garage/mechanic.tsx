import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FLOOR_Y, MECHANIC_HOME_X } from './layout'
import { ToolInHand, type ToolId } from './tools'

/**
 * The mechanic. She waits by the tool chest with her spanner, and whenever a
 * repair lands she walks to that part, aims the matching tool at it and works
 * it over before strolling back. The figure is drawn in local coordinates
 * with the feet at the origin and the whole body facing +x (towards the car);
 * the game only moves the group and tells it where to aim.
 */

export type MechanicJob = { id: number; tool: ToolId; x: number; y: number }

const WALK_MS = 460
const REACH = 46
const SHOULDER = { x: 12, y: -76 }
const IDLE_ARM_ANGLE = 38

const SKIN_SHADE = '#c98d5a'
const HAIR = '#3b2417'
const BOOT = '#3b2314'
const CAP = 'url(#fg-red)'

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n))
}

export function Mechanic({ job }: { job: MechanicJob | null }) {
  const standX = job ? job.x - REACH : MECHANIC_HOME_X
  const [walking, setWalking] = useState(false)

  // Leg swing only while the group is actually travelling.
  useEffect(() => {
    setWalking(true)
    const t = setTimeout(() => setWalking(false), WALK_MS)
    return () => clearTimeout(t)
  }, [standX])

  const aim = job
    ? clamp((Math.atan2(job.y - (FLOOR_Y + SHOULDER.y), job.x - (standX + SHOULDER.x)) * 180) / Math.PI, -70, 80)
    : IDLE_ARM_ANGLE
  const tool: ToolId = job ? job.tool : 'wrench'

  const armAnimate = job
    ? { rotate: [aim - 16, aim + 6, aim - 14, aim + 4, aim - 12, aim + 2, aim] }
    : { rotate: aim }
  const armTransition = job
    ? { duration: 1.05, delay: WALK_MS / 1000, ease: 'easeInOut' as const }
    : { type: 'spring' as const, stiffness: 120, damping: 12 }

  const legSwing = (phase: 1 | -1) =>
    walking
      ? { rotate: [0, 22 * phase, 0, -22 * phase, 0] }
      : { rotate: 0 }
  const legTransition = walking ? { duration: 0.42, repeat: Infinity, ease: 'easeInOut' as const } : { duration: 0.2 }

  return (
    <motion.g
      aria-hidden="true"
      initial={false}
      animate={{ x: standX }}
      transition={{ duration: WALK_MS / 1000, ease: 'easeInOut' }}
    >
      <g transform={`translate(0 ${FLOOR_Y})`}>
        <ellipse cx="2" cy="0" rx="26" ry="5" fill="#000000" opacity="0.28" />

        {/* body bob: breathing when idle, a bounce when walking */}
        <motion.g
          animate={walking ? { y: [0, -3, 0, -3, 0] } : { y: [0, -1.5, 0] }}
          transition={walking ? { duration: 0.42, repeat: Infinity, ease: 'easeInOut' } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* back leg */}
          <motion.g animate={legSwing(-1)} transition={legTransition} style={{ transformOrigin: '-6px -42px' }}>
            <path d="M -13,-44 L 0,-44 L -1,-8 L -14,-8 Z" fill="#1e3a8a" />
            <path d="M -16,-9 L 2,-9 L 4,-1 Q 4,1 1,1 L -14,1 Q -17,1 -17,-2 Z" fill={BOOT} stroke="#1c110a" strokeWidth="1" />
          </motion.g>
          {/* front leg */}
          <motion.g animate={legSwing(1)} transition={legTransition} style={{ transformOrigin: '8px -42px' }}>
            <path d="M 0,-44 L 16,-44 L 17,-8 L 2,-8 Z" fill="url(#fg-overalls)" />
            <path d="M 4,-30 L 13,-30" stroke="#1e3a8a" strokeWidth="1.2" opacity="0.7" />
            <path d="M 0,-9 L 19,-9 L 23,-1 Q 24,1 21,1 L 1,1 Q -2,1 -2,-2 Z" fill={BOOT} stroke="#1c110a" strokeWidth="1" />
            <path d="M 3,-6 L 18,-6" stroke="#6b4a2a" strokeWidth="1.2" strokeLinecap="round" />
          </motion.g>

          {/* far arm, hanging by the side */}
          <path d="M -14,-78 L -6,-76 L -12,-50 L -20,-52 Z" fill="#e5e7eb" />
          <path d="M -13,-64 L -6,-62 L -12,-50 L -20,-52 Z" fill="url(#fg-overalls)" opacity="0.9" />
          <circle cx="-17" cy="-47" r="5" fill={SKIN_SHADE} />

          {/* torso: grey tee under blue overalls with straps, bib pocket and hip pouch */}
          <path d="M -18,-84 Q 0,-90 18,-84 L 20,-62 L -20,-62 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
          <path d="M -18,-64 L 18,-64 L 20,-42 L -20,-42 Z" fill="url(#fg-overalls)" />
          <path d="M -11,-64 L -11,-78 L -5,-78 L -5,-64 Z M 5,-64 L 5,-78 L 11,-78 L 11,-64 Z" fill="url(#fg-overalls)" />
          <path d="M -12,-70 L 12,-70 L 11,-56 L -11,-56 Z" fill="url(#fg-overalls)" />
          <rect x="-7" y="-67" width="14" height="10" rx="2" fill="#1e3a8a" opacity="0.6" />
          <circle cx="-8" cy="-66" r="1.8" fill="#fbbf24" />
          <circle cx="8" cy="-66" r="1.8" fill="#fbbf24" />
          <path d="M -20,-44 L 20,-44" stroke="#1e3a8a" strokeWidth="2.5" />
          <path d="M 14,-46 L 26,-46 L 25,-34 L 15,-34 Z" fill="#a16207" stroke="#713f12" strokeWidth="1" />
          <rect x="17" y="-52" width="3" height="8" rx="1" fill="#94a3b8" />
          <rect x="21" y="-51" width="3" height="7" rx="1" fill="#ef4444" />

          {/* neck and head */}
          <rect x="-5" y="-92" width="10" height="10" fill={SKIN_SHADE} />
          <motion.g
            animate={{ rotate: [0, -3, 0, 2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: '0px -88px' }}
          >
            <circle cx="0" cy="-101" r="15" fill="url(#fg-skin)" />
            {/* jaw shade and ear */}
            <path d="M -14,-98 Q 0,-84 14,-98 Q 8,-88 0,-87 Q -8,-88 -14,-98 Z" fill={SKIN_SHADE} opacity="0.55" />
            <ellipse cx="-14" cy="-101" rx="3.2" ry="4" fill="url(#fg-skin)" stroke={SKIN_SHADE} strokeWidth="0.8" />
            {/* hair: fringe and a ponytail out the back of the cap */}
            <path d="M -15,-104 Q -14,-114 -2,-116 Q 10,-117 15,-108 L 15,-104 Q 8,-110 0,-109 Q -8,-108 -15,-104 Z" fill={HAIR} />
            <path d="M -14,-108 Q -26,-100 -22,-84 Q -20,-92 -14,-98 Z" fill={HAIR} />
            {/* eyes with a blink, brow, freckles, smile */}
            <ellipse cx="6" cy="-102" rx="3.4" ry="3.8" fill="#ffffff" />
            <circle cx="7" cy="-101.5" r="2" fill="#2b1a10" />
            <circle cx="7.8" cy="-102.6" r="0.7" fill="#ffffff" />
            <motion.rect
              x="2"
              y="-106"
              width="8.5"
              height="8"
              fill="url(#fg-skin)"
              animate={{ scaleY: [0, 0, 1, 0, 0] }}
              transition={{ duration: 0.36, times: [0, 0.3, 0.5, 0.7, 1], repeat: Infinity, repeatDelay: 3.2 }}
              style={{ transformOrigin: '6px -106px' }}
            />
            <path d="M 2,-108 Q 6,-111 11,-108" stroke={HAIR} strokeWidth="1.6" fill="none" strokeLinecap="round" />
            <path d="M 4,-93 Q 9,-89 14,-93" stroke="#7c2d12" strokeWidth="1.8" fill="none" strokeLinecap="round" />
            <circle cx="10" cy="-96" r="3" fill="#f87171" opacity="0.35" />
            {/* grease smudge */}
            <path d="M -4,-95 L 2,-93" stroke="#44403c" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
            {/* red cap, brim pointing at the car */}
            <path d="M -15,-108 Q -12,-122 0,-122 Q 13,-122 15,-108 Z" fill={CAP} stroke="#7f1d1d" strokeWidth="1" />
            <path d="M -8,-118 Q 0,-121 8,-118" stroke="#fca5a5" strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.8" />
            <path d="M 13,-110 L 30,-108 Q 32,-106 30,-104 L 13,-105 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1" />
            <circle cx="0" cy="-122" r="2" fill="#7f1d1d" />
          </motion.g>

          {/* working arm: aims the tool at the part and swings it */}
          <motion.g
            animate={armAnimate}
            transition={armTransition}
            style={{ transformOrigin: `${SHOULDER.x}px ${SHOULDER.y}px` }}
          >
            <g transform={`translate(${SHOULDER.x} ${SHOULDER.y})`}>
              {/* rolled grey sleeve, then forearm */}
              <path d="M -4,-6 L 14,-5 L 15,5 L -4,6 Z" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="1" />
              <path d="M 12,-5 L 30,-4 L 30,4 L 12,5 Z" fill="url(#fg-skin)" />
              <circle cx="32" cy="0" r="6" fill="url(#fg-skin)" stroke={SKIN_SHADE} strokeWidth="1" />
              <g transform="translate(36 0)">
                <ToolInHand tool={tool} />
              </g>
            </g>
          </motion.g>
        </motion.g>
      </g>
    </motion.g>
  )
}

/** Rolling tool chest parked beside the mechanic. */
export function ToolChest() {
  return (
    <g aria-hidden="true">
      <ellipse cx="22" cy={FLOOR_Y} rx="24" ry="4" fill="#000000" opacity="0.25" />
      <rect x="2" y="184" width="40" height="60" rx="4" fill="url(#fg-red)" stroke="#7f1d1d" strokeWidth="1.4" />
      <rect x="2" y="184" width="40" height="6" rx="2" fill="#fecaca" opacity="0.5" />
      {[194, 206, 218, 230].map((y) => (
        <g key={y}>
          <rect x="6" y={y} width="32" height="9" rx="1.5" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="0.8" />
          <rect x="14" y={y + 3} width="16" height="2.5" rx="1.25" fill="url(#fg-chrome)" />
        </g>
      ))}
      <circle cx="10" cy={FLOOR_Y - 3} r="4.5" fill="#27272a" stroke="#09090b" strokeWidth="1" />
      <circle cx="34" cy={FLOOR_Y - 3} r="4.5" fill="#27272a" stroke="#09090b" strokeWidth="1" />
      {/* oily rag and an oil can on top */}
      <path d="M 6,184 Q 14,176 22,182 Q 28,178 34,184 Z" fill="#e7e5e4" />
      <rect x="28" y="170" width="10" height="14" rx="2" fill="#facc15" stroke="#a16207" strokeWidth="1" />
      <rect x="31" y="166" width="4" height="5" rx="1" fill="#dc2626" />
    </g>
  )
}

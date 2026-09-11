import { motion } from 'framer-motion'
import { FLOOR_Y } from './layout'

/**
 * The mechanic working on the car: stands on the shop floor just behind the
 * rear quarter, wrench in hand. `pulse` is incremented by the game every time
 * a repair lands, which remounts the arm group and replays its swing, so the
 * figure visibly reacts to the child's work.
 */

const OVERALLS = '#1d4ed8'
const OVERALLS_DARK = '#1e3a8a'
const SKIN = '#f0c08a'
const SKIN_SHADE = '#d9a874'
const BOOT = '#44271a'
const CAP = '#dc2626'

export function Mechanic({ pulse }: { pulse: number }) {
  return (
    <motion.g
      aria-hidden="true"
      animate={{ y: [0, -2, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* floor shadow */}
      <ellipse cx="68" cy={FLOOR_Y} rx="38" ry="6" fill="#00000018" />

      {/* back leg */}
      <path d="M 54,192 L 68,192 L 66,240 L 50,240 Z" fill={OVERALLS_DARK} />
      <rect x="44" y={FLOOR_Y - 14} width="26" height="14" rx="5" fill="#2f1a10" />

      {/* front leg */}
      <path d="M 70,192 L 86,192 L 88,240 L 72,240 Z" fill={OVERALLS} />
      <rect x="66" y={FLOOR_Y - 14} width="30" height="14" rx="5" fill={BOOT} />

      {/* torso in overalls, with a white tee at the shoulders */}
      <path d="M 52,140 L 88,140 L 90,196 L 50,196 Z" fill={OVERALLS} />
      <path d="M 56,140 L 84,140 L 84,150 L 56,150 Z" fill="#f8fafc" />
      <path d="M 60,140 L 66,140 L 66,170 L 60,170 Z" fill={OVERALLS_DARK} />
      <path d="M 76,140 L 82,140 L 82,170 L 76,170 Z" fill={OVERALLS_DARK} />
      {/* chest pocket */}
      <rect x="64" y="160" width="16" height="14" rx="3" fill={OVERALLS_DARK} />

      {/* far arm hanging by the side */}
      <path d="M 52,148 L 60,148 L 56,182 L 48,180 Z" fill={OVERALLS_DARK} />
      <circle cx="52" cy="185" r="6" fill={SKIN_SHADE} />

      {/* head, facing the car */}
      <circle cx="72" cy="121" r="16" fill={SKIN} />
      <path d="M 60,128 L 62,136 L 84,136 L 84,128 Z" fill={SKIN} />
      <circle cx="80" cy="119" r="2.6" fill="#3f2a1a" />
      <path d="M 78,128 Q 83,131 87,127" stroke="#3f2a1a" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="61" cy="124" r="4" fill={SKIN_SHADE} />
      {/* grease smudge on the cheek */}
      <path d="M 68,127 L 74,129" stroke="#57534e" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

      {/* cap with the brim pointing at the car */}
      <path d="M 56,114 Q 60,101 74,101 Q 88,101 89,114 Z" fill={CAP} />
      <path d="M 87,112 L 103,110 L 103,116 L 86,117 Z" fill="#b91c1c" />

      {/* working arm: swings every time a repair lands */}
      <motion.g
        key={pulse}
        initial={{ rotate: -34 }}
        animate={{ rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 11 }}
        style={{ transformOrigin: '84px 150px' }}
      >
        <path d="M 82,144 L 92,142 L 110,158 L 102,166 Z" fill={OVERALLS} />
        <circle cx="108" cy="163" r="7" fill={SKIN} />
        {/* wrench in the fist, pointing at the car */}
        <rect x="110" y="159" width="26" height="7" rx="3" fill="#94a3b8" stroke="#475569" strokeWidth="2" />
        <path d="M 132,155 L 142,155 L 142,161 L 136,161 L 136,164 L 142,164 L 142,170 L 132,170 Z" fill="#94a3b8" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
      </motion.g>
    </motion.g>
  )
}

/** Rolling tool chest parked beside the mechanic. */
export function ToolChest() {
  return (
    <g aria-hidden="true">
      <rect x="8" y="196" width="44" height="48" rx="5" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="2" />
      <rect x="13" y="203" width="34" height="9" rx="2" fill="#ef4444" />
      <rect x="13" y="216" width="34" height="9" rx="2" fill="#ef4444" />
      <rect x="13" y="229" width="34" height="9" rx="2" fill="#ef4444" />
      <circle cx="18" cy={FLOOR_Y - 4} r="5" fill="#27272a" />
      <circle cx="42" cy={FLOOR_Y - 4} r="5" fill="#27272a" />
    </g>
  )
}

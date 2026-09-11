import { motion } from 'framer-motion'

export type DogState = 'idle' | 'asking' | 'chewing' | 'drinking' | 'barking' | 'happy'

type DogProps = {
  state: DogState
  className?: string
}

const BODY = '#e0a458'
const EAR = '#b97a35'
const CREAM = '#fdf3e1'
const INK = '#5b3a22'
const MOUTH_DARK = '#7a3b3b'
const TONGUE = '#ef8a8a'

/** Hand-drawn, flat, friendly cartoon dog. Face + tail react to `state`; no numeric meters ever. */
export function Dog({ state, className }: DogProps) {
  const isHappyFace = state === 'happy' || state === 'barking'
  const isChewing = state === 'chewing'
  const isDrinking = state === 'drinking'
  const isBarking = state === 'barking'
  const isAsking = state === 'asking'

  // Whole-dog gentle lean when inviting play.
  const bodyAnimate = isAsking ? { x: [0, -10, 0], rotate: [0, -4, 0] } : { x: 0, rotate: 0 }
  const bodyTransition = isAsking
    ? { duration: 0.9, ease: 'easeInOut' as const }
    : { duration: 0.4, ease: 'easeOut' as const }

  // Tail: slow happy sway at rest, fast excited wag on a good reaction.
  const tailAnimate =
    isHappyFace || isChewing || isDrinking
      ? { rotate: [0, 26, -22, 26, -14, 0] }
      : { rotate: [0, 9, 0, -6, 0] }
  const tailTransition =
    isHappyFace || isChewing || isDrinking
      ? { duration: 0.55, repeat: Infinity, ease: 'easeInOut' as const }
      : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' as const }

  // Head tilts down happily while drinking.
  const headAnimate = isDrinking ? { rotate: 10 } : { rotate: 0 }

  // Snout bounces open/closed while chewing.
  const snoutAnimate = isChewing ? { scaleY: [1, 0.55, 1] } : { scaleY: 1 }
  const snoutTransition = isChewing
    ? { duration: 0.26, repeat: Infinity, ease: 'easeInOut' as const }
    : { duration: 0.2 }

  return (
    <motion.svg
      viewBox="0 0 200 200"
      className={className}
      animate={bodyAnimate}
      transition={bodyTransition}
      aria-hidden="true"
    >
      {/* tail */}
      <motion.path
        d="M156,150 C176,140 192,118 183,102 C177,116 166,129 152,146 Z"
        fill={EAR}
        style={{ transformOrigin: '156px 148px' }}
        animate={tailAnimate}
        transition={tailTransition}
      />

      {/* body */}
      <ellipse cx="100" cy="150" rx="58" ry="40" fill={BODY} />
      <ellipse cx="100" cy="163" rx="32" ry="19" fill={CREAM} />
      <ellipse cx="72" cy="184" rx="13" ry="9" fill={BODY} />
      <ellipse cx="128" cy="184" rx="13" ry="9" fill={BODY} />

      {/* head group, tilts for drinking */}
      <motion.g animate={headAnimate} style={{ transformOrigin: '100px 128px' }} transition={{ duration: 0.4 }}>
        <ellipse cx="58" cy="76" rx="17" ry="27" fill={EAR} transform="rotate(-18 58 76)" />
        <ellipse cx="142" cy="76" rx="17" ry="27" fill={EAR} transform="rotate(18 142 76)" />
        <circle cx="100" cy="84" r="46" fill={BODY} />

        {/* snout, bounces while chewing */}
        <motion.g animate={snoutAnimate} transition={snoutTransition} style={{ transformOrigin: '100px 96px' }}>
          <ellipse cx="100" cy="100" rx="24" ry="17" fill={CREAM} />
          <ellipse cx="100" cy="90" rx="9" ry="7" fill={INK} />

          {isBarking || isChewing ? (
            <ellipse cx="100" cy="109" rx="13" ry="10" fill={MOUTH_DARK} />
          ) : (
            <path
              d={isHappyFace ? 'M84,101 Q100,120 116,101' : 'M89,105 Q100,110 111,105'}
              stroke={INK}
              strokeWidth={4}
              strokeLinecap="round"
              fill="none"
            />
          )}
        </motion.g>

        {/* eyes */}
        {isHappyFace ? (
          <>
            <path d="M72,72 Q80,63 88,72" stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" />
            <path d="M112,72 Q120,63 128,72" stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="80" cy="72" r="6" fill={INK} />
            <circle cx="120" cy="72" r="6" fill={INK} />
            <circle cx="82" cy="70" r="1.6" fill="white" />
            <circle cx="122" cy="70" r="1.6" fill="white" />
          </>
        )}
      </motion.g>

      {/* tongue lapping while drinking */}
      {isDrinking && (
        <motion.ellipse
          cx="100"
          cy="122"
          rx="6"
          ry="8"
          fill={TONGUE}
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 0.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.svg>
  )
}

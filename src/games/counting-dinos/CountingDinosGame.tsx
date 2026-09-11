import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GameShell } from '../../shared/GameShell'
import { Confetti } from '../../shared/Confetti'
import { useProgress } from '../../shared/useProgress'
import { Dino } from '../../assets/svg/Dino'
import { sfx, unlockAudio } from '../../shared/audio'

/** Distinct color sets so each dino on screen reads as its own individual. */
const DINO_PALETTES: { body: string; belly: string; spike: string }[] = [
  { body: '#38bdf8', belly: '#e0f2fe', spike: '#0284c7' }, // sky blue
  { body: '#4ade80', belly: '#dcfce7', spike: '#16a34a' }, // green
  { body: '#fb923c', belly: '#ffedd5', spike: '#c2410c' }, // orange
  { body: '#c084fc', belly: '#f3e8ff', spike: '#7e22ce' }, // purple
  { body: '#fbbf24', belly: '#fef9c3', spike: '#b45309' }, // yellow
]

/** Fixed, non-overlapping layout positions (percent of scene area) indexed by dino count. */
const LAYOUTS: Record<number, { x: number; y: number }[]> = {
  1: [{ x: 50, y: 50 }],
  2: [
    { x: 30, y: 45 },
    { x: 70, y: 55 },
  ],
  3: [
    { x: 25, y: 40 },
    { x: 50, y: 62 },
    { x: 75, y: 42 },
  ],
  4: [
    { x: 22, y: 35 },
    { x: 50, y: 55 },
    { x: 78, y: 35 },
    { x: 50, y: 82 },
  ],
  5: [
    { x: 18, y: 38 },
    { x: 40, y: 62 },
    { x: 62, y: 30 },
    { x: 82, y: 58 },
    { x: 50, y: 85 },
  ],
}

function randomCount() {
  return 1 + Math.floor(Math.random() * 5)
}

export function CountingDinosGame() {
  const { addSticker } = useProgress('counting-dinos')
  const [round, setRound] = useState(0)
  const [total, setTotal] = useState(randomCount)
  const [tapped, setTapped] = useState<Set<number>>(new Set())
  const [jumping, setJumping] = useState<Set<number>>(new Set())
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const [celebrating, setCelebrating] = useState(false)

  const layout = useMemo(() => LAYOUTS[total], [total])
  const palettes = useMemo(
    () => Array.from({ length: total }, (_, i) => DINO_PALETTES[i % DINO_PALETTES.length]),
    [total],
  )

  const tappedCount = tapped.size
  const allTapped = tappedCount === total

  const jumpTimeouts = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())
  const nextRoundTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Clear pending timeouts on unmount.
  useEffect(() => {
    const jumpMap = jumpTimeouts.current
    return () => {
      jumpMap.forEach((id) => clearTimeout(id))
      jumpMap.clear()
      if (nextRoundTimeout.current) clearTimeout(nextRoundTimeout.current)
    }
  }, [])

  // When every dino has been tapped, celebrate and start a fresh round shortly after.
  useEffect(() => {
    if (!allTapped) return
    setCelebrating(true)
    unlockAudio()
    sfx.celebrate()
    setConfettiTrigger((n) => n + 1)

    nextRoundTimeout.current = setTimeout(() => {
      setTotal(randomCount())
      setTapped(new Set())
      setCelebrating(false)
      setRound((r) => r + 1)
    }, 2800)

    return () => {
      if (nextRoundTimeout.current) clearTimeout(nextRoundTimeout.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTapped])

  // Award a sticker once per completed round (once, right when it completes).
  const awardedRound = useRef(-1)
  useEffect(() => {
    if (allTapped && awardedRound.current !== round) {
      awardedRound.current = round
      void addSticker()
    }
  }, [allTapped, round, addSticker])

  const handleTapDino = (index: number) => {
    unlockAudio()
    sfx.jump()

    // Play the little jump reaction regardless of whether this is a first tap.
    setJumping((prev) => new Set(prev).add(index))
    const existing = jumpTimeouts.current.get(index)
    if (existing) clearTimeout(existing)
    const id = setTimeout(() => {
      setJumping((prev) => {
        const next = new Set(prev)
        next.delete(index)
        return next
      })
      jumpTimeouts.current.delete(index)
    }, 500)
    jumpTimeouts.current.set(index, id)

    if (!tapped.has(index)) {
      setTapped((prev) => {
        const next = new Set(prev)
        next.add(index)
        return next
      })
    }
  }

  return (
    <GameShell bgClassName="bg-lime-100">
      <div className="flex min-h-screen w-full flex-col items-center px-4 pb-10 pt-24">
        {/* Running count display */}
        <div className="mb-2 flex flex-col items-center">
          <motion.div
            key={celebrating ? `final-${total}` : tappedCount}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className="flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-white/80 shadow-lg"
          >
            <span className="text-7xl font-black text-sky-700 tabular-nums">
              {tappedCount === 0 && !celebrating ? '' : celebrating ? total : tappedCount}
            </span>
          </motion.div>
        </div>

        {/* Scene of dinos */}
        <div className="relative mt-4 h-[52vh] w-full max-w-2xl flex-shrink-0">
          {layout.map((pos, index) => {
            const isTapped = tapped.has(index)
            const isJumping = jumping.has(index)
            const palette = palettes[index]
            return (
              <button
                key={index}
                type="button"
                aria-label={`Dinosaur ${index + 1}`}
                onClick={() => handleTapDino(index)}
                className="absolute flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center touch-manipulation select-none"
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              >
                <motion.div
                  className="h-full w-full"
                  animate={
                    isJumping
                      ? { y: [0, -36, 0], rotate: [0, -6, 6, 0] }
                      : { y: 0, rotate: 0 }
                  }
                  whileTap={{ scale: 0.85 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <Dino
                    className="h-full w-full drop-shadow-md"
                    body={palette.body}
                    belly={palette.belly}
                    spike={palette.spike}
                  />
                </motion.div>
                <AnimatePresence>
                  {isTapped && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -right-1 -top-1 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 text-lg font-black text-white shadow"
                    >
                      ✓
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            )
          })}
        </div>

        <AnimatePresence>
          {celebrating && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0.6, 1.15, 1], opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="fixed inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur-sm"
            >
              <span className="text-9xl font-black text-emerald-600 drop-shadow-sm">{total}</span>
              <span className="text-6xl" aria-hidden="true">
                🎉
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <Confetti trigger={confettiTrigger} particleCount={56} />
      </div>
    </GameShell>
  )
}

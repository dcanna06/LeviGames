import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react'
import { motion } from 'framer-motion'
import { GameShell } from '../../shared/GameShell'
import { Confetti } from '../../shared/Confetti'
import { useProgress } from '../../shared/useProgress'
import { Paw } from '../../assets/svg/Paw'
import { sfx, unlockAudio } from '../../shared/audio'
import { ANIMALS, type Animal } from './animals'

/** Picks a target animal plus two distinct distractors, shuffled into random positions. */
function makeRound(): Animal[] {
  const shuffled = [...ANIMALS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, 3)
}

export function AnimalSoundsGame() {
  const { addSticker } = useProgress('animal-sounds')
  const [round, setRound] = useState<Animal[]>(() => makeRound())
  const [targetIndex, setTargetIndex] = useState(() => Math.floor(Math.random() * 3))
  const [solved, setSolved] = useState(false)
  const [hintIndex, setHintIndex] = useState<number | null>(null)
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const [confettiOrigin, setConfettiOrigin] = useState({ x: 50, y: 50 })

  const nextRoundTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const hintTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (nextRoundTimeout.current) clearTimeout(nextRoundTimeout.current)
      if (hintTimeout.current) clearTimeout(hintTimeout.current)
    }
  }, [])

  const target = round[targetIndex]

  const playTargetSound = useCallback(() => {
    unlockAudio()
    sfx[target.sound]()
  }, [target])

  const startNextRound = useCallback(() => {
    const next = makeRound()
    setRound(next)
    setTargetIndex(Math.floor(Math.random() * next.length))
    setSolved(false)
    setHintIndex(null)
  }, [])

  const handlePlaySound = () => {
    if (solved) return
    playTargetSound()
  }

  const handleAnimalTap = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    if (solved) return
    unlockAudio()

    if (index === targetIndex) {
      setSolved(true)
      sfx.cheer()
      const rect = event.currentTarget.getBoundingClientRect()
      setConfettiOrigin({
        x: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
        y: ((rect.top + rect.height / 2) / window.innerHeight) * 100,
      })
      setConfettiTrigger((n) => n + 1)
      void addSticker()
      nextRoundTimeout.current = setTimeout(startNextRound, 2200)
    } else {
      sfx[target.sound]()
      sfx.glow()
      setHintIndex(targetIndex)
      if (hintTimeout.current) clearTimeout(hintTimeout.current)
      hintTimeout.current = setTimeout(() => setHintIndex(null), 1500)
    }
  }

  return (
    <GameShell bgClassName="bg-purple-100">
      <div className="flex min-h-screen w-full flex-col items-center px-4 pb-10 pt-24">
        {/* Primary "play sound" control */}
        <motion.button
          type="button"
          aria-label="Play animal sound"
          onClick={handlePlaySound}
          disabled={solved}
          className="flex h-36 w-36 items-center justify-center rounded-full bg-white shadow-xl touch-manipulation select-none"
          whileTap={solved ? undefined : { scale: 0.88 }}
          animate={solved ? {} : { scale: [1, 1.06, 1] }}
          transition={solved ? { type: 'spring', stiffness: 400, damping: 15 } : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Paw className="h-20 w-20" color="#7c3aed" />
        </motion.button>

        <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
          {round.map((animal, index) => {
            const isHinting = hintIndex === index
            return (
              <motion.button
                key={`${animal.id}-${index}`}
                type="button"
                aria-label="Animal"
                onClick={(event) => handleAnimalTap(index, event)}
                disabled={solved}
                className="relative flex aspect-square min-h-20 min-w-20 items-center justify-center rounded-[2rem] shadow-lg touch-manipulation select-none"
                style={{ backgroundColor: animal.bg }}
                whileTap={solved ? undefined : { scale: 0.9 }}
                animate={
                  isHinting
                    ? { scale: [1, 1.08, 1], boxShadow: ['0 0 0px rgba(250,204,21,0)', '0 0 40px 12px rgba(250,204,21,0.8)', '0 0 0px rgba(250,204,21,0)'] }
                    : {}
                }
                transition={isHinting ? { duration: 0.9, repeat: 2, ease: 'easeInOut' } : { type: 'spring', stiffness: 400, damping: 15 }}
              >
                <animal.Face className="h-4/5 w-4/5" />
              </motion.button>
            )
          })}
        </div>
      </div>
      <Confetti trigger={confettiTrigger} origin={confettiOrigin} />
    </GameShell>
  )
}

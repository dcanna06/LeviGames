import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { GameShell } from '../../shared/GameShell'
import { Confetti } from '../../shared/Confetti'
import { useProgress } from '../../shared/useProgress'
import { sfx, unlockAudio } from '../../shared/audio'
import { Dino } from '../../assets/svg/Dino'

type IconKey = 'dino' | 'dog' | 'duck'

type CardData = {
  id: string
  icon: IconKey
  matched: boolean
}

const ICON_KEYS: IconKey[] = ['dino', 'dog', 'duck']

const ICON_LABELS: Record<IconKey, string> = {
  dino: 'dinosaur',
  dog: 'dog',
  duck: 'duck',
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

let deckIdCounter = 0
function buildDeck(): CardData[] {
  const pairs = shuffle([...ICON_KEYS, ...ICON_KEYS])
  return pairs.map((icon) => ({ id: `${icon}-${deckIdCounter++}`, icon, matched: false }))
}

type IconProps = { className?: string }

function DinoIcon({ className }: IconProps) {
  return <Dino className={className} body="#4ade80" belly="#bbf7d0" spike="#16a34a" />
}

function DogIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <ellipse cx="52" cy="66" rx="24" ry="34" fill="#b8752f" transform="rotate(-18 52 66)" />
      <ellipse cx="148" cy="66" rx="24" ry="34" fill="#b8752f" transform="rotate(18 148 66)" />
      <circle cx="100" cy="112" r="66" fill="#e3a45f" />
      <ellipse cx="100" cy="140" rx="36" ry="26" fill="#f4d9ae" />
      <ellipse cx="100" cy="128" rx="14" ry="10" fill="#3f2a1a" />
      <circle cx="76" cy="100" r="10" fill="#3f2a1a" />
      <circle cx="124" cy="100" r="10" fill="#3f2a1a" />
      <circle cx="80" cy="96" r="3" fill="#ffffff" />
      <circle cx="128" cy="96" r="3" fill="#ffffff" />
      <path d="M 78 150 Q 100 166 122 150" stroke="#3f2a1a" strokeWidth="7" fill="none" strokeLinecap="round" />
      <path d="M 100 150 Q 100 162 100 168" stroke="#f472b6" strokeWidth="10" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function DuckIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <ellipse cx="95" cy="120" rx="72" ry="60" fill="#fde047" />
      <circle cx="90" cy="80" r="46" fill="#fde047" />
      <path d="M 130 82 L 176 72 L 176 100 Z" fill="#f97316" />
      <circle cx="104" cy="70" r="7" fill="#3f2a1a" />
      <circle cx="107" cy="67" r="2.4" fill="#ffffff" />
      <path d="M 40 128 Q 74 156 110 138" stroke="#eab308" strokeWidth="9" fill="none" strokeLinecap="round" />
    </svg>
  )
}

const ICON_COMPONENTS: Record<IconKey, (props: IconProps) => JSX.Element> = {
  dino: DinoIcon,
  dog: DogIcon,
  duck: DuckIcon,
}

function CardBackPattern() {
  return (
    <svg viewBox="0 0 100 100" className="h-1/2 w-1/2" aria-hidden="true">
      <path
        d="M 50 15 L 61 40 L 88 43 L 68 61 L 74 88 L 50 74 L 26 88 L 32 61 L 12 43 L 39 40 Z"
        fill="#ffffff"
        opacity="0.85"
      />
    </svg>
  )
}

type MemoryCardTileProps = {
  card: CardData
  index: number
  isFaceUp: boolean
  onSelect: (index: number) => void
  registerRef: (el: HTMLButtonElement | null) => void
}

function MemoryCardTile({ card, index, isFaceUp, onSelect, registerRef }: MemoryCardTileProps) {
  const Icon = ICON_COMPONENTS[card.icon]
  const stateLabel = card.matched
    ? `matched, shows a ${ICON_LABELS[card.icon]}`
    : isFaceUp
      ? `shows a ${ICON_LABELS[card.icon]}`
      : 'face down'

  return (
    <motion.button
      ref={registerRef}
      type="button"
      onClick={() => onSelect(index)}
      aria-label={`Memory card ${index + 1}, ${stateLabel}`}
      className="relative mx-auto aspect-square w-full max-w-[140px] touch-manipulation select-none [perspective:1000px]"
      whileTap={{ scale: 0.94 }}
      animate={{ scale: card.matched ? 1.04 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFaceUp ? 180 : 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      >
        <div
          className={`absolute inset-0 flex items-center justify-center rounded-[1.75rem] shadow-lg ${
            card.matched ? 'bg-gradient-to-br from-emerald-300 to-emerald-400 ring-4 ring-emerald-200' : 'bg-gradient-to-br from-rose-300 to-pink-400'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <CardBackPattern />
        </div>
        <div
          className="absolute inset-0 flex items-center justify-center rounded-[1.75rem] bg-white p-4 shadow-lg"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <Icon className="h-full w-full" />
        </div>
      </motion.div>
    </motion.button>
  )
}

type ConfettiState = {
  trigger: number
  origin: { x: number; y: number }
  count: number
}

export function MemoryMatchGame() {
  const [deck, setDeck] = useState<CardData[]>(() => buildDeck())
  const [flipped, setFlipped] = useState<number[]>([])
  const [confetti, setConfetti] = useState<ConfettiState>({ trigger: 0, origin: { x: 50, y: 50 }, count: 24 })
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([])
  const { addSticker } = useProgress('memory-match')

  function computeOrigin(i1: number, i2: number): { x: number; y: number } {
    const el1 = cardRefs.current[i1]
    const el2 = cardRefs.current[i2]
    if (!el1 || !el2 || typeof window === 'undefined') return { x: 50, y: 50 }
    const r1 = el1.getBoundingClientRect()
    const r2 = el2.getBoundingClientRect()
    const cx = (r1.left + r1.width / 2 + r2.left + r2.width / 2) / 2
    const cy = (r1.top + r1.height / 2 + r2.top + r2.height / 2) / 2
    return { x: (cx / window.innerWidth) * 100, y: (cy / window.innerHeight) * 100 }
  }

  const handleSelect = (index: number) => {
    if (flipped.length >= 2) return
    const card = deck[index]
    if (card.matched) return
    if (flipped.includes(index)) return
    unlockAudio()
    sfx.flip()
    setFlipped((prev) => [...prev, index])
  }

  // Resolve a pending pair once two cards are face up: match stays revealed,
  // mismatch gets a gentle flip-back after a beat. No penalty either way.
  useEffect(() => {
    if (flipped.length !== 2) return
    const [i1, i2] = flipped
    const isMatch = deck[i1].icon === deck[i2].icon

    if (isMatch) {
      sfx.matchSuccess()
      const origin = computeOrigin(i1, i2)
      setConfetti((c) => ({ trigger: c.trigger + 1, origin, count: 28 }))
      const timeout = window.setTimeout(() => {
        setDeck((prev) => prev.map((c, idx) => (idx === i1 || idx === i2 ? { ...c, matched: true } : c)))
        setFlipped([])
      }, 500)
      return () => window.clearTimeout(timeout)
    }

    const timeout = window.setTimeout(() => {
      sfx.mismatchGentle()
      setFlipped([])
    }, 800)
    return () => window.clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped, deck])

  // Full board complete: big celebration, award a sticker, then loop with a fresh board.
  useEffect(() => {
    if (!deck.every((c) => c.matched)) return
    sfx.celebrate()
    setConfetti((c) => ({ trigger: c.trigger + 1, origin: { x: 50, y: 45 }, count: 58 }))
    void addSticker()
    const timeout = window.setTimeout(() => {
      setDeck(buildDeck())
      setFlipped([])
    }, 2400)
    return () => window.clearTimeout(timeout)
  }, [deck, addSticker])

  return (
    <GameShell bgClassName="bg-pink-100">
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-10">
        <div className="grid w-full max-w-md grid-cols-3 gap-5 sm:gap-6">
          {deck.map((card, index) => (
            <MemoryCardTile
              key={card.id}
              card={card}
              index={index}
              isFaceUp={flipped.includes(index) || card.matched}
              onSelect={handleSelect}
              registerRef={(el) => {
                cardRefs.current[index] = el
              }}
            />
          ))}
        </div>
      </div>
      <Confetti trigger={confetti.trigger} origin={confetti.origin} particleCount={confetti.count} />
    </GameShell>
  )
}

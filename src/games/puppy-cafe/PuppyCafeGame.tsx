import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, type PanInfo } from 'framer-motion'
import type { ReactNode, RefObject } from 'react'
import { GameShell } from '../../shared/GameShell'
import { Confetti } from '../../shared/Confetti'
import { useProgress } from '../../shared/useProgress'
import { sfx, unlockAudio, type SfxName } from '../../shared/audio'
import { Dog, type DogState } from './Dog'
import { BallIcon, BoneIcon, BowlIcon } from './Items'

type ItemKind = 'bone' | 'bowl' | 'ball'

const REACTION_STATE: Record<ItemKind, DogState> = {
  bone: 'chewing',
  bowl: 'drinking',
  ball: 'barking',
}

const REACTION_SOUND: Record<ItemKind, SfxName> = {
  bone: 'chew',
  bowl: 'splash',
  ball: 'bark',
}

// How long each state lasts before the dog moves on to the next one.
// Reactions settle into a cosmetic "happy" look, then back to idle.
const STATE_DURATION_MS: Partial<Record<DogState, number>> = {
  chewing: 1100,
  drinking: 1000,
  barking: 1100,
  happy: 2400,
  asking: 1300,
}

const MIN_IDLE_ASK_MS = 8000
const MAX_IDLE_ASK_MS = 15000
const DROP_FORGIVENESS_PX = 60

export function PuppyCafeGame() {
  const [dogState, setDogState] = useState<DogState>('idle')
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const dogRef = useRef<HTMLDivElement | null>(null)
  const { addSticker } = useProgress('puppy-cafe')

  // Drives both the reaction sequence (chew/drink/bark -> happy -> idle) and
  // the idle "ask" prompt, all through one small state machine. Any new drop
  // just calls setDogState directly, which cancels whatever timer was pending.
  useEffect(() => {
    if (dogState === 'idle') {
      const delay = MIN_IDLE_ASK_MS + Math.random() * (MAX_IDLE_ASK_MS - MIN_IDLE_ASK_MS)
      const id = window.setTimeout(() => {
        setDogState('asking')
        sfx.nudge()
      }, delay)
      return () => window.clearTimeout(id)
    }

    const next: DogState = dogState === 'happy' || dogState === 'asking' ? 'idle' : 'happy'
    const duration = STATE_DURATION_MS[dogState] ?? 1000
    const id = window.setTimeout(() => setDogState(next), duration)
    return () => window.clearTimeout(id)
  }, [dogState])

  const handleDrop = useCallback(
    (kind: ItemKind) => {
      unlockAudio()
      setDogState(REACTION_STATE[kind])
      sfx[REACTION_SOUND[kind]]()
      if (kind === 'ball') sfx.squeakyBall()
      setConfettiTrigger((n) => n + 1)
      addSticker()
    },
    [addSticker],
  )

  return (
    <GameShell bgClassName="bg-amber-100">
      <div className="flex h-screen w-full flex-col items-center justify-between overflow-hidden px-4 pb-10 pt-24">
        <div ref={dogRef} className="flex w-full flex-1 items-center justify-center">
          <Dog state={dogState} className="h-56 w-56 drop-shadow-md sm:h-72 sm:w-72" />
        </div>

        <div className="flex w-full max-w-md items-end justify-around gap-4">
          <DragItem kind="bone" ariaLabel="Bone" dogRef={dogRef} onDrop={handleDrop}>
            <BoneIcon className="h-14 w-14" />
          </DragItem>
          <DragItem kind="bowl" ariaLabel="Water bowl" dogRef={dogRef} onDrop={handleDrop}>
            <BowlIcon className="h-14 w-14" />
          </DragItem>
          <DragItem kind="ball" ariaLabel="Ball" dogRef={dogRef} onDrop={handleDrop}>
            <BallIcon className="h-14 w-14" />
          </DragItem>
        </div>
      </div>

      <Confetti trigger={confettiTrigger} origin={{ x: 50, y: 38 }} />
    </GameShell>
  )
}

type DragItemProps = {
  kind: ItemKind
  ariaLabel: string
  dogRef: RefObject<HTMLDivElement | null>
  onDrop: (kind: ItemKind) => void
  children: ReactNode
}

/**
 * A large, forgiving draggable item: springs back to the tray unless dropped
 * near the dog (generous bounding-box margin, not pixel-perfect overlap), so
 * repeated drags always succeed and nothing can be "missed" and punished.
 */
function DragItem({ kind, ariaLabel, dogRef, onDrop, children }: DragItemProps) {
  return (
    <motion.div
      role="img"
      aria-label={ariaLabel}
      drag
      dragSnapToOrigin
      dragElastic={0.2}
      dragMomentum={false}
      whileDrag={{ scale: 1.15, zIndex: 20 }}
      whileTap={{ scale: 1.08 }}
      onDragEnd={(_event, info: PanInfo) => {
        const target = dogRef.current?.getBoundingClientRect()
        if (!target) return
        const hit =
          info.point.x > target.left - DROP_FORGIVENESS_PX &&
          info.point.x < target.right + DROP_FORGIVENESS_PX &&
          info.point.y > target.top - DROP_FORGIVENESS_PX &&
          info.point.y < target.bottom + DROP_FORGIVENESS_PX
        if (hit) onDrop(kind)
      }}
      className="flex h-24 w-24 shrink-0 cursor-grab touch-none items-center justify-center rounded-[2rem] bg-white/80 p-3 shadow-lg active:cursor-grabbing"
    >
      {children}
    </motion.div>
  )
}

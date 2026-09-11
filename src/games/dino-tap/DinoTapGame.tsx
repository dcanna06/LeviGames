import { useState } from 'react'
import { motion, useAnimation } from 'framer-motion'
import { GameShell } from '../../shared/GameShell'
import { Confetti } from '../../shared/Confetti'
import { useProgress } from '../../shared/useProgress'
import { sfx, unlockAudio } from '../../shared/audio'
import { Dino } from '../../assets/svg/Dino'

type DinoConfig = {
  id: string
  top: string
  startLeft: number
  endLeft: number
  duration: number
  delay: number
  bobDuration: number
  body: string
  belly: string
  spike: string
}

const DINOS: DinoConfig[] = [
  {
    id: 'green',
    top: '14%',
    startLeft: 6,
    endLeft: 66,
    duration: 8.5,
    delay: 0,
    bobDuration: 0.7,
    body: '#4ade80',
    belly: '#bbf7d0',
    spike: '#22c55e',
  },
  {
    id: 'blue',
    top: '38%',
    startLeft: 64,
    endLeft: 8,
    duration: 10,
    delay: 1.4,
    bobDuration: 0.85,
    body: '#38bdf8',
    belly: '#bae6fd',
    spike: '#0284c7',
  },
  {
    id: 'orange',
    top: '60%',
    startLeft: 10,
    endLeft: 70,
    duration: 9.5,
    delay: 2.8,
    bobDuration: 0.65,
    body: '#fb923c',
    belly: '#fed7aa',
    spike: '#ea580c',
  },
  {
    id: 'purple',
    top: '81%',
    startLeft: 58,
    endLeft: 6,
    duration: 11.5,
    delay: 0.9,
    bobDuration: 0.9,
    body: '#c084fc',
    belly: '#e9d5ff',
    spike: '#9333ea',
  },
]

type DinoActorProps = {
  config: DinoConfig
  onTap: () => void
}

/** One walking, bouncing, tappable dinosaur that roars and pops confetti when tapped. */
function DinoActor({ config, onTap }: DinoActorProps) {
  const { top, startLeft, endLeft, duration, delay, bobDuration, body, belly, spike } = config
  const jumpControls = useAnimation()
  const [burst, setBurst] = useState(0)

  // Face the direction of travel: the dino artwork faces left by default,
  // so it needs a horizontal flip while moving rightward.
  const facingWhileGrowing = endLeft > startLeft ? -1 : 1
  const facingWhileShrinking = -facingWhileGrowing

  const handleTap = () => {
    unlockAudio()
    sfx.roar()
    void jumpControls.start({
      y: [0, -70, 0],
      transition: { duration: 0.55, ease: 'easeOut', times: [0, 0.4, 1] },
    })
    setBurst((b) => b + 1)
    void onTap()
  }

  return (
    <motion.div
      className="absolute"
      style={{ top }}
      animate={{
        left: [`${startLeft}%`, `${endLeft}%`, `${endLeft}%`, `${startLeft}%`],
        scaleX: [facingWhileGrowing, facingWhileGrowing, facingWhileShrinking, facingWhileShrinking],
      }}
      transition={{
        duration,
        delay,
        times: [0, 0.5, 0.5, 1],
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <motion.div
        className="relative"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: bobDuration, repeat: Infinity, ease: 'easeInOut' }}
      >
        <motion.button
          type="button"
          aria-label="Tap the dinosaur"
          onClick={handleTap}
          animate={jumpControls}
          whileTap={{ scale: 0.9 }}
          className="relative flex h-32 w-32 select-none items-center justify-center border-0 bg-transparent p-0 touch-manipulation"
        >
          <Dino className="h-full w-full drop-shadow-md" body={body} belly={belly} spike={spike} />
        </motion.button>
        <Confetti trigger={burst} fixed={false} particleCount={16} />
      </motion.div>
    </motion.div>
  )
}

export function DinoTapGame() {
  const { addSticker } = useProgress('dino-tap')

  return (
    <GameShell bgClassName="bg-emerald-100">
      <div className="relative min-h-screen w-full overflow-hidden pb-8 pt-28">
        {/* soft ground strip for a bit of scene depth */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-emerald-300/50 to-transparent" />

        {DINOS.map((config) => (
          <DinoActor key={config.id} config={config} onTap={addSticker} />
        ))}
      </div>
    </GameShell>
  )
}

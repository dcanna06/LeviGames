import { useNavigate } from 'react-router-dom'
import { SoundButton } from '../shared/SoundButton'
import { Dino } from '../assets/svg/Dino'
import { Paw } from '../assets/svg/Paw'

type GameEntry = {
  id: string
  path: string
  label: string
  bg: string
  idle: 'bounce' | 'wiggle'
  icon: React.ReactNode
}

function CardsIcon() {
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-16" aria-hidden="true">
      <rect x="14" y="24" width="34" height="48" rx="8" fill="#f472b6" transform="rotate(-8 31 48)" />
      <rect x="52" y="24" width="34" height="48" rx="8" fill="#60a5fa" transform="rotate(8 69 48)" />
      <circle cx="31" cy="48" r="9" fill="white" transform="rotate(-8 31 48)" />
      <circle cx="69" cy="48" r="9" fill="white" transform="rotate(8 69 48)" />
    </svg>
  )
}

function SoundIcon() {
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-16" aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="#c084fc" />
      <path d="M 32 42 h12 l16 -14 v44 l-16 -14 h-12 z" fill="white" />
      <path d="M 68 38 Q 78 50 68 62" stroke="white" strokeWidth="6" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-16" aria-hidden="true">
      <rect x="10" y="42" width="50" height="26" rx="6" fill="#f87171" />
      <path d="M 60 48 h18 l12 14 v6 h-30 z" fill="#fb923c" />
      <circle cx="30" cy="74" r="10" fill="#1f2937" />
      <circle cx="76" cy="74" r="10" fill="#1f2937" />
      <circle cx="30" cy="74" r="4" fill="#9ca3af" />
      <circle cx="76" cy="74" r="4" fill="#9ca3af" />
    </svg>
  )
}

function BoneBowlIcon() {
  return (
    <svg viewBox="0 0 100 100" className="h-16 w-16" aria-hidden="true">
      <circle cx="50" cy="50" r="42" fill="#fbbf24" />
      <path
        d="M 30 40 a7 7 0 1 1 12 -6 a7 7 0 1 1 6 12 l-6 6 l6 6 a7 7 0 1 1 -6 12 a7 7 0 1 1 -12 -6 l6 -6 l-6 -6 z"
        fill="white"
      />
    </svg>
  )
}

const games: GameEntry[] = [
  { id: 'dino-tap', path: '/dino-tap', label: 'Dino Tap Parade', bg: 'bg-emerald-300', idle: 'bounce', icon: <Dino className="h-20 w-20" /> },
  { id: 'puppy-cafe', path: '/puppy-cafe', label: 'Puppy Cafe', bg: 'bg-amber-300', idle: 'wiggle', icon: <BoneBowlIcon /> },
  { id: 'counting-dinos', path: '/counting-dinos', label: 'Counting Dinosaurs', bg: 'bg-lime-300', idle: 'bounce', icon: <Dino className="h-20 w-20" body="#38bdf8" belly="#e0f2fe" spike="#0284c7" /> },
  { id: 'memory-match', path: '/memory-match', label: 'Memory Match', bg: 'bg-pink-300', idle: 'wiggle', icon: <CardsIcon /> },
  { id: 'animal-sounds', path: '/animal-sounds', label: 'Animal Sound Match', bg: 'bg-purple-300', idle: 'bounce', icon: <SoundIcon /> },
  { id: 'fix-it-garage', path: '/fix-it-garage', label: 'Fix-It Garage', bg: 'bg-orange-300', idle: 'wiggle', icon: <TruckIcon /> },
]

export function HubScreen() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full bg-sky-100 px-4 py-8">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-5 sm:max-w-xl sm:grid-cols-3">
        {games.map((game) => (
          <SoundButton
            key={game.id}
            ariaLabel={game.label}
            sound="tap"
            idle={game.idle}
            onClick={() => navigate(game.path)}
            className={`aspect-square flex-col gap-2 ${game.bg}`}
          >
            {game.icon}
          </SoundButton>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <Paw className="h-10 w-10 opacity-30" />
      </div>
    </div>
  )
}

import type { ReactElement } from 'react'
import type { SfxName } from '../../shared/audio'

/** Simple, friendly, flat/rounded SVG animal illustrations for this game. */

type AnimalSvgProps = { className?: string }

export function DogFace({ className }: AnimalSvgProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <ellipse cx="50" cy="55" rx="42" ry="38" fill="#d9a066" />
      <ellipse cx="16" cy="30" rx="14" ry="20" fill="#b97a4b" transform="rotate(-18 16 30)" />
      <ellipse cx="84" cy="30" rx="14" ry="20" fill="#b97a4b" transform="rotate(18 84 30)" />
      <ellipse cx="50" cy="62" rx="24" ry="20" fill="#f3d9b1" />
      <circle cx="34" cy="48" r="6" fill="#3b2a1a" />
      <circle cx="66" cy="48" r="6" fill="#3b2a1a" />
      <ellipse cx="50" cy="66" rx="9" ry="7" fill="#3b2a1a" />
      <path d="M50 72 Q50 80 40 80" stroke="#3b2a1a" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M32 82 Q40 90 50 84 Q60 90 68 82" stroke="#3b2a1a" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function CowFace({ className }: AnimalSvgProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <ellipse cx="50" cy="55" rx="42" ry="38" fill="#f8f4ee" />
      <ellipse cx="30" cy="35" rx="9" ry="8" fill="#3a3a3a" />
      <ellipse cx="72" cy="42" rx="7" ry="6" fill="#3a3a3a" />
      <ellipse cx="18" cy="18" rx="10" ry="9" fill="#f8f4ee" />
      <ellipse cx="82" cy="18" rx="10" ry="9" fill="#f8f4ee" />
      <ellipse cx="50" cy="70" rx="26" ry="20" fill="#f9c9d6" />
      <circle cx="40" cy="66" r="5" fill="#c2185b" />
      <circle cx="60" cy="66" r="5" fill="#c2185b" />
      <circle cx="34" cy="48" r="6" fill="#3b2a1a" />
      <circle cx="66" cy="48" r="6" fill="#3b2a1a" />
      <path d="M40 78 Q50 84 60 78" stroke="#3b2a1a" strokeWidth="4" fill="none" strokeLinecap="round" />
    </svg>
  )
}

export function CatFace({ className }: AnimalSvgProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M22 30 L34 8 L44 32 Z" fill="#e8a13a" />
      <path d="M78 30 L66 8 L56 32 Z" fill="#e8a13a" />
      <ellipse cx="50" cy="56" rx="40" ry="36" fill="#f0b556" />
      <ellipse cx="50" cy="64" rx="22" ry="18" fill="#fde4bb" />
      <ellipse cx="34" cy="50" rx="6" ry="7" fill="#2b2b2b" />
      <ellipse cx="66" cy="50" rx="6" ry="7" fill="#2b2b2b" />
      <path d="M50 62 L45 68 L55 68 Z" fill="#c2185b" />
      <path d="M50 68 Q50 74 44 74" stroke="#2b2b2b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M50 68 Q50 74 56 74" stroke="#2b2b2b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M6 58 H26 M6 66 H26" stroke="#2b2b2b" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M74 58 H94 M74 66 H94" stroke="#2b2b2b" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export function DuckFace({ className }: AnimalSvgProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <ellipse cx="48" cy="50" rx="40" ry="38" fill="#fbe14a" />
      <ellipse cx="50" cy="72" rx="30" ry="16" fill="#f5a623" />
      <circle cx="34" cy="40" r="6" fill="#2b2b2b" />
      <circle cx="66" cy="40" r="6" fill="#2b2b2b" />
    </svg>
  )
}

export function SheepFace({ className }: AnimalSvgProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="22" cy="30" r="14" fill="#f2f2f2" />
      <circle cx="78" cy="30" r="14" fill="#f2f2f2" />
      <circle cx="14" cy="52" r="14" fill="#f2f2f2" />
      <circle cx="86" cy="52" r="14" fill="#f2f2f2" />
      <circle cx="30" cy="20" r="13" fill="#f2f2f2" />
      <circle cx="70" cy="20" r="13" fill="#f2f2f2" />
      <circle cx="50" cy="16" r="14" fill="#f2f2f2" />
      <ellipse cx="50" cy="56" rx="40" ry="34" fill="#f2f2f2" />
      <ellipse cx="50" cy="64" rx="22" ry="18" fill="#5c4632" />
      <circle cx="40" cy="60" r="5" fill="#fff" />
      <circle cx="60" cy="60" r="5" fill="#fff" />
      <circle cx="40" cy="61" r="2.5" fill="#2b2b2b" />
      <circle cx="60" cy="61" r="2.5" fill="#2b2b2b" />
      <ellipse cx="50" cy="72" rx="6" ry="4" fill="#3b2a1a" />
    </svg>
  )
}

export function PigFace({ className }: AnimalSvgProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <ellipse cx="50" cy="55" rx="42" ry="38" fill="#f6a8c0" />
      <ellipse cx="22" cy="26" rx="12" ry="13" fill="#f6a8c0" />
      <ellipse cx="78" cy="26" rx="12" ry="13" fill="#f6a8c0" />
      <ellipse cx="22" cy="28" rx="6" ry="7" fill="#f082a8" />
      <ellipse cx="78" cy="28" rx="6" ry="7" fill="#f082a8" />
      <circle cx="34" cy="48" r="6" fill="#2b2b2b" />
      <circle cx="66" cy="48" r="6" fill="#2b2b2b" />
      <ellipse cx="50" cy="70" rx="20" ry="15" fill="#f082a8" />
      <ellipse cx="42" cy="70" rx="4" ry="5" fill="#c2185b" />
      <ellipse cx="58" cy="70" rx="4" ry="5" fill="#c2185b" />
    </svg>
  )
}

export type AnimalId = 'dog' | 'cow' | 'cat' | 'duck' | 'sheep' | 'pig'

export type Animal = {
  id: AnimalId
  sound: SfxName
  Face: (props: AnimalSvgProps) => ReactElement
  bg: string
}

export const ANIMALS: Animal[] = [
  { id: 'dog', sound: 'dogBark', Face: DogFace, bg: '#fef3e2' },
  { id: 'cow', sound: 'cowMoo', Face: CowFace, bg: '#fdf6f0' },
  { id: 'cat', sound: 'catMeow', Face: CatFace, bg: '#fff4e0' },
  { id: 'duck', sound: 'duckQuack', Face: DuckFace, bg: '#fffbe0' },
  { id: 'sheep', sound: 'sheepBaa', Face: SheepFace, bg: '#f5f5f5' },
  { id: 'pig', sound: 'pigOink', Face: PigFace, bg: '#fdeef2' },
]

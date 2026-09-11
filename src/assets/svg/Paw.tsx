type PawProps = { className?: string; color?: string }

/** Friendly rounded paw-print icon, used for the home button and "play sound" prompts. */
export function Paw({ className, color = '#78350f' }: PawProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill={color} aria-hidden="true">
      <ellipse cx="50" cy="66" rx="26" ry="22" />
      <ellipse cx="20" cy="40" rx="12" ry="15" transform="rotate(-20 20 40)" />
      <ellipse cx="42" cy="24" rx="12" ry="15" transform="rotate(-6 42 24)" />
      <ellipse cx="66" cy="24" rx="12" ry="15" transform="rotate(6 66 24)" />
      <ellipse cx="86" cy="42" rx="12" ry="15" transform="rotate(22 86 42)" />
    </svg>
  )
}

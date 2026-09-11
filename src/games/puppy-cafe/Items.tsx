type IconProps = {
  className?: string
}

/** Flat, friendly bone icon for the "feed" item. */
export function BoneIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g fill="#f7f2e3" stroke="#d9cba9" strokeWidth="3" strokeLinejoin="round">
        <rect x="28" y="41" width="44" height="18" rx="9" />
        <circle cx="24" cy="36" r="13" />
        <circle cx="24" cy="64" r="13" />
        <circle cx="76" cy="36" r="13" />
        <circle cx="76" cy="64" r="13" />
      </g>
    </svg>
  )
}

/** Flat water bowl icon for the "drink" item. */
export function BowlIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path
        d="M12,48 Q12,80 50,84 Q88,80 88,48 Z"
        fill="#e7edf3"
        stroke="#a9b6c4"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <ellipse cx="50" cy="47" rx="38" ry="14" fill="#cfd8e0" stroke="#a9b6c4" strokeWidth="3" />
      <ellipse cx="50" cy="46" rx="29" ry="9" fill="#7fd0f5" />
      <ellipse cx="40" cy="43" rx="6" ry="2.4" fill="#d7f3ff" opacity="0.85" />
    </svg>
  )
}

/** Flat squeaky ball icon for the "play" item. */
export function BallIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="38" fill="#fbbf24" />
      <path d="M50,12 A38,38 0 0 1 50,88" fill="none" stroke="#f97316" strokeWidth="8" />
      <path d="M14,42 A38,38 0 0 0 14,58" fill="none" stroke="#f97316" strokeWidth="8" />
      <ellipse cx="38" cy="38" rx="8" ry="5" fill="white" opacity="0.6" />
    </svg>
  )
}

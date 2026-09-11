type DinoProps = {
  className?: string
  body?: string
  belly?: string
  spike?: string
}

/** Shared friendly dinosaur mascot, reused by Dino Tap Parade and Counting Dinosaurs. */
export function Dino({ className, body = '#4ade80', belly = '#bbf7d0', spike = '#22c55e' }: DinoProps) {
  return (
    <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
      <ellipse cx="256" cy="330" rx="150" ry="110" fill={body} />
      <path d="M 380 340 Q 460 320 440 260 Q 430 320 370 320 Z" fill={body} />
      <circle cx="180" cy="230" r="95" fill={body} />
      <ellipse cx="256" cy="360" rx="95" ry="60" fill={belly} />
      <path d="M 210 145 L 230 100 L 250 150 Z" fill={spike} />
      <path d="M 260 140 L 280 90 L 300 148 Z" fill={spike} />
      <path d="M 315 155 L 335 110 L 352 165 Z" fill={spike} />
      <circle cx="205" cy="205" r="26" fill="white" />
      <circle cx="212" cy="205" r="13" fill="#1f2937" />
      <circle cx="217" cy="199" r="4" fill="white" />
      <path d="M 140 250 Q 170 275 210 258" stroke="#166534" strokeWidth="8" fill="none" strokeLinecap="round" />
      <ellipse cx="200" cy="430" rx="38" ry="22" fill={spike} />
      <ellipse cx="310" cy="430" rx="38" ry="22" fill={spike} />
    </svg>
  )
}

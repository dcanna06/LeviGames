import type { ReactElement } from 'react'

/** Checkered-flag icon for the "done, drive off" button. */
export function CheckeredFlagIcon({ className }: { className?: string }) {
  const cell = 12.5
  const cells: ReactElement[] = []
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      if ((row + col) % 2 === 0) {
        cells.push(
          <rect key={`${row}-${col}`} x={10 + col * cell} y={10 + row * cell} width={cell} height={cell} fill="#1f2937" />,
        )
      }
    }
  }
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect x="7" y="45" width="6" height="48" rx="2" fill="#78716c" />
      <rect x="10" y="8" width="52" height="52" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2" />
      {cells}
    </svg>
  )
}

/**
 * Shared paint: gradients, filters and patterns used by every piece of the
 * garage scene. One light source — the work lamp hanging top-right — drives
 * every gradient direction and highlight placement so the parts read as one
 * lit object rather than a pile of flat fills.
 *
 * Filters are only ever applied to static art (never to elements that
 * animate) so the compositor can keep the animations on the GPU.
 */
export function SceneDefs() {
  return (
    <defs>
      {/* Championship White paint: bright roof, cooler flanks, shaded sills */}
      <linearGradient id="fg-paint" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.45" stopColor="#f4f6f8" />
        <stop offset="0.8" stopColor="#dfe4ea" />
        <stop offset="1" stopColor="#b9c2cc" />
      </linearGradient>
      {/* long specular streak that runs along the shoulder line */}
      <linearGradient id="fg-spec" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0" />
        <stop offset="0.35" stopColor="#ffffff" stopOpacity="0.95" />
        <stop offset="0.7" stopColor="#ffffff" stopOpacity="0.6" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
      </linearGradient>
      {/* tinted glass with a sky reflection sweeping across it */}
      <linearGradient id="fg-glass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#dff3ff" />
        <stop offset="0.45" stopColor="#8ec9ea" />
        <stop offset="0.5" stopColor="#c7e8f8" />
        <stop offset="0.56" stopColor="#7fbfe3" />
        <stop offset="1" stopColor="#2f6f95" />
      </linearGradient>
      <linearGradient id="fg-glass-dirty" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#b7ab96" />
        <stop offset="1" stopColor="#7d6f5c" />
      </linearGradient>
      {/* gloss black aero parts */}
      <linearGradient id="fg-aero" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3f3f46" />
        <stop offset="0.5" stopColor="#18181b" />
        <stop offset="1" stopColor="#09090b" />
      </linearGradient>
      {/* rubber: lit sidewall up-left, deep shadow on the far edge */}
      <radialGradient id="fg-tyre" cx="0.38" cy="0.32" r="0.75">
        <stop offset="0" stopColor="#4b4b52" />
        <stop offset="0.55" stopColor="#1c1c21" />
        <stop offset="1" stopColor="#050506" />
      </radialGradient>
      {/* gunmetal alloy with a highlight in the lamp's direction */}
      <radialGradient id="fg-alloy" cx="0.4" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#9a9aa3" />
        <stop offset="0.6" stopColor="#4c4c55" />
        <stop offset="1" stopColor="#26262c" />
      </radialGradient>
      <linearGradient id="fg-spoke" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#b4b4bd" />
        <stop offset="0.5" stopColor="#6b6b74" />
        <stop offset="1" stopColor="#3a3a41" />
      </linearGradient>
      <radialGradient id="fg-rotor" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#71717a" />
        <stop offset="0.7" stopColor="#a1a1aa" />
        <stop offset="1" stopColor="#52525b" />
      </radialGradient>
      <linearGradient id="fg-chrome" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f8fafc" />
        <stop offset="0.4" stopColor="#94a3b8" />
        <stop offset="0.55" stopColor="#e2e8f0" />
        <stop offset="1" stopColor="#475569" />
      </linearGradient>
      <linearGradient id="fg-red" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f87171" />
        <stop offset="0.5" stopColor="#dc2626" />
        <stop offset="1" stopColor="#991b1b" />
      </linearGradient>
      <linearGradient id="fg-blue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#60a5fa" />
        <stop offset="0.5" stopColor="#2563eb" />
        <stop offset="1" stopColor="#1e3a8a" />
      </linearGradient>
      <linearGradient id="fg-yellow" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fde047" />
        <stop offset="0.5" stopColor="#eab308" />
        <stop offset="1" stopColor="#a16207" />
      </linearGradient>
      <linearGradient id="fg-green" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#4ade80" />
        <stop offset="0.5" stopColor="#16a34a" />
        <stop offset="1" stopColor="#14532d" />
      </linearGradient>
      <linearGradient id="fg-lamp-white" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.6" stopColor="#bae6fd" />
        <stop offset="1" stopColor="#7dd3fc" />
      </linearGradient>
      <linearGradient id="fg-tail-red" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#7f1d1d" />
        <stop offset="0.5" stopColor="#ef4444" />
        <stop offset="1" stopColor="#fca5a5" />
      </linearGradient>

      {/* garage environment */}
      <linearGradient id="fg-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#cfd8e3" />
        <stop offset="1" stopColor="#eef2f6" />
      </linearGradient>
      <linearGradient id="fg-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#8a929c" />
        <stop offset="1" stopColor="#5f6771" />
      </linearGradient>
      <radialGradient id="fg-lamp-glow" cx="0.5" cy="0" r="1">
        <stop offset="0" stopColor="#fff7d6" stopOpacity="0.85" />
        <stop offset="0.5" stopColor="#fff1b8" stopOpacity="0.28" />
        <stop offset="1" stopColor="#fff1b8" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="fg-ao" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#000000" stopOpacity="0.55" />
        <stop offset="0.6" stopColor="#000000" stopOpacity="0.25" />
        <stop offset="1" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="fg-steel" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#64748b" />
        <stop offset="0.5" stopColor="#cbd5e1" />
        <stop offset="1" stopColor="#64748b" />
      </linearGradient>
      <linearGradient id="fg-skin" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6cfa3" />
        <stop offset="1" stopColor="#dda772" />
      </linearGradient>
      <linearGradient id="fg-overalls" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#1e3a8a" />
        <stop offset="0.45" stopColor="#2f55c9" />
        <stop offset="1" stopColor="#1e3a8a" />
      </linearGradient>

      {/* honeycomb mesh for the Type R's front intake */}
      <pattern id="fg-mesh" width="7" height="6" patternUnits="userSpaceOnUse">
        <path d="M 3.5,0.4 L 6.4,2 L 6.4,4.4 L 3.5,6 L 0.6,4.4 L 0.6,2 Z" fill="none" stroke="#52525b" strokeWidth="0.9" />
      </pattern>

      {/* soft contact shadow for static props */}
      <filter id="fg-shadow" x="-20%" y="-20%" width="140%" height="160%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#0f172a" floodOpacity="0.35" />
      </filter>
      <filter id="fg-blur" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="5" />
      </filter>
    </defs>
  )
}

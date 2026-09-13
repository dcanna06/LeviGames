import type { ReactElement } from 'react'
import { motion } from 'framer-motion'
import {
  ARCH_CTRL_Y,
  ARCH_HALF_W,
  COWL_X,
  COWL_Y,
  DECK_Y,
  FRONT_WHEEL_CX,
  HATCH_X,
  HATCH_Y,
  NOSE_X,
  REAR_WHEEL_CX,
  ROCKER_Y,
  ROOF_FRONT_X,
  ROOF_REAR_X,
  ROOF_Y,
  TAIL_X,
  GLASS_PATH,
  VIEW_H,
  VIEW_W,
} from './layout'

/**
 * Vehicle bodies, all drawn against the shared coordinate system in layout.ts
 * so the wheels, glazing and bumper overlays line up on every one of them.
 *
 * Shading follows the cel-shaded vector style: a base gradient lit from the
 * work lamp (top right), one flat shadow tone along the sills, one specular
 * streak along the shoulder line, a rim light on the roof, and a thin outline.
 */

export type VehicleType = 'car' | 'truck' | 'digger'

export const VEHICLE_TYPES: VehicleType[] = ['car', 'truck', 'digger']

const OUTLINE = '#475569'

/** One wheel arch, apex raised clear of the tyre. */
function arch(cx: number): string {
  const left = cx - ARCH_HALF_W
  const right = cx + ARCH_HALF_W
  return ` L ${left},${ROCKER_Y} C ${left},${ARCH_CTRL_Y} ${right},${ARCH_CTRL_Y} ${right},${ROCKER_Y}`
}

/**
 * The dark inside of each wheel arch, with an arch liner lip. Drawn under the
 * wheels so a missing wheel reveals a believable empty well.
 */
function ArchVoids() {
  return (
    <g aria-hidden="true">
      {[REAR_WHEEL_CX, FRONT_WHEEL_CX].map((cx) => (
        <g key={cx}>
          <path
            d={`M ${cx - ARCH_HALF_W},${DECK_Y} L ${cx - ARCH_HALF_W},${ROCKER_Y - 16} C ${cx - ARCH_HALF_W},${
              ARCH_CTRL_Y - 6
            } ${cx + ARCH_HALF_W},${ARCH_CTRL_Y - 6} ${cx + ARCH_HALF_W},${ROCKER_Y - 16} L ${cx + ARCH_HALF_W},${DECK_Y} Z`}
            fill="#111114"
          />
          {/* suspension strut and lower arm visible in the well */}
          <rect x={cx - 3} y={ROCKER_Y - 50} width="6" height="40" rx="2" fill="#3f3f46" />
          <rect x={cx - 22} y={ROCKER_Y - 4} width="44" height="6" rx="3" fill="#3f3f46" />
        </g>
      ))}
    </g>
  )
}

/** Soft contact shadow under a vehicle plus the darker patch between the wheels. */
function UnderShadow() {
  return (
    <g aria-hidden="true">
      <ellipse cx={(TAIL_X + NOSE_X) / 2} cy={DECK_Y - 1} rx={(NOSE_X - TAIL_X) / 2 + 10} ry="9" fill="url(#fg-ao)" />
    </g>
  )
}

/** Per-vehicle glazing so the hose repair fits the cab it's washing. */
export const VEHICLE_GLASS: Record<VehicleType, string> = {
  car: GLASS_PATH,
  truck: 'M 270,126 L 350,126 L 392,160 L 270,160 Z',
  digger: 'M 268,124 L 356,124 L 356,162 L 268,162 Z',
}

/** Championship White FL5 Civic Type R, nose to the right. */
export function CarBody() {
  const shell =
    `M ${TAIL_X},200` +
    ` C ${TAIL_X},210 132,${ROCKER_Y} 144,${ROCKER_Y}` +
    arch(REAR_WHEEL_CX) +
    arch(FRONT_WHEEL_CX) +
    ` L 476,${ROCKER_Y}` +
    ` C 488,${ROCKER_Y} ${NOSE_X},208 ${NOSE_X},200` +
    ` L ${NOSE_X},190` +
    ` C 491,182 478,177 460,175` +
    ` C 438,172 416,167 ${COWL_X},${COWL_Y}` +
    ` C 384,144 362,127 ${ROOF_FRONT_X},${ROOF_Y}` +
    ` C 312,116 278,116 ${ROOF_REAR_X},${ROOF_Y}` +
    ` C 230,122 206,132 184,142` +
    ` L ${HATCH_X},${HATCH_Y - 4}` +
    ` L ${HATCH_X + 2},${HATCH_Y + 2}` +
    ` C 154,158 140,168 134,180` +
    ` C 128,188 ${TAIL_X},194 ${TAIL_X},200 Z`

  return (
    <g aria-hidden="true">
      <UnderShadow />
      <ArchVoids />

      {/* body shell */}
      <path d={shell} fill="url(#fg-paint)" stroke={OUTLINE} strokeWidth="1.6" strokeLinejoin="round" />

      {/* cel shadow tone along the lower doors and sills */}
      <path
        d={`M 142,188 Q 300,196 478,198 L 478,${ROCKER_Y} L 146,${ROCKER_Y} Z`}
        fill="#0f172a"
        opacity="0.09"
      />
      {/* shadow the roof casts onto the C-pillar and rear glass */}
      <path d="M 184,142 C 206,132 230,122 252,119 L 262,120 C 240,127 218,137 198,148 Z" fill="#0f172a" opacity="0.08" />

      {/* rear hatch glass: dark sliver seen edge-on down the fastback */}
      <path d="M 246,122 C 226,126 206,134 188,142 L 172,146 L 190,137 C 210,128 230,122 246,120 Z" fill="#1e3a5f" />
      <path d="M 240,123 C 224,127 210,133 198,139" stroke="#93c5fd" strokeWidth="1.4" opacity="0.6" strokeLinecap="round" />

      {/* side glazing frame and B-pillar behind the glass overlay */}
      <path d={GLASS_PATH} fill="#0f172a" />
      <path d="M 296,127 L 300,159" stroke="#0f172a" strokeWidth="5" />

      {/* rocker side skirt (gloss black) */}
      <path d={`M 230,206 L 382,206 L 380,${ROCKER_Y} L 232,${ROCKER_Y} Z`} fill="url(#fg-aero)" />
      <path d="M 236,208 L 378,208" stroke="#71717a" strokeWidth="1" opacity="0.7" />

      {/* rear diffuser + centre-exit triple exhaust */}
      <path d={`M ${TAIL_X},198 L 160,201 L 156,${ROCKER_Y} L 140,${ROCKER_Y} C 130,${ROCKER_Y} ${TAIL_X},208 ${TAIL_X},200 Z`} fill="url(#fg-aero)" />
      <ellipse cx={TAIL_X + 3} cy="203" rx="4.5" ry="3.6" fill="url(#fg-chrome)" stroke="#334155" strokeWidth="1" />
      <ellipse cx={TAIL_X + 3} cy="210" rx="4" ry="3.2" fill="url(#fg-chrome)" stroke="#334155" strokeWidth="1" />
      <ellipse cx={TAIL_X + 3} cy="203" rx="2" ry="1.6" fill="#0f172a" />
      <ellipse cx={TAIL_X + 3} cy="210" rx="1.8" ry="1.4" fill="#0f172a" />

      {/* full-width LED tail lamp bar wrapping the corner */}
      <path d="M 130,182 L 160,164 L 164,171 L 133,191 Z" fill="url(#fg-tail-red)" stroke="#7f1d1d" strokeWidth="1" />
      <path d="M 135,185 L 159,169" stroke="#fecaca" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
      {/* Type R badge on the tailgate */}
      <rect x="148" y="195" width="16" height="5.5" rx="2" fill="url(#fg-red)" stroke="#7f1d1d" strokeWidth="0.6" />

      {/* doors: shut lines and flush handles */}
      <path d="M 300,161 C 300,180 298,196 296,206" stroke="#94a3b8" strokeWidth="1.4" fill="none" opacity="0.9" />
      <path d="M 390,164 C 390,180 388,196 386,206" stroke="#94a3b8" strokeWidth="1.4" fill="none" opacity="0.9" />
      <path d="M 224,164 C 226,180 228,196 230,206" stroke="#94a3b8" strokeWidth="1.2" fill="none" opacity="0.7" />
      <rect x="312" y="176" width="18" height="5" rx="2.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />
      <rect x="402" y="178" width="18" height="5" rx="2.5" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="0.8" />

      {/* front fender vent behind the wheel */}
      <path d="M 366,192 L 377,190 L 378,205 L 367,207 Z" fill="url(#fg-aero)" />
      <path d="M 369,196 L 375,195 M 369,201 L 375,200" stroke="#71717a" strokeWidth="1" />

      {/* bonnet vent */}
      <path d="M 428,170 L 452,174 L 450,178 L 426,175 Z" fill="#3f3f46" />
      <path d="M 431,172 L 448,175" stroke="#71717a" strokeWidth="0.8" />

      {/* slim swept LED headlamp */}
      <path d="M 450,177 L 490,185 L 491,193 L 454,187 Z" fill="url(#fg-lamp-white)" stroke={OUTLINE} strokeWidth="1.2" />
      <path d="M 456,182 L 486,188" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <path d="M 457,185 L 484,191" stroke="#0ea5e9" strokeWidth="1" strokeLinecap="round" opacity="0.7" />

      {/* bumper cavity: crash beam and the dark void the bumper overlay covers */}
      <path d={`M 466,194 L ${NOSE_X},196 L ${NOSE_X},206 C ${NOSE_X},210 488,${ROCKER_Y} 478,${ROCKER_Y} L 464,209 Z`} fill="#1c1917" />
      <rect x="466" y="199" width="26" height="6" rx="2" fill="url(#fg-steel)" stroke="#334155" strokeWidth="0.8" />

      {/* door mirror on the A-pillar base */}
      <path d="M 392,151 L 408,149 L 410,160 L 396,161 Z" fill="url(#fg-aero)" stroke={OUTLINE} strokeWidth="1" />
      <path d="M 396,153 L 404,152" stroke="#a1a1aa" strokeWidth="1" />

      {/* shoulder specular streak and roof rim light */}
      <path d="M 150,171 Q 300,178 470,182" stroke="url(#fg-spec)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d={`M ${ROOF_REAR_X + 6},${ROOF_Y - 0.5} Q 296,${ROOF_Y - 3} ${ROOF_FRONT_X - 6},${ROOF_Y - 0.5}`} stroke="#ffffff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.9" />
      <path d="M 404,165 C 424,168 446,172 466,176" stroke="#ffffff" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.8" />
    </g>
  )
}

/** Blue box truck sharing the same wheelbase and running gear. */
export function TruckBody() {
  const cab =
    `M 262,${ROCKER_Y}` +
    arch(FRONT_WHEEL_CX) +
    ` L 474,${ROCKER_Y}` +
    ` C 488,${ROCKER_Y} ${NOSE_X},208 ${NOSE_X},198` +
    ` L ${NOSE_X},172` +
    ` C 492,166 470,162 452,160` +
    ` L 404,158` +
    ` L 356,118` +
    ` L 262,118 Z`

  const chassis = `M ${TAIL_X},${ROCKER_Y - 6}` + arch(REAR_WHEEL_CX) + ` L 262,${ROCKER_Y} L 262,${ROCKER_Y - 6} Z`

  return (
    <g aria-hidden="true">
      <UnderShadow />
      <ArchVoids />
      {/* chassis rail behind the rear wheel */}
      <path d={chassis} fill="#1f2937" stroke="#0f172a" strokeWidth="1" />
      {/* cargo box with corrugated panels and a roll-up rear door */}
      <rect x={TAIL_X} y="92" width="140" height="122" rx="5" fill="url(#fg-blue)" stroke="#1e3a8a" strokeWidth="1.6" />
      <rect x={TAIL_X + 8} y="100" width="124" height="4" rx="2" fill="#93c5fd" opacity="0.7" />
      {[112, 124, 136, 148, 160, 172, 184, 196].map((y) => (
        <path key={y} d={`M ${TAIL_X + 10},${y} L ${TAIL_X + 130},${y}`} stroke="#1e40af" strokeWidth="1.2" opacity="0.6" />
      ))}
      <rect x={TAIL_X + 2} y="104" width="12" height="100" rx="2" fill="#1e3a8a" opacity="0.7" />
      <path d={`M ${TAIL_X + 2},112 L ${TAIL_X + 14},112 M ${TAIL_X + 2},130 L ${TAIL_X + 14},130 M ${TAIL_X + 2},148 L ${TAIL_X + 14},148 M ${TAIL_X + 2},166 L ${TAIL_X + 14},166 M ${TAIL_X + 2},184 L ${TAIL_X + 14},184`} stroke="#60a5fa" strokeWidth="1" />
      <path d={`M ${TAIL_X},96 L ${TAIL_X + 140},96`} stroke="#bfdbfe" strokeWidth="2" opacity="0.9" />
      {/* rear mudflap and tail lamp */}
      <rect x="150" y="196" width="14" height="10" rx="2" fill="url(#fg-tail-red)" stroke="#7f1d1d" strokeWidth="0.8" />
      <rect x="128" y="196" width="18" height="10" rx="2" fill="#fde68a" stroke="#a16207" strokeWidth="0.8" />

      {/* cab */}
      <path d={cab} fill="url(#fg-blue)" stroke="#1e3a8a" strokeWidth="1.6" strokeLinejoin="round" />
      <path d={`M 262,190 Q 380,196 480,198 L 480,${ROCKER_Y} L 262,${ROCKER_Y} Z`} fill="#0f172a" opacity="0.12" />
      <path d={VEHICLE_GLASS.truck} fill="#0f172a" />
      <path d="M 262,118 L 356,118" stroke="#bfdbfe" strokeWidth="2" opacity="0.9" />
      <path d="M 270,164 L 380,164 L 392,178 L 270,178 Z" fill="#1e3a8a" opacity="0.5" />
      <rect x="290" y="168" width="20" height="5" rx="2.5" fill="#cbd5e1" />
      {/* roof marker lamps */}
      {[272, 292, 312, 332].map((x) => (
        <rect key={x} x={x} y="112" width="8" height="5" rx="2" fill="#fbbf24" stroke="#b45309" strokeWidth="0.6" />
      ))}
      {/* mirror */}
      <rect x="392" y="126" width="8" height="18" rx="2" fill="#0f172a" />
      <path d="M 396,124 L 366,124" stroke="#0f172a" strokeWidth="2" />
      {/* grille, headlamp, chrome bumper */}
      <path d="M 462,164 L 490,170 L 490,182 L 462,178 Z" fill="url(#fg-lamp-white)" stroke={OUTLINE} strokeWidth="1" />
      <path d="M 466,168 L 486,173" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      <path d={`M 470,186 L ${NOSE_X},188 L ${NOSE_X},204 L 470,202 Z`} fill="#09090b" />
      <path d={`M 470,186 L ${NOSE_X},188 L ${NOSE_X},204 L 470,202 Z`} fill="url(#fg-mesh)" />
      <path d="M 262,186 Q 380,192 478,194" stroke="url(#fg-spec)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
    </g>
  )
}

/** Yellow wheeled excavator: cab, boom, dipper and bucket over the bonnet. */
export function DiggerBody() {
  const body =
    `M ${TAIL_X},168` +
    ` L ${TAIL_X},${ROCKER_Y - 6}` +
    ` L 142,${ROCKER_Y - 6}` +
    ` L 150,${ROCKER_Y}` +
    arch(REAR_WHEEL_CX) +
    arch(FRONT_WHEEL_CX) +
    ` L 474,${ROCKER_Y}` +
    ` C 488,${ROCKER_Y} ${NOSE_X},208 ${NOSE_X},198` +
    ` L ${NOSE_X},178` +
    ` L 404,170` +
    ` L 262,168 Z`

  return (
    <g aria-hidden="true">
      <UnderShadow />
      <ArchVoids />
      {/* counterweight at the rear */}
      <rect x={TAIL_X} y="150" width="60" height="60" rx="6" fill="#a16207" stroke="#713f12" strokeWidth="1.4" />
      <path d={`M ${TAIL_X + 6},158 L ${TAIL_X + 54},158 M ${TAIL_X + 6},170 L ${TAIL_X + 54},170`} stroke="#854d0e" strokeWidth="2" />
      {/* engine deck + exhaust stack */}
      <rect x="150" y="128" width="112" height="44" rx="6" fill="url(#fg-yellow)" stroke="#713f12" strokeWidth="1.4" />
      <path d="M 160,140 L 250,140 M 160,150 L 250,150 M 160,160 L 250,160" stroke="#a16207" strokeWidth="1.5" opacity="0.7" />
      <rect x="176" y="96" width="10" height="36" rx="3" fill="#3f3f46" stroke="#18181b" strokeWidth="1" />
      <rect x="172" y="92" width="18" height="8" rx="3" fill="#52525b" />
      {/* undercarriage / body */}
      <path d={body} fill="url(#fg-yellow)" stroke="#713f12" strokeWidth="1.6" strokeLinejoin="round" />
      <path d={`M ${TAIL_X},192 Q 300,198 478,200 L 478,${ROCKER_Y} L ${TAIL_X},${ROCKER_Y} Z`} fill="#0f172a" opacity="0.12" />
      {/* cab with roll-over frame */}
      <rect x="262" y="112" width="102" height="60" rx="7" fill="url(#fg-yellow)" stroke="#713f12" strokeWidth="1.6" />
      <path d={VEHICLE_GLASS.digger} fill="#0f172a" />
      <path d="M 262,116 L 364,116" stroke="#fef08a" strokeWidth="2" opacity="0.9" />
      <rect x="258" y="108" width="110" height="6" rx="3" fill="#3f3f46" />
      {/* rotating beacon on the cab roof */}
      <rect x="330" y="98" width="14" height="10" rx="3" fill="#fb923c" stroke="#9a3412" strokeWidth="1" />
      <motion.rect
        x="332"
        y="100"
        width="10"
        height="6"
        rx="2"
        fill="#fff7ed"
        animate={{ opacity: [0, 0.95, 0] }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* boom, dipper and bucket with chrome hydraulic rams */}
      <path d="M 366,136 L 440,92 L 456,104 L 386,150 Z" fill="url(#fg-yellow)" stroke="#713f12" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M 448,98 L 486,130 L 476,142 L 438,110 Z" fill="url(#fg-yellow)" stroke="#713f12" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M 474,136 L 500,140 L 496,164 L 470,158 L 462,146 Z" fill="#78716c" stroke="#44403c" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M 470,158 L 496,164" stroke="#a8a29e" strokeWidth="2" />
      <path d="M 380,120 L 424,104" stroke="#3f3f46" strokeWidth="6" strokeLinecap="round" />
      <path d="M 398,113 L 424,104" stroke="url(#fg-steel)" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M 452,120 L 476,140" stroke="#3f3f46" strokeWidth="6" strokeLinecap="round" />
      <path d="M 462,128 L 476,140" stroke="url(#fg-steel)" strokeWidth="3.5" strokeLinecap="round" />
      {[[366, 136], [448, 98], [474, 136]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="3.5" fill="#3f3f46" stroke="#18181b" strokeWidth="1" />
      ))}
      {/* headlamps and warning chevrons */}
      <path d="M 464,182 L 490,186 L 490,196 L 464,192 Z" fill="url(#fg-lamp-white)" stroke={OUTLINE} strokeWidth="1" />
      <path d="M 140,196 L 150,208 M 152,196 L 162,208 M 164,196 L 174,208" stroke="#0f172a" strokeWidth="3" opacity="0.5" />
      <path d={`M ${TAIL_X + 10},172 Q 300,178 470,182`} stroke="url(#fg-spec)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  )
}

export const VEHICLE_BODIES: Record<VehicleType, () => ReactElement> = {
  car: CarBody,
  truck: TruckBody,
  digger: DiggerBody,
}

/** Pegboard, shelf, lamp, lift and floor behind the whole scene. */
export function GarageBackdrop() {
  return (
    <g aria-hidden="true">
      <rect x="0" y="0" width={VIEW_W} height={DECK_Y} fill="url(#fg-wall)" />
      {/* painted dado and skirting */}
      <rect x="0" y="150" width={VIEW_W} height={DECK_Y - 150} fill="#a7b3c2" />
      <path d={`M 0,150 L ${VIEW_W},150`} stroke="#9aa6b5" strokeWidth="2" />
      <path d={`M 0,${DECK_Y - 6} L ${VIEW_W},${DECK_Y - 6}`} stroke="#8e99a8" strokeWidth="3" />
      {/* wall panel seams */}
      <path d="M 150,0 L 150,150 M 300,0 L 300,150 M 450,0 L 450,150" stroke="#dde4ec" strokeWidth="3" />

      {/* pegboard with hanging tools */}
      <rect x="10" y="32" width="112" height="86" rx="4" fill="#d9c7a8" stroke="#a88a5a" strokeWidth="1.5" />
      {Array.from({ length: 6 }, (_, r) =>
        Array.from({ length: 8 }, (_, c) => (
          <circle key={`${r}-${c}`} cx={20 + c * 13.5} cy={42 + r * 13} r="1.3" fill="#a88a5a" />
        )),
      )}
      {/* spanner */}
      <g transform="translate(30 44) rotate(20)">
        <rect x="-3" y="0" width="6" height="42" rx="2" fill="url(#fg-steel)" stroke="#334155" strokeWidth="0.8" />
        <circle cx="0" cy="-2" r="7" fill="url(#fg-steel)" stroke="#334155" strokeWidth="0.8" />
        <circle cx="0" cy="-2" r="2.5" fill="#d9c7a8" />
      </g>
      {/* screwdrivers */}
      <g transform="translate(62 42)">
        <rect x="-3" y="0" width="6" height="22" rx="3" fill="#ef4444" stroke="#7f1d1d" strokeWidth="0.8" />
        <rect x="-1.2" y="22" width="2.4" height="24" fill="#94a3b8" />
      </g>
      <g transform="translate(76 42)">
        <rect x="-3" y="0" width="6" height="22" rx="3" fill="#2563eb" stroke="#1e3a8a" strokeWidth="0.8" />
        <rect x="-1.2" y="22" width="2.4" height="24" fill="#94a3b8" />
      </g>
      {/* hammer */}
      <g transform="translate(100 46) rotate(-8)">
        <rect x="-2.5" y="8" width="5" height="40" rx="2" fill="#a16207" stroke="#713f12" strokeWidth="0.8" />
        <rect x="-10" y="0" width="20" height="10" rx="2" fill="#52525b" stroke="#18181b" strokeWidth="0.8" />
      </g>

      {/* shelf with tins and bottles */}
      <rect x="150" y="82" width="132" height="5" rx="1.5" fill="#8b6d45" />
      <path d="M 156,87 L 156,98 L 166,87 M 276,87 L 276,98 L 266,87" stroke="#6b5334" strokeWidth="2.5" fill="none" />
      <rect x="158" y="58" width="24" height="24" rx="2" fill="#d4d4d8" stroke="#52525b" strokeWidth="1" />
      <rect x="158" y="64" width="24" height="9" fill="#dc2626" />
      <rect x="188" y="52" width="26" height="30" rx="2" fill="#e4e4e7" stroke="#52525b" strokeWidth="1" />
      <rect x="188" y="60" width="26" height="10" fill="#2563eb" />
      <path d="M 222,82 L 222,64 Q 222,56 228,56 L 232,56 Q 238,56 238,64 L 238,82 Z" fill="#facc15" stroke="#a16207" strokeWidth="1" />
      <rect x="226" y="50" width="8" height="7" rx="1.5" fill="#dc2626" />
      <path d="M 246,82 L 246,62 Q 246,54 252,54 L 258,54 Q 264,54 264,62 L 264,82 Z" fill="#f8fafc" stroke="#52525b" strokeWidth="1" />
      <rect x="248" y="62" width="14" height="10" fill="#16a34a" />

      {/* hanging work lamp: cord, shade, bulb, glow and light cone */}
      <path d="M 440,0 L 440,50" stroke="#57534e" strokeWidth="2.5" />
      <path d="M 424,70 L 376,234 L 504,234 L 456,70 Z" fill="url(#fg-lamp-glow)" />
      <path d="M 418,50 L 462,50 L 470,72 L 410,72 Z" fill="#44403c" stroke="#292524" strokeWidth="1" />
      <path d="M 420,52 L 460,52 L 466,60 L 414,60 Z" fill="#78716c" />
      <ellipse cx="440" cy="72" rx="24" ry="5" fill="#fde68a" />
      <ellipse cx="440" cy="72" rx="10" ry="3.5" fill="#ffffff" />

      {/* floor */}
      <rect x="0" y={DECK_Y} width={VIEW_W} height={VIEW_H - DECK_Y} fill="url(#fg-floor)" />
      <path d={`M 0,${DECK_Y} L ${VIEW_W},${DECK_Y}`} stroke="#4b535d" strokeWidth="2" />
      <path d={`M 0,${DECK_Y + 18} L ${VIEW_W},${DECK_Y + 18}`} stroke="#6b737d" strokeWidth="1" opacity="0.7" />
      {[0, 80, 160, 240, 320, 400, 480].map((x) => (
        <path key={x} d={`M ${x},${DECK_Y} L ${x - 14},${VIEW_H}`} stroke="#6b737d" strokeWidth="1" opacity="0.6" />
      ))}

      {/* two-post lift: runways and hydraulic posts */}
      <rect x="108" y={DECK_Y - 2} width="400" height="12" rx="3" fill="url(#fg-steel)" stroke="#334155" strokeWidth="1" />
      <path d={`M 112,${DECK_Y + 4} L 504,${DECK_Y + 4}`} stroke="#e2e8f0" strokeWidth="1.5" opacity="0.8" />
      <rect x="146" y={DECK_Y + 10} width="30" height="20" rx="3" fill="#475569" stroke="#1e293b" strokeWidth="1" />
      <rect x="426" y={DECK_Y + 10} width="30" height="20" rx="3" fill="#475569" stroke="#1e293b" strokeWidth="1" />
      <rect x="152" y={DECK_Y + 14} width="18" height="4" rx="2" fill="#94a3b8" />
      <rect x="432" y={DECK_Y + 14} width="18" height="4" rx="2" fill="#94a3b8" />
    </g>
  )
}

/** Drifting dust motes in the lamp light; the only backdrop element that moves. */
export function Ambience() {
  const motes = [
    { x: 418, y: 100, d: 6.5 },
    { x: 448, y: 130, d: 8 },
    { x: 432, y: 160, d: 7 },
    { x: 462, y: 110, d: 9 },
    { x: 440, y: 190, d: 7.5 },
  ]
  return (
    <g aria-hidden="true">
      {motes.map((m, i) => (
        <motion.circle
          key={i}
          cx={m.x}
          cy={m.y}
          r="1.4"
          fill="#fffbeb"
          animate={{ y: [0, -14, 0], x: [0, 5, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: m.d, repeat: Infinity, ease: 'easeInOut', delay: i * 0.9 }}
        />
      ))}
    </g>
  )
}

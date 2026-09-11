import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import { motion, type PanInfo } from 'framer-motion'
import { GameShell } from '../../shared/GameShell'
import { BigButton } from '../../shared/BigButton'
import { Confetti } from '../../shared/Confetti'
import { useProgress } from '../../shared/useProgress'
import { sfx, unlockAudio } from '../../shared/audio'
import { CheckeredFlagIcon } from './icons'
import { GarageBackdrop, VEHICLE_BODIES, VEHICLE_TYPES, type VehicleType } from './vehicles'
import { Mechanic, ToolChest } from './mechanic'
import {
  WheelPart,
  TirePart,
  WindshieldPart,
  BumperPart,
  WingPart,
  DecalPart,
  WingIcon,
  DecalIcon,
  PART_ITEMS,
  type PartItemDef,
  type WingColor,
  type DecalColor,
} from './parts'
import { TOOLS, type ToolDef } from './tools'
import { ALL_PROBLEMS, ZONES, zoneStyle, VIEW_W, VIEW_H, type ProblemKey } from './layout'

/**
 * Fix-It Garage: a car sits on the lift with 2-4 broken parts and a mechanic
 * standing by. Drag the matching tool onto a broken part to fix it (the wrong
 * tool simply does nothing — no penalty, just try again). A parts tray adds
 * cosmetic extras, and the checkered flag sends the car off at any time.
 *
 * Deviation from the spec: "hood popped open" is skipped as a problem type
 * since the spec gives it no matching tool or sound; only the four clearly
 * specified pairs are used (wrench/wheel, pump/tyre, hose/glass, hammer/bumper).
 */

type DriveState = 'idle' | 'rev' | 'out' | 'in'

function randomVehicleType(): VehicleType {
  return VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)]
}

function randomFixedState(): Record<ProblemKey, boolean> {
  const shuffled = [...ALL_PROBLEMS].sort(() => Math.random() - 0.5)
  const count = 2 + Math.floor(Math.random() * 3)
  const active = new Set(shuffled.slice(0, count))
  const fixed = {} as Record<ProblemKey, boolean>
  ALL_PROBLEMS.forEach((problem) => {
    fixed[problem] = !active.has(problem)
  })
  return fixed
}

/** Forgiving hit test: is the drop point within `margin` px of the zone's box? */
function pointInZone(point: { x: number; y: number }, ref: RefObject<HTMLDivElement | null>, margin = 60): boolean {
  const rect = ref.current?.getBoundingClientRect()
  if (!rect) return false
  return (
    point.x > rect.left - margin &&
    point.x < rect.right + margin &&
    point.y > rect.top - margin &&
    point.y < rect.bottom + margin
  )
}

type DraggableItemProps = {
  ariaLabel: string
  bg: string
  onDrop: (point: { x: number; y: number }) => void
  children: ReactNode
}

/** A tray item that springs back to its slot unless dropped on a matching zone. */
function DraggableItem({ ariaLabel, bg, onDrop, children }: DraggableItemProps) {
  return (
    <motion.div
      role="button"
      aria-label={ariaLabel}
      drag
      dragSnapToOrigin
      dragElastic={0.2}
      dragMomentum={false}
      whileTap={{ scale: 0.92 }}
      whileDrag={{ scale: 1.12, zIndex: 50 }}
      onDragEnd={(_event, info: PanInfo) => onDrop(info.point)}
      className="flex h-24 w-24 shrink-0 touch-none select-none items-center justify-center rounded-[1.75rem] shadow-lg"
      style={{ backgroundColor: bg }}
    >
      {children}
    </motion.div>
  )
}

export function FixItGarageGame() {
  const { addSticker } = useProgress('fix-it-garage')

  const [vehicleType, setVehicleType] = useState<VehicleType>(() => randomVehicleType())
  const [vehicleKey, setVehicleKey] = useState(0)
  const [fixed, setFixed] = useState<Record<ProblemKey, boolean>>(() => randomFixedState())
  const [wingColor, setWingColor] = useState<WingColor | null>(null)
  const [decalColor, setDecalColor] = useState<DecalColor | null>(null)
  const [driveState, setDriveState] = useState<DriveState>('idle')
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const [confettiOrigin, setConfettiOrigin] = useState({ x: 50, y: 50 })
  const [fixPulse, setFixPulse] = useState(0)

  const driveStateRef = useRef<DriveState>('idle')
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  const wheelZoneRef = useRef<HTMLDivElement>(null)
  const tireZoneRef = useRef<HTMLDivElement>(null)
  const windshieldZoneRef = useRef<HTMLDivElement>(null)
  const bumperZoneRef = useRef<HTMLDivElement>(null)
  const wingZoneRef = useRef<HTMLDivElement>(null)
  const decalZoneRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [])

  const getProblemZoneRef = useCallback((problem: ProblemKey): RefObject<HTMLDivElement | null> => {
    if (problem === 'wheel') return wheelZoneRef
    if (problem === 'tire') return tireZoneRef
    if (problem === 'windshield') return windshieldZoneRef
    return bumperZoneRef
  }, [])

  const fireConfettiAt = useCallback((ref: RefObject<HTMLDivElement | null>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (rect) {
      setConfettiOrigin({
        x: ((rect.left + rect.width / 2) / window.innerWidth) * 100,
        y: ((rect.top + rect.height / 2) / window.innerHeight) * 100,
      })
    }
    setConfettiTrigger((n) => n + 1)
  }, [])

  /** Rev bounce, honk, drive off screen, then roll a fresh vehicle in. */
  const driveOff = useCallback(() => {
    if (driveStateRef.current !== 'idle') return
    driveStateRef.current = 'rev'
    setDriveState('rev')
    unlockAudio()
    sfx.honk()
    void addSticker()
    setConfettiOrigin({ x: 50, y: 45 })
    setConfettiTrigger((n) => n + 1)

    const t1 = setTimeout(() => {
      driveStateRef.current = 'out'
      setDriveState('out')
    }, 280)

    const t2 = setTimeout(() => {
      setVehicleType(randomVehicleType())
      setFixed(randomFixedState())
      setWingColor(null)
      setDecalColor(null)
      setVehicleKey((k) => k + 1)
      driveStateRef.current = 'in'
      setDriveState('in')
    }, 280 + 650)

    const t3 = setTimeout(() => {
      driveStateRef.current = 'idle'
      setDriveState('idle')
    }, 280 + 650 + 600)

    timeoutsRef.current.push(t1, t2, t3)
  }, [addSticker])

  // Auto drive-off once every problem on this vehicle is fixed.
  useEffect(() => {
    const allFixed = ALL_PROBLEMS.every((problem) => fixed[problem])
    if (allFixed && driveStateRef.current === 'idle') {
      driveOff()
    }
  }, [fixed, driveOff])

  const handleToolDrop = useCallback(
    (tool: ToolDef, point: { x: number; y: number }) => {
      if (fixed[tool.problem]) return
      const zoneRef = getProblemZoneRef(tool.problem)
      if (!pointInZone(point, zoneRef)) return
      unlockAudio()
      sfx[tool.sound]()
      setFixed((prev) => ({ ...prev, [tool.problem]: true }))
      setFixPulse((n) => n + 1)
      fireConfettiAt(zoneRef)
    },
    [fixed, getProblemZoneRef, fireConfettiAt],
  )

  const handlePartDrop = useCallback((item: PartItemDef, point: { x: number; y: number }) => {
    if (item.kind === 'wing') {
      if (!pointInZone(point, wingZoneRef)) return
      unlockAudio()
      sfx.partClick()
      setWingColor(item.color)
    } else {
      if (!pointInZone(point, decalZoneRef)) return
      unlockAudio()
      sfx.partClick()
      setDecalColor(item.color)
    }
    setFixPulse((n) => n + 1)
  }, [])

  const removeWing = useCallback(() => {
    if (!wingColor) return
    unlockAudio()
    sfx.partPop()
    setWingColor(null)
  }, [wingColor])

  const removeDecal = useCallback(() => {
    if (!decalColor) return
    unlockAudio()
    sfx.partPop()
    setDecalColor(null)
  }, [decalColor])

  const Body = VEHICLE_BODIES[vehicleType]

  const carAnimate =
    driveState === 'rev'
      ? { x: [0, -10, 10, -6, 0], scale: [1, 1.03, 1, 1.02, 1] }
      : driveState === 'out'
        ? { x: 620 }
        : { x: 0 }

  const carTransition =
    driveState === 'rev'
      ? { duration: 0.28, ease: 'easeInOut' as const }
      : driveState === 'out'
        ? { duration: 0.65, ease: 'easeIn' as const }
        : driveState === 'in'
          ? { type: 'spring' as const, stiffness: 120, damping: 16 }
          : { type: 'spring' as const, stiffness: 200, damping: 22 }

  return (
    <GameShell bgClassName="bg-orange-100">
      <div className="relative flex min-h-screen w-full flex-col items-center px-4 pb-6 pt-24">
        <div className="fixed right-4 top-4 z-40">
          <BigButton
            ariaLabel="All done, drive the car off"
            onClick={driveOff}
            idle="bounce"
            disabled={driveState !== 'idle'}
            className="h-20 w-20 bg-white p-3"
          >
            <CheckeredFlagIcon className="h-full w-full" />
          </BigButton>
        </div>

        <div className="flex w-full max-w-2xl flex-1 items-center justify-center py-4">
          <div className="relative w-full" style={{ aspectRatio: `${VIEW_W} / ${VIEW_H}` }}>
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              className="absolute inset-0 h-full w-full overflow-hidden rounded-[1.5rem]"
              preserveAspectRatio="xMidYMid meet"
            >
              <GarageBackdrop />
              <ToolChest />

              <motion.g key={vehicleKey} initial={driveState === 'in' ? { x: -620 } : false} animate={carAnimate} transition={carTransition}>
                <Body />
                <BumperPart ok={fixed.bumper} />
                <WindshieldPart ok={fixed.windshield} />
                {wingColor && <WingPart color={wingColor} />}
                {decalColor && <DecalPart color={decalColor} />}
                <WheelPart ok={fixed.wheel} />
                <TirePart ok={fixed.tire} />
              </motion.g>

              <Mechanic pulse={fixPulse} />
            </svg>

            <div ref={wheelZoneRef} className="pointer-events-none absolute" style={zoneStyle(ZONES.wheel)} />
            <div ref={tireZoneRef} className="pointer-events-none absolute" style={zoneStyle(ZONES.tire)} />
            <div ref={windshieldZoneRef} className="pointer-events-none absolute" style={zoneStyle(ZONES.windshield)} />
            <div ref={bumperZoneRef} className="pointer-events-none absolute" style={zoneStyle(ZONES.bumper)} />
            <div
              ref={wingZoneRef}
              role="button"
              aria-label="Wing on the car, tap to take it off"
              className="absolute cursor-pointer touch-manipulation"
              style={zoneStyle(ZONES.wing)}
              onClick={removeWing}
            />
            <div
              ref={decalZoneRef}
              role="button"
              aria-label="Number sticker on the car, tap to take it off"
              className="absolute cursor-pointer touch-manipulation"
              style={zoneStyle(ZONES.decal)}
              onClick={removeDecal}
            />
          </div>
        </div>

        <div className="flex w-full max-w-xl flex-col items-center gap-4 rounded-[2rem] bg-white/50 p-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            {PART_ITEMS.map((item) => (
              <DraggableItem
                key={item.id}
                ariaLabel={item.kind === 'wing' ? 'Wing' : 'Number sticker'}
                bg={item.bg}
                onDrop={(point) => handlePartDrop(item, point)}
              >
                {item.kind === 'wing' ? (
                  <WingIcon color={item.color} className="h-14 w-14" />
                ) : (
                  <DecalIcon color={item.color} className="h-14 w-14" />
                )}
              </DraggableItem>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {TOOLS.map((tool) => (
              <DraggableItem
                key={tool.id}
                ariaLabel={tool.ariaLabel}
                bg={tool.bg}
                onDrop={(point) => handleToolDrop(tool, point)}
              >
                <tool.Icon className="h-14 w-14" />
              </DraggableItem>
            ))}
          </div>
        </div>
      </div>
      <Confetti trigger={confettiTrigger} origin={confettiOrigin} />
    </GameShell>
  )
}

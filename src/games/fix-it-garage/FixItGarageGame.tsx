import { useCallback, useEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'
import { motion, type PanInfo } from 'framer-motion'
import { GameShell } from '../../shared/GameShell'
import { BigButton } from '../../shared/BigButton'
import { Confetti } from '../../shared/Confetti'
import { useProgress } from '../../shared/useProgress'
import { sfx, unlockAudio } from '../../shared/audio'
import { CheckeredFlagIcon } from './icons'
import { SceneDefs } from './defs'
import { Ambience, GarageBackdrop, VEHICLE_BODIES, VEHICLE_GLASS, VEHICLE_TYPES, type VehicleType } from './vehicles'
import { Mechanic, ToolChest, type MechanicJob } from './mechanic'
import { Burst, BURST_LIFETIME, BURST_ORIGINS, type BurstDef, type BurstKind } from './effects'
import {
  WheelPart,
  TirePart,
  WindshieldPart,
  BumperPart,
  WingPart,
  DecalPart,
  WingIcon,
  DecalIcon,
  SpareWheel,
  PART_ITEMS,
  type PartItemDef,
  type Spin,
  type WingColor,
  type DecalColor,
} from './parts'
import { TOOLS, ToolDefs, type ToolDef, type ToolId } from './tools'
import { ALL_PROBLEMS, ANCHORS, DECK_Y, NOSE_X, TAIL_X, ZONES, zoneStyle, VIEW_W, VIEW_H, type ProblemKey } from './layout'

/**
 * Fix-It Garage: a car sits on the lift with 2-4 broken parts and a mechanic
 * standing by. Drag the matching tool onto a broken part to fix it (the wrong
 * tool simply does nothing — no penalty, just try again). A parts tray adds
 * cosmetic extras, and the checkered flag sends the car off at any time.
 *
 * Feedback is layered the way games do it: the part changes instantly, a
 * particle burst fires at the spot, the car body reacts (a squash from the
 * hammer, a suspension drop when the wheel goes on), the mechanic walks over
 * and works the part with the right tool, and the sound plays — all on top of
 * the confetti every game shares.
 *
 * Deviation from the spec: "hood popped open" is skipped as a problem type
 * since the spec gives it no matching tool or sound; only the four clearly
 * specified pairs are used (wrench/wheel, pump/tyre, hose/glass, hammer/bumper).
 */

type DriveState = 'idle' | 'rev' | 'out' | 'in'

type JoltKind = 'none' | 'hammer' | 'wrench' | 'pump' | 'land'
type Jolt = { id: number; kind: JoltKind }

const REV_MS = 420
const OUT_MS = 750
const IN_MS = 800
const JOB_MS = 1700

/** Optional QA overrides on the hash route, e.g. #/fix-it-garage?vehicle=car&problems=all */
function readQuery(): URLSearchParams {
  return new URLSearchParams(window.location.hash.split('?')[1] ?? '')
}

function randomVehicleType(): VehicleType {
  const forced = readQuery().get('vehicle') as VehicleType | null
  if (forced && VEHICLE_TYPES.includes(forced)) return forced
  return VEHICLE_TYPES[Math.floor(Math.random() * VEHICLE_TYPES.length)]
}

function randomFixedState(): Record<ProblemKey, boolean> {
  const all = readQuery().get('problems') === 'all'
  const shuffled = [...ALL_PROBLEMS].sort(() => Math.random() - 0.5)
  const count = all ? ALL_PROBLEMS.length : 2 + Math.floor(Math.random() * 3)
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

const JOLT_ANIMATION: Record<JoltKind, { animate: Record<string, number[]>; duration: number }> = {
  none: { animate: {}, duration: 0 },
  hammer: { animate: { scaleX: [1, 0.985, 1.01, 1], scaleY: [1, 0.94, 1.02, 1], x: [0, -5, 2, 0] }, duration: 0.45 },
  wrench: { animate: { y: [0, 6, -3, 1, 0] }, duration: 0.6 },
  pump: { animate: { y: [0, -5, 2, 0] }, duration: 0.5 },
  land: { animate: { y: [0, 5, -2, 0], scaleY: [1, 0.96, 1.01, 1] }, duration: 0.55 },
}

const JOLT_BY_TOOL: Record<ToolId, JoltKind> = { hammer: 'hammer', wrench: 'wrench', pump: 'pump', hose: 'none' }

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
      whileDrag={{ scale: 1.15, rotate: -6, zIndex: 50, boxShadow: '0 18px 30px rgba(15, 23, 42, 0.35)' }}
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
  const [bursts, setBursts] = useState<BurstDef[]>([])
  const [jolt, setJolt] = useState<Jolt>({ id: 0, kind: 'none' })
  const [job, setJob] = useState<MechanicJob | null>(null)

  const driveStateRef = useRef<DriveState>('idle')
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])
  const nextIdRef = useRef(1)

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

  const later = useCallback((fn: () => void, ms: number) => {
    timeoutsRef.current.push(setTimeout(fn, ms))
  }, [])

  const spawnBurst = useCallback(
    (kind: BurstKind, x: number, y: number) => {
      const id = nextIdRef.current++
      setBursts((prev) => [...prev, { id, kind, x, y }])
      later(() => setBursts((prev) => prev.filter((b) => b.id !== id)), BURST_LIFETIME[kind])
    },
    [later],
  )

  const jolCar = useCallback((kind: JoltKind) => {
    if (kind === 'none') return
    setJolt({ id: nextIdRef.current++, kind })
  }, [])

  /** Send the mechanic to a part with a tool; she walks back once the job is done. */
  const dispatchMechanic = useCallback(
    (tool: ToolId, x: number, y: number) => {
      const id = nextIdRef.current++
      setJob({ id, tool, x, y })
      later(() => setJob((current) => (current?.id === id ? null : current)), JOB_MS)
    },
    [later],
  )

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

  /** Rev (anticipation), launch with tyre smoke, then roll a fresh vehicle in and settle it. */
  const driveOff = useCallback(() => {
    if (driveStateRef.current !== 'idle') return
    driveStateRef.current = 'rev'
    setDriveState('rev')
    setJob(null)
    unlockAudio()
    sfx.honk()
    void addSticker()
    setConfettiOrigin({ x: 50, y: 45 })
    setConfettiTrigger((n) => n + 1)
    spawnBurst('exhaust', BURST_ORIGINS.exhaust.x, BURST_ORIGINS.exhaust.y)
    later(() => spawnBurst('exhaust', BURST_ORIGINS.exhaust.x, BURST_ORIGINS.exhaust.y), 180)

    later(() => {
      driveStateRef.current = 'out'
      setDriveState('out')
      spawnBurst('launch', BURST_ORIGINS.launch.x, BURST_ORIGINS.launch.y)
    }, REV_MS)

    later(() => {
      setVehicleType(randomVehicleType())
      setFixed(randomFixedState())
      setWingColor(null)
      setDecalColor(null)
      setVehicleKey((k) => k + 1)
      driveStateRef.current = 'in'
      setDriveState('in')
    }, REV_MS + OUT_MS)

    later(() => {
      driveStateRef.current = 'idle'
      setDriveState('idle')
      spawnBurst('land', BURST_ORIGINS.land.x, BURST_ORIGINS.land.y)
      jolCar('land')
    }, REV_MS + OUT_MS + IN_MS)
  }, [addSticker, later, spawnBurst, jolCar])

  // Auto drive-off once every problem on this vehicle is fixed — after a beat,
  // so the last repair's burst and the mechanic's swing get to play.
  useEffect(() => {
    const allFixed = ALL_PROBLEMS.every((problem) => fixed[problem])
    if (allFixed && driveStateRef.current === 'idle') {
      const t = setTimeout(driveOff, 1400)
      return () => clearTimeout(t)
    }
  }, [fixed, driveOff])

  const handleToolDrop = useCallback(
    (tool: ToolDef, point: { x: number; y: number }) => {
      if (fixed[tool.problem]) return
      if (driveStateRef.current !== 'idle') return
      const zoneRef = getProblemZoneRef(tool.problem)
      if (!pointInZone(point, zoneRef)) return
      unlockAudio()
      sfx[tool.sound]()
      setFixed((prev) => ({ ...prev, [tool.problem]: true }))
      const anchor = ANCHORS[tool.problem]
      spawnBurst(tool.id, anchor.x, anchor.y)
      jolCar(JOLT_BY_TOOL[tool.id])
      dispatchMechanic(tool.id, anchor.x, anchor.y)
      // follow-through: a second, smaller burst as the mechanic gets there
      later(() => spawnBurst('attach', anchor.x, anchor.y), 620)
      fireConfettiAt(zoneRef)
    },
    [fixed, getProblemZoneRef, fireConfettiAt, spawnBurst, jolCar, dispatchMechanic, later],
  )

  const handlePartDrop = useCallback(
    (item: PartItemDef, point: { x: number; y: number }) => {
      if (driveStateRef.current !== 'idle') return
      if (item.kind === 'wing') {
        if (!pointInZone(point, wingZoneRef)) return
        unlockAudio()
        sfx.partClick()
        setWingColor(item.color)
        spawnBurst('attach', ANCHORS.wing.x, ANCHORS.wing.y)
        dispatchMechanic('wrench', ANCHORS.wing.x, ANCHORS.wing.y + 30)
      } else {
        if (!pointInZone(point, decalZoneRef)) return
        unlockAudio()
        sfx.partClick()
        setDecalColor(item.color)
        spawnBurst('attach', ANCHORS.decal.x, ANCHORS.decal.y)
      }
    },
    [spawnBurst, dispatchMechanic],
  )

  const removeWing = useCallback(() => {
    if (!wingColor) return
    unlockAudio()
    sfx.partPop()
    setWingColor(null)
    spawnBurst('pop', ANCHORS.wing.x, ANCHORS.wing.y)
  }, [wingColor, spawnBurst])

  const removeDecal = useCallback(() => {
    if (!decalColor) return
    unlockAudio()
    sfx.partPop()
    setDecalColor(null)
    spawnBurst('pop', ANCHORS.decal.x, ANCHORS.decal.y)
  }, [decalColor, spawnBurst])

  const Body = VEHICLE_BODIES[vehicleType]
  const spin: Spin = driveState === 'out' ? 'out' : driveState === 'in' ? 'in' : 'none'

  const carAnimate =
    driveState === 'rev'
      ? { x: [0, -10, 6, -8, 4, 0], y: [0, 2, 0, 2, 0, 0], rotate: [0, -0.8, 0, -0.6, 0, 0] }
      : driveState === 'out'
        ? { x: 640, y: 0, rotate: -1.5 }
        : { x: 0, y: 0, rotate: 0 }

  const carTransition =
    driveState === 'rev'
      ? { duration: REV_MS / 1000, ease: 'easeInOut' as const }
      : driveState === 'out'
        ? { duration: OUT_MS / 1000, ease: [0.6, 0, 1, 0.4] as const }
        : driveState === 'in'
          ? { duration: IN_MS / 1000, ease: [0, 0.6, 0.3, 1] as const }
          : { type: 'spring' as const, stiffness: 200, damping: 22 }

  const joltDef = JOLT_ANIMATION[jolt.kind]

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
              className="absolute inset-0 h-full w-full overflow-hidden rounded-[1.5rem] shadow-xl"
              preserveAspectRatio="xMidYMid meet"
            >
              <SceneDefs />
              <ToolDefs />
              <GarageBackdrop />
              <Ambience />
              <ToolChest />
              {!fixed.wheel && driveState === 'idle' && <SpareWheel />}

              <motion.g
                key={vehicleKey}
                initial={driveState === 'in' ? { x: -640, y: 0, rotate: 0 } : false}
                animate={carAnimate}
                transition={carTransition}
                style={{ transformOrigin: `${(TAIL_X + NOSE_X) / 2}px ${DECK_Y}px` }}
              >
                <motion.g
                  key={jolt.id}
                  initial={false}
                  animate={joltDef.animate}
                  transition={{ duration: joltDef.duration, ease: 'easeOut' }}
                  style={{ transformOrigin: `${(TAIL_X + NOSE_X) / 2}px ${DECK_Y}px` }}
                >
                  <Body />
                  <BumperPart ok={fixed.bumper} />
                  <WindshieldPart ok={fixed.windshield} glassPath={VEHICLE_GLASS[vehicleType]} />
                  {wingColor && <WingPart color={wingColor} />}
                  {decalColor && <DecalPart color={decalColor} />}
                  <WheelPart ok={fixed.wheel} spin={spin} />
                  <TirePart ok={fixed.tire} spin={spin} />
                </motion.g>
              </motion.g>

              <Mechanic job={job} />

              {bursts.map((b) => (
                <Burst key={b.id} {...b} />
              ))}
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

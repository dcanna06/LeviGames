// Tiny synthesized sound-effect engine. No audio files, no network calls —
// every sound is generated on the fly with the Web Audio API, so the app
// stays fully self-contained and offline-safe with zero binary audio assets.

let ctx: AudioContext | null = null
let unlocked = false

function getCtx(): AudioContext {
  if (!ctx) {
    const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new Ctor()
  }
  return ctx
}

/** Call on the very first user touch/tap to unlock audio on iOS Safari. Safe to call repeatedly. */
export function unlockAudio() {
  const c = getCtx()
  if (c.state === 'suspended') void c.resume()
  if (unlocked) return
  unlocked = true
  const buffer = c.createBuffer(1, 1, 22050)
  const source = c.createBufferSource()
  source.buffer = buffer
  source.connect(c.destination)
  source.start(0)
}

type ToneOpts = {
  freq: number
  freqEnd?: number
  start?: number
  duration?: number
  type?: OscillatorType
  gain?: number
  attack?: number
  release?: number
  detune?: number
  filterFreq?: number
  filterType?: BiquadFilterType
}

function tone(c: AudioContext, master: GainNode, opts: ToneOpts) {
  const {
    freq,
    freqEnd,
    start = 0,
    duration = 0.2,
    type = 'sine',
    gain = 0.25,
    attack = 0.01,
    release = 0.12,
    detune = 0,
    filterFreq,
    filterType = 'lowpass',
  } = opts
  const t0 = c.currentTime + start
  const osc = c.createOscillator()
  osc.type = type
  osc.frequency.setValueAtTime(freq, t0)
  if (freqEnd !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), t0 + duration)
  if (detune) osc.detune.setValueAtTime(detune, t0)

  const g = c.createGain()
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + attack)
  g.gain.setValueAtTime(gain, Math.max(t0 + attack, t0 + duration - release))
  g.gain.linearRampToValueAtTime(0.0001, t0 + duration)

  let node: AudioNode = osc
  if (filterFreq) {
    const f = c.createBiquadFilter()
    f.type = filterType
    f.frequency.setValueAtTime(filterFreq, t0)
    node.connect(f)
    node = f
  }
  node.connect(g)
  g.connect(master)
  osc.start(t0)
  osc.stop(t0 + duration + 0.05)
}

type NoiseOpts = {
  start?: number
  duration?: number
  gain?: number
  filterFreq?: number
  filterType?: BiquadFilterType
  q?: number
}

function noise(c: AudioContext, master: GainNode, opts: NoiseOpts = {}) {
  const { start = 0, duration = 0.15, gain = 0.2, filterFreq = 1800, filterType = 'bandpass', q = 1 } = opts
  const t0 = c.currentTime + start
  const frameCount = Math.max(1, Math.floor(c.sampleRate * duration))
  const buffer = c.createBuffer(1, frameCount, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < frameCount; i++) data[i] = Math.random() * 2 - 1

  const src = c.createBufferSource()
  src.buffer = buffer

  const filter = c.createBiquadFilter()
  filter.type = filterType
  filter.frequency.setValueAtTime(filterFreq, t0)
  filter.Q.setValueAtTime(q, t0)

  const g = c.createGain()
  g.gain.setValueAtTime(0, t0)
  g.gain.linearRampToValueAtTime(gain, t0 + 0.008)
  g.gain.linearRampToValueAtTime(0.0001, t0 + duration)

  src.connect(filter)
  filter.connect(g)
  g.connect(master)
  src.start(t0)
  src.stop(t0 + duration + 0.02)
}

function play(fn: (c: AudioContext, master: GainNode) => void) {
  try {
    const c = getCtx()
    if (c.state === 'suspended') void c.resume()
    const master = c.createGain()
    master.gain.value = 1
    master.connect(c.destination)
    fn(c, master)
  } catch {
    // Web Audio unavailable — fail silently, never block the UI.
  }
}

/** Named sound-effect library shared by every game. */
export const sfx = {
  tap() {
    play((c, m) => tone(c, m, { freq: 520, duration: 0.09, type: 'sine', gain: 0.2, attack: 0.005, release: 0.06 }))
  },
  jump() {
    play((c, m) => tone(c, m, { freq: 300, freqEnd: 620, duration: 0.18, type: 'triangle', gain: 0.22 }))
  },
  roar() {
    play((c, m) => {
      tone(c, m, { freq: 140, freqEnd: 90, duration: 0.45, type: 'sawtooth', gain: 0.22, filterFreq: 900, attack: 0.05, release: 0.2 })
      noise(c, m, { start: 0.02, duration: 0.4, gain: 0.12, filterFreq: 700, filterType: 'lowpass' })
    })
  },
  chime() {
    play((c, m) => {
      tone(c, m, { freq: 784, duration: 0.35, type: 'sine', gain: 0.18 })
      tone(c, m, { freq: 988, duration: 0.4, type: 'sine', gain: 0.14, start: 0.06 })
    })
  },
  cheer() {
    play((c, m) => {
      ;[523, 659, 784, 1047].forEach((f, i) => tone(c, m, { freq: f, duration: 0.3, type: 'triangle', gain: 0.16, start: i * 0.07 }))
    })
  },
  celebrate() {
    play((c, m) => {
      ;[523, 659, 784, 1047, 1319].forEach((f, i) => tone(c, m, { freq: f, duration: 0.4, type: 'triangle', gain: 0.16, start: i * 0.06 }))
      noise(c, m, { start: 0.1, duration: 0.3, gain: 0.06, filterFreq: 4000, filterType: 'highpass' })
    })
  },
  bark() {
    play((c, m) => {
      tone(c, m, { freq: 380, freqEnd: 220, duration: 0.12, type: 'square', gain: 0.2, filterFreq: 1800 })
      tone(c, m, { freq: 360, freqEnd: 200, duration: 0.12, type: 'square', gain: 0.18, start: 0.16, filterFreq: 1800 })
    })
  },
  chew() {
    play((c, m) => {
      for (let i = 0; i < 4; i++) noise(c, m, { start: i * 0.16, duration: 0.09, gain: 0.14, filterFreq: 1200, filterType: 'lowpass' })
    })
  },
  splash() {
    play((c, m) => {
      noise(c, m, { duration: 0.3, gain: 0.16, filterFreq: 2200, filterType: 'bandpass' })
      tone(c, m, { freq: 500, freqEnd: 300, duration: 0.25, type: 'sine', gain: 0.1 })
    })
  },
  squeakyBall() {
    play((c, m) => tone(c, m, { freq: 900, freqEnd: 1300, duration: 0.15, type: 'square', gain: 0.12 }))
  },
  nudge() {
    play((c, m) => tone(c, m, { freq: 440, freqEnd: 520, duration: 0.15, type: 'sine', gain: 0.12 }))
  },
  flip() {
    play((c, m) => tone(c, m, { freq: 700, freqEnd: 500, duration: 0.12, type: 'triangle', gain: 0.14 }))
  },
  matchSuccess() {
    play((c, m) => {
      tone(c, m, { freq: 659, duration: 0.18, type: 'sine', gain: 0.18 })
      tone(c, m, { freq: 880, duration: 0.25, type: 'sine', gain: 0.16, start: 0.1 })
    })
  },
  mismatchGentle() {
    play((c, m) => tone(c, m, { freq: 330, freqEnd: 280, duration: 0.22, type: 'sine', gain: 0.1 }))
  },
  ratchet() {
    play((c, m) => {
      for (let i = 0; i < 5; i++) noise(c, m, { start: i * 0.06, duration: 0.04, gain: 0.14, filterFreq: 2500, filterType: 'highpass' })
    })
  },
  hiss() {
    play((c, m) => noise(c, m, { duration: 0.5, gain: 0.1, filterFreq: 5000, filterType: 'highpass' }))
  },
  waterSqueak() {
    play((c, m) => {
      tone(c, m, { freq: 1200, freqEnd: 1600, duration: 0.1, type: 'sine', gain: 0.08 })
      tone(c, m, { freq: 1400, freqEnd: 1000, duration: 0.1, type: 'sine', gain: 0.08, start: 0.13 })
    })
  },
  clank() {
    play((c, m) => {
      tone(c, m, { freq: 220, duration: 0.15, type: 'square', gain: 0.16, filterFreq: 1200 })
      noise(c, m, { duration: 0.08, gain: 0.1, filterFreq: 1500 })
    })
  },
  honk() {
    play((c, m) => {
      tone(c, m, { freq: 300, duration: 0.25, type: 'sawtooth', gain: 0.18, filterFreq: 1000 })
      tone(c, m, { freq: 300, duration: 0.25, type: 'sawtooth', gain: 0.18, start: 0.3, filterFreq: 1000 })
    })
  },
  partClick() {
    play((c, m) => tone(c, m, { freq: 900, duration: 0.06, type: 'square', gain: 0.14 }))
  },
  partPop() {
    play((c, m) => tone(c, m, { freq: 500, freqEnd: 300, duration: 0.08, type: 'sine', gain: 0.14 }))
  },
  glow() {
    play((c, m) => tone(c, m, { freq: 900, duration: 0.5, type: 'sine', gain: 0.06, attack: 0.15, release: 0.3 }))
  },
  dogBark() {
    play((c, m) => {
      tone(c, m, { freq: 400, freqEnd: 220, duration: 0.13, type: 'square', gain: 0.22, filterFreq: 1800 })
      tone(c, m, { freq: 380, freqEnd: 200, duration: 0.13, type: 'square', gain: 0.2, start: 0.18, filterFreq: 1800 })
    })
  },
  cowMoo() {
    play((c, m) => tone(c, m, { freq: 160, freqEnd: 110, duration: 0.7, type: 'sawtooth', gain: 0.18, filterFreq: 500, attack: 0.1, release: 0.25 }))
  },
  catMeow() {
    play((c, m) => tone(c, m, { freq: 500, freqEnd: 750, duration: 0.35, type: 'sawtooth', gain: 0.16, filterFreq: 2200, attack: 0.06 }))
  },
  duckQuack() {
    play((c, m) => {
      tone(c, m, { freq: 320, freqEnd: 220, duration: 0.12, type: 'square', gain: 0.2, filterFreq: 1200 })
      tone(c, m, { freq: 300, freqEnd: 200, duration: 0.1, type: 'square', gain: 0.16, start: 0.14, filterFreq: 1200 })
    })
  },
  sheepBaa() {
    play((c, m) => {
      tone(c, m, { freq: 300, freqEnd: 380, duration: 0.22, type: 'sawtooth', gain: 0.16, filterFreq: 900 })
      tone(c, m, { freq: 340, freqEnd: 280, duration: 0.3, type: 'sawtooth', gain: 0.14, start: 0.22, filterFreq: 900 })
    })
  },
  pigOink() {
    play((c, m) => {
      tone(c, m, { freq: 180, freqEnd: 130, duration: 0.16, type: 'square', gain: 0.2, filterFreq: 700 })
      tone(c, m, { freq: 160, freqEnd: 110, duration: 0.16, type: 'square', gain: 0.18, start: 0.2, filterFreq: 700 })
    })
  },
}

export type SfxName = keyof typeof sfx

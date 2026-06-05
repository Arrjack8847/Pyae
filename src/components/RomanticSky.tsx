import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent, WheelEvent } from 'react'
import { loveMessages } from '../data/loveMessages'
import { FireworkCanvas } from './FireworkCanvas'
import type { FireworkBurst, FireworkCanvasHandle } from './FireworkCanvas'
import { FloatingMessage } from './FloatingMessage'
import { SecretNoteModal } from './SecretNoteModal'

type RomanticSkyProps = {
  musicFinaleSignal: number
  onNext: () => void
}

type PanState = {
  x: number
  y: number
  scale: number
}

type PointerRecord = {
  x: number
  y: number
}

const worldSize = { width: 1800, height: 1680 }
const unlockCount = 4
const initialPanState: PanState = { x: 0, y: 0, scale: 0.86 }
const noteTargetSize = { width: 220, height: 56 }

const photoSources = [
  '/images/gf.jpg',
  '/images/gf1.jpg',
  '/images/gf2.jpg',
  '/images/gf3.jpg',
  '/images/gf4.jpg',
]

const memoryCards = [
  { id: 'memory-one', src: photoSources[0], x: 245, y: 1050, z: -260, scale: 0.72, rotate: -18, delay: -1.6, duration: 12.8 },
  { id: 'memory-two', src: photoSources[1], x: 1325, y: 1015, z: -180, scale: 0.76, rotate: 14, delay: -4.4, duration: 13.9 },
  { id: 'memory-three', src: photoSources[2], x: 520, y: 1405, z: 160, scale: 0.86, rotate: 10, delay: -7.2, duration: 12.2 },
  { id: 'memory-four', src: photoSources[3], x: 1210, y: 1340, z: -80, scale: 0.72, rotate: -12, delay: -9.8, duration: 14.5 },
  { id: 'memory-five', src: photoSources[4], x: 825, y: 1190, z: -340, scale: 0.62, rotate: 7, delay: -11.3, duration: 15.2 },
  { id: 'memory-six', src: photoSources[0], x: 1510, y: 1490, z: 110, scale: 0.8, rotate: -8, delay: -13.1, duration: 12.6 },
  { id: 'memory-seven', src: photoSources[1], x: 165, y: 1485, z: -120, scale: 0.66, rotate: 16, delay: -5.6, duration: 13.4 },
  { id: 'memory-eight', src: photoSources[2], x: 985, y: 1080, z: 260, scale: 0.74, rotate: -7, delay: -15.2, duration: 11.9 },
  { id: 'memory-nine', src: photoSources[3], x: 1445, y: 1210, z: -420, scale: 0.58, rotate: 18, delay: -2.8, duration: 15.7 },
  { id: 'memory-ten', src: photoSources[4], x: 385, y: 1285, z: 240, scale: 0.7, rotate: -9, delay: -8.9, duration: 12.4 },
  { id: 'memory-eleven', src: photoSources[0], x: 1085, y: 1590, z: -220, scale: 0.64, rotate: 11, delay: -12.7, duration: 14.7 },
  { id: 'memory-twelve', src: photoSources[1], x: 645, y: 1125, z: -520, scale: 0.56, rotate: -15, delay: -16.4, duration: 16.2 },
  { id: 'memory-thirteen', src: photoSources[2], x: 905, y: 1460, z: 330, scale: 0.78, rotate: 13, delay: -3.3, duration: 12.9 },
  { id: 'memory-fourteen', src: photoSources[3], x: 118, y: 1185, z: -360, scale: 0.6, rotate: -7, delay: -6.8, duration: 15.5 },
  { id: 'memory-fifteen', src: photoSources[4], x: 1575, y: 1085, z: 210, scale: 0.82, rotate: 9, delay: -10.6, duration: 12.7 },
  { id: 'memory-sixteen', src: photoSources[0], x: 745, y: 1580, z: -100, scale: 0.68, rotate: -13, delay: -14.1, duration: 14.2 },
  { id: 'memory-seventeen', src: photoSources[1], x: 1125, y: 1225, z: 360, scale: 0.76, rotate: 6, delay: -17.2, duration: 11.8 },
  { id: 'memory-eighteen', src: photoSources[2], x: 465, y: 1010, z: -180, scale: 0.62, rotate: 17, delay: -19.1, duration: 15.8 },
  { id: 'memory-nineteen', src: photoSources[3], x: 1345, y: 1585, z: -320, scale: 0.66, rotate: -16, delay: -20.6, duration: 16.4 },
  { id: 'memory-twenty', src: photoSources[4], x: 920, y: 970, z: 120, scale: 0.72, rotate: -4, delay: -22.4, duration: 13.3 },
]

const atmosphereMessages = [
  { id: 'stream-one', text: 'Loving you still feels easy', x: 250, y: 1210, z: -260, scale: 0.84, rotate: -5, delay: -0.8, duration: 12.4 },
  { id: 'stream-two', text: 'another little thought of you', x: 980, y: 1170, z: -120, scale: 0.9, rotate: 6, delay: -2.4, duration: 13.2 },
  { id: 'stream-three', text: 'you make ordinary days glow', x: 590, y: 1360, z: 180, scale: 1.02, rotate: -8, delay: -4.8, duration: 11.8 },
  { id: 'stream-four', text: 'still choosing you', x: 1260, y: 1290, z: -320, scale: 0.76, rotate: 4, delay: -6.6, duration: 14.2 },
  { id: 'stream-five', text: 'one more reason to smile', x: 350, y: 1510, z: 90, scale: 0.95, rotate: 8, delay: -8.4, duration: 12.9 },
  { id: 'stream-six', text: 'with you, everything feels right', x: 1120, y: 1540, z: 240, scale: 1.06, rotate: -6, delay: -10.2, duration: 12.1 },
  { id: 'stream-seven', text: 'my favorite person', x: 720, y: 1640, z: -180, scale: 0.82, rotate: 5, delay: -12.5, duration: 13.7 },
  { id: 'stream-eight', text: 'so many tiny memories', x: 1435, y: 1610, z: 40, scale: 0.92, rotate: -9, delay: -14.4, duration: 12.6 },
  { id: 'stream-nine', text: 'another soft little day', x: 170, y: 1420, z: -420, scale: 0.72, rotate: -10, delay: -1.9, duration: 15.4 },
  { id: 'stream-ten', text: 'you are still my favorite', x: 1040, y: 1325, z: 120, scale: 0.96, rotate: 7, delay: -3.7, duration: 12.8 },
  { id: 'stream-eleven', text: 'a sky full of us', x: 520, y: 1175, z: -60, scale: 0.86, rotate: 3, delay: -5.8, duration: 11.7 },
  { id: 'stream-twelve', text: 'tiny note, big feeling', x: 1380, y: 1195, z: 180, scale: 1, rotate: -4, delay: -7.9, duration: 12.3 },
  { id: 'stream-thirteen', text: 'one more secret for you', x: 675, y: 1505, z: -300, scale: 0.78, rotate: -7, delay: -9.2, duration: 14.8 },
  { id: 'stream-fourteen', text: 'every thought finds you', x: 1160, y: 1660, z: -20, scale: 0.88, rotate: 10, delay: -11.8, duration: 13.5 },
  { id: 'stream-fifteen', text: 'countless little sparks', x: 360, y: 1620, z: 260, scale: 1.05, rotate: 4, delay: -13.6, duration: 11.6 },
  { id: 'stream-sixteen', text: 'still with you', x: 1480, y: 1460, z: -210, scale: 0.8, rotate: -6, delay: -15.8, duration: 15 },
]

const celebrationBursts = [
  { delay: 60, x: 0.5, y: 0.24, mode: 'big' },
  { delay: 230, x: 0.23, y: 0.32, mode: 'big' },
  { delay: 330, x: 0.77, y: 0.31, mode: 'big' },
  { delay: 540, x: 0.38, y: 0.43, mode: 'heart' },
  { delay: 680, x: 0.62, y: 0.41, mode: 'heart' },
  { delay: 860, x: 0.16, y: 0.5, mode: 'normal' },
  { delay: 980, x: 0.84, y: 0.5, mode: 'normal' },
  { delay: 1180, x: 0.5, y: 0.44, mode: 'loveText' },
  { delay: 1400, x: 0.3, y: 0.23, mode: 'normal' },
  { delay: 1510, x: 0.7, y: 0.23, mode: 'normal' },
  { delay: 1700, x: 0.42, y: 0.32, mode: 'big' },
  { delay: 1840, x: 0.58, y: 0.32, mode: 'big' },
  { delay: 2100, x: 0.2, y: 0.62, mode: 'heart' },
  { delay: 2240, x: 0.8, y: 0.62, mode: 'heart' },
  { delay: 2520, x: 0.34, y: 0.53, mode: 'normal' },
  { delay: 2680, x: 0.66, y: 0.52, mode: 'normal' },
  { delay: 3160, x: 0.5, y: 0.46, mode: 'big' },
] satisfies { delay: number; x: number; y: number; mode: FireworkBurst['mode'] }[]

const reducedMotionCelebrationBursts = [
  { delay: 40, x: 0.5, y: 0.26, mode: 'big' },
  { delay: 260, x: 0.25, y: 0.36, mode: 'normal' },
  { delay: 360, x: 0.75, y: 0.36, mode: 'normal' },
  { delay: 560, x: 0.5, y: 0.45, mode: 'heart' },
  { delay: 820, x: 0.5, y: 0.44, mode: 'loveText' },
  { delay: 1180, x: 0.5, y: 0.48, mode: 'big' },
] satisfies { delay: number; x: number; y: number; mode: FireworkBurst['mode'] }[]

const musicFinaleBursts = [
  { delay: 0, x: 0.5, y: 0.18, mode: 'loveText' },
  { delay: 160, x: 0.22, y: 0.28, mode: 'big' },
  { delay: 240, x: 0.78, y: 0.28, mode: 'big' },
  { delay: 420, x: 0.36, y: 0.42, mode: 'heart' },
  { delay: 520, x: 0.64, y: 0.42, mode: 'heart' },
  { delay: 720, x: 0.5, y: 0.36, mode: 'big' },
  { delay: 920, x: 0.18, y: 0.56, mode: 'normal' },
  { delay: 1040, x: 0.82, y: 0.56, mode: 'normal' },
  { delay: 1220, x: 0.42, y: 0.24, mode: 'heart' },
  { delay: 1340, x: 0.58, y: 0.24, mode: 'heart' },
  { delay: 1540, x: 0.5, y: 0.5, mode: 'big' },
] satisfies { delay: number; x: number; y: number; mode: FireworkBurst['mode'] }[]

const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof Element && Boolean(target.closest('button, a, input, textarea, select, [role="button"]'))

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const createFireworkNoiseBuffer = (context: AudioContext) => {
  const noiseBuffer = context.createBuffer(1, Math.floor(context.sampleRate * 0.18), context.sampleRate)
  const noiseData = noiseBuffer.getChannelData(0)

  for (let index = 0; index < noiseData.length; index += 1) {
    const fade = 1 - index / noiseData.length
    noiseData[index] = (Math.random() * 2 - 1) * fade
  }

  return noiseBuffer
}

export function RomanticSky({ musicFinaleSignal, onNext }: RomanticSkyProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const fireworkCanvasRef = useRef<FireworkCanvasHandle | null>(null)
  const activePointers = useRef(new Map<number, PointerRecord>())
  const dragStart = useRef<{ pointerId: number; x: number; y: number; pan: PanState } | null>(null)
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null)
  const initialized = useRef(false)
  const entranceCelebrationStartedRef = useRef(false)
  const entranceBurstFiredRef = useRef(false)
  const entranceScheduleTimerRef = useRef<number | null>(null)
  const lastTap = useRef(0)
  const tapStart = useRef<{ x: number; y: number } | null>(null)
  const tapCount = useRef(0)
  const handledMusicFinaleSignal = useRef(0)
  const pendingMusicFinaleSignal = useRef(0)
  const guidedMessageIdRef = useRef<string | null>(null)
  const guidedHoldTimer = useRef<number | null>(null)
  const cameraAnimations = useRef<{ stop: () => void }[]>([])
  const panRef = useRef<PanState>(initialPanState)
  const pendingPanRef = useRef<PanState | null>(null)
  const dragFrameRef = useRef<number | null>(null)
  const activeMessageIdRef = useRef<string | null>(null)
  const documentVisibleRef = useRef(typeof document === 'undefined' || document.visibilityState === 'visible')
  const fireworkSequenceTimers = useRef<number[]>([])
  const fireworkAudioContext = useRef<AudioContext | null>(null)
  const fireworkMasterGain = useRef<GainNode | null>(null)
  const fireworkNoiseBuffer = useRef<AudioBuffer | null>(null)
  const fireworkAudioReady = useRef(false)
  const activeFireworkSounds = useRef(0)
  const soundReleaseTimers = useRef<number[]>([])
  const panX = useMotionValue(initialPanState.x)
  const panY = useMotionValue(initialPanState.y)
  const panScale = useMotionValue(initialPanState.scale)

  const [openedIds, setOpenedIds] = useState<string[]>([])
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null)
  const [guidedMessageId, setGuidedMessageId] = useState<string | null>(null)
  const [introDone, setIntroDone] = useState(false)
  const [isDocumentVisible, setIsDocumentVisible] = useState(
    () => typeof document === 'undefined' || document.visibilityState === 'visible',
  )

  const activeMessage = useMemo(
    () => loveMessages.find((message) => message.id === activeMessageId),
    [activeMessageId],
  )
  const unopenedMessages = useMemo(
    () => loveMessages.filter((message) => !openedIds.includes(message.id)),
    [openedIds],
  )

  useEffect(() => {
    activeMessageIdRef.current = activeMessageId
  }, [activeMessageId])

  const clampPan = useCallback((next: PanState): PanState => {
    const viewport = viewportRef.current
    if (!viewport) return next
    const rect = viewport.getBoundingClientRect()
    const scale = Math.min(1.45, Math.max(0.52, next.scale))
    const scaledWidth = worldSize.width * scale
    const scaledHeight = worldSize.height * scale
    const minX = Math.min(0, rect.width - scaledWidth)
    const minY = Math.min(0, rect.height - scaledHeight)

    return {
      scale,
      x: Math.min(80, Math.max(minX - 80, next.x)),
      y: Math.min(80, Math.max(minY - 80, next.y)),
    }
  }, [])

  const syncPanFromMotionValues = useCallback(() => {
    panRef.current = {
      x: panX.get(),
      y: panY.get(),
      scale: panScale.get(),
    }
    return panRef.current
  }, [panScale, panX, panY])

  const stopCameraAnimation = useCallback(() => {
    cameraAnimations.current.forEach((control) => control.stop())
    cameraAnimations.current = []
    syncPanFromMotionValues()
  }, [syncPanFromMotionValues])

  const clearGuidedHold = useCallback(() => {
    if (guidedHoldTimer.current !== null) {
      window.clearTimeout(guidedHoldTimer.current)
      guidedHoldTimer.current = null
    }
    setGuidedMessageId(null)
  }, [])

  const holdGuidedMessage = useCallback((id: string) => {
    if (guidedHoldTimer.current !== null) {
      window.clearTimeout(guidedHoldTimer.current)
    }
    setGuidedMessageId(id)
    guidedHoldTimer.current = window.setTimeout(() => {
      guidedHoldTimer.current = null
      setGuidedMessageId((current) => (current === id ? null : current))
    }, 5200)
  }, [])

  const updatePan = useCallback(
    (nextPan: PanState) => {
      const clamped = clampPan(nextPan)
      panRef.current = clamped
      panX.set(clamped.x)
      panY.set(clamped.y)
      panScale.set(clamped.scale)
      return clamped
    },
    [clampPan, panScale, panX, panY],
  )

  const clearFireworkSequenceTimers = useCallback((resetPendingEntrance = false) => {
    if (entranceScheduleTimerRef.current !== null) {
      window.clearTimeout(entranceScheduleTimerRef.current)
      entranceScheduleTimerRef.current = null
    }

    fireworkSequenceTimers.current.forEach((timer) => window.clearTimeout(timer))
    fireworkSequenceTimers.current = []

    if (resetPendingEntrance && entranceCelebrationStartedRef.current && !entranceBurstFiredRef.current) {
      entranceCelebrationStartedRef.current = false
    }
  }, [])

  const schedulePanUpdate = useCallback(
    (nextPan: PanState) => {
      pendingPanRef.current = nextPan
      if (dragFrameRef.current !== null) return

      dragFrameRef.current = window.requestAnimationFrame(() => {
        dragFrameRef.current = null
        const pendingPan = pendingPanRef.current
        pendingPanRef.current = null
        if (pendingPan) {
          updatePan(pendingPan)
        }
      })
    },
    [updatePan],
  )

  const flushScheduledPanUpdate = useCallback(() => {
    if (dragFrameRef.current !== null) {
      window.cancelAnimationFrame(dragFrameRef.current)
      dragFrameRef.current = null
    }

    const pendingPan = pendingPanRef.current
    pendingPanRef.current = null
    if (pendingPan) {
      updatePan(pendingPan)
    }
  }, [updatePan])

  const animateToPan = useCallback(
    (nextPan: PanState) => {
      stopCameraAnimation()
      const target = clampPan(nextPan)
      const transition = { type: 'spring', stiffness: 92, damping: 24, mass: 0.9 } as const

      cameraAnimations.current = [
        animate(panX, target.x, {
          ...transition,
          onUpdate: (latest) => {
            panRef.current.x = latest
          },
        }),
        animate(panY, target.y, {
          ...transition,
          onUpdate: (latest) => {
            panRef.current.y = latest
          },
        }),
        animate(panScale, target.scale, {
          ...transition,
          onUpdate: (latest) => {
            panRef.current.scale = latest
          },
        }),
      ]
    },
    [clampPan, panScale, panX, panY, stopCameraAnimation],
  )

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport || initialized.current) return

    const rect = viewport.getBoundingClientRect()
    const scale = rect.width < 520 ? 0.62 : rect.width < 800 ? 0.76 : 0.86
    const centerX = 900
    const centerY = rect.width < 520 ? 760 : rect.width < 800 ? 700 : 610
    initialized.current = true
    updatePan({
      scale,
      x: rect.width / 2 - centerX * scale,
      y: rect.height / 2 - centerY * scale,
    })
  }, [updatePan])

  useEffect(() => {
    const handleViewportChange = () => {
      if (!initialized.current) return
      stopCameraAnimation()
      updatePan(panRef.current)
    }

    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('orientationchange', handleViewportChange)
    return () => {
      window.removeEventListener('resize', handleViewportChange)
      window.removeEventListener('orientationchange', handleViewportChange)
    }
  }, [stopCameraAnimation, updatePan])

  useEffect(() => {
    const updateVisibility = () => {
      const visible = document.visibilityState === 'visible'
      documentVisibleRef.current = visible
      setIsDocumentVisible(visible)
      if (!visible) {
        clearFireworkSequenceTimers()
      }
    }

    updateVisibility()
    document.addEventListener('visibilitychange', updateVisibility)
    return () => document.removeEventListener('visibilitychange', updateVisibility)
  }, [clearFireworkSequenceTimers])

  useEffect(
    () => () => {
      stopCameraAnimation()
      clearFireworkSequenceTimers(true)
      fireworkCanvasRef.current?.clear()
      if (dragFrameRef.current !== null) {
        window.cancelAnimationFrame(dragFrameRef.current)
        dragFrameRef.current = null
      }
      pendingPanRef.current = null
      if (guidedHoldTimer.current !== null) {
        window.clearTimeout(guidedHoldTimer.current)
      }
    },
    [clearFireworkSequenceTimers, stopCameraAnimation],
  )

  useEffect(() => {
    const timer = window.setTimeout(() => setIntroDone(true), 3100)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    return () => {
      soundReleaseTimers.current.forEach((timer) => window.clearTimeout(timer))
      soundReleaseTimers.current = []
      activeFireworkSounds.current = 0
      fireworkNoiseBuffer.current = null
      const context = fireworkAudioContext.current
      if (context && context.state !== 'closed') {
        void context.close()
      }
    }
  }, [])

  const unlockFireworkAudio = useCallback(async () => {
    const AudioCtor =
      window.AudioContext ||
      (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtor) return

    if (!fireworkAudioContext.current) {
      const context = new AudioCtor()
      const masterGain = context.createGain()
      masterGain.gain.value = 0.22
      masterGain.connect(context.destination)
      fireworkAudioContext.current = context
      fireworkMasterGain.current = masterGain
      fireworkNoiseBuffer.current = createFireworkNoiseBuffer(context)
    }

    try {
      await fireworkAudioContext.current.resume()
      fireworkAudioReady.current = fireworkAudioContext.current.state === 'running'
    } catch {
      fireworkAudioReady.current = false
    }
  }, [])

  const playFireworkSound = useCallback((mode: FireworkBurst['mode']) => {
    const context = fireworkAudioContext.current
    const masterGain = fireworkMasterGain.current
    const noiseBuffer = fireworkNoiseBuffer.current
    if (!fireworkAudioReady.current || !context || !masterGain || !noiseBuffer || context.state !== 'running') return
    if (activeFireworkSounds.current >= 8) return

    activeFireworkSounds.current += 1
    const releaseTimer = window.setTimeout(() => {
      activeFireworkSounds.current = Math.max(0, activeFireworkSounds.current - 1)
      soundReleaseTimers.current = soundReleaseTimers.current.filter((timer) => timer !== releaseTimer)
    }, 880)
    soundReleaseTimers.current.push(releaseTimer)

    const now = context.currentTime
    const intensity = mode === 'big' || mode === 'loveText' ? 1.12 : mode === 'heart' ? 0.92 : 0.68
    const pop = context.createOscillator()
    const popGain = context.createGain()
    pop.type = 'triangle'
    pop.frequency.setValueAtTime(mode === 'heart' ? 520 : 340, now)
    pop.frequency.exponentialRampToValueAtTime(105, now + 0.18)
    popGain.gain.setValueAtTime(0.0001, now)
    popGain.gain.exponentialRampToValueAtTime(0.12 * intensity, now + 0.018)
    popGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.28)
    pop.connect(popGain).connect(masterGain)
    pop.start(now)
    pop.stop(now + 0.31)
    pop.onended = () => {
      pop.disconnect()
      popGain.disconnect()
    }

    const noise = context.createBufferSource()
    const noiseFilter = context.createBiquadFilter()
    const noiseGain = context.createGain()
    noise.buffer = noiseBuffer
    noiseFilter.type = 'bandpass'
    noiseFilter.frequency.setValueAtTime(760 + Math.random() * 480, now)
    noiseFilter.Q.value = 1.2
    noiseGain.gain.setValueAtTime(0.0001, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.065 * intensity, now + 0.02)
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.21)
    noise.connect(noiseFilter).connect(noiseGain).connect(masterGain)
    noise.start(now)
    noise.stop(now + 0.23)
    noise.onended = () => {
      noise.disconnect()
      noiseFilter.disconnect()
      noiseGain.disconnect()
    }

    const sparkleFrequencies = mode === 'heart' ? [740, 980, 1240, 1560] : [620, 840, 1120]
    sparkleFrequencies.forEach((frequency, index) => {
      const start = now + 0.08 + index * 0.035
      const sparkle = context.createOscillator()
      const sparkleGain = context.createGain()
      sparkle.type = 'sine'
      sparkle.frequency.setValueAtTime(frequency * (0.96 + Math.random() * 0.12), start)
      sparkleGain.gain.setValueAtTime(0.0001, start)
      sparkleGain.gain.exponentialRampToValueAtTime(0.042 * intensity, start + 0.018)
      sparkleGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.24)
      sparkle.connect(sparkleGain).connect(masterGain)
      sparkle.start(start)
      sparkle.stop(start + 0.27)
      sparkle.onended = () => {
        sparkle.disconnect()
        sparkleGain.disconnect()
      }
    })

    if (mode === 'big' || mode === 'loveText') {
      const boom = context.createOscillator()
      const boomGain = context.createGain()
      boom.type = 'sine'
      boom.frequency.setValueAtTime(92, now + 0.05)
      boom.frequency.exponentialRampToValueAtTime(42, now + 0.62)
      boomGain.gain.setValueAtTime(0.0001, now + 0.04)
      boomGain.gain.exponentialRampToValueAtTime(0.18, now + 0.09)
      boomGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.72)
      boom.connect(boomGain).connect(masterGain)
      boom.start(now + 0.04)
      boom.stop(now + 0.75)
      boom.onended = () => {
        boom.disconnect()
        boomGain.disconnect()
      }
    }
  }, [])

  const createFirework = useCallback((clientX: number, clientY: number, mode: FireworkBurst['mode'] = 'normal', countAsTap = true) => {
    const rect = viewportRef.current?.getBoundingClientRect()
    if (!rect) return
    let burstMode = mode
    if (countAsTap) {
      tapCount.current += 1
      burstMode = tapCount.current % 5 === 0 ? 'loveText' : mode
    }

    fireworkCanvasRef.current?.burst({
      x: clientX - rect.left,
      y: clientY - rect.top,
      mode: burstMode,
    })
    playFireworkSound(burstMode)
  }, [playFireworkSound])

  const scheduleFireworkSequence = useCallback(
    (
      sequence: readonly { delay: number; x: number; y: number; mode: FireworkBurst['mode'] }[],
      options: { entrance?: boolean } = {},
    ) => {
      if (!documentVisibleRef.current || document.visibilityState !== 'visible') return false

      void unlockFireworkAudio()

      sequence.forEach((burst) => {
        const timer = window.setTimeout(() => {
          if (!documentVisibleRef.current || document.visibilityState !== 'visible' || activeMessageIdRef.current) return
          const rect = viewportRef.current?.getBoundingClientRect()
          if (!rect) return

          if (options.entrance) {
            entranceBurstFiredRef.current = true
          }

          createFirework(rect.left + rect.width * burst.x, rect.top + rect.height * burst.y, burst.mode, false)
        }, burst.delay)
        fireworkSequenceTimers.current.push(timer)
      })

      return true
    },
    [createFirework, unlockFireworkAudio],
  )

  useEffect(() => {
    if (entranceCelebrationStartedRef.current || entranceScheduleTimerRef.current !== null || !isDocumentVisible) return

    entranceScheduleTimerRef.current = window.setTimeout(() => {
      entranceScheduleTimerRef.current = null
      if (entranceCelebrationStartedRef.current || !documentVisibleRef.current || document.visibilityState !== 'visible') return

      const sequence = prefersReducedMotion() ? reducedMotionCelebrationBursts : celebrationBursts
      entranceCelebrationStartedRef.current = true
      entranceBurstFiredRef.current = false

      const scheduled = scheduleFireworkSequence(sequence, { entrance: true })
      if (!scheduled) {
        entranceCelebrationStartedRef.current = false
      }
    }, 180)

    return () => {
      if (entranceScheduleTimerRef.current !== null && !entranceCelebrationStartedRef.current) {
        window.clearTimeout(entranceScheduleTimerRef.current)
        entranceScheduleTimerRef.current = null
      }
    }
  }, [isDocumentVisible, scheduleFireworkSequence])

  useEffect(() => {
    if (musicFinaleSignal <= handledMusicFinaleSignal.current) return

    pendingMusicFinaleSignal.current = musicFinaleSignal
    if (!isDocumentVisible || activeMessageId !== null) return

    const previousHandledSignal = handledMusicFinaleSignal.current
    handledMusicFinaleSignal.current = pendingMusicFinaleSignal.current
    pendingMusicFinaleSignal.current = 0

    const scheduled = scheduleFireworkSequence(musicFinaleBursts)
    if (!scheduled) {
      pendingMusicFinaleSignal.current = musicFinaleSignal
      handledMusicFinaleSignal.current = previousHandledSignal
    }
  }, [activeMessageId, isDocumentVisible, musicFinaleSignal, scheduleFireworkSequence])

  const openMessage = useCallback((id: string) => {
    void unlockFireworkAudio()
    clearGuidedHold()
    setActiveMessageId(id)
    setOpenedIds((current) => (current.includes(id) ? current : [...current, id]))
  }, [clearGuidedHold, unlockFireworkAudio])

  const getPointerDistance = () => {
    let first: PointerRecord | null = null
    for (const point of activePointers.current.values()) {
      if (!first) {
        first = point
        continue
      }
      return Math.hypot(first.x - point.x, first.y - point.y)
    }
    return 0
  }

  const getNextGuidedMessage = useCallback(() => {
    if (unopenedMessages.length === 0) return null

    if (!guidedMessageIdRef.current) {
      const rect = viewportRef.current?.getBoundingClientRect()
      if (!rect) return unopenedMessages[0]

      const currentPan = panRef.current
      const worldCenterX = (rect.width / 2 - currentPan.x) / currentPan.scale
      const worldCenterY = (rect.height / 2 - currentPan.y) / currentPan.scale

      return unopenedMessages.reduce((nearest, message) => {
        const nearestDistance = Math.hypot(
          nearest.x + noteTargetSize.width / 2 - worldCenterX,
          nearest.y + noteTargetSize.height / 2 - worldCenterY,
        )
        const messageDistance = Math.hypot(
          message.x + noteTargetSize.width / 2 - worldCenterX,
          message.y + noteTargetSize.height / 2 - worldCenterY,
        )
        return messageDistance < nearestDistance ? message : nearest
      }, unopenedMessages[0])
    }

    const startIndex = loveMessages.findIndex((message) => message.id === guidedMessageIdRef.current)
    for (let offset = 1; offset <= loveMessages.length; offset += 1) {
      const candidate = loveMessages[(startIndex + offset + loveMessages.length) % loveMessages.length]
      if (!openedIds.includes(candidate.id)) return candidate
    }

    return unopenedMessages[0]
  }, [openedIds, unopenedMessages])

  const handleFindNextNote = useCallback(() => {
    const viewport = viewportRef.current
    const message = getNextGuidedMessage()
    if (!viewport || !message) return

    flushScheduledPanUpdate()
    const rect = viewport.getBoundingClientRect()
    const targetScale = rect.width < 520 ? 0.82 : rect.width < 800 ? 0.88 : 0.96
    const noteElement = viewport.querySelector<HTMLElement>(`.floating-message[data-message-id="${message.id}"]`)
    const noteRect = noteElement?.getBoundingClientRect()
    const currentPan = panRef.current
    const targetCenter = noteRect
      ? {
          x: (noteRect.left - rect.left + noteRect.width / 2 - currentPan.x) / currentPan.scale,
          y: (noteRect.top - rect.top + noteRect.height / 2 - currentPan.y) / currentPan.scale,
        }
      : {
          x: message.x + noteTargetSize.width / 2,
          y: message.y + noteTargetSize.height / 2,
        }

    guidedMessageIdRef.current = message.id
    holdGuidedMessage(message.id)
    animateToPan({
      scale: targetScale,
      x: rect.width / 2 - targetCenter.x * targetScale,
      y: rect.height / 2 - targetCenter.y * targetScale,
    })
  }, [animateToPan, flushScheduledPanUpdate, getNextGuidedMessage, holdGuidedMessage])

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isInteractiveTarget(event.target)) return
    void unlockFireworkAudio()
    clearGuidedHold()
    flushScheduledPanUpdate()
    event.currentTarget.setPointerCapture(event.pointerId)
    activePointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })
    tapStart.current = { x: event.clientX, y: event.clientY }

    if (activePointers.current.size === 1) {
      stopCameraAnimation()
      dragStart.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        pan: panRef.current,
      }
      pinchStart.current = null
    }

    if (activePointers.current.size === 2) {
      stopCameraAnimation()
      pinchStart.current = { distance: getPointerDistance(), scale: panRef.current.scale }
      dragStart.current = null
    }
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!activePointers.current.has(event.pointerId)) return
    activePointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (activePointers.current.size === 2 && pinchStart.current) {
      const nextDistance = getPointerDistance()
      if (nextDistance > 0 && pinchStart.current.distance > 0) {
        const currentPan = pendingPanRef.current ?? panRef.current
        schedulePanUpdate({
          ...currentPan,
          scale: pinchStart.current.scale * (nextDistance / pinchStart.current.distance),
        })
      }
      return
    }

    if (dragStart.current?.pointerId === event.pointerId) {
      const dx = event.clientX - dragStart.current.x
      const dy = event.clientY - dragStart.current.y
      schedulePanUpdate({ ...dragStart.current.pan, x: dragStart.current.pan.x + dx, y: dragStart.current.pan.y + dy })
    }
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!activePointers.current.has(event.pointerId)) return
    flushScheduledPanUpdate()

    const start = tapStart.current
    const moved = start ? Math.hypot(event.clientX - start.x, event.clientY - start.y) : 999
    const now = Date.now()
    const isDoubleTap = now - lastTap.current < 300

    activePointers.current.delete(event.pointerId)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragStart.current = null
    pinchStart.current = null

    if (moved < 9) {
      const rect = viewportRef.current?.getBoundingClientRect()
      const centerX = rect ? rect.left + rect.width / 2 : event.clientX
      const centerY = rect ? rect.top + rect.height / 2 : event.clientY
      const nearCenter = Math.hypot(event.clientX - centerX, event.clientY - centerY) < 140
      createFirework(event.clientX, event.clientY, isDoubleTap ? 'heart' : nearCenter ? 'big' : 'normal')
      lastTap.current = now
    }
  }

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault()
    clearGuidedHold()
    flushScheduledPanUpdate()
    stopCameraAnimation()
    const delta = event.deltaY > 0 ? -0.06 : 0.06
    updatePan({ ...panRef.current, scale: panRef.current.scale + delta })
  }

  const unlocked = openedIds.length >= unlockCount

  return (
    <div className="sky-page">
      <div className="sky-header">
        <div>
          <p>Happy 5 Monthsary pr, Thel Thel</p>
          <span>Drag around the sky. Tap anywhere to light it up. I left little messages for you ✨</span>
        </div>
        <div className="sky-progress" aria-label={`${openedIds.length} messages opened`}>
          <Sparkles size={16} aria-hidden="true" />
          {Math.min(openedIds.length, unlockCount)} / {unlockCount}
        </div>
      </div>

      <div
        ref={viewportRef}
        className="sky-viewport"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
      >
        <FireworkCanvas ref={fireworkCanvasRef} />

        <div className="sky-hud">
          <div className="sky-quest">
            <Sparkles size={15} aria-hidden="true" />
            <span>Choose a hidden message</span>
          </div>
          <div className="sky-hud-actions">
            {!unlocked && (
              <button
                type="button"
                className="find-note-button"
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation()
                  handleFindNextNote()
                }}
              >
                <Sparkles size={15} aria-hidden="true" />
                <span className="find-note-button__full">Find next note</span>
                <span className="find-note-button__compact">Find note</span>
              </button>
            )}
            <div className="sky-progress" aria-label={`${openedIds.length} messages opened`}>
              {Math.min(openedIds.length, unlockCount)} / {unlockCount}
            </div>
          </div>
        </div>

        <motion.div
          className="sky-world"
          style={{
            width: worldSize.width,
            height: worldSize.height,
            x: panX,
            y: panY,
            scale: panScale,
          }}
        >
          <div className="depth-starfield depth-starfield-back" />
          <div className="depth-starfield depth-starfield-front" />
          <div className="constellation-line line-one" />
          <div className="constellation-line line-two" />
          <div className="constellation-line line-three" />

          <motion.div
            className="depth-title"
            initial={{ opacity: 0, y: 28, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
          >
            <strong>Happy 5 </strong>
            <strong>Monthsary</strong>
            <strong>pr, Thel Thel</strong>
            <span>💗</span>

          </motion.div>

          <div className="depth-instructions">
            Find 4 glowing notes.
            <br />
            Tap the sky for fireworks.
          </div>

          <div className="depth-lane lane-one" />
          <div className="depth-lane lane-two" />

          {atmosphereMessages.map((message) => (
            <div
              key={message.id}
              className="stream-note"
              style={{
                left: message.x,
                top: message.y,
                '--stream-z': `${message.z}px`,
                '--stream-scale': message.scale,
                '--stream-rotate': `${message.rotate}deg`,
                '--stream-delay': `${message.delay}s`,
                '--stream-duration': `${message.duration}s`,
              } as CSSProperties}
            >
              {message.text}
            </div>
          ))}

          {memoryCards.map((card) => (
            <div
              key={card.id}
              className={`memory-card memory-photo-card ${card.id}`}
              style={{
                left: card.x,
                top: card.y,
                '--memory-z': `${card.z}px`,
                '--memory-scale': card.scale,
                '--memory-rotate': `${card.rotate}deg`,
                '--memory-delay': `${card.delay}s`,
                '--memory-duration': `${card.duration}s`,
              } as CSSProperties}
            >
              <img src={card.src} alt="" draggable={false} />
            </div>
          ))}

          {loveMessages.map((message) => (
            <FloatingMessage
              key={message.id}
              message={message}
              opened={openedIds.includes(message.id)}
              guided={guidedMessageId === message.id}
              onOpen={() => openMessage(message.id)}
            />
          ))}
        </motion.div>

        <AnimatePresence>
          {!introDone && (
            <motion.div
              className="sky-intro-reveal"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 2.1, duration: 0.8 }}
            >
              <motion.h2
                initial={{ opacity: 0, scale: 0.74, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
              >
                Happy 5 
                <span>Monthsary</span>
                <span>pr, Thel Thel</span>
                <span>🧸</span>
              </motion.h2>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {unlocked && (
            <motion.button
              type="button"
              className="next-surprise-button"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              whileTap={{ scale: 0.96 }}
              onClick={onNext}
            >
              Open the next surprise 🌷
              <ArrowRight size={18} aria-hidden="true" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <SecretNoteModal message={activeMessage} onClose={() => setActiveMessageId(null)} />
    </div>
  )
}

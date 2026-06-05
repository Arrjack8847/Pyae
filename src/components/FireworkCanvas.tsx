import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

export type FireworkBurst = {
  id: string
  x: number
  y: number
  mode: 'normal' | 'heart' | 'big' | 'loveText'
}

export type FireworkCanvasHandle = {
  burst: (burst: Omit<FireworkBurst, 'id'>) => void
  clear: () => void
}

type Particle = {
  active: boolean
  x: number
  y: number
  previousX: number
  previousY: number
  vx: number
  vy: number
  gravity: number
  drag: number
  life: number
  maxLife: number
  size: number
  colorIndex: number
  shape: 'spark' | 'heart'
  twinklePhase: number
}

type LoveTextReveal = {
  active: boolean
  x: number
  y: number
  vy: number
  life: number
  maxLife: number
  scale: number
}

type CanvasSize = {
  width: number
  height: number
  ratio: number
}

type SpriteCache = {
  sparks: HTMLCanvasElement[]
  hearts: HTMLCanvasElement[]
  loveText: HTMLCanvasElement
}

type FireworkInput = Omit<FireworkBurst, 'id'>

const colors = ['#ff5cc8', '#ff97dd', '#ffd58b', '#caa7ff', '#ffffff']
const emptySize: CanvasSize = { width: 0, height: 0, ratio: 1 }

const createParticle = (): Particle => ({
  active: false,
  x: 0,
  y: 0,
  previousX: 0,
  previousY: 0,
  vx: 0,
  vy: 0,
  gravity: 0.04,
  drag: 0.985,
  life: 0,
  maxLife: 1,
  size: 1,
  colorIndex: 0,
  shape: 'spark',
  twinklePhase: 0,
})

const createLoveTextReveal = (): LoveTextReveal => ({
  active: false,
  x: 0,
  y: 0,
  vy: -0.45,
  life: 0,
  maxLife: 92,
  scale: 1,
})

const getParticleBudget = (width: number, reducedMotion: boolean) => {
  if (reducedMotion) return 150
  if (width < 640) return 300
  if (width < 1024) return 400
  return 540
}

const getBurstParticleCount = (mode: FireworkBurst['mode'], width: number, reducedMotion: boolean) => {
  if (reducedMotion) {
    if (mode === 'big' || mode === 'loveText') return 34
    return mode === 'heart' ? 28 : 20
  }

  const mobile = width < 640
  if (mode === 'big' || mode === 'loveText') return mobile ? 58 : 78
  if (mode === 'heart') return mobile ? 46 : 62
  return mobile ? 34 : 44
}

const drawHeartShape = (context: CanvasRenderingContext2D, x: number, y: number, size: number) => {
  context.beginPath()
  context.moveTo(x, y + size * 0.16)
  context.bezierCurveTo(x - size * 0.64, y - size * 0.42, x - size * 0.92, y + size * 0.32, x, y + size * 0.9)
  context.bezierCurveTo(x + size * 0.92, y + size * 0.32, x + size * 0.64, y - size * 0.42, x, y + size * 0.16)
  context.closePath()
}

const createSparkSprite = (color: string) => {
  const sprite = document.createElement('canvas')
  const size = 72
  const center = size / 2
  sprite.width = size
  sprite.height = size

  const context = sprite.getContext('2d')
  if (!context) return sprite

  const glow = context.createRadialGradient(center, center, 0, center, center, center)
  glow.addColorStop(0, 'rgba(255, 255, 255, 1)')
  glow.addColorStop(0.18, color)
  glow.addColorStop(0.46, `${color}88`)
  glow.addColorStop(1, `${color}00`)
  context.fillStyle = glow
  context.fillRect(0, 0, size, size)

  context.globalCompositeOperation = 'screen'
  context.fillStyle = 'rgba(255, 255, 255, 0.78)'
  context.beginPath()
  context.arc(center, center, 5.2, 0, Math.PI * 2)
  context.fill()
  context.globalCompositeOperation = 'source-over'

  return sprite
}

const createHeartSprite = (color: string) => {
  const sprite = document.createElement('canvas')
  const size = 88
  const center = size / 2
  sprite.width = size
  sprite.height = size

  const context = sprite.getContext('2d')
  if (!context) return sprite

  const glow = context.createRadialGradient(center, center, 0, center, center, center)
  glow.addColorStop(0, `${color}88`)
  glow.addColorStop(0.58, `${color}44`)
  glow.addColorStop(1, `${color}00`)
  context.fillStyle = glow
  context.fillRect(0, 0, size, size)

  context.shadowBlur = 14
  context.shadowColor = color
  context.fillStyle = color
  drawHeartShape(context, center, center - 13, 25)
  context.fill()

  context.shadowBlur = 0
  context.fillStyle = 'rgba(255, 255, 255, 0.62)'
  drawHeartShape(context, center - 1, center - 14, 12)
  context.fill()

  return sprite
}

const createLoveTextSprite = () => {
  const sprite = document.createElement('canvas')
  sprite.width = 420
  sprite.height = 132

  const context = sprite.getContext('2d')
  if (!context) return sprite

  const gradient = context.createLinearGradient(82, 0, 338, 0)
  gradient.addColorStop(0, '#fff7fb')
  gradient.addColorStop(0.46, '#ffd58b')
  gradient.addColorStop(1, '#ff97dd')

  context.font = '800 42px ui-sans-serif, system-ui, sans-serif'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.shadowBlur = 28
  context.shadowColor = '#ff5cc8'
  context.lineWidth = 8
  context.strokeStyle = 'rgba(255, 92, 200, 0.2)'
  context.strokeText('I love you', 210, 66)
  context.fillStyle = gradient
  context.fillText('I love you', 210, 66)

  return sprite
}

const createSpriteCache = (): SpriteCache => ({
  sparks: colors.map(createSparkSprite),
  hearts: colors.map(createHeartSprite),
  loveText: createLoveTextSprite(),
})

export const FireworkCanvas = forwardRef<FireworkCanvasHandle>(function FireworkCanvas(_, ref) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const particlePoolRef = useRef<Particle[]>([])
  const textRevealsRef = useRef<LoveTextReveal[]>([])
  const textRevealPoolRef = useRef<LoveTextReveal[]>([])
  const pendingBurstsRef = useRef<FireworkInput[]>([])
  const spriteCacheRef = useRef<SpriteCache | null>(null)
  const sizeRef = useRef<CanvasSize>(emptySize)
  const maxParticlesRef = useRef(420)
  const animationFrameRef = useRef<number | null>(null)
  const isVisibleRef = useRef(typeof document === 'undefined' || document.visibilityState === 'visible')
  const reducedMotionRef = useRef(false)
  const burstImplRef = useRef<(burst: FireworkInput) => void>((burst) => {
    pendingBurstsRef.current.push(burst)
  })
  const clearImplRef = useRef<() => void>(() => undefined)

  useImperativeHandle(
    ref,
    () => ({
      burst: (burst) => burstImplRef.current(burst),
      clear: () => clearImplRef.current(),
    }),
    [],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return

    contextRef.current = context
    spriteCacheRef.current = createSpriteCache()

    const stopAnimation = () => {
      if (animationFrameRef.current === null) return
      window.cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    const acquireParticle = () => {
      const activeParticles = particlesRef.current
      let particle = particlePoolRef.current.pop()

      if (!particle && activeParticles.length >= maxParticlesRef.current) {
        let reclaimIndex = 0
        let highestProgress = -1
        for (let index = 0; index < activeParticles.length; index += 1) {
          const candidate = activeParticles[index]
          const progress = candidate.life / candidate.maxLife
          if (progress > highestProgress) {
            highestProgress = progress
            reclaimIndex = index
          }
        }

        particle = activeParticles[reclaimIndex]
        const replacement = activeParticles.pop()
        if (replacement && replacement !== particle) {
          activeParticles[reclaimIndex] = replacement
        }
      }

      if (!particle) {
        particle = createParticle()
      }

      particle.active = true
      activeParticles.push(particle)
      return particle
    }

    const acquireLoveTextReveal = () => {
      let reveal = textRevealPoolRef.current.pop()
      const activeReveals = textRevealsRef.current

      if (!reveal && activeReveals.length >= 3) {
        reveal = activeReveals.shift()
      }

      if (!reveal) {
        reveal = createLoveTextReveal()
      }

      reveal.active = true
      activeReveals.push(reveal)
      return reveal
    }

    const releaseDeadParticles = () => {
      const particles = particlesRef.current
      let writeIndex = 0

      for (let readIndex = 0; readIndex < particles.length; readIndex += 1) {
        const particle = particles[readIndex]
        particle.previousX = particle.x
        particle.previousY = particle.y
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vx *= particle.drag
        particle.vy = particle.vy * particle.drag + particle.gravity
        particle.life += 1

        if (particle.life < particle.maxLife) {
          particles[writeIndex] = particle
          writeIndex += 1
        } else {
          particle.active = false
          particlePoolRef.current.push(particle)
        }
      }

      particles.length = writeIndex
    }

    const updateLoveTextReveals = () => {
      const reveals = textRevealsRef.current
      let writeIndex = 0

      for (let readIndex = 0; readIndex < reveals.length; readIndex += 1) {
        const reveal = reveals[readIndex]
        reveal.y += reveal.vy
        reveal.life += 1

        if (reveal.life < reveal.maxLife) {
          reveals[writeIndex] = reveal
          writeIndex += 1
        } else {
          reveal.active = false
          textRevealPoolRef.current.push(reveal)
        }
      }

      reveals.length = writeIndex
    }

    const drawParticles = () => {
      const cache = spriteCacheRef.current
      if (!cache) return

      const particles = particlesRef.current
      context.globalCompositeOperation = 'lighter'
      context.lineCap = 'round'

      for (let index = 0; index < particles.length; index += 1) {
        const particle = particles[index]
        const progress = particle.life / particle.maxLife
        const fadeIn = Math.min(1, progress / 0.12)
        const fadeOut = Math.pow(Math.max(0, 1 - progress), 1.35)
        const twinkle = 0.82 + Math.sin(particle.life * 0.28 + particle.twinklePhase) * 0.18
        const alpha = fadeIn * fadeOut * twinkle
        const color = colors[particle.colorIndex]
        const sprite = particle.shape === 'heart' ? cache.hearts[particle.colorIndex] : cache.sparks[particle.colorIndex]
        const drawSize = particle.shape === 'heart' ? particle.size * 7.4 : particle.size * 4.7

        context.globalAlpha = alpha * 0.34
        context.strokeStyle = color
        context.lineWidth = Math.max(0.75, particle.size * 0.42)
        context.beginPath()
        context.moveTo(particle.previousX, particle.previousY)
        context.lineTo(particle.x, particle.y)
        context.stroke()

        context.globalAlpha = alpha
        context.drawImage(sprite, particle.x - drawSize / 2, particle.y - drawSize / 2, drawSize, drawSize)
      }
    }

    const drawLoveTextReveals = () => {
      const cache = spriteCacheRef.current
      if (!cache) return

      const reveals = textRevealsRef.current
      const sprite = cache.loveText
      const aspectRatio = sprite.height / sprite.width

      context.globalCompositeOperation = 'source-over'
      for (let index = 0; index < reveals.length; index += 1) {
        const reveal = reveals[index]
        const progress = reveal.life / reveal.maxLife
        const fadeIn = Math.min(1, progress / 0.18)
        const fadeOut = Math.pow(Math.max(0, 1 - progress), 1.55)
        const alpha = fadeIn * fadeOut
        const scale = reveal.scale * (1 + Math.sin(progress * Math.PI) * 0.08)
        const width = Math.min(sizeRef.current.width * 0.72, 300) * scale
        const height = width * aspectRatio

        context.globalAlpha = alpha
        context.drawImage(sprite, reveal.x - width / 2, reveal.y - height / 2, width, height)
      }
    }

    const resetCanvasState = () => {
      context.globalAlpha = 1
      context.globalCompositeOperation = 'source-over'
      context.lineCap = 'butt'
      context.lineWidth = 1
    }

    const tick = () => {
      animationFrameRef.current = null

      if (!isVisibleRef.current) return

      const { width, height } = sizeRef.current
      context.clearRect(0, 0, width, height)
      releaseDeadParticles()
      updateLoveTextReveals()
      drawParticles()
      drawLoveTextReveals()
      resetCanvasState()

      if (particlesRef.current.length > 0 || textRevealsRef.current.length > 0) {
        animationFrameRef.current = window.requestAnimationFrame(tick)
      }
    }

    const startAnimation = () => {
      if (animationFrameRef.current !== null || !isVisibleRef.current) return
      if (particlesRef.current.length === 0 && textRevealsRef.current.length === 0) return
      animationFrameRef.current = window.requestAnimationFrame(tick)
    }

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      const width = Math.max(1, rect.width)
      const height = Math.max(1, rect.height)
      const pixelWidth = Math.max(1, Math.round(width * ratio))
      const pixelHeight = Math.max(1, Math.round(height * ratio))
      const changed = canvas.width !== pixelWidth || canvas.height !== pixelHeight

      if (changed) {
        canvas.width = pixelWidth
        canvas.height = pixelHeight
      }

      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      sizeRef.current = { width, height, ratio }
      maxParticlesRef.current = getParticleBudget(width, reducedMotionRef.current)

      if (changed && particlesRef.current.length === 0 && textRevealsRef.current.length === 0) {
        context.clearRect(0, 0, width, height)
      }
    }

    const spawnLoveText = (x: number, y: number) => {
      const reveal = acquireLoveTextReveal()
      reveal.x = x
      reveal.y = y - 18
      reveal.vy = reducedMotionRef.current ? -0.18 : -0.42
      reveal.life = 0
      reveal.maxLife = reducedMotionRef.current ? 62 : 92
      reveal.scale = reducedMotionRef.current ? 0.92 : 1
    }

    const spawnBurst = (burst: FireworkInput) => {
      const { width } = sizeRef.current
      const reducedMotion = reducedMotionRef.current
      const count = getBurstParticleCount(burst.mode, width, reducedMotion)
      const baseSpeed = burst.mode === 'big' || burst.mode === 'loveText' ? 6.5 : burst.mode === 'heart' ? 5.2 : 4.4
      const speedScale = reducedMotion ? 0.62 : 1

      for (let index = 0; index < count; index += 1) {
        const particle = acquireParticle()
        const colorIndex = index % colors.length
        const ring = index / count
        const jitter = -0.08 + Math.random() * 0.16
        let vx: number
        let vy: number

        if (burst.mode === 'heart') {
          const t = Math.PI * 2 * ring
          const heartX = 16 * Math.sin(t) ** 3
          const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))
          const heartScale = (0.155 + Math.random() * 0.045) * speedScale
          vx = heartX * heartScale
          vy = heartY * heartScale
        } else {
          const angle = Math.PI * 2 * ring + jitter
          const layeredSpeed = baseSpeed * (0.48 + Math.random() * 0.78) * speedScale
          vx = Math.cos(angle) * layeredSpeed
          vy = Math.sin(angle) * layeredSpeed
        }

        particle.x = burst.x
        particle.y = burst.y
        particle.previousX = burst.x
        particle.previousY = burst.y
        particle.vx = vx
        particle.vy = vy
        particle.gravity = (0.026 + Math.random() * 0.028) * (reducedMotion ? 0.7 : 1)
        particle.drag = 0.982 + Math.random() * 0.008
        particle.life = 0
        particle.maxLife =
          (burst.mode === 'big' || burst.mode === 'loveText' ? 66 : 54) +
          Math.random() * (reducedMotion ? 12 : 24)
        particle.size = (burst.mode === 'big' || burst.mode === 'loveText' ? 2.25 : 1.75) + Math.random() * 2.1
        particle.colorIndex = colorIndex
        particle.shape = burst.mode === 'heart' || (!reducedMotion && Math.random() > 0.72) ? 'heart' : 'spark'
        particle.twinklePhase = Math.random() * Math.PI * 2
      }

      if (burst.mode === 'loveText') {
        spawnLoveText(burst.x, burst.y)
      }
    }

    const flushPendingBursts = () => {
      const pendingBursts = pendingBurstsRef.current
      if (pendingBursts.length === 0) return

      pendingBurstsRef.current = []
      for (let index = 0; index < pendingBursts.length; index += 1) {
        spawnBurst(pendingBursts[index])
      }
      startAnimation()
    }

    const clearCanvas = () => {
      stopAnimation()

      const particles = particlesRef.current
      for (let index = 0; index < particles.length; index += 1) {
        particles[index].active = false
        particlePoolRef.current.push(particles[index])
      }
      particles.length = 0

      const reveals = textRevealsRef.current
      for (let index = 0; index < reveals.length; index += 1) {
        reveals[index].active = false
        textRevealPoolRef.current.push(reveals[index])
      }
      reveals.length = 0
      pendingBurstsRef.current = []

      const { width, height } = sizeRef.current
      context.clearRect(0, 0, width, height)
      resetCanvasState()
    }

    burstImplRef.current = (burst) => {
      if (!isVisibleRef.current) return
      if (!contextRef.current) {
        pendingBurstsRef.current.push(burst)
        return
      }

      spawnBurst(burst)
      startAnimation()
    }

    clearImplRef.current = clearCanvas

    const updateReducedMotion = (event?: MediaQueryListEvent) => {
      reducedMotionRef.current = event?.matches ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      maxParticlesRef.current = getParticleBudget(sizeRef.current.width, reducedMotionRef.current)
    }

    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible'
      if (!isVisibleRef.current) {
        stopAnimation()
        return
      }
      startAnimation()
    }

    resize()
    updateReducedMotion()
    flushPendingBursts()

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    motionQuery.addEventListener('change', updateReducedMotion)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('resize', resize)
    window.addEventListener('orientationchange', resize)

    let resizeObserver: ResizeObserver | null = null
    if ('ResizeObserver' in window) {
      resizeObserver = new ResizeObserver(resize)
      resizeObserver.observe(canvas)
    }

    return () => {
      burstImplRef.current = (burst) => {
        pendingBurstsRef.current.push(burst)
      }
      clearImplRef.current = () => undefined
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      motionQuery.removeEventListener('change', updateReducedMotion)
      window.removeEventListener('resize', resize)
      window.removeEventListener('orientationchange', resize)
      resizeObserver?.disconnect()
      clearCanvas()
      contextRef.current = null
      spriteCacheRef.current = null
    }
  }, [])

  return <canvas ref={canvasRef} className="firework-canvas" aria-hidden="true" />
})

FireworkCanvas.displayName = 'FireworkCanvas'

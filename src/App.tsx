import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useRef, useState } from 'react'
import { FlowerReveal } from './components/FlowerReveal'
import { LoveGate } from './components/LoveGate'
import { LoveLetter } from './components/LoveLetter'
import { QuestionGate } from './components/QuestionGate'
import { RomanticSky } from './components/RomanticSky'

type Step =
  | 'loveGate'
  | 'questionGate'
  | 'romanticSky'
  | 'loveLetter'
  | 'flowerReveal'

const pageMotion = {
  initial: { opacity: 0, y: 24, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -24, scale: 0.98 },
  transition: { duration: 0.48, ease: 'easeOut' },
} as const

function App() {
  const [step, setStep] = useState<Step>('loveGate')
  const [musicFinaleSignal, setMusicFinaleSignal] = useState(0)
  const transitionMusicRef = useRef<HTMLAudioElement | null>(null)

  const isCuteHome = step === 'loveGate'
  const isRomanticSky = step === 'romanticSky'
  const startRedroomMusic = useCallback(() => {
    const music = transitionMusicRef.current
    if (!music) return

    music.pause()
    music.currentTime = 0
    music.volume = 0.88
    setMusicFinaleSignal(0)
    void music.play().catch(() => undefined)
  }, [])

  return (
    <main
      className={`min-h-svh overflow-hidden transition-colors duration-500 ${
        isCuteHome ? 'cute-home-theme' : isRomanticSky ? 'bg-[#08030f] text-white' : 'cute-story-theme'
      }`}
    >
      <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
        {isRomanticSky ? (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,65,188,0.13),transparent_30%),linear-gradient(180deg,#020104_0%,#0a0211_55%,#050107_100%)]" />
            <div className="stars-field" />
          </>
        ) : isCuteHome ? (
          <>
            <div className="absolute inset-0 cute-home-backdrop" />
            <div className="cute-cloud-band cute-cloud-band-top" />
            <div className="cute-cloud-band cute-cloud-band-bottom" />
            <div className="cute-sparkle-field" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 cute-story-backdrop" />
            <div className="cute-cloud-band cute-cloud-band-top cute-story-cloud" />
            <div className="cute-cloud-band cute-cloud-band-bottom cute-story-cloud" />
            <div className="stars-field cute-story-stars" />
          </>
        )}
      </div>

      <audio
        ref={transitionMusicRef}
        src="/music.mp3"
        preload="auto"
        playsInline
        data-redroom-music
        onEnded={() => setMusicFinaleSignal((signal) => signal + 1)}
      />

      <AnimatePresence mode="wait">
        {step === 'loveGate' && (
          <motion.section key="loveGate" {...pageMotion}>
            <LoveGate
              onYes={() => {
                setStep('questionGate')
              }}
            />
          </motion.section>
        )}

        {step === 'questionGate' && (
          <motion.section key="questionGate" {...pageMotion}>
            <QuestionGate
              onRedroomMusicStart={startRedroomMusic}
              onComplete={() => {
                setStep('romanticSky')
              }}
            />
          </motion.section>
        )}

        {step === 'romanticSky' && (
          <motion.section key="romanticSky" {...pageMotion}>
            <RomanticSky musicFinaleSignal={musicFinaleSignal} onNext={() => setStep('loveLetter')} />
          </motion.section>
        )}

        {step === 'loveLetter' && (
          <motion.section key="loveLetter" {...pageMotion}>
            <LoveLetter onNext={() => setStep('flowerReveal')} />
          </motion.section>
        )}

        {step === 'flowerReveal' && (
          <motion.section key="flowerReveal" {...pageMotion}>
            <FlowerReveal />
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  )
}

export default App

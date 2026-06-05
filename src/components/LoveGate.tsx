import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { useMemo, useState } from 'react'

type LoveGateProps = {
  onYes: () => void
}

const noMessages = [
  'Are you sure?',
  'Think again baby...',
  'Pls click yes',
  'why you doing this?',
  "Nah uhh,you can't ragebait me anymore :D",
]

const gifMoods = [
  '/gifs/mood-1.gif',
  '/gifs/mood-2.gif',
  '/gifs/mood-3.gif',
  '/gifs/mood-5.webp',
  '/gifs/mood-4.gif',
  '/gifs/mood-6.gif',
]

export function LoveGate({ onYes }: LoveGateProps) {
  const [noClicks, setNoClicks] = useState(0)
  const [accepted, setAccepted] = useState(false)

  const currentGif = gifMoods[Math.min(noClicks, gifMoods.length - 1)]

  const message = accepted
    ? 'Opening your gift...'
    : noClicks === 0
      ? 'Would you like to see your gift?'
      : noMessages[Math.min(noClicks - 1, noMessages.length - 1)]

  const yesScale = 1 + Math.min(noClicks, 6) * 0.14
  const noScale = Math.max(0.35, 1 - noClicks * 0.12)

  const noOffset = useMemo(() => {
    if (noClicks < 4) return { x: 0, y: 0 }

    return {
      x: (noClicks % 2 === 0 ? -1 : 1) * Math.min(70, 18 + noClicks * 7),
      y: (noClicks % 3 === 0 ? -1 : 1) * Math.min(24, 8 + noClicks * 3),
    }
  }, [noClicks])

  return (
    <section className="lovegate-clean-page">
      <div className="lovegate-clean-wrap">
        <motion.div
          className="lovegate-clean-card"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <motion.div
            className="lovegate-gif-holder"
            animate={{ y: [0, -8, 0], rotate: [-1.5, 1.5, -1.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <motion.img
              key={currentGif}
              src={currentGif}
              alt="Cute reaction"
              className="lovegate-gif"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            />
          </motion.div>

          <motion.h1
            className="lovegate-title"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.4 }}
          >
            HEY BABY!
          </motion.h1>

          <motion.p
            className="lovegate-subtitle"
            key={message}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {message}
          </motion.p>

          <div className="lovegate-actions">
            <motion.button
              type="button"
              className="lovegate-circle-btn lovegate-no-btn"
              animate={{ scale: noScale, x: noOffset.x, y: noOffset.y }}
              whileTap={{ scale: noScale * 0.92 }}
              disabled={accepted}
              onClick={() => setNoClicks((count) => count + 1)}
              aria-label="No"
            >
              <X size={36} strokeWidth={3.4} />
            </motion.button>

            <motion.button
              type="button"
              className="lovegate-circle-btn lovegate-yes-btn"
              style={{ scale: yesScale }}
              whileTap={{ scale: yesScale * 0.94 }}
              disabled={accepted}
              onClick={() => {
                if (accepted) return
                setAccepted(true)
                window.setTimeout(onYes, 900)
              }}
              aria-label="Yes"
            >
              <Check size={36} strokeWidth={3.4} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
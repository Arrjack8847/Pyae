import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { questionOptions } from '../data/questionOptions'

type QuestionGateProps = {
  onComplete: () => void
  onRedroomMusicStart?: () => void
}

const revealLineDelay = 1000
const readyDelay = 800
const countdownDelay = 600
const welcomeHold = 400

const revealLines = [
  'Redroom unlocked.',
  'Naughty girl, I know you gonna choose that.',
  'Get ready to get red.',
  'I made the next little world red and sexy.',
  'Tiny sparkles are getting ready.',
  'Ready?',
]

const realAnswerId = 'redroom'
const realAnswerLabel = 'Redroom'

export function QuestionGate({ onComplete, onRedroomMusicStart }: QuestionGateProps) {
  const [selected, setSelected] = useState<string | null>(null)
  const [renamedOptionIds, setRenamedOptionIds] = useState<string[]>([])
  const [retryMessage, setRetryMessage] = useState('')
  const [lineIndex, setLineIndex] = useState(0)
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    if (!selected) return

    if (lineIndex < revealLines.length - 1) {
      const timer = window.setTimeout(() => setLineIndex((index) => index + 1), revealLineDelay)
      return () => window.clearTimeout(timer)
    }

    const readyTimer = window.setTimeout(() => setCountdown(3), readyDelay)
    return () => window.clearTimeout(readyTimer)
  }, [lineIndex, selected])

  useEffect(() => {
    if (countdown === null) return

    if (countdown === 0) {
      const doneTimer = window.setTimeout(onComplete, welcomeHold)
      return () => window.clearTimeout(doneTimer)
    }

    const timer = window.setTimeout(() => setCountdown((value) => (value === null ? null : value - 1)), countdownDelay)
    return () => window.clearTimeout(timer)
  }, [countdown, onComplete])

  const handleOptionPick = (option: (typeof questionOptions)[number]) => {
    const alreadyRenamed = renamedOptionIds.includes(option.id)

    if (option.id !== realAnswerId && !alreadyRenamed) {
      setRenamedOptionIds((current) => [...current, option.id])
      setRetryMessage(`${option.label} became ${realAnswerLabel}. Try again.`)
      return
    }

    onRedroomMusicStart?.()
    setSelected(realAnswerLabel)
    setRetryMessage('')
    setLineIndex(0)
    setCountdown(null)
  }

  return (
    <div className="gate-shell question-shell light-blue-theme">
      <div className="glass-panel question-panel">
        {!selected ? (
          <>
            <Sparkles className="mx-auto mb-4 text-[#f6a94f]" size={26} aria-hidden="true" />
            <h1>Before I show you...</h1>
            <p>I have one tiny cute question for you</p>
            <h2>What kind of room do you want to spend most of the time with me?</h2>

            <AnimatePresence mode="wait">
              {retryMessage && (
                <motion.p
                  key={retryMessage}
                  className="question-hint"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {retryMessage}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="question-options">
              {questionOptions.map((option) => {
                const isRenamed = renamedOptionIds.includes(option.id)
                const label = isRenamed ? realAnswerLabel : option.label

                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    className={`question-option ${isRenamed ? 'is-renamed' : ''}`}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleOptionPick(option)}
                  >
                    <span>{option.icon}</span>
                    {label}
                  </motion.button>
                )
              })}
            </div>
          </>
        ) : (
          <div className="reveal-copy">
            <AnimatePresence mode="wait">
              {countdown === null ? (
                <motion.div
                  key={lineIndex}
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.38 }}
                >
                  <p className="selected-choice">{selected}</p>
                  <h1>{revealLines[lineIndex]}</h1>
                </motion.div>
              ) : (
                <motion.div
                  key={countdown}
                  className="countdown"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.25 }}
                  transition={{ duration: 0.34 }}
                >
                  {countdown === 0 ? 'Welcome to Redroom' : countdown}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}

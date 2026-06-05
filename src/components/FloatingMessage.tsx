import { Sparkles } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { LoveMessage } from '../data/loveMessages'

type FloatingMessageProps = {
  message: LoveMessage
  opened: boolean
  guided?: boolean
  onOpen: () => void
}

export function FloatingMessage({ message, opened, guided = false, onOpen }: FloatingMessageProps) {
  const style = {
    left: message.x,
    top: message.y,
    '--float-duration': `${message.floatDuration}s`,
    '--float-delay': `${message.delay}s`,
    '--depth-z': `${message.z}px`,
    '--depth-scale': message.scale,
    '--rotation': `${message.rotate}deg`,
    '--drift-x': `${message.drift}px`,
  } as CSSProperties

  return (
    <button
      type="button"
      className={`floating-message floating-message--${message.tone} ${opened ? 'is-opened' : 'is-unopened'} ${
        guided ? 'is-guided' : ''
      }`}
      data-message-id={message.id}
      style={style}
      aria-label={opened ? `Open message again: ${message.label}` : `Unopened secret message: ${message.label}`}
      onPointerDown={(event) => {
        event.stopPropagation()
      }}
      onClick={(event) => {
        event.stopPropagation()
        onOpen()
      }}
    >
      <span className="floating-message__hit-target" aria-hidden="true" />
      <Sparkles size={15} aria-hidden="true" />
      {message.label}
    </button>
  )
}

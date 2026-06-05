import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { LoveMessage } from '../data/loveMessages'

type SecretNoteModalProps = {
  message?: LoveMessage
  onClose: () => void
}

export function SecretNoteModal({ message, onClose }: SecretNoteModalProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="secret-note glass-panel"
            initial={{ opacity: 0, scale: 0.9, y: 28 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 18 }}
            transition={{ duration: 0.28 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="icon-button close-button" aria-label="Close note" onClick={onClose}>
              <X size={18} aria-hidden="true" />
            </button>
            <p>{message.label}</p>
            <h2>{message.note}</h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

import { AnimatePresence, motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'

export function FlowerReveal() {
  const [showFinal, setShowFinal] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setShowFinal(true), 2000)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="flower-page light-blue-theme">
      <motion.div
        className="flower-bloom final-bouquet"
        initial={{ opacity: 0, y: 36, scale: 0.86, rotate: -3 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="/images/photo_2026-04-28_19-02-54-Photoroom.png"
          alt="Favorite flower bouquet"
          draggable={false}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {!showFinal ? (
          <motion.h1
            key="first"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
          >
            This website is only the first part of your gift...
          </motion.h1>
        ) : (
          <motion.div
            key="final"
            className="final-look"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <Heart size={34} fill="currentColor" aria-hidden="true" />
            <h1>Arr bwar ly doh py  nw😛</h1>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

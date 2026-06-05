import { Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function MusicPlayer() {
  const audioContext = useRef<AudioContext | null>(null)
  const gainNode = useRef<GainNode | null>(null)
  const interval = useRef<number | null>(null)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    return () => {
      if (interval.current) window.clearInterval(interval.current)
      audioContext.current?.close()
    }
  }, [])

  const playNote = (frequency: number, start: number, duration: number) => {
    const context = audioContext.current
    const gain = gainNode.current
    if (!context || !gain) return

    const oscillator = context.createOscillator()
    const noteGain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = frequency
    noteGain.gain.setValueAtTime(0, start)
    noteGain.gain.linearRampToValueAtTime(0.075, start + 0.05)
    noteGain.gain.exponentialRampToValueAtTime(0.001, start + duration)
    oscillator.connect(noteGain).connect(gain)
    oscillator.start(start)
    oscillator.stop(start + duration)
  }

  const start = async () => {
    const AudioCtor =
      window.AudioContext ||
      (window as Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioCtor) return

    if (!audioContext.current) {
      audioContext.current = new AudioCtor()
      gainNode.current = audioContext.current.createGain()
      gainNode.current.gain.value = 0.55
      gainNode.current.connect(audioContext.current.destination)
    }

    await audioContext.current.resume()
    const notes = [392, 493.88, 587.33, 783.99]
    const playLoop = () => {
      const context = audioContext.current
      if (!context) return
      notes.forEach((note, index) => playNote(note, context.currentTime + index * 0.32, 1.25))
    }

    playLoop()
    interval.current = window.setInterval(playLoop, 2600)
    setPlaying(true)
  }

  const stop = () => {
    if (interval.current) window.clearInterval(interval.current)
    interval.current = null
    setPlaying(false)
  }

  return (
    <button
      type="button"
      className="icon-button music-button"
      aria-label={playing ? 'Pause music' : 'Play music'}
      onClick={playing ? stop : start}
    >
      {playing ? <Volume2 size={19} aria-hidden="true" /> : <VolumeX size={19} aria-hidden="true" />}
    </button>
  )
}

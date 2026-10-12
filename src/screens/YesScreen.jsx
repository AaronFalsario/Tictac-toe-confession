import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { motion } from 'framer-motion'
import Flower from '../components/Flower.jsx'
import { playWin } from '../utils/sounds.js'

export default function YesScreen({ onReplay }) {
  useEffect(() => {
    playWin()
    const colors = ['#fff4f6', '#f9a8c5', '#d97790', '#f59e0b', '#14b8a6']
    confetti({ particleCount: 100, spread: 76, startVelocity: 26, origin: { y: 0.62 }, colors, ticks: 170, scalar: 0.85 })
  }, [])

  return (
    <motion.section initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="relative mx-auto max-w-xl overflow-hidden rounded-[28px] border border-rose-200/80 bg-[#fffdfb]/95 px-6 py-12 text-center shadow-[0_28px_90px_rgba(120,40,70,0.2)] sm:px-10">
      <motion.div initial={{ scale: 0.55, rotate: -25 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 150 }}>
        <Flower size={72} color="#df8da4" className="mx-auto drop-shadow-sm" />
      </motion.div>
      <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.24em] text-rose-500">Thank you, Ela</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold leading-relaxed text-[#684456] sm:text-3xl">I’ll spend every day earning that yes.</h1>
      <p className="mt-4 font-serif text-base leading-relaxed text-[#80596c]">Thank you for trusting me with the start of something special. I’ll meet your yes with patience, kindness, and the care it deserves.</p>
      <button type="button" onClick={onReplay} className="mt-9 rounded-xl border border-rose-200 bg-white/70 px-5 py-3 font-mono text-xs text-[#80596c] transition hover:border-rose-400 hover:bg-white">Replay the game</button>
    </motion.section>
  )
}

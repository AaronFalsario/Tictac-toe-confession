import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Envelope from '../components/Envelope.jsx'
import Flower from '../components/Flower.jsx'

// Moved to top so it's defined before use
const bloomFlowers = [
  { key: 'a', left: '8%', top: '9%', size: 76, color: '#d97790', rotate: 14, delay: 0.08 },
  { key: 'b', left: '77%', top: '12%', size: 108, color: '#f0a7b7', rotate: -14, delay: 0.16 },
  { key: 'c', left: '18%', top: '67%', size: 100, color: '#eaa0ad', rotate: 20, delay: 0.26 },
  { key: 'd', left: '73%', top: '65%', size: 82, color: '#c87992', rotate: -8, delay: 0.34 },
  { key: 'e', left: '46%', top: '6%', size: 44, color: '#e8a2b5', rotate: 8, delay: 0.22 },
]

export default function EnvelopeScreen({ onOpenMusic, onReveal }) {
  const [isOpen, setIsOpen] = useState(false)

  function open() {
    if (isOpen) return
    setIsOpen(true)
    onOpenMusic()
    window.setTimeout(onReveal, 1550)
  }

  return (
    <>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="panel mx-auto max-w-xl px-6 py-10 text-center sm:px-10 sm:py-12"
      >
        <div className="font-mono text-[10px] uppercase tracking-[0.26em] text-teal-400">
          Room 03 / Complete
        </div>
        <h1 className="mt-4 text-xl font-semibold text-slate-100">
          A final item was recovered.
        </h1>
        <p className="mt-2 font-mono text-xs text-slate-400">
          &gt; Victory. Here's your present for playing my game.
        </p>

        {/* Let the envelope peek out — no overflow clipping here */}
        <div className="mt-11 mb-7 overflow-visible">
          <Envelope isOpen={isOpen} onOpen={open} />
        </div>
      </motion.section>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="fixed inset-0 z-[60] grid place-items-center overflow-hidden bg-[#fce7ef]"
          >
            <motion.div
              initial={{ scale: 0.15, rotate: -12 }}
              animate={{ scale: 1.8, rotate: 0 }}
              transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#fff7f8_0%,#fbcfe0_52%,#f9a8c5_100%)]"
            />

            {bloomFlowers.map((flower) => (
              <motion.div
                key={flower.key}
                initial={{ opacity: 0, scale: 0.2, rotate: -30 }}
                animate={{ opacity: 0.72, scale: 1, rotate: flower.rotate }}
                transition={{ delay: flower.delay, duration: 0.8, ease: 'backOut' }}
                className="absolute"
                style={{ left: flower.left, top: flower.top }}
              >
                <Flower size={flower.size} color={flower.color} />
              </motion.div>
            ))}

            <motion.div
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="relative z-10 grid h-28 w-20 place-items-center rounded-lg border border-white/80 bg-[#fffaf7] shadow-[0_16px_50px_rgba(120,40,70,0.2)]"
            >
              <div className="absolute inset-x-2 top-5 space-y-2">
                <span className="block h-px bg-rose-200" />
                <span className="block h-px bg-rose-200" />
                <span className="block h-px w-4/5 bg-rose-200" />
              </div>
              <Flower size={27} color="#d97790" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
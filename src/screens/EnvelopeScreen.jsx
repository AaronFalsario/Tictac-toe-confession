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
    window.setTimeout(onReveal, 2050)
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
            exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] grid place-items-center overflow-hidden bg-[#fce7ef]"
          >
            <motion.div
              initial={{ scale: 0.03, opacity: 0.3, x: '-50%', y: '-50%' }}
              animate={{ scale: 1, opacity: 1, x: '-50%', y: '-50%' }}
              transition={{ duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute left-1/2 top-1/2 h-[160vmax] w-[160vmax] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,#fff7f8_0%,#fbcfe0_52%,#f9a8c5_100%)]"
            />

            {bloomFlowers.map((flower) => (
              <motion.div
                key={flower.key}
                initial={{ opacity: 0, scale: 0.12, rotate: flower.rotate - 65, y: 70 }}
                animate={{ opacity: 0.72, scale: 1, rotate: flower.rotate, y: 0 }}
                transition={{ delay: flower.delay + 0.15, duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                className="absolute"
                style={{ left: flower.left, top: flower.top }}
              >
                <Flower size={flower.size} color={flower.color} />
              </motion.div>
            ))}

            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.35, rotate: 8 }}
              animate={{ y: 0, opacity: 1, scale: [0.35, 1.06, 1], rotate: 0 }}
              transition={{ delay: 0.45, duration: 1.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 grid h-32 w-24 place-items-center rounded-lg border border-white/90 bg-[#fffaf7] shadow-[0_24px_80px_rgba(120,40,70,0.24)]"
            >
              <div className="absolute inset-x-3 top-5 space-y-3">
                <span className="block h-px bg-rose-200/90" />
                <span className="block h-px bg-rose-200/90" />
                <span className="block h-px w-4/5 bg-rose-200/90" />
                <span className="block h-px w-3/5 bg-rose-200/90" />
              </div>
              <motion.div animate={{ rotate: [0, 7, -6, 0] }} transition={{ delay: 0.8, duration: 2.5, ease: 'easeInOut' }}>
                <Flower size={32} color="#d97790" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
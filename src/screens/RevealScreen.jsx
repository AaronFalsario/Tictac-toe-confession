import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Flower from '../components/Flower.jsx'

// Customize the personal letter here. Paragraphs appear one at a time as she reads.
const letterParagraphs = [
  { kind: 'salutation', text: 'Hey Ela,' },
  { text: 'First of all, you made it through the locked room. I hope the little puzzle and our duel gave you a smile, because making this for you has been one of my favorite projects.' },
  { text: 'The game was a fun excuse, but the truth is much simpler: I wanted to make you something that felt like a little adventure, and save the most important part for the very end.' },
  { text: 'I really like who you are. I like your warmth, your way of making ordinary moments feel brighter, and how being around you leaves me in a better mood than before. There is something about you that makes me want to pay attention, listen a little closer, and keep getting to know you.' },
  { text: 'I have caught myself looking forward to seeing you, thinking of things we could do together, and wondering what it would be like to make more memories side by side. Not because everything has to be figured out today, but because the possibility makes me genuinely happy.' },
  { text: 'So I wanted to ask you properly, with a little care and a little courage. I would love the chance to court you: to spend more time together, learn what makes you laugh, show up for you, and see if we can build something meaningful at a pace that feels right for both of us.' },
  { text: 'There is no perfect answer I am expecting, and you do not owe me one just because I made a game. I mean it when I say you can take your time. Whatever you feel, I will respect it, and I am grateful you made it all the way here to read this.' },
  { kind: 'question', text: 'Can I court you?' },
  { kind: 'signature', text: 'With care, always.' },
]

const flowerPositions = [
  { left: '-46px', top: '8%', size: 112, color: '#eda6b9', delay: 0 },
  { right: '-38px', top: '19%', size: 92, color: '#d986a0', delay: 0.8 },
  { left: '-24px', bottom: '14%', size: 78, color: '#d986a0', delay: 1.2 },
  { right: '-50px', bottom: '4%', size: 118, color: '#efb0c0', delay: 0.4 },
]

export default function RevealScreen({ onYes }) {
  const [visibleLines, setVisibleLines] = useState(0)
  const [hoverCount, setHoverCount] = useState(0)
  const [thinkingLabel, setThinkingLabel] = useState('Let me think')
  const [response, setResponse] = useState('')
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setVisibleLines(1), 550)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (visibleLines === 0 || visibleLines >= letterParagraphs.length) return undefined
    const timer = window.setTimeout(() => setVisibleLines((count) => Math.min(count + 1, letterParagraphs.length)), 1450)
    return () => window.clearTimeout(timer)
  }, [visibleLines])

  function handleThinkingHover() {
    if (hoverCount >= 3) return
    const nextCount = hoverCount + 1
    setHoverCount(nextCount)
    if (nextCount >= 3) setThinkingLabel('Take your time')
  }

  function chooseTime() {
    setThinkingLabel('Take your time')
    setHoverCount(3)
    setResponse('Of course. There is no rush—take whatever time feels right for you.')
  }

  const progress = Math.round((visibleLines / letterParagraphs.length) * 100)

  return (
    <section className="relative mx-auto w-full max-w-3xl py-5 sm:py-10">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_48%,rgba(255,255,255,0.88),rgba(255,244,247,0.48)_54%,rgba(249,168,197,0.35))]" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(#d986a0_0.7px,transparent_0.7px)] [background-size:22px_22px]" />
        {flowerPositions.map((flower, index) => (
          <motion.div
            key={index}
            className="absolute opacity-50"
            style={{ left: flower.left, right: flower.right, top: flower.top, bottom: flower.bottom }}
            animate={{ y: [0, index % 2 ? 9 : -9, 0], rotate: [0, index % 2 ? -9 : 9, 0] }}
            transition={{ duration: 6 + index, repeat: Infinity, ease: 'easeInOut', delay: flower.delay }}
          >
            <Flower size={flower.size} color={flower.color} />
          </motion.div>
        ))}
        {driftingPetals.map((petal) => (
          <motion.span
            key={petal.key}
            className="absolute h-3 w-2 rounded-full bg-rose-300/70"
            style={{ left: petal.left }}
            initial={{ y: '-10vh', x: 0, rotate: 0, opacity: 0 }}
            animate={{ y: '110vh', x: petal.drift, rotate: 340, opacity: [0, 0.8, 0.75, 0] }}
            transition={{ duration: petal.duration, repeat: Infinity, ease: 'linear', delay: petal.delay }}
          />
        ))}
      </div>

      <motion.article
        initial={{ opacity: 0, y: 45, rotateX: 9, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative z-10 mx-auto max-w-2xl overflow-hidden rounded-[28px] border border-rose-200/80 bg-[#fffdfb]/95 shadow-[0_28px_90px_rgba(120,40,70,0.2)]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_0,transparent_35px,rgba(244,183,196,0.2)_36px,transparent_37px)]" />
        <div className="relative px-6 py-7 sm:px-12 sm:py-10">
          <div className="flex items-center justify-between gap-4 border-b border-rose-200/80 pb-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-rose-500">A letter, just for you</p>
              <h1 className="mt-2 font-serif text-2xl font-semibold text-[#684456] sm:text-3xl">A little something from me</h1>
            </div>
            <Flower size={42} color="#e29aae" />
          </div>

          <div className="mt-5 flex items-center gap-3" aria-label={`Letter revealed ${progress} percent`}>
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-rose-100">
              <motion.div animate={{ width: `${progress}%` }} className="h-full rounded-full bg-gradient-to-r from-rose-300 to-rose-500" />
            </div>
            <span className="font-mono text-[10px] text-rose-400">{progress}%</span>
          </div>

          {visibleLines < letterParagraphs.length && (
            <button
              type="button"
              onClick={() => setVisibleLines(letterParagraphs.length)}
              className="mt-4 rounded-md px-2 py-1 font-mono text-[10px] text-rose-500 underline decoration-rose-200 underline-offset-4 transition hover:text-rose-700"
            >
              Skip the writing animation
            </button>
          )}

          <div className="relative mt-6 space-y-4 font-serif text-[16px] leading-[1.85] text-[#594650] sm:text-[17px]">
            {letterParagraphs.slice(0, visibleLines).map((paragraph, index) => (
              <motion.p
                key={paragraph.text}
                initial={{ opacity: 0, y: 10, filter: 'blur(3px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.65 }}
                className={
                  paragraph.kind === 'salutation'
                    ? 'text-xl font-semibold text-[#684456]'
                    : paragraph.kind === 'question'
                      ? 'pt-2 text-center text-2xl font-semibold text-rose-600 sm:text-3xl'
                      : paragraph.kind === 'signature'
                        ? 'pt-1 text-right text-base italic text-[#9b6176]'
                        : ''
                }
              >
                {paragraph.text}
                {index === visibleLines - 1 && visibleLines < letterParagraphs.length && <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-rose-400 align-middle" />}
              </motion.p>
            ))}
          </div>

          {visibleLines >= letterParagraphs.length && !accepted && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8 border-t border-rose-100 pt-6 text-center">
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => { setAccepted(true); onYes() }}
                  className="rounded-xl bg-rose-500 px-8 py-3 font-mono text-sm font-semibold text-white shadow-[0_10px_28px_rgba(190,75,114,0.25)] transition hover:-translate-y-0.5 hover:bg-rose-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                >
                  Yes, I’d like that
                </button>
                <motion.button
                  type="button"
                  onMouseEnter={handleThinkingHover}
                  onFocus={handleThinkingHover}
                  onClick={chooseTime}
                  animate={hoverCount < 3 ? { x: [0, hoverCount % 2 ? -4 : 4, 0], scale: [1, 0.98, 1] } : { x: 0, scale: 1 }}
                  transition={{ duration: 0.32 }}
                  className="rounded-xl border border-rose-200 bg-white/70 px-6 py-3 font-mono text-sm text-[#80596c] transition hover:border-rose-300 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-400"
                >
                  {thinkingLabel}
                </motion.button>
              </div>
              {response && <p aria-live="polite" className="mt-4 font-serif text-sm italic text-[#9b6176]">{response}</p>}
            </motion.div>
          )}
        </div>
      </motion.article>
      <p className="relative z-10 mt-5 text-center font-mono text-[9px] uppercase tracking-[0.25em] text-rose-500/70">Take your time · There is no wrong answer</p>
    </section>
  )
}

const driftingPetals = [
  { key: 'one', left: '12%', delay: 1, duration: 17, drift: 45 },
  { key: 'two', left: '31%', delay: 5, duration: 19, drift: -35 },
  { key: 'three', left: '69%', delay: 2, duration: 16, drift: 40 },
  { key: 'four', left: '88%', delay: 8, duration: 20, drift: -50 },
  { key: 'five', left: '52%', delay: 11, duration: 18, drift: 24 },
]

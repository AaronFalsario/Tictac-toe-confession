import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from '../components/Icon.jsx'
import { playClick, playLockOpen } from '../utils/sounds.js'

// Customize the date here. Accepted input is matched by its six digits.
const LOCK_DATE = '07/20/26'

export default function LockScreen({ onUnlock }) {
  const [entry, setEntry] = useState('')
  const [hintVisible, setHintVisible] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [locked, setLocked] = useState(false)
  const [shake, setShake] = useState(false)

  useEffect(() => {
    if (!locked) return undefined
    const timer = window.setTimeout(onUnlock, 1500)
    return () => window.clearTimeout(timer)
  }, [locked, onUnlock])

  function submit(event) {
    event.preventDefault()
    if (locked) return
    const acceptedEntries = [
      LOCK_DATE,
      LOCK_DATE.replaceAll('/', '-'),
      LOCK_DATE.replaceAll('/', ''),
      LOCK_DATE.replace(/^0(?=\d\/)/, ''),
    ]
    if (acceptedEntries.includes(entry.trim())) {
      playLockOpen()
      setFeedback('> Access granted. Proceeding to Part 2...')
      setLocked(true)
      return
    }
    playClick()
    setFeedback('> Incorrect. Try again.')
    setShake(true)
    window.setTimeout(() => setShake(false), 380)
  }

  return (
    <section className="panel mx-auto max-w-xl p-6 sm:p-10">
      <div className="mb-8 flex items-center gap-3 border-b border-slate-700/80 pb-5">
        <div className="grid h-11 w-11 place-items-center rounded-xl border border-teal-500/30 bg-teal-500/10 text-teal-300"><Icon name="lock" size={22} /></div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-teal-400">An indie puzzle</p>
          <h1 className="font-mono text-lg font-bold tracking-wide text-slate-100 sm:text-xl">THE LOCKED ROOM</h1>
        </div>
      </div>
      <p className="text-sm text-slate-400">A puzzle in three parts</p>
      <div className="mt-8 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-700" />
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-amber-400">Part 1 — The Lock</p>
        <span className="h-px flex-1 bg-slate-700" />
      </div>

      <form onSubmit={submit} className="mt-8">
        <motion.div animate={shake ? { x: [0, -7, 7, -5, 5, 0] } : { x: 0 }} transition={{ duration: 0.34 }} className={`mx-auto flex max-w-sm items-center gap-3 rounded-xl border bg-slate-950/80 p-3 transition-colors ${feedback.startsWith('> Incorrect') ? 'border-[#b4534b]/70 shadow-[0_0_24px_rgba(180,83,75,0.12)]' : 'border-slate-700'}`}>
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-lg border ${locked ? 'border-teal-400/50 bg-teal-400/10 text-teal-300' : 'border-slate-700 bg-slate-800 text-slate-400'}`}>
            {locked ? <Icon name="check" /> : <Icon name="lock" />}
          </div>
          <input
            autoComplete="off"
            aria-label="Combination"
            inputMode="numeric"
            placeholder="MM / DD / YY"
            value={entry}
            onChange={(event) => setEntry(event.target.value)}
            disabled={locked}
            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-center font-mono text-lg tracking-[0.12em] text-slate-100 outline-none placeholder:text-sm placeholder:tracking-[0.12em] placeholder:text-slate-600"
          />
          <button disabled={locked} className="rounded-lg bg-teal-500 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-teal-400 disabled:opacity-70">Enter</button>
        </motion.div>
      </form>

      <p className="terminal mt-6 min-h-6 text-sm" aria-live="polite">{feedback || '> Enter the date that opened the first door.'}</p>
      <div className="mt-5 flex justify-center">
        <button type="button" onClick={() => { playClick(); setHintVisible((visible) => !visible) }} className="rounded-md px-3 py-2 font-mono text-xs text-slate-400 transition hover:text-amber-300">
          {hintVisible ? 'Hide hint' : '[ ? ]  Hint'}
        </button>
      </div>
      <AnimatePresence>
        {hintVisible && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-center font-mono text-xs text-amber-300">&gt; Hint: A day that changed everything. (MM/DD/YY)</motion.p>}
      </AnimatePresence>
      <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">Room 01 <span className="mx-2 text-slate-700">/</span> Awaiting input</p>
    </section>
  )
}

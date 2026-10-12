import { motion } from 'framer-motion'
import Icon from './Icon.jsx'

export default function Envelope({ isOpen, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={isOpen}
      aria-label="Open the envelope"
      className="group relative mx-auto block h-72 w-80 max-w-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400 disabled:cursor-default overflow-visible"
      style={{ perspective: '1000px' }}
    >
      {/* ── Letter note (sits BEHIND the envelope body, peeks up on hover) ── */}
      <div
        className={[
          'absolute left-1/2 top-10 z-0 grid h-40 w-60 -ml-[7.5rem] place-items-center overflow-hidden',
          'rounded-md border border-amber-200/80 bg-amber-50 text-amber-800 shadow-lg',
          'transition-transform duration-500 ease-out',
          isOpen
            ? '-translate-y-[130px] scale-95 opacity-0'
            : 'translate-y-8 group-hover:-translate-y-3',
        ].join(' ')}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_27px,#e6d5bc_28px)] bg-[size:100%_28px] opacity-30"
        />
        <span className="relative font-mono text-[10px] font-semibold tracking-[0.2em]">
          A NOTE FOR YOU
        </span>
      </div>

      {/* ── Envelope container ── */}
      <div className="absolute bottom-8 left-1/2 z-10 h-40 w-72 -ml-36" style={{ transformStyle: 'preserve-3d' }}>

        {/* Envelope back panel (behind everything) */}
        <div className="absolute inset-0 rounded-xl border border-slate-300/90 bg-slate-100 shadow-[0_20px_50px_rgba(2,6,23,0.4)]" />

        {/* Inner V-fold lines (the classic envelope look) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-xl bg-[linear-gradient(145deg,transparent_49.5%,rgba(100,116,139,0.18)_50%,transparent_50.5%),linear-gradient(35deg,transparent_49.5%,rgba(100,116,139,0.14)_50%,transparent_50.5%)]"
        />

        {/* ── The FLAP / LID — rotates up and back on open ── */}
        <motion.div
          initial={false}
          animate={{
            rotateX: isOpen ? -180 : 0,
            zIndex: isOpen ? 0 : 30,
          }}
          transition={{ duration: 0.7, ease: [0.34, 1.2, 0.64, 1] }}
          style={{
            transformOrigin: 'top center',
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden',
          }}
          className="absolute inset-x-0 top-0 z-30 h-20 origin-top"
        >
          {/* Outer face of the flap (visible when closed) */}
          <div className="absolute inset-0 rounded-t-xl bg-slate-200 [clip-path:polygon(0_0,100%_0,50%_100%)] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.08)]" />
        </motion.div>

        {/* ── Wax seal (only shown when closed) ── */}
        {!isOpen && (
          <span className="absolute left-1/2 top-1/2 z-40 grid h-12 w-12 -ml-6 -mt-6 place-items-center rounded-full border border-amber-800/30 bg-amber-500 text-amber-950 shadow-md transition-transform duration-300 group-hover:scale-105">
            <span className="grid h-9 w-9 place-items-center rounded-full border border-amber-800/25">
              <Icon name="spark" size={18} />
            </span>
          </span>
        )}

        {/* ── Front pocket panel (the front face of the envelope) ──
             Sits above the letter but below the flap when closed.
             This is what makes the letter look "inside" the envelope. */}
        <div className="absolute inset-x-0 bottom-0 z-20 h-[108px] overflow-hidden rounded-b-xl border-x border-b border-slate-300/90">
          {/* Front V shape */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-slate-100 [clip-path:polygon(0_100%,0_0,50%_55%,100%_0,100%_100%)]"
          />
          {/* Highlight edge */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.6),transparent_35%)] [clip-path:polygon(0_100%,0_0,50%_55%,100%_0,100%_100%)]"
          />
        </div>
      </div>

      {/* Hint text */}
      {!isOpen && (
        <motion.span
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -bottom-2 left-0 right-0 font-mono text-[10px] font-medium uppercase tracking-[0.24em] text-amber-400/80"
        >
          Open envelope to continue
        </motion.span>
      )}
    </button>
  )
}
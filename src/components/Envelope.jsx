import { useState } from 'react'
import Icon from './Icon.jsx'

const ENVELOPE_HEIGHT = 150

export default function Envelope({ isOpen, onOpen }) {
  const [isHovered, setIsHovered] = useState(false)
  const isPeeking = isHovered && !isOpen

  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={isOpen}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      aria-label="Open the envelope"
      className="group relative mx-auto block cursor-pointer transition-transform duration-300 hover:-translate-y-1 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400 disabled:cursor-default"
      style={{ width: 'min(288px, 88vw)', height: 245, perspective: 1000 }}
    >
      <div
        aria-hidden="true"
        className="absolute bottom-5 left-1/2 rounded-xl border border-slate-300 bg-slate-200 shadow-[0_20px_50px_rgba(2,6,23,0.35)]"
        style={{ width: '100%', height: ENVELOPE_HEIGHT, transform: 'translateX(-50%)', zIndex: 1 }}
      />

      <div
        aria-hidden="true"
        className={`absolute left-[11%] top-[75px] z-[2] grid h-[150px] w-[78%] translate-y-2 place-items-center overflow-hidden rounded-t-md border border-amber-200 bg-[#fff9e9] text-amber-900 opacity-0 shadow-[0_4px_14px_rgba(15,23,42,0.12)] transition-[transform,opacity] duration-700 ease-out ${isOpen ? 'z-[7] -translate-y-[125px]' : 'group-hover:-translate-y-[68px] group-hover:opacity-100'}`}
      >
        <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_27px,#eadfc8_27px,#eadfc8_28px)] opacity-35" />
        <span className="relative font-mono text-[9px] font-semibold tracking-[0.18em]">A NOTE FOR YOU</span>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-5 left-1/2 rounded-xl border border-slate-300 bg-slate-100 [clip-path:polygon(0_0,50%_62%,100%_0,100%_100%,0_100%)]"
        style={{ width: '100%', height: ENVELOPE_HEIGHT, transform: 'translateX(-50%)', zIndex: 3 }}
      />

      <div
        aria-hidden="true"
        className="absolute bottom-5 left-1/2 h-[150px] rounded-xl border border-slate-300/70 bg-[linear-gradient(145deg,transparent_49.4%,rgba(100,116,139,0.15)_50%,transparent_50.6%),linear-gradient(35deg,transparent_49.4%,rgba(100,116,139,0.12)_50%,transparent_50.6%)]"
        style={{ width: '100%', transform: 'translateX(-50%)', zIndex: 4 }}
      />

      <div
        aria-hidden="true"
        className={`absolute left-0 h-[76px] w-full [transform-origin:top_center] [transform-style:preserve-3d] [backface-visibility:hidden] transition-transform duration-700 ease-out ${isOpen ? '[transform:rotateX(-165deg)]' : 'group-hover:[transform:rotateX(-155deg)]'}`}
        style={{
          bottom: 94,
          transformOrigin: 'top center',
          transformStyle: 'preserve-3d',
          backfaceVisibility: 'hidden',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        <div className="h-full w-full rounded-t-lg bg-gradient-to-b from-slate-200 to-slate-300 [clip-path:polygon(0_0,100%_0,50%_100%)] shadow-sm" />
      </div>

      {!isOpen && (
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-[calc(100%-93px)] z-[6] grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-amber-800/30 bg-amber-500 text-amber-950 shadow-md transition-all duration-300 group-hover:scale-75 group-hover:opacity-0"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full border border-amber-800/25"><Icon name="spark" size={17} /></span>
        </span>
      )}

      {!isOpen && (
        <span className="absolute -bottom-0 left-0 right-0 font-mono text-[9px] uppercase tracking-[0.2em] text-amber-400/80">
          {isPeeking ? 'Click to open' : 'Hover to peek · Click to open'}
        </span>
      )}
    </button>
  )
}
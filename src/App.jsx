import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import EnvelopeScreen from './screens/EnvelopeScreen.jsx'
import GameScreen from './screens/GameScreen.jsx'
import LockScreen from './screens/LockScreen.jsx'
import RevealScreen from './screens/RevealScreen.jsx'
import YesScreen from './screens/YesScreen.jsx'
import MusicToggle from './components/MusicToggle.jsx'
import { useBackgroundMusic } from './hooks/useBackgroundMusic.js'

export default function App() {
  const [screen, setScreen] = useState('lock')
  const [musicAvailable, setMusicAvailable] = useState(true)
  const music = useBackgroundMusic()

  function openEnvelope() {
    music.play().then(setMusicAvailable)
  }

  function replay() {
    music.stop()
    setScreen('lock')
  }

  const isPersonalReveal = screen === 'reveal' || screen === 'yes'

  return (
    <main className={`relative flex min-h-screen items-center justify-center px-4 py-12 ${isPersonalReveal ? 'bg-[#fff4f6] text-[#503440]' : 'overflow-hidden'}`}>
      {!isPersonalReveal && <div aria-hidden="true" className="pointer-events-none absolute inset-0 game-grid opacity-60" />}
      {!isPersonalReveal && <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.08),transparent_58%)]" />}

      {(screen === 'reveal' || screen === 'yes') && (
        <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
          {!musicAvailable && screen !== 'yes' && (
            <button onClick={() => music.play().then(setMusicAvailable)} className="rounded-full border border-rose-300 bg-white/90 px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-rose-700 shadow-lg hover:bg-white">
              Add song to play
            </button>
          )}
          <MusicToggle isPlaying={music.isPlaying} onToggle={music.toggle} />
        </div>
      )}

      <div className={`relative z-10 w-full ${isPersonalReveal ? 'max-w-5xl' : 'max-w-3xl'}`}>
        <AnimatePresence mode="wait">
          {screen === 'lock' && <motion.div key="lock" {...pageTransition}><LockScreen onUnlock={() => setScreen('game')} /></motion.div>}
          {screen === 'game' && <motion.div key="game" {...pageTransition}><GameScreen onWin={() => setScreen('envelope')} /></motion.div>}
          {screen === 'envelope' && <motion.div key="envelope" {...pageTransition}><EnvelopeScreen onOpenMusic={openEnvelope} onReveal={() => setScreen('reveal')} /></motion.div>}
          {screen === 'reveal' && <motion.div key="reveal" {...pageTransition}><RevealScreen onYes={() => setScreen('yes')} /></motion.div>}
          {screen === 'yes' && <motion.div key="yes" {...pageTransition}><YesScreen onReplay={replay} /></motion.div>}
        </AnimatePresence>
      </div>
    </main>
  )
}

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: 'easeOut' },
}

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from '../components/Icon.jsx'
import { playClick, playWin } from '../utils/sounds.js'

const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]

function getWinner(board) {
  for (const [a, b, c] of lines) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  return board.every(Boolean) ? 'draw' : null
}

// The opponent spots winning moves but leaves enough openings for a casual win.
function chooseAiMove(board) {
  for (let index = 0; index < 9; index += 1) {
    if (!board[index]) {
      const candidate = [...board]
      candidate[index] = 'O'
      if (getWinner(candidate) === 'O') return index
    }
  }
  if (Math.random() < 0.35) {
    for (let index = 0; index < 9; index += 1) {
      if (!board[index]) {
        const candidate = [...board]
        candidate[index] = 'X'
        if (getWinner(candidate) === 'X') return index
      }
    }
  }
  const available = board.map((cell, index) => (cell ? -1 : index)).filter((index) => index >= 0)
  if (available.includes(4) && Math.random() < 0.35) return 4
  return available[Math.floor(Math.random() * available.length)]
}

export default function GameScreen({ onWin }) {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [result, setResult] = useState(null)
  const [thinking, setThinking] = useState(false)
  const [won, setWon] = useState(false)
  const aiTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(aiTimer.current), [])

  function play(index) {
    if (board[index] || result || thinking) return
    playClick()
    const playerBoard = [...board]
    playerBoard[index] = 'X'
    setBoard(playerBoard)
    const playerResult = getWinner(playerBoard)
    if (playerResult) {
      setResult(playerResult)
      if (playerResult === 'X') {
        setWon(true)
        playWin()
        window.setTimeout(onWin, 1450)
      }
      return
    }
    setThinking(true)
    aiTimer.current = window.setTimeout(() => {
      const next = [...playerBoard]
      next[chooseAiMove(next)] = 'O'
      const aiResult = getWinner(next)
      setBoard(next)
      if (aiResult) setResult(aiResult)
      setThinking(false)
    }, 440)
  }

  function rematch() {
    window.clearTimeout(aiTimer.current)
    setBoard(Array(9).fill(null))
    setResult(null)
    setThinking(false)
    setWon(false)
  }

  const status = won
    ? "> Victory. Here's your present for playing my game."
    : result === 'O'
      ? '> Rematch? (The chamber awaits.)'
      : result === 'draw'
        ? '> A stalemate. Try again.'
        : thinking
          ? '> Opponent is considering a move...'
          : '> Win to unlock the final chamber.'

  return (
    <section className="panel mx-auto max-w-xl p-6 sm:p-10">
      <div className="flex items-start justify-between gap-4 border-b border-slate-700/80 pb-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-amber-400">Room 02 / Strategy</p>
          <h1 className="mt-2 font-mono text-2xl font-bold text-slate-100">Part 2 — The Duel</h1>
        </div>
        <div className="rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 font-mono text-[10px] text-slate-500">X <span className="text-teal-300">YOU</span><br />O <span className="text-amber-300">CPU</span></div>
      </div>
      <p className="terminal mt-6 text-sm" aria-live="polite">{status}</p>

      <div className="relative mx-auto mt-7 w-full max-w-[310px]">
        <AnimatePresence>
          {!won && <motion.div key="board" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.94, filter: 'blur(4px)' }} transition={{ duration: 0.45 }} className="grid grid-cols-3 gap-2">
            {board.map((cell, index) => (
              <button
                key={index}
                type="button"
                onClick={() => play(index)}
                disabled={Boolean(cell) || Boolean(result) || thinking}
                aria-label={`Cell ${index + 1}${cell ? `, ${cell}` : ', empty'}`}
                className="grid aspect-square place-items-center rounded-xl border border-slate-700 bg-slate-950/80 font-mono text-5xl transition hover:border-teal-500/70 hover:bg-slate-800/80 disabled:cursor-default disabled:hover:border-slate-700"
              >
                {cell && <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={cell === 'X' ? 'text-teal-300' : 'text-amber-300'}>{cell}</motion.span>}
              </button>
            ))}
          </motion.div>}
        </AnimatePresence>
        {won && <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 grid place-items-center rounded-2xl border border-teal-500/25 bg-slate-900/90 text-teal-300"><Icon name="envelope" size={34} /></motion.div>}
      </div>

      {result && !won && (
        <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} onClick={rematch} className="mx-auto mt-6 block rounded-lg border border-slate-600 px-5 py-3 font-mono text-xs text-slate-200 transition hover:border-teal-500 hover:text-teal-200">
          Rematch <span aria-hidden="true">↻</span>
        </motion.button>
      )}
      <div className="mt-7 flex items-center justify-between border-t border-slate-800 pt-4 font-mono text-[10px] uppercase tracking-wider text-slate-600"><span>PLAYER X / HUMAN</span><span>TIC-TAC-TOE / 3×3</span></div>
    </section>
  )
}

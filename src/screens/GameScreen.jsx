import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Icon from '../components/Icon.jsx'
import { playClick, playWin } from '../utils/sounds.js'

const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
const memoryFaces = ['🌷', '💌', '🌙', '💖']
const wordRounds = [
  { answer: 'LOVE', letters: 'VOLE', hint: 'A feeling at the heart of this game.' },
  { answer: 'HEART', letters: 'TAHER', hint: 'Something that beats in your chest.' },
  { answer: 'FLOWER', letters: 'WOLFRE', hint: 'A pretty gift that grows in a garden.' },
  { answer: 'FOREVER', letters: 'VORFREE', hint: 'How long I hope we stay together.' },
]
const heartPattern = ['💌', '🌷', '🌙']
const patternChoices = ['🌷', '🌙', '💌', '💖']
const puzzleSize = 2
const solvedPuzzle = [1, 2, 3, null]
const envelopeSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#fff1f3"/><stop offset="1" stop-color="#f9c7d3"/></linearGradient><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fffdf8"/><stop offset="1" stop-color="#fff5e9"/></linearGradient><linearGradient id="env" x2="1" y2="1"><stop stop-color="#f7c3cd"/><stop offset="1" stop-color="#e99eaf"/></linearGradient></defs><rect width="300" height="300" fill="url(#bg)"/><circle cx="44" cy="48" r="4" fill="#fff" opacity=".8"/><circle cx="254" cy="53" r="6" fill="#fff" opacity=".7"/><circle cx="244" cy="255" r="4" fill="#fff" opacity=".8"/><path d="M63 85h174v139H63z" rx="8" fill="url(#paper)" stroke="#e7c9bd" stroke-width="3"/><path d="M87 117h126M87 137h126M87 157h95" stroke="#e8c9c6" stroke-width="4" stroke-linecap="round"/><ellipse cx="150" cy="225" rx="111" ry="19" fill="#bb7184" opacity=".18"/><path d="M38 127l112 83 112-83v90H38z" fill="url(#env)" stroke="#d88d9d" stroke-width="3" stroke-linejoin="round"/><path d="M39 127l111 72 111-72" fill="none" stroke="#d88d9d" stroke-width="3"/><path d="M38 217l84-66m140 66l-84-66" fill="none" stroke="#df9aaa" stroke-width="3"/><circle cx="150" cy="184" r="20" fill="#fff5f5" stroke="#dd8d9e" stroke-width="2"/><path d="M150 196s-12-7-12-15a7 7 0 0112-4 7 7 0 0112 4c0 8-12 15-12 15z" fill="#d97992"/></svg>`
const envelopeImage = `url("data:image/svg+xml,${encodeURIComponent(envelopeSvg)}")`

function getWinner(board) {
  for (const [a, b, c] of lines) if (board[a] && board[a] === board[b] && board[a] === board[c]) return board[a]
  return board.every(Boolean) ? 'draw' : null
}

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

function createMemoryCards() {
  return [...memoryFaces, ...memoryFaces]
    .map((face, index) => ({ id: `${face}-${index}`, face }))
    .sort(() => Math.random() - 0.5)
}

function createShuffledPuzzle() {
  let puzzle = [...solvedPuzzle]
  let previousBlank = -1

  for (let move = 0; move < 3; move += 1) {
    const blank = puzzle.indexOf(null)
    const neighbors = [blank - puzzleSize, blank + puzzleSize]
    if (blank % puzzleSize > 0) neighbors.push(blank - 1)
    if (blank % puzzleSize < puzzleSize - 1) neighbors.push(blank + 1)
    const choices = neighbors.filter((index) => index >= 0 && index < solvedPuzzle.length && index !== previousBlank)
    const next = choices[Math.floor(Math.random() * choices.length)]
    ;[puzzle[blank], puzzle[next]] = [puzzle[next], puzzle[blank]]
    previousBlank = blank
  }

  return puzzle
}

function isSolved(puzzle) {
  return puzzle.every((tile, index) => tile === solvedPuzzle[index])
}

export default function GameScreen({ onWin }) {
  const [stage, setStage] = useState('duel')
  const [board, setBoard] = useState(Array(9).fill(null))
  const [result, setResult] = useState(null)
  const [thinking, setThinking] = useState(false)
  const [won, setWon] = useState(false)
  const [cards, setCards] = useState(createMemoryCards)
  const [openCards, setOpenCards] = useState([])
  const [matchedCards, setMatchedCards] = useState([])
  const [selectedLetters, setSelectedLetters] = useState([])
  const [wordRound, setWordRound] = useState(0)
  const [wordFeedback, setWordFeedback] = useState('')
  const [patternInput, setPatternInput] = useState([])
  const [patternVisible, setPatternVisible] = useState(true)
  const [patternFeedback, setPatternFeedback] = useState('')
  const [puzzle, setPuzzle] = useState(createShuffledPuzzle)
  const [puzzleComplete, setPuzzleComplete] = useState(false)
  const [puzzleMoves, setPuzzleMoves] = useState(0)
  const aiTimer = useRef(null)
  const stageTimer = useRef(null)
  const memoryTimer = useRef(null)

  useEffect(() => () => {
    window.clearTimeout(aiTimer.current)
    window.clearTimeout(stageTimer.current)
    window.clearTimeout(memoryTimer.current)
  }, [])

  useEffect(() => {
    if (stage !== 'pattern') return undefined
    setPatternVisible(true)
    const timer = window.setTimeout(() => setPatternVisible(false), 2200)
    return () => window.clearTimeout(timer)
  }, [stage])

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
        stageTimer.current = window.setTimeout(() => setStage('memory'), 1250)
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

  function chooseMemoryCard(index) {
    if (openCards.length === 2 || openCards.includes(index) || matchedCards.includes(index)) return
    playClick()
    if (openCards.length === 0) {
      setOpenCards([index])
      return
    }

    const [first] = openCards
    setOpenCards([first, index])
    if (cards[first].face === cards[index].face) {
      const nextMatched = [...matchedCards, first, index]
      setMatchedCards(nextMatched)
      setOpenCards([])
      if (nextMatched.length === cards.length) {
        playWin()
        stageTimer.current = window.setTimeout(() => setStage('word'), 850)
      }
      return
    }

    memoryTimer.current = window.setTimeout(() => setOpenCards([]), 750)
  }

  function submitWord() {
    if (wordFeedback.startsWith('> Round') || wordFeedback.startsWith('> All four')) return
    const round = wordRounds[wordRound]
    const answer = selectedLetters.map((index) => round.letters[index]).join('')
    if (answer === round.answer) {
      playWin()
      if (wordRound === wordRounds.length - 1) {
        setWordFeedback('> All four words solved! Watch the little sequence next.')
        stageTimer.current = window.setTimeout(() => setStage('pattern'), 900)
      } else {
        setWordFeedback(`> Round ${wordRound + 1} complete! Get ready for the next word.`)
        stageTimer.current = window.setTimeout(() => {
          setWordRound((roundIndex) => roundIndex + 1)
          setSelectedLetters([])
          setWordFeedback('')
        }, 850)
      }
      return
    }
    playClick()
    setWordFeedback('> Not quite. Rearrange the letters and try again.')
  }

  function tapPattern(choice) {
    if (patternVisible) return
    playClick()
    const next = [...patternInput, choice]
    setPatternInput(next)
    if (heartPattern[next.length - 1] !== patternChoices[choice]) {
      setPatternInput([])
      setPatternFeedback('> Oops! Watch the sequence again and try once more.')
      setPatternVisible(true)
      window.setTimeout(() => setPatternVisible(false), 2200)
      return
    }
    setPatternFeedback('')
    if (next.length === heartPattern.length) {
      playWin()
      stageTimer.current = window.setTimeout(() => setStage('picture'), 800)
    }
  }

  function movePuzzleTile(index) {
    if (puzzleComplete) return
    const blank = puzzle.indexOf(null)
    const adjacent = Math.abs(Math.floor(index / puzzleSize) - Math.floor(blank / puzzleSize)) + Math.abs((index % puzzleSize) - (blank % puzzleSize)) === 1
    if (!adjacent) return
    playClick()
    const next = [...puzzle]
    ;[next[index], next[blank]] = [next[blank], next[index]]
    setPuzzle(next)
    setPuzzleMoves((moves) => moves + 1)
    if (isSolved(next)) {
      setPuzzleComplete(true)
      playWin()
    }
  }

  function shufflePuzzle() {
    setPuzzle(createShuffledPuzzle())
    setPuzzleComplete(false)
    setPuzzleMoves(0)
  }

  const status = won
    ? '> Duel cleared. Loading the next puzzle...'
    : result === 'O'
      ? '> The opponent won. Try another match.'
      : result === 'draw'
        ? '> A stalemate. Try again.'
        : thinking
          ? '> Opponent is considering a move...'
          : '> Win to unlock the next puzzle.'

  const stages = ['duel', 'memory', 'word', 'pattern', 'picture']
  const room = stages.indexOf(stage) + 1
  const stageTitles = {
    duel: 'The Duel',
    memory: 'The Matching Game',
    word: 'The Secret Word',
    pattern: 'The Heartbeat',
    picture: 'The Hidden Picture',
  }
  const stageLabels = {
    duel: 'TIC-TAC-TOE / 3×3',
    memory: 'MEMORY / 4 PAIRS',
    word: 'WORD SCRAMBLE / 4 ROUNDS',
    pattern: 'PATTERN / 3 SYMBOLS',
    picture: 'SLIDING PICTURE / 2×2',
  }

  return (
    <section className="panel mx-auto max-w-xl p-6 sm:p-10">
      <div className="flex items-start justify-between gap-4 border-b border-slate-700/80 pb-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-amber-400">Room 02 / Game {room} of {stages.length}</p>
          <h1 className="mt-2 font-mono text-2xl font-bold text-slate-100">{stageTitles[stage]}</h1>
        </div>
        <div className="flex gap-1.5 pt-1" aria-label={`Game ${room} of ${stages.length}`}>
          {stages.map((item, index) => (
            <span key={item} className={`h-2 w-5 rounded-full sm:w-7 ${index < room ? 'bg-teal-400' : 'bg-slate-700'}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stage === 'duel' && (
          <motion.div key="duel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="terminal text-sm" aria-live="polite">{status}</p>
              <span className="shrink-0 rounded-lg border border-slate-700 bg-slate-950/70 px-3 py-2 font-mono text-[10px] text-slate-500">X <span className="text-teal-300">YOU</span> / O <span className="text-amber-300">CPU</span></span>
            </div>
            <div className="relative mx-auto mt-6 w-full max-w-[310px]">
              <AnimatePresence>
                {!won && (
                  <motion.div key="board" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.94, filter: 'blur(4px)' }} transition={{ duration: 0.45 }} className="grid grid-cols-3 gap-2">
                    {board.map((cell, index) => (
                      <button key={index} type="button" onClick={() => play(index)} disabled={Boolean(cell) || Boolean(result) || thinking} aria-label={`Cell ${index + 1}${cell ? `, ${cell}` : ', empty'}`} className="grid aspect-square place-items-center rounded-xl border border-slate-700 bg-slate-950/80 font-mono text-5xl transition hover:border-teal-500/70 hover:bg-slate-800/80 disabled:cursor-default disabled:hover:border-slate-700">
                        {cell && <motion.span initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={cell === 'X' ? 'text-teal-300' : 'text-amber-300'}>{cell}</motion.span>}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              {won && <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 grid place-items-center rounded-2xl border border-teal-500/25 bg-slate-900/90 text-teal-300"><Icon name="check" size={34} /></motion.div>}
            </div>
            {result && !won && (
              <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} onClick={rematch} className="mx-auto mt-5 block rounded-lg border border-slate-600 px-5 py-3 font-mono text-xs text-slate-200 transition hover:border-teal-500 hover:text-teal-200">
                Rematch <span aria-hidden="true">↻</span>
              </motion.button>
            )}
          </motion.div>
        )}

        {stage === 'memory' && (
          <motion.div key="memory" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <p className="terminal mt-5 text-sm" aria-live="polite">&gt; Find all four matching pairs to continue.</p>
            <div className="mx-auto mt-6 grid max-w-sm grid-cols-4 gap-3">
              {cards.map((card, index) => {
                const isVisible = openCards.includes(index) || matchedCards.includes(index)
                return (
                  <button key={card.id} type="button" onClick={() => chooseMemoryCard(index)} disabled={matchedCards.includes(index) || openCards.length === 2} aria-label={isVisible ? `Card ${index + 1}: ${card.face}` : `Reveal card ${index + 1}`} className={`grid aspect-square place-items-center rounded-xl border text-3xl transition sm:text-4xl ${isVisible ? 'border-rose-300/60 bg-rose-300/15' : 'border-slate-700 bg-slate-950/80 hover:border-rose-300/60 hover:bg-slate-800'} disabled:cursor-default`}>
                    {isVisible ? card.face : <span className="font-mono text-lg text-rose-300/70">?</span>}
                  </button>
                )
              })}
            </div>
            <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-wider text-slate-500">Pairs found: {matchedCards.length / 2} / 4</p>
          </motion.div>
        )}

        {stage === 'word' && (
          <motion.div key="word" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="terminal text-sm" aria-live="polite">&gt; Unscramble the letters to solve the word.</p>
              <span className="shrink-0 rounded-full border border-rose-300/30 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-rose-200">Round {wordRound + 1} / {wordRounds.length}</span>
            </div>
            <p className="mt-4 text-center text-sm text-amber-200/90">{wordRounds[wordRound].hint}</p>
            <div className="mt-5 flex min-h-16 items-center justify-center gap-2" aria-label={`Your answer: ${selectedLetters.map((index) => wordRounds[wordRound].letters[index]).join('') || 'empty'}`}>
              {wordRounds[wordRound].answer.split('').map((_, index) => (
                <span key={index} className="grid h-12 w-12 place-items-center rounded-lg border border-slate-700 bg-slate-950/70 font-mono text-xl font-bold text-rose-200">
                  {selectedLetters[index] === undefined ? <span className="text-slate-700">_</span> : wordRounds[wordRound].letters[selectedLetters[index]]}
                </span>
              ))}
            </div>
            <div className="mx-auto mt-5 flex max-w-xs flex-wrap justify-center gap-2">
              {wordRounds[wordRound].letters.split('').map((letter, index) => (
                <button key={index} type="button" onClick={() => { setSelectedLetters((current) => [...current, index]); setWordFeedback('') }} disabled={selectedLetters.includes(index)} aria-label={`Choose letter ${letter}`} className="grid h-12 w-12 place-items-center rounded-lg border border-rose-300/40 bg-rose-300/10 font-mono text-xl font-bold text-rose-100 transition hover:bg-rose-300/20 disabled:opacity-30">
                  {letter}
                </button>
              ))}
            </div>
            <p className="mt-4 min-h-5 text-center font-mono text-xs text-amber-300" aria-live="polite">{wordFeedback || `Letters: ${wordRounds[wordRound].letters.split('').join(' · ')}`}</p>
            <div className="mt-4 flex justify-center gap-3">
              <button type="button" onClick={() => { setSelectedLetters([]); setWordFeedback('') }} className="rounded-lg border border-slate-600 px-4 py-2 font-mono text-xs text-slate-200 transition hover:border-rose-300 hover:text-rose-200">Clear</button>
              <button type="button" onClick={submitWord} disabled={selectedLetters.length !== wordRounds[wordRound].answer.length || wordFeedback.startsWith('> Round') || wordFeedback.startsWith('> All four')} className="rounded-lg bg-rose-300 px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-40">Check word</button>
            </div>
          </motion.div>
        )}

        {stage === 'pattern' && (
          <motion.div key="pattern" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <p className="terminal mt-5 text-sm" aria-live="polite">&gt; Memorize the three symbols, then repeat them in order.</p>
            <div className="mx-auto mt-5 flex min-h-16 max-w-xs items-center justify-center gap-3 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3" aria-label={patternVisible ? 'Memorize this sequence' : 'Repeat the sequence'}>
              {patternVisible ? heartPattern.map((symbol, index) => (
                <span key={`${symbol}-${index}`} className="grid h-11 w-11 place-items-center rounded-lg bg-rose-300/10 text-3xl">{symbol}</span>
              )) : patternInput.map((choice, index) => (
                <span key={`${choice}-${index}`} className="grid h-11 w-11 place-items-center rounded-lg bg-teal-300/10 text-3xl">{patternChoices[choice]}</span>
              ))}
              {!patternVisible && patternInput.length === 0 && <span className="font-mono text-xs text-slate-500">Your turn!</span>}
            </div>
            <p className="mt-4 min-h-5 text-center font-mono text-xs text-amber-300" aria-live="polite">{patternFeedback || (patternVisible ? 'Remember the order...' : 'Tap the symbols in the same order.')}</p>
            <div className="mx-auto mt-4 grid max-w-xs grid-cols-4 gap-2">
              {patternChoices.map((symbol, index) => (
                <button key={symbol} type="button" onClick={() => tapPattern(index)} disabled={patternVisible} aria-label={`Choose ${symbol}`} className="grid aspect-square place-items-center rounded-xl border border-slate-700 bg-slate-950/80 text-3xl transition hover:border-rose-300/70 hover:bg-slate-800 disabled:cursor-wait disabled:opacity-50">{symbol}</button>
              ))}
            </div>
          </motion.div>
        )}

        {stage === 'picture' && (
          <motion.div key="picture" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <p className="terminal mt-5 text-sm" aria-live="polite">
              {puzzleComplete ? '> Picture restored. Your envelope is ready.' : '> Just 3 easy moves! Match the picture below.'}
            </p>
            {!puzzleComplete && (
              <div className="mx-auto mt-4 flex w-fit items-center gap-3 rounded-xl border border-slate-700/80 bg-slate-950/50 px-3 py-2">
                <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">Picture guide</span>
                <div role="img" aria-label="Picture guide showing the completed envelope" className="h-12 w-12 rounded-md border border-rose-200/30 bg-cover" style={{ backgroundImage: envelopeImage, backgroundPosition: 'center', backgroundSize: 'cover' }} />
              </div>
            )}
            <div className="mx-auto mt-5 grid w-full max-w-[330px] grid-cols-2 gap-1.5 overflow-hidden rounded-2xl border border-rose-200/30 bg-slate-950 p-2">
              {puzzleComplete ? (
                <motion.div initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }} role="img" aria-label="Completed picture of a pink envelope" className="col-span-2 aspect-square rounded-xl bg-cover shadow-[0_12px_35px_rgba(249,168,193,0.22)]" style={{ backgroundImage: envelopeImage, backgroundPosition: 'center', backgroundSize: 'cover' }} />
              ) : puzzle.map((tile, index) => {
                if (tile === null) return <div key="empty" aria-label="Empty tile space" className="aspect-square rounded-lg bg-slate-800/80" />
                const sourceIndex = tile - 1
                const row = Math.floor(sourceIndex / puzzleSize)
                const column = sourceIndex % puzzleSize
                return <button key={tile} type="button" onClick={() => movePuzzleTile(index)} aria-label={`Move picture tile ${tile}`} className="aspect-square rounded-lg border border-white/20 bg-cover transition hover:border-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-rose-300" style={{ backgroundImage: envelopeImage, backgroundSize: `${puzzleSize * 100}% ${puzzleSize * 100}%`, backgroundPosition: `${column * 100}% ${row * 100}%` }} />
              })}
            </div>
            {puzzleComplete ? (
              <motion.button initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} onClick={onWin} className="mx-auto mt-6 block rounded-lg bg-rose-300 px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-slate-950 transition hover:bg-rose-200">
                Reveal the envelope <span aria-hidden="true">→</span>
              </motion.button>
            ) : (
              <div className="mt-5 flex items-center justify-center gap-5">
                <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">Moves: {puzzleMoves} <span className="text-slate-600">/ about 3</span></p>
                <button type="button" onClick={shufflePuzzle} className="rounded-lg border border-slate-600 px-4 py-2 font-mono text-xs text-slate-200 transition hover:border-rose-300 hover:text-rose-200">Shuffle</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-7 flex items-center justify-between border-t border-slate-800 pt-4 font-mono text-[10px] uppercase tracking-wider text-slate-600"><span>FIVE GAMES / ONE SURPRISE</span><span>{stageLabels[stage]}</span></div>
    </section>
  )
}

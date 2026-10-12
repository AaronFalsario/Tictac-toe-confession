import { useCallback, useEffect, useRef, useState } from 'react'

// Add the user-supplied, licensed MP3 at this public path.
const MUSIC_FILE = '/music/take-a-chance-with-me.mp3'

export function useBackgroundMusic() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = new Audio(MUSIC_FILE)
    audio.loop = true
    audio.preload = 'none'
    audio.addEventListener('play', () => setIsPlaying(true))
    audio.addEventListener('pause', () => setIsPlaying(false))
    audio.addEventListener('error', () => setIsPlaying(false))
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      audioRef.current = null
    }
  }, [])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return false
    try {
      await audio.play()
      setIsPlaying(true)
      return true
    } catch (error) {
      console.warn('Background music could not be played. Check the MP3 path and browser permissions.', error)
      setIsPlaying(false)
      return false
    }
  }, [])

  const stop = useCallback(() => {
    audioRef.current?.pause()
  }, [])

  const toggle = useCallback(async () => {
    if (audioRef.current?.paused) await play()
    else stop()
  }, [play, stop])

  return { isPlaying, play, stop, toggle }
}

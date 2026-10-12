let audioContext

function tone(frequency, duration, type = 'sine') {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return
    audioContext ||= new AudioContextClass()
    if (audioContext.state === 'suspended') void audioContext.resume()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime)
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration)
    oscillator.connect(gain)
    gain.connect(audioContext.destination)
    oscillator.start()
    oscillator.stop(audioContext.currentTime + duration)
  } catch (error) {
    console.warn('The browser could not play a Love Quest sound.', error)
  }
}

export const playClick = () => tone(520, 0.07, 'triangle')

export const playLockOpen = () => {
  tone(440, 0.12)
  window.setTimeout(() => tone(660, 0.18), 100)
}

export const playWin = () => {
  tone(523, 0.16)
  window.setTimeout(() => tone(659, 0.16), 100)
  window.setTimeout(() => tone(784, 0.24), 200)
}

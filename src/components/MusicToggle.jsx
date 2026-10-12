import Icon from './Icon.jsx'

export default function MusicToggle({ isPlaying, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
      title={isPlaying ? 'Pause music' : 'Play music'}
      className={`flex min-h-11 items-center gap-2.5 rounded-full border px-4 py-2 shadow-lg backdrop-blur-md transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-400 ${isPlaying ? 'border-rose-300 bg-white/90 text-rose-700' : 'border-rose-200 bg-white/75 text-[#80596c] hover:border-rose-300 hover:bg-white'}`}
    >
      <span className="relative grid h-7 w-7 place-items-center rounded-full bg-rose-100/80 text-rose-600">
        <Icon name={isPlaying ? 'music' : 'mute'} size={15} />
        {isPlaying && (
          <span aria-hidden="true" className="absolute -right-0.5 -top-0.5 flex h-3 items-end gap-px">
            <span className="h-1 w-0.5 animate-pulse rounded-full bg-rose-500" />
            <span className="h-2 w-0.5 animate-pulse rounded-full bg-rose-400 [animation-delay:120ms]" />
            <span className="h-1.5 w-0.5 animate-pulse rounded-full bg-rose-500 [animation-delay:240ms]" />
          </span>
        )}
      </span>
      <span className="text-left">
        <span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-rose-400">{isPlaying ? 'Now playing' : 'Music paused'}</span>
        <span className="block text-xs font-medium">{isPlaying ? 'Pause song' : 'Play song'}</span>
      </span>
    </button>
  )
}

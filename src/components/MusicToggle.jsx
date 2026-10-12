import Icon from './Icon.jsx'

export default function MusicToggle({ isPlaying, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isPlaying ? 'Pause background music' : 'Play background music'}
      title={isPlaying ? 'Pause music' : 'Play music'}
      className="grid h-10 w-10 place-items-center rounded-full border border-slate-700 bg-slate-900/90 text-slate-300 shadow-lg transition hover:border-teal-500 hover:text-teal-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-400"
    >
      <Icon name={isPlaying ? 'music' : 'mute'} />
    </button>
  )
}

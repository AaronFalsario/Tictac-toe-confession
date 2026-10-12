const paths = {
  arrow: <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 1 1 8 0v3" /></>,
  music: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></>,
  mute: <><path d="M11 5 6 9H3v6h3l5 4z" /><path d="m17 9 5 6m0-6-5 6" /></>,
  envelope: <><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></>,
  spark: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" /></>,
}

export default function Icon({ name, className = '', size = 20 }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

export default function Flower({ size = 64, color = '#d97790', center = '#f8df9c', className = '' }) {
  return (
    <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 100 100" fill="none">
      <g fill={color} opacity="0.9">
        <ellipse cx="50" cy="23" rx="13" ry="23" />
        <ellipse cx="50" cy="23" rx="13" ry="23" transform="rotate(60 50 50)" />
        <ellipse cx="50" cy="23" rx="13" ry="23" transform="rotate(120 50 50)" />
        <ellipse cx="50" cy="23" rx="13" ry="23" transform="rotate(180 50 50)" />
        <ellipse cx="50" cy="23" rx="13" ry="23" transform="rotate(240 50 50)" />
        <ellipse cx="50" cy="23" rx="13" ry="23" transform="rotate(300 50 50)" />
      </g>
      <circle cx="50" cy="50" r="12" fill={center} />
      <circle cx="50" cy="50" r="5" fill="#fff8ed" opacity="0.8" />
    </svg>
  )
}

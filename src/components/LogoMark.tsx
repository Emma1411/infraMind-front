export default function LogoMark({ className = "size-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={className} role="img" aria-label="Logo InfraMind">
      <defs>
        <linearGradient id="inframind-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3874ea" />
          <stop offset="1" stopColor="#1b3a82" />
        </linearGradient>
      </defs>
      <rect width="36" height="36" rx="10" fill="url(#inframind-logo)" />
      <g stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none">
        <path d="M11 12.5 18 18l7-5.5" />
        <path d="M18 18v8" />
      </g>
      <g fill="#fff">
        <circle cx="11" cy="12.5" r="2.6" />
        <circle cx="25" cy="12.5" r="2.6" />
        <circle cx="18" cy="26" r="2.6" />
      </g>
    </svg>
  );
}
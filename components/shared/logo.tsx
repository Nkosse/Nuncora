import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconOnly?: boolean
  size?: "sm" | "md" | "lg"
}

const sizes = {
  sm: { icon: 28, font: 15, gap: 8 },
  md: { icon: 36, font: 19, gap: 10 },
  lg: { icon: 44, font: 24, gap: 12 },
}

export function ConvexLogo({ className, iconOnly = false, size = "md" }: LogoProps) {
  const s = sizes[size]
  const totalWidth = iconOnly ? s.icon : s.icon + s.gap + s.font * 4.6
  const totalHeight = s.icon

  return (
    <svg
      width={totalWidth}
      height={totalHeight}
      viewBox={`0 0 ${totalWidth} ${totalHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-label="Convex"
    >
      <defs>
        <linearGradient id="cvx-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
        <linearGradient id="cvx-line" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
        <filter id="cvx-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Icon: rounded square with gradient */}
      <rect
        x="0" y="0"
        width={s.icon} height={s.icon}
        rx={s.icon * 0.22}
        fill="url(#cvx-grad)"
      />

      {/* Subtle inner highlight at top */}
      <rect
        x="0" y="0"
        width={s.icon} height={s.icon * 0.5}
        rx={s.icon * 0.22}
        fill="rgba(255,255,255,0.07)"
      />

      {/* Convex upward curve — the core icon */}
      {(() => {
        const p = s.icon
        const x1 = p * 0.22, y1 = p * 0.76   // start: bottom-left
        const x2 = p * 0.78, y2 = p * 0.24   // end: top-right
        const cx = p * 0.25, cy = p * 0.25   // control point (convex outward = control near top-left)
        return (
          <path
            d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
            stroke="url(#cvx-line)"
            strokeWidth={p * 0.075}
            strokeLinecap="round"
            fill="none"
            filter="url(#cvx-glow)"
          />
        )
      })()}

      {/* Peak dot */}
      {(() => {
        const p = s.icon
        return (
          <circle
            cx={p * 0.78} cy={p * 0.24}
            r={p * 0.095}
            fill="white"
            filter="url(#cvx-glow)"
          />
        )
      })()}

      {/* Start dot (subtle) */}
      {(() => {
        const p = s.icon
        return (
          <circle
            cx={p * 0.22} cy={p * 0.76}
            r={p * 0.055}
            fill="rgba(255,255,255,0.45)"
          />
        )
      })()}

      {/* Wordmark */}
      {!iconOnly && (
        <text
          x={s.icon + s.gap}
          y={s.icon * 0.685}
          fontFamily="-apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif"
          fontSize={s.font}
          fontWeight="700"
          letterSpacing="-0.4"
          fill="white"
        >
          Convex
        </text>
      )}
    </svg>
  )
}

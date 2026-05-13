import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 text-center", className)}>
      {Icon && (
        <div className="mb-4 p-4 rounded-2xl bg-zinc-800/50 border border-zinc-800">
          <Icon className="h-8 w-8 text-zinc-600" />
        </div>
      )}
      <h3 className="text-sm font-semibold text-zinc-300">{title}</h3>
      {description && <p className="mt-1 text-sm text-zinc-600 max-w-sm">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

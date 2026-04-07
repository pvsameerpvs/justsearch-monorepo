import * as React from "react"
import { cn } from "./Button"

export const Badge = ({ className, variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'success' | 'warning' | 'danger' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
  }
  
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors", variants[variant], className)} {...props} />
  )
}

export const PageHeader = ({ title, description, children }: { title: string, description?: string, children?: React.ReactNode }) => (
  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between py-6">
    <div className="space-y-1">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      {description && <p className="text-sm text-slate-500">{description}</p>}
    </div>
    <div className="flex items-center gap-2 mt-2 sm:mt-0">
      {children}
    </div>
  </div>
)

import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

const accentStyles = {
  green: 'border-l-green-500 text-green-600',
  blue: 'border-l-blue-600 text-blue-600',
  red: 'border-l-red-500 text-red-500',
  gray: 'border-l-gray-400 text-gray-500',
  orange: 'border-l-orange-500 text-orange-500',
}

interface MetricCardProps {
  label: string
  value: string | number
  subtitle?: string | null
  accent?: keyof typeof accentStyles
  icon?: LucideIcon
  unit?: string | null
}

export default function MetricCard({
  label,
  value,
  subtitle,
  accent,
  icon: Icon,
  unit,
}: MetricCardProps) {
  return (
    <div
      className={`relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${
        accent ? `border-l-4 ${accentStyles[accent]}` : ''
      }`}
    >
      {Icon && (
        <Icon className="absolute right-3 top-3 h-4 w-4 text-gray-300" />
      )}
      <p className="text-[10px] font-semibold tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">
        {value}
        {unit && <span className="ml-1 text-lg font-semibold text-gray-500">{unit}</span>}
      </p>
      {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
    </div>
  )
}

interface SectionHeaderProps {
  title: string
  subtitle: string
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-3">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  )
}

interface ChartCardProps {
  title: string
  subtitle: string
  children: ReactNode
  className?: string
}

export function ChartCard({ title, subtitle, children, className = '' }: ChartCardProps) {
  return (
    <div className={`rounded-lg border border-gray-200 bg-white p-5 shadow-sm ${className}`}>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mb-4 text-sm text-gray-500">{subtitle}</p>
      {children}
    </div>
  )
}

export interface FilterOptions {
  division: string[]
  ticketType: string[]
  payment: string[]
  workflow: string[]
  status: string[]
  decisionMatrix: string[]
  year: string[]
}

export interface StatusOverviewItem {
  id: string
  label: string
  value: number
  subtitle: string | null
  accent: 'green' | 'blue' | 'red' | 'gray' | 'orange'
  icon: string
}

export interface TimingMetricItem {
  id: string
  label: string
  value: string
  unit: string | null
  subtitle: string
  icon: string
}

export interface TrendPoint {
  monthKey: string
  month: string
  days: number
}

export interface StatusMixItem {
  status: string
  count: number
  color: string
}

export interface VolumePoint {
  monthKey: string
  month: string
  count: number
}

export type AnalyticsTab = 'executive' | 'approval-time' | 'operational' | 'ai-insights'

export interface FilterState {
  division: string
  ticketType: string
  payment: string
  workflow: string
  status: string
  decisionMatrix: string
  year: string
}

export const defaultFilters = (options: FilterOptions): FilterState => ({
  division: options.division[0] ?? 'All',
  ticketType: options.ticketType[0] ?? 'All',
  payment: options.payment[0] ?? 'All',
  workflow: options.workflow[0] ?? 'All',
  status: options.status[0] ?? 'All',
  decisionMatrix: options.decisionMatrix[0] ?? 'All',
  year: options.year[0] ?? 'All',
})

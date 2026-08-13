export interface AnalyticsFiltersQuery {
  division?: string
  ticket_type?: string
  payment?: string
  workflow?: string
  status?: string
  decision_matrix?: string
  year?: number
}

export interface FiltersResponse {
  divisions: string[]
  ticket_types: string[]
  payments: string[]
  workflows: string[]
  statuses: string[]
  decision_matrices: string[]
  years: number[]
}

export interface StatusCountItem {
  status: string
  count: number
  percentage: number
}

export interface AdminSendbacksL1 {
  count: number
  percentage: number
}

export interface StatusOverview {
  statuses: StatusCountItem[]
  admin_sendbacks_l1: AdminSendbacksL1
}

export interface TimingMetrics {
  avg_approval_time_days: number
  median_approval_time_days: number
  avg_checker_time_days: number
  median_checker_time_days: number
  avg_co_initiator_time_days: number
  avg_approver_time_days: number
  median_approver_time_days: number
}

export interface MonthTrendItem {
  month: string
  avg_days: number
  ticket_count: number
}

export interface ClosureVolumeItem {
  month: string
  count: number
}

export interface ExecutiveResponse {
  total_filtered: number
  status_overview: StatusOverview
  timing_metrics: TimingMetrics
  approval_time_trend: MonthTrendItem[]
  closure_volume_by_month: ClosureVolumeItem[]
}

export interface AgingBucketItem {
  bucket: string
  count: number
}

export interface SendbackTrendItem {
  month: string
  count: number
}

export interface VerticalAvgItem {
  vertical: string
  avg_days: number
  ticket_count: number
}

export interface DepartmentAvgItem {
  department: string
  avg_days: number
  ticket_count: number
}

export interface OperationalResponse {
  total_filtered: number
  open_ticket_aging: AgingBucketItem[]
  admin_sendback_trend: SendbackTrendItem[]
  approval_time_by_vertical: VerticalAvgItem[]
  approval_time_by_department: DepartmentAvgItem[]
}

export interface ExplorerDataItem {
  label: string
  value: number
  ticket_count: number
}

export interface ExplorerResponse {
  measure: string
  breakdown_by: string
  period: string
  view: string
  total_filtered: number
  unit: string
  data: ExplorerDataItem[]
}

export type ExplorerMeasure = 'approval_time'
export type ExplorerBreakdown = 'vertical' | 'division' | 'department' | 'ticket_type'
export type ExplorerPeriod = 'month' | 'week'
export type ExplorerView = 'breakdown' | 'trend'

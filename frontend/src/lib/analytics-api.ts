import api from './api'
import type { FilterOptions, FilterState } from '../types/analytics'
import type {
  AnalyticsFiltersQuery,
  ExecutiveResponse,
  ExplorerBreakdown,
  ExplorerMeasure,
  ExplorerPeriod,
  ExplorerResponse,
  ExplorerView,
  FiltersResponse,
  OperationalResponse,
} from '../types/analytics-api'

export function filtersToQuery(filters: FilterState): AnalyticsFiltersQuery {
  const query: AnalyticsFiltersQuery = {}

  if (filters.division !== 'All') query.division = filters.division
  if (filters.ticketType !== 'All') query.ticket_type = filters.ticketType
  if (filters.payment !== 'All') query.payment = filters.payment
  if (filters.workflow !== 'All') query.workflow = filters.workflow
  if (filters.status !== 'All') query.status = filters.status
  if (filters.decisionMatrix !== 'All') query.decision_matrix = filters.decisionMatrix
  if (filters.year !== 'All') query.year = Number(filters.year)

  return query
}

export function mapFiltersResponse(response: FiltersResponse): FilterOptions {
  return {
    division: ['All', ...response.divisions],
    ticketType: ['All', ...response.ticket_types],
    payment: ['All', ...response.payments],
    workflow: ['All', ...response.workflows],
    status: ['All', ...response.statuses],
    decisionMatrix: ['All', ...response.decision_matrices],
    year: ['All', ...response.years.map(String)],
  }
}

export async function fetchAnalyticsFilters(): Promise<FilterOptions> {
  const { data } = await api.get<FiltersResponse>('/api/analytics/filters')
  return mapFiltersResponse(data)
}

export async function fetchExecutive(filters: FilterState): Promise<ExecutiveResponse> {
  const { data } = await api.get<ExecutiveResponse>('/api/analytics/executive', {
    params: filtersToQuery(filters),
  })
  return data
}

export async function fetchOperational(filters: FilterState): Promise<OperationalResponse> {
  const { data } = await api.get<OperationalResponse>('/api/analytics/operational', {
    params: filtersToQuery(filters),
  })
  return data
}

export async function fetchExplorer(
  filters: FilterState,
  options: {
    measure?: ExplorerMeasure
    breakdownBy?: ExplorerBreakdown
    period?: ExplorerPeriod
    view?: ExplorerView
  },
): Promise<ExplorerResponse> {
  const { data } = await api.get<ExplorerResponse>('/api/analytics/explorer', {
    params: {
      ...filtersToQuery(filters),
      measure: options.measure ?? 'approval_time',
      breakdown_by: options.breakdownBy ?? 'vertical',
      period: options.period ?? 'month',
      view: options.view ?? 'breakdown',
    },
  })
  return data
}

export function formatMonthLabel(monthKey: string): string {
  const parts = monthKey.split('-')
  if (parts.length < 2) return monthKey
  const month = Number(parts[1])
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return labels[month - 1] ?? monthKey
}

/** Unique month label including year — avoids duplicate x-axis keys across years. */
export function formatMonthYearLabel(monthKey: string): string {
  const parts = monthKey.split('-')
  if (parts.length < 2) return monthKey
  const year = parts[0]
  const month = Number(parts[1])
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthLabel = labels[month - 1] ?? monthKey
  return `${monthLabel} '${year.slice(-2)}`
}

export function formatMonthYearLongLabel(monthKey: string): string {
  const parts = monthKey.split('-')
  if (parts.length < 2) return monthKey
  const year = parts[0]
  const month = Number(parts[1])
  const labels = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  const monthLabel = labels[month - 1] ?? monthKey
  return `${monthLabel} ${year}`
}

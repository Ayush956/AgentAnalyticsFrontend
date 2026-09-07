import type {
  ExecutiveResponse,
  StatusCountItem,
} from '../types/analytics-api'
import type {
  StatusMixItem,
  StatusOverviewItem,
  TimingMetricItem,
  TrendPoint,
  VolumePoint,
} from '../types/analytics'
import { formatMonthYearLabel } from './analytics-api'

const STATUS_COLORS: Record<string, string> = {
  Closed: '#22c55e',
  Open: '#003399',
  Initiated: '#003399',
  Rejected: '#ef4444',
  Cancelled: '#f97316',
}

const STATUS_CARD_CONFIG: Record<
  string,
  { label: string; accent: StatusOverviewItem['accent']; icon: string; subtitle?: string }
> = {
  Closed: { label: 'CLOSED', accent: 'green', icon: 'check-circle' },
  Open: { label: 'OPEN', accent: 'blue', icon: 'clock', subtitle: 'Initiated · not closed' },
  Initiated: { label: 'OPEN', accent: 'blue', icon: 'clock', subtitle: 'Initiated · not closed' },
  Rejected: { label: 'REJECTED', accent: 'red', icon: 'alert-circle' },
  Cancelled: { label: 'CANCELLED', accent: 'gray', icon: 'ban' },
}

function findStatusCount(statuses: StatusCountItem[], names: string[]): number {
  return statuses
    .filter((s) => names.some((n) => s.status.toLowerCase() === n.toLowerCase()))
    .reduce((sum, s) => sum + s.count, 0)
}

export function mapStatusOverview(data: ExecutiveResponse): StatusOverviewItem[] {
  const { statuses, admin_sendbacks_l1 } = data.status_overview
  const cards: StatusOverviewItem[] = []

  const closed = statuses.find((s) => s.status === 'Closed')
  if (closed) {
    cards.push({
      id: 'closed',
      label: 'CLOSED',
      value: closed.count,
      subtitle: `${closed.percentage}% of total`,
      accent: 'green',
      icon: 'check-circle',
    })
  }

  const openCount = findStatusCount(statuses, ['Open', 'Initiated'])
  if (openCount > 0) {
    cards.push({
      id: 'open',
      label: 'OPEN',
      value: openCount,
      subtitle: 'Initiated · not closed',
      accent: 'blue',
      icon: 'clock',
    })
  }

  for (const status of statuses) {
    if (['Closed', 'Open', 'Initiated'].includes(status.status)) continue
    const config = STATUS_CARD_CONFIG[status.status]
    if (config) {
      cards.push({
        id: status.status.toLowerCase(),
        label: config.label,
        value: status.count,
        subtitle: status.percentage > 0 ? `${status.percentage}% of total` : null,
        accent: config.accent,
        icon: config.icon,
      })
    }
  }

  cards.push({
    id: 'sendbacks',
    label: 'ADMIN SEND-BACKS (L1)',
    value: admin_sendbacks_l1.count,
    subtitle: `${admin_sendbacks_l1.percentage}% of total`,
    accent: 'orange',
    icon: 'undo',
  })

  return cards
}

export function mapTimingMetrics(data: ExecutiveResponse): TimingMetricItem[] {
  const t = data.timing_metrics
  return [
    {
      id: 'approval',
      label: 'AVG APPROVAL TIME',
      value: String(t.avg_approval_time_days),
      unit: 'D',
      subtitle: `Median ${t.median_approval_time_days} d`,
      icon: 'timer',
    },
    {
      id: 'checker',
      label: 'AVG CHECKER TIME',
      value: String(t.avg_checker_time_days),
      unit: 'D',
      subtitle: `Median ${t.median_checker_time_days} d`,
      icon: 'shield',
    },
    {
      id: 'co-initiator',
      label: 'AVG CO-INITIATOR TIME',
      value: String(t.avg_co_initiator_time_days),
      unit: 'D',
      subtitle: 'Where co-initiators present',
      icon: 'users',
    },
    {
      id: 'approver',
      label: 'AVG APPROVER TIME',
      value: String(t.avg_approver_time_days),
      unit: 'D',
      subtitle: `Median ${t.median_approver_time_days} d`,
      icon: 'file-check',
    },
    {
      id: 'total',
      label: 'TOTAL TICKETS (FILTERED)',
      value: String(data.total_filtered),
      unit: null,
      subtitle: 'Matching current filters',
      icon: 'layers',
    },
  ]
}

export function mapStatusMix(data: ExecutiveResponse): StatusMixItem[] {
  return data.status_overview.statuses.map((item) => ({
    status: item.status,
    count: item.count,
    color: STATUS_COLORS[item.status] ?? '#94a3b8',
  }))
}

export function mapApprovalTrend(data: ExecutiveResponse): TrendPoint[] {
  return data.approval_time_trend.map((item) => ({
    monthKey: item.month,
    month: formatMonthYearLabel(item.month),
    days: item.avg_days,
  }))
}

export function mapClosureVolume(data: ExecutiveResponse): VolumePoint[] {
  return data.closure_volume_by_month.map((item) => ({
    monthKey: item.month,
    month: formatMonthYearLabel(item.month),
    count: item.count,
  }))
}

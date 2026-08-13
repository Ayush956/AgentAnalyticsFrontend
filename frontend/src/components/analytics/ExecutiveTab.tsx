import { getMetricIcon } from '../layout/DashboardLayout'
import MetricCard, { ChartCard, SectionHeader } from './MetricCard'
import FilterBar from './FilterBar'
import ApprovalTimeTrendChart from './charts/ApprovalTimeTrendChart'
import StatusMixChart from './charts/StatusMixChart'
import ClosureVolumeChart from './charts/ClosureVolumeChart'
import {
  mapApprovalTrend,
  mapClosureVolume,
  mapStatusMix,
  mapStatusOverview,
  mapTimingMetrics,
} from '../../lib/executive-mappers'
import type { ExecutiveResponse } from '../../types/analytics-api'
import type { FilterOptions, FilterState } from '../../types/analytics'

interface ExecutiveTabProps {
  data: ExecutiveResponse
  filterOptions: FilterOptions
  filters: FilterState
  onFilterChange: (key: keyof FilterState, value: string) => void
  onFilterReset: () => void
}

export default function ExecutiveTab({
  data,
  filterOptions,
  filters,
  onFilterChange,
  onFilterReset,
}: ExecutiveTabProps) {
  const statusOverview = mapStatusOverview(data)
  const timingMetrics = mapTimingMetrics(data)
  const approvalTimeTrend = mapApprovalTrend(data)
  const statusMix = mapStatusMix(data)
  const closureVolume = mapClosureVolume(data)

  return (
    <>
      <FilterBar
        options={filterOptions}
        values={filters}
        onChange={onFilterChange}
        onReset={onFilterReset}
      />

      <section className="mt-6">
        <SectionHeader
          title="Status overview"
          subtitle="Ticket counts by current lifecycle state"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {statusOverview.map((item) => (
            <MetricCard
              key={item.id}
              label={item.label}
              value={item.value}
              subtitle={item.subtitle}
              accent={item.accent}
              icon={getMetricIcon(item.icon)}
            />
          ))}
        </div>
      </section>

      <section className="mt-6">
        <SectionHeader
          title="Timing metrics"
          subtitle="Average days spent at each approval stage"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {timingMetrics.map((item) => (
            <MetricCard
              key={item.id}
              label={item.label}
              value={item.value}
              unit={item.unit}
              subtitle={item.subtitle}
              icon={getMetricIcon(item.icon)}
            />
          ))}
        </div>
      </section>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard
          title="Approval Time Trend"
          subtitle="Avg days to closure, by month"
          className="lg:col-span-2"
        >
          <ApprovalTimeTrendChart data={approvalTimeTrend} />
        </ChartCard>

        <ChartCard title="Status Mix" subtitle="All Tickets (filtered)">
          <StatusMixChart data={statusMix} />
        </ChartCard>
      </div>

      <div className="mt-4">
        <ChartCard title="Closure Volume by Month" subtitle="Count of Tickets closed">
          <ClosureVolumeChart data={closureVolume} />
        </ChartCard>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Views and rows shown are scoped to your assigned roles. Data respects Row-Level Security.
      </p>
    </>
  )
}

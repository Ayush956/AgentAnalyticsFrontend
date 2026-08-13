import FilterBar from './FilterBar'
import { ChartCard } from './MetricCard'
import { AgingBarChart, HorizontalBarChart } from './charts/BarCharts'
import SendbackTrendChart from './charts/SendbackTrendChart'
import type { OperationalResponse } from '../../types/analytics-api'
import type { FilterOptions, FilterState } from '../../types/analytics'

interface OperationalTabProps {
  data: OperationalResponse
  filterOptions: FilterOptions
  filters: FilterState
  onFilterChange: (key: keyof FilterState, value: string) => void
  onFilterReset: () => void
}

export default function OperationalTab({
  data,
  filterOptions,
  filters,
  onFilterChange,
  onFilterReset,
}: OperationalTabProps) {
  const openTotal = data.open_ticket_aging.reduce((sum, b) => sum + b.count, 0)

  const verticalData = data.approval_time_by_vertical.map((item) => ({
    label: item.vertical,
    value: item.avg_days,
  }))

  const departmentData = data.approval_time_by_department.map((item) => ({
    label: item.department,
    value: item.avg_days,
  }))

  return (
    <>
      <FilterBar
        options={filterOptions}
        values={filters}
        onChange={onFilterChange}
        onReset={onFilterReset}
      />

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Open Ticket Aging" subtitle={`${openTotal} open Tickets by age (days)`}>
          <AgingBarChart data={data.open_ticket_aging} />
        </ChartCard>

        <ChartCard title="Admin L1 Send-Back Trend" subtitle="Send-backs per month">
          <SendbackTrendChart data={data.admin_sendback_trend} />
        </ChartCard>

        <ChartCard title="Approval Time by Vertical" subtitle="Avg days, closed Tickets">
          <HorizontalBarChart data={verticalData} />
        </ChartCard>

        <ChartCard title="Approval Time by Division – Department" subtitle="Top 8 by avg days">
          <HorizontalBarChart data={departmentData} />
        </ChartCard>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Views and rows shown are scoped to your assigned roles. Data respects Row-Level Security.
      </p>
    </>
  )
}

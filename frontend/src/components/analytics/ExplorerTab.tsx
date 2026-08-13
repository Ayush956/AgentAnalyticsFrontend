import FilterBar from './FilterBar'
import { ExplorerBarChart } from './charts/BarCharts'
import { formatMonthLabel } from '../../lib/analytics-api'
import type { ExplorerResponse } from '../../types/analytics-api'
import type {
  ExplorerBreakdown,
  ExplorerPeriod,
  ExplorerView,
} from '../../types/analytics-api'
import type { FilterOptions, FilterState } from '../../types/analytics'

interface ExplorerConfig {
  breakdownBy: ExplorerBreakdown
  period: ExplorerPeriod
  view: ExplorerView
}

interface ExplorerTabProps {
  data: ExplorerResponse
  filterOptions: FilterOptions
  filters: FilterState
  explorerConfig: ExplorerConfig
  onFilterChange: (key: keyof FilterState, value: string) => void
  onFilterReset: () => void
  onExplorerChange: (opts: Partial<ExplorerConfig>) => void
}

const BREAKDOWN_OPTIONS: { value: ExplorerBreakdown; label: string }[] = [
  { value: 'vertical', label: 'Vertical' },
  { value: 'division', label: 'Division' },
  { value: 'department', label: 'Department' },
  { value: 'ticket_type', label: 'Ticket Type' },
]

export default function ExplorerTab({
  data,
  filterOptions,
  filters,
  explorerConfig,
  onFilterChange,
  onFilterReset,
  onExplorerChange,
}: ExplorerTabProps) {
  const { breakdownBy, period, view } = explorerConfig

  const chartData = data.data.map((item) => ({
    label: view === 'trend' ? formatMonthLabel(item.label) : item.label,
    value: item.value,
  }))

  const breakdownLabel =
    BREAKDOWN_OPTIONS.find((o) => o.value === breakdownBy)?.label ?? breakdownBy

  return (
    <>
      <FilterBar
        options={filterOptions}
        values={filters}
        onChange={onFilterChange}
        onReset={onFilterReset}
      />

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-gray-900">Configurable Measure</h2>
        <p className="text-sm text-gray-500">
          Switch Measure × Breakdown × Period and the chart recomputes.
        </p>

        <div className="mt-4 flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold tracking-wide text-gray-500">MEASURE</span>
            <select
              value="approval_time"
              disabled
              className="rounded border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm text-gray-700"
            >
              <option value="approval_time">Approval Time</option>
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold tracking-wide text-gray-500">
              BREAK DOWN BY
            </span>
            <select
              value={breakdownBy}
              onChange={(e) =>
                onExplorerChange({ breakdownBy: e.target.value as ExplorerBreakdown })
              }
              disabled={view === 'trend'}
              className="rounded border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 outline-none focus:border-maruti-blue disabled:bg-gray-50 disabled:text-gray-400"
            >
              {BREAKDOWN_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold tracking-wide text-gray-500">
              PERIOD (TREND)
            </span>
            <select
              value={period}
              onChange={(e) => onExplorerChange({ period: e.target.value as ExplorerPeriod })}
              disabled={view === 'breakdown'}
              className="rounded border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-800 outline-none focus:border-maruti-blue disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
            </select>
          </label>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-semibold tracking-wide text-gray-500">VIEW</span>
            <div className="flex overflow-hidden rounded border border-gray-200">
              <button
                type="button"
                onClick={() => onExplorerChange({ view: 'breakdown' })}
                className={`px-4 py-1.5 text-sm font-medium ${
                  view === 'breakdown'
                    ? 'bg-maruti-blue text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Breakdown
              </button>
              <button
                type="button"
                onClick={() => onExplorerChange({ view: 'trend' })}
                className={`px-4 py-1.5 text-sm font-medium ${
                  view === 'trend'
                    ? 'bg-maruti-blue text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                Trend
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <ExplorerBarChart data={chartData} />
          <p className="mt-2 text-center text-xs text-gray-500">
            Showing Approval Time (avg, days)
            {view === 'breakdown' ? ` by ${breakdownLabel}` : ` · ${period} trend`} ·{' '}
            {data.total_filtered} records in scope · unit: {data.unit}
          </p>
        </div>
      </div>

      <p className="mt-6 text-xs text-gray-400">
        Views and rows shown are scoped to your assigned roles. Data respects Row-Level Security.
      </p>
    </>
  )
}

import { RotateCcw } from 'lucide-react'
import type { FilterOptions, FilterState } from '../../types/analytics'

interface FilterBarProps {
  options: FilterOptions
  values: FilterState
  onChange: (key: keyof FilterState, value: string) => void
  onReset: () => void
}

const filterConfig: { key: keyof FilterState; label: string }[] = [
  { key: 'division', label: 'DIVISION' },
  { key: 'ticketType', label: 'TICKET TYPE' },
  { key: 'payment', label: 'PAYMENT' },
  { key: 'workflow', label: 'WORKFLOW' },
  { key: 'status', label: 'STATUS' },
  { key: 'decisionMatrix', label: 'DECISION MATRIX' },
  { key: 'year', label: 'YEAR' },
]

export default function FilterBar({ options, values, onChange, onReset }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-end gap-3 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {filterConfig.map(({ key, label }) => (
        <label key={key} className="flex min-w-[110px] flex-1 flex-col gap-1">
          <span className="text-[10px] font-semibold tracking-wide text-gray-500">{label}</span>
          <select
            value={values[key]}
            onChange={(e) => onChange(key, e.target.value)}
            className="rounded border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-800 outline-none focus:border-maruti-blue focus:ring-1 focus:ring-maruti-blue"
          >
            {options[key === 'ticketType' ? 'ticketType' : key === 'decisionMatrix' ? 'decisionMatrix' : key].map(
              (opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ),
            )}
          </select>
        </label>
      ))}

      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-1.5 rounded border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset
      </button>
    </div>
  )
}

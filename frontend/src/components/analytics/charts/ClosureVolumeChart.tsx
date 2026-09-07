import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatMonthYearLongLabel } from '../../../lib/analytics-api'
import type { VolumePoint } from '../../../types/analytics'

interface ClosureVolumeChartProps {
  data: VolumePoint[]
}

export default function ClosureVolumeChart({ data }: ClosureVolumeChartProps) {
  const maxCount = Math.max(...data.map((point) => point.count), 0)
  const yMax = Math.max(20, Math.ceil(maxCount / 10) * 10)
  const yTicks = Array.from({ length: yMax / 20 + 1 }, (_, i) => i * 20).filter((t) => t <= yMax)

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          domain={[0, yMax]}
          ticks={yTicks.length > 1 ? yTicks : [0, yMax]}
        />
        <Tooltip
          formatter={(value) => [value, 'Tickets closed']}
          labelFormatter={(_, payload) => {
            const point = payload?.[0]?.payload as VolumePoint | undefined
            return point ? formatMonthYearLongLabel(point.monthKey) : ''
          }}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
        />
        <Bar dataKey="count" fill="#003399" radius={[4, 4, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  )
}

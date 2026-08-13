import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { VolumePoint } from '../../../types/analytics'

interface ClosureVolumeChartProps {
  data: VolumePoint[]
}

export default function ClosureVolumeChart({ data }: ClosureVolumeChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          domain={[0, 80]}
          ticks={[0, 20, 40, 60, 80]}
        />
        <Tooltip
          formatter={(value) => [value, 'Tickets closed']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
        />
        <Bar dataKey="count" fill="#003399" radius={[4, 4, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  )
}

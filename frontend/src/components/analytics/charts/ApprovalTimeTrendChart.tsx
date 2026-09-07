import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatMonthYearLongLabel } from '../../../lib/analytics-api'
import type { TrendPoint } from '../../../types/analytics'

interface ApprovalTimeTrendChartProps {
  data: TrendPoint[]
}

export default function ApprovalTimeTrendChart({ data }: ApprovalTimeTrendChartProps) {
  const maxDays = Math.max(...data.map((point) => point.days), 0)
  const yMax = Math.max(8, Math.ceil(maxDays / 2) * 2)
  const yTicks = Array.from({ length: yMax / 2 + 1 }, (_, i) => i * 2)

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
          tickFormatter={(v) => `${v}d`}
          domain={[0, yMax]}
          ticks={yTicks}
        />
        <Tooltip
          formatter={(value) => [`${value} days`, 'Avg approval time']}
          labelFormatter={(_, payload) => {
            const point = payload?.[0]?.payload as TrendPoint | undefined
            return point ? formatMonthYearLongLabel(point.monthKey) : ''
          }}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
        />
        <Line
          type="monotone"
          dataKey="days"
          stroke="#003399"
          strokeWidth={2}
          dot={{ r: 4, fill: '#003399', strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

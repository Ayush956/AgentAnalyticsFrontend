import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TrendPoint } from '../../../types/analytics'

interface ApprovalTimeTrendChartProps {
  data: TrendPoint[]
}

export default function ApprovalTimeTrendChart({ data }: ApprovalTimeTrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
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
          tickFormatter={(v) => `${v}d`}
          domain={[0, 8]}
          ticks={[0, 2, 4, 6, 8]}
        />
        <Tooltip
          formatter={(value) => [`${value} days`, 'Avg approval time']}
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

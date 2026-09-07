import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatMonthYearLabel, formatMonthYearLongLabel } from '../../../lib/analytics-api'

interface SendbackTrendChartProps {
  data: { month: string; count: number }[]
}

export default function SendbackTrendChart({ data }: SendbackTrendChartProps) {
  const chartData = data.map((d) => ({
    monthKey: d.month,
    month: formatMonthYearLabel(d.month),
    count: d.count,
  }))

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey="month"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value) => [value, 'Send-backs']}
          labelFormatter={(_, payload) => {
            const point = payload?.[0]?.payload as { monthKey?: string } | undefined
            return point?.monthKey ? formatMonthYearLongLabel(point.monthKey) : ''
          }}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
        />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#f97316"
          strokeWidth={2}
          dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

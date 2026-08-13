import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface VerticalBarChartProps {
  data: { label: string; value: number }[]
  color?: string
  valueLabel?: string
}

export default function VerticalBarChart({
  data,
  color = '#003399',
  valueLabel = 'Value',
}: VerticalBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-20}
          textAnchor="end"
          height={60}
        />
        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value) => [value, valueLabel]}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
        />
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} maxBarSize={48} />
      </BarChart>
    </ResponsiveContainer>
  )
}

interface ExplorerBarChartProps {
  data: { label: string; value: number }[]
}

export function ExplorerBarChart({ data }: ExplorerBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-25}
          textAnchor="end"
          height={70}
        />
        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value) => [`${value} d`, 'Avg']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
        />
        <Bar dataKey="value" fill="#003399" radius={[4, 4, 0, 0]} maxBarSize={56} />
      </BarChart>
    </ResponsiveContainer>
  )
}

const AGING_COLORS: Record<string, string> = {
  '0-7': '#003399',
  '8-15': '#003399',
  '16-30': '#f97316',
  '31-60': '#f97316',
  '>60': '#ef4444',
}

interface AgingBarChartProps {
  data: { bucket: string; count: number }[]
}

export function AgingBarChart({ data }: AgingBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
        <XAxis
          dataKey="bucket"
          tick={{ fontSize: 12, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(value) => [value, 'Tickets']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
        />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((entry) => (
            <Cell key={entry.bucket} fill={AGING_COLORS[entry.bucket] ?? '#003399'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

interface HorizontalBarChartProps {
  data: { label: string; value: number }[]
  color?: string
}

export function HorizontalBarChart({ data, color = '#003399' }: HorizontalBarChartProps) {
  const sorted = [...data].sort((a, b) => a.value - b.value)

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, sorted.length * 36)}>
      <BarChart data={sorted} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
        <XAxis type="number" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
        <YAxis
          type="category"
          dataKey="label"
          tick={{ fontSize: 11, fill: '#6b7280' }}
          axisLine={false}
          tickLine={false}
          width={120}
        />
        <Tooltip
          formatter={(value) => [`${value} d`, 'Avg days']}
          contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
        />
        <Bar dataKey="value" fill={color} radius={[0, 4, 4, 0]} maxBarSize={20} />
      </BarChart>
    </ResponsiveContainer>
  )
}

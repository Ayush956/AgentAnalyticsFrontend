import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { StatusMixItem } from '../../../types/analytics'

interface StatusMixChartProps {
  data: StatusMixItem[]
}

export default function StatusMixChart({ data }: StatusMixChartProps) {
  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="status"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={2}
          >
            {data.map((entry) => (
              <Cell key={entry.status} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [value, name]}
            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 13 }}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((item) => (
          <div key={item.status} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            <span>
              {item.status} ({item.count})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

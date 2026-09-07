import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { ChartPoint } from '../../lib/chat-markdown'
import { parseMarkdownTables, tableToChartData } from '../../lib/chat-markdown'

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="mb-2 mt-3 text-base font-bold text-gray-900 first:mt-0">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="mb-2 mt-3 text-sm font-bold text-gray-900 first:mt-0">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="mb-1.5 mt-2 text-sm font-semibold text-gray-800 first:mt-0">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="mb-2 list-disc space-y-1 pl-4 last:mb-0">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="mb-2 list-decimal space-y-1 pl-4 last:mb-0">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li className="leading-relaxed">{children}</li>,
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="my-3 overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200 text-left text-xs">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-gray-100">{children}</thead>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => (
    <tbody className="divide-y divide-gray-100 bg-white">{children}</tbody>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => <tr>{children}</tr>,
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-3 py-2 font-semibold text-gray-700">{children}</th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-3 py-2 text-gray-800">{children}</td>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="rounded bg-gray-200/70 px-1 py-0.5 text-[11px]">{children}</code>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="my-2 border-l-2 border-blue-300 pl-3 text-gray-600">{children}</blockquote>
  ),
}

function ChatMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  )
}

function ChatMiniChart({ data, title }: { data: ChartPoint[]; title?: string }) {
  const height = Math.max(140, data.length * 28 + 40)

  return (
    <div className="my-3 rounded-lg border border-blue-100 bg-white p-3">
      {title && <p className="mb-2 text-xs font-semibold text-gray-600">{title}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 12, left: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
          <XAxis type="number" tick={{ fontSize: 10 }} />
          <YAxis
            type="category"
            dataKey="label"
            width={72}
            tick={{ fontSize: 10 }}
            tickFormatter={(value: string) => (value.length > 12 ? `${value.slice(0, 12)}…` : value)}
          />
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
          <Bar dataKey="value" fill="#1e4a8c" radius={[0, 4, 4, 0]} maxBarSize={18} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

interface AssistantMessageContentProps {
  content: string
  showCharts?: boolean
}

export function AssistantMessageContent({
  content,
  showCharts = true,
}: AssistantMessageContentProps) {
  const tables = showCharts ? parseMarkdownTables(content) : []
  const chartDataList = tables
    .map((table) => tableToChartData(table))
    .filter((data): data is NonNullable<typeof data> => data !== null)

  return (
    <div className="chat-message-content">
      <ChatMarkdown content={content} />
      {showCharts &&
        chartDataList.map((data, index) => (
          <ChatMiniChart key={index} data={data} title="Visual summary" />
        ))}
    </div>
  )
}

export function UserMessageContent({ content }: { content: string }) {
  return <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
}

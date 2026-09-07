export interface ParsedTable {
  headers: string[]
  rows: string[][]
}

function parseRow(line: string): string[] {
  return line
    .split('|')
    .slice(1, -1)
    .map((cell) => cell.trim().replace(/\*\*/g, ''))
}

export function parseMarkdownTables(content: string): ParsedTable[] {
  const tables: ParsedTable[] = []
  const lines = content.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()
    if (!line.startsWith('|') || !line.endsWith('|')) {
      i++
      continue
    }

    const headers = parseRow(line)
    i++

    if (i >= lines.length || !/^\|[\s\-:|]+\|$/.test(lines[i].trim())) {
      continue
    }

    i++
    const rows: string[][] = []

    while (i < lines.length) {
      const rowLine = lines[i].trim()
      if (!rowLine.startsWith('|') || !rowLine.endsWith('|')) break
      if (/^\|[\s\-:|]+\|$/.test(rowLine)) {
        i++
        continue
      }
      rows.push(parseRow(rowLine))
      i++
    }

    if (headers.length > 0 && rows.length > 0) {
      tables.push({ headers, rows })
    }
  }

  return tables
}

function parseNumber(value: string): number {
  const cleaned = value.replace(/[%$,]/g, '').trim()
  const num = Number.parseFloat(cleaned)
  return Number.isFinite(num) ? num : Number.NaN
}

export interface ChartPoint {
  label: string
  value: number
}

export function tableToChartData(table: ParsedTable): ChartPoint[] | null {
  if (table.rows.length < 2) return null

  let valueCol = -1
  for (let col = 1; col < table.headers.length; col++) {
    const numericCount = table.rows.filter((row) => Number.isFinite(parseNumber(row[col] ?? ''))).length
    if (numericCount >= Math.ceil(table.rows.length * 0.6)) {
      valueCol = col
      break
    }
  }

  if (valueCol === -1) return null

  const data = table.rows
    .map((row) => ({
      label: row[0] ?? '',
      value: parseNumber(row[valueCol] ?? ''),
    }))
    .filter((point) => point.label && Number.isFinite(point.value))

  return data.length >= 2 ? data : null
}

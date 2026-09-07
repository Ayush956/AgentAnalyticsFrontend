import { useCallback, useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import AnalyticsTabs from '../components/analytics/AnalyticsTabs'
import ExecutiveTab from '../components/analytics/ExecutiveTab'
import ExplorerTab from '../components/analytics/ExplorerTab'
import OperationalTab from '../components/analytics/OperationalTab'
import AiInsightsTab from '../components/analytics/AiInsightsTab'
import CopilotPanel from '../components/copilot/CopilotPanel'
import DashboardLayout from '../components/layout/DashboardLayout'
import { ChatProvider } from '../context/ChatContext'
import {
  fetchAnalyticsFilters,
  fetchExecutive,
  fetchExplorer,
  fetchOperational,
} from '../lib/analytics-api'
import { buildCopilotAnalyticsContext } from '../lib/copilot-context'
import type {
  ExecutiveResponse,
  ExplorerBreakdown,
  ExplorerPeriod,
  ExplorerResponse,
  ExplorerView,
  OperationalResponse,
} from '../types/analytics-api'
import type { AnalyticsTab, FilterOptions, FilterState } from '../types/analytics'
import { defaultFilters } from '../types/analytics'

const TAB_SUBTITLES: Record<AnalyticsTab, string> = {
  executive: 'Executive',
  'approval-time': 'Approval Time Explorer',
  operational: 'Operational',
  'ai-insights': 'AI Insights',
}

interface ExplorerConfig {
  breakdownBy: ExplorerBreakdown
  period: ExplorerPeriod
  view: ExplorerView
}

function DashboardContent() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('executive')
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [filters, setFilters] = useState<FilterState | null>(null)
  const [explorerConfig, setExplorerConfig] = useState<ExplorerConfig>({
    breakdownBy: 'vertical',
    period: 'month',
    view: 'breakdown',
  })

  const [executiveData, setExecutiveData] = useState<ExecutiveResponse | null>(null)
  const [operationalData, setOperationalData] = useState<OperationalResponse | null>(null)
  const [explorerData, setExplorerData] = useState<ExplorerResponse | null>(null)

  const [loading, setLoading] = useState(true)
  const [tabLoading, setTabLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const tabLabel = TAB_SUBTITLES[activeTab]

  useEffect(() => {
    fetchAnalyticsFilters()
      .then((options) => {
        setFilterOptions(options)
        setFilters(defaultFilters(options))
      })
      .catch(() => setError('Failed to load filter options'))
      .finally(() => setLoading(false))
  }, [])

  const loadTabData = useCallback(async () => {
    if (!filters) return

    setTabLoading(true)
    setError(null)

    try {
      if (activeTab === 'executive') {
        setExecutiveData(await fetchExecutive(filters))
      } else if (activeTab === 'operational') {
        setOperationalData(await fetchOperational(filters))
      } else if (activeTab === 'approval-time') {
        setExplorerData(
          await fetchExplorer(filters, {
            measure: 'approval_time',
            breakdownBy: explorerConfig.breakdownBy,
            period: explorerConfig.period,
            view: explorerConfig.view,
          }),
        )
      }
    } catch {
      setError('Failed to load analytics data')
    } finally {
      setTabLoading(false)
    }
  }, [activeTab, filters, explorerConfig])

  useEffect(() => {
    if (!filters) return
    loadTabData()
  }, [filters, loadTabData])

  const getAnalyticsContext = useCallback(async () => {
    if (!filters) {
      throw new Error('Filters are not loaded yet. Please wait and try again.')
    }
    return buildCopilotAnalyticsContext(filters, activeTab, explorerConfig)
  }, [filters, activeTab, explorerConfig])

  function handleFilterChange(key: keyof FilterState, value: string) {
    setFilters((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  function handleFilterReset() {
    if (filterOptions) setFilters(defaultFilters(filterOptions))
  }

  function handleExplorerChange(opts: Partial<ExplorerConfig>) {
    setExplorerConfig((prev) => ({ ...prev, ...opts }))
  }

  const showContent = !loading && filters && filterOptions

  return (
    <ChatProvider getAnalyticsContext={filters ? getAnalyticsContext : undefined}>
      <DashboardLayout
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={() => setSidebarCollapsed((c) => !c)}
      >
        <div className="p-6">
          <div className="mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-500">
              {tabLabel} · Access scoped to your role. Data respects Row-Level Security.
            </p>
          </div>

          <div className="mt-4 mb-6">
            <AnalyticsTabs active={activeTab} onChange={setActiveTab} />
          </div>

          {loading && (
            <div className="flex items-center justify-center py-32 text-gray-400">Loading…</div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {tabLoading && showContent && (
            <div className="mb-4 text-sm text-gray-400">Refreshing data…</div>
          )}

          {showContent && activeTab === 'executive' && executiveData && (
            <ExecutiveTab
              data={executiveData}
              filterOptions={filterOptions}
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterReset={handleFilterReset}
            />
          )}

          {showContent && activeTab === 'approval-time' && explorerData && (
            <ExplorerTab
              data={explorerData}
              filterOptions={filterOptions}
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterReset={handleFilterReset}
              explorerConfig={explorerConfig}
              onExplorerChange={handleExplorerChange}
            />
          )}

          {showContent && activeTab === 'operational' && operationalData && (
            <OperationalTab
              data={operationalData}
              filterOptions={filterOptions}
              filters={filters}
              onFilterChange={handleFilterChange}
              onFilterReset={handleFilterReset}
            />
          )}

          {showContent && activeTab === 'ai-insights' && <AiInsightsTab />}
        </div>

        {!copilotOpen && activeTab !== 'ai-insights' && (
          <button
            type="button"
            onClick={() => setCopilotOpen(true)}
            className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg transition hover:shadow-xl"
            aria-label="Open AI copilot"
          >
            <Sparkles className="h-5 w-5" />
          </button>
        )}

        <CopilotPanel open={copilotOpen} onClose={() => setCopilotOpen(false)} />
      </DashboardLayout>
    </ChatProvider>
  )
}

export default function DashboardPage() {
  return <DashboardContent />
}

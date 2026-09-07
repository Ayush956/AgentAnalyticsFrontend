import {
  fetchExecutive,
  fetchExplorer,
  fetchOperational,
} from './analytics-api'
import type {
  ExecutiveResponse,
  ExplorerBreakdown,
  ExplorerPeriod,
  ExplorerResponse,
  ExplorerView,
  OperationalResponse,
} from '../types/analytics-api'
import type { AnalyticsTab, FilterState } from '../types/analytics'

export interface ExplorerConfig {
  breakdownBy: ExplorerBreakdown
  period: ExplorerPeriod
  view: ExplorerView
}

export interface CopilotAnalyticsContext {
  active_tab: AnalyticsTab
  filters: FilterState
  explorer_config: ExplorerConfig
  executive: ExecutiveResponse
  operational: OperationalResponse
  explorer: ExplorerResponse
  fetched_at: string
}

export async function buildCopilotAnalyticsContext(
  filters: FilterState,
  activeTab: AnalyticsTab,
  explorerConfig: ExplorerConfig,
): Promise<CopilotAnalyticsContext> {
  const explorerOptions = {
    measure: 'approval_time' as const,
    breakdownBy: explorerConfig.breakdownBy,
    period: explorerConfig.period,
    view: explorerConfig.view,
  }

  const [executive, operational, explorer] = await Promise.all([
    fetchExecutive(filters),
    fetchOperational(filters),
    fetchExplorer(filters, explorerOptions),
  ])

  return {
    active_tab: activeTab,
    filters,
    explorer_config: explorerConfig,
    executive,
    operational,
    explorer,
    fetched_at: new Date().toISOString(),
  }
}

export const COPILOT_SUGGESTIONS = [
  'What is the average approval time for current filters?',
  'Which vertical has the slowest approvals?',
  'Summarize the ticket status breakdown',
  'What does open ticket aging look like?',
]

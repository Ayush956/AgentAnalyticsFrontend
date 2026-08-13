import { Sparkles } from 'lucide-react'
import type { AnalyticsTab } from '../../types/analytics'

interface AnalyticsTabsProps {
  active: AnalyticsTab
  onChange: (tab: AnalyticsTab) => void
}

const tabs: { id: AnalyticsTab; label: string; icon?: 'sparkles' }[] = [
  { id: 'executive', label: 'Executive' },
  { id: 'approval-time', label: 'Approval Time Explorer' },
  { id: 'operational', label: 'Operational' },
  { id: 'ai-insights', label: 'AI Insights', icon: 'sparkles' },
]

export default function AnalyticsTabs({ active, onChange }: AnalyticsTabsProps) {
  return (
    <div className="flex gap-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex items-center gap-1.5 border-b-2 pb-3 text-sm font-medium transition-colors ${
            active === tab.id
              ? 'border-maruti-blue text-maruti-blue'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          {tab.icon === 'sparkles' && <Sparkles className="h-3.5 w-3.5" />}
          {tab.label}
        </button>
      ))}
    </div>
  )
}

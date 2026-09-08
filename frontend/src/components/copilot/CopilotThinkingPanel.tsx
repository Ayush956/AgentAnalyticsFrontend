import { Check, ChevronDown, ChevronUp, Loader2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import type { ThinkingPhase } from '../../context/ChatContext'

interface ThinkingStep {
  id: ThinkingPhase
  label: string
  detail: string
}

const THINKING_STEPS: ThinkingStep[] = [
  {
    id: 'fetching_data',
    label: 'Fetching live dashboard data…',
    detail:
      'Loading Executive, Operational, and Explorer analytics for your current filters.',
  },
  {
    id: 'routing_ai',
    label: 'Routing to Analytics AI…',
    detail:
      'Sending your question with aggregated ticket metrics to the grounded AI model.',
  },
  {
    id: 'generating',
    label: 'Generating grounded answer…',
    detail:
      'Composing a response using only the dashboard data — numbers, trends, and breakdowns.',
  },
]

const PHASE_ORDER: ThinkingPhase[] = ['fetching_data', 'routing_ai', 'generating']

function phaseIndex(phase: ThinkingPhase): number {
  return PHASE_ORDER.indexOf(phase)
}

interface CopilotThinkingPanelProps {
  elapsedSeconds: number
  phase?: ThinkingPhase
  completed?: boolean
  defaultExpanded?: boolean
}

export default function CopilotThinkingPanel({
  elapsedSeconds,
  phase = 'generating',
  completed = false,
  defaultExpanded,
}: CopilotThinkingPanelProps) {
  const [expanded, setExpanded] = useState(defaultExpanded ?? !completed)

  if (!completed && phase === 'idle') return null

  const currentIndex = completed ? PHASE_ORDER.length : phaseIndex(phase)
  const activeStep = THINKING_STEPS[Math.min(currentIndex, THINKING_STEPS.length - 1)]

  return (
    <div className="w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((open) => !open)}
        className={`flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-gray-50/80 ${
          expanded ? 'border-b border-gray-100' : ''
        }`}
      >
        <Sparkles className="h-4 w-4 shrink-0 text-maruti-blue" />
        <span className="text-sm font-medium text-gray-900">
          {completed || phase === 'generating'
            ? `Thought for ${elapsedSeconds}s`
            : `Thinking… ${elapsedSeconds}s`}
        </span>
        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-maruti-blue">
          Analytics AI
        </span>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
          3 steps
        </span>
        <span className="ml-auto text-gray-400">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {expanded && (
        <div className="space-y-3 px-3 py-3">
          {THINKING_STEPS.map((step) => {
            const stepIndex = phaseIndex(step.id)
            const isComplete = completed || currentIndex > stepIndex
            const isActive = !completed && currentIndex === stepIndex
            const isPending = !completed && currentIndex < stepIndex

            return (
              <div key={step.id} className="flex gap-2.5">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
                  {isComplete ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <Check className="h-3 w-3 text-green-600" strokeWidth={3} />
                    </span>
                  ) : isActive ? (
                    <Loader2 className="h-4 w-4 animate-spin text-maruti-blue" />
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-gray-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium ${
                      isPending ? 'text-gray-400' : isActive ? 'text-gray-900' : 'text-gray-700'
                    }`}
                  >
                    {step.label}
                  </p>
                  {(isActive || isComplete) && (
                    <p className="mt-1 text-xs leading-relaxed text-gray-500">{step.detail}</p>
                  )}
                </div>
              </div>
            )
          })}

          <div className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                <Check className="h-3 w-3 text-green-600" strokeWidth={3} />
              </span>
              <span className="text-xs font-medium text-gray-700">
                {completed ? 'Ready' : 'Working…'}
              </span>
            </div>
            <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-[10px] font-medium text-green-700">
              {completed
                ? 'Answer generated'
                : activeStep.label.replace('…', '')}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

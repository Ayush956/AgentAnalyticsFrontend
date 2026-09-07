import { ArrowUp, BarChart3, Search, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useChat } from '../../context/ChatContext'
import { COPILOT_SUGGESTIONS } from '../../lib/copilot-context'
import { AssistantMessageContent, UserMessageContent } from './ChatMessageContent'

const SUGGESTION_ICONS = [TrendingUp, Search, Zap, BarChart3]

interface CopilotChatProps {
  variant: 'tab' | 'drawer'
  suggestions?: string[]
  onClose?: () => void
}

export default function CopilotChat({
  variant,
  suggestions = COPILOT_SUGGESTIONS,
  onClose,
}: CopilotChatProps) {
  const {
    connected,
    messages,
    streamingText,
    isStreaming,
    isThinking,
    error,
    sendMessage,
    resetChat,
  } = useChat()

  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const showHero =
    messages.length === 0 && !isStreaming && !streamingText && !isThinking

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingText, isThinking, scrollToBottom])

  async function submitPrompt(prompt: string) {
    const trimmed = prompt.trim()
    if (!trimmed || isStreaming) return

    setInput('')
    await sendMessage(trimmed)
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    submitPrompt(input)
  }

  const containerClass =
    variant === 'tab'
      ? 'relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-b from-[#eef4fc] to-[#f8fbff] shadow-sm'
      : 'flex h-full flex-col bg-white'

  const contentClass =
    variant === 'tab'
      ? 'flex min-h-[600px] flex-col overflow-hidden px-6 pb-8 pt-10'
      : 'flex flex-1 flex-col overflow-hidden px-4 pb-4 pt-2'

  return (
    <div className={containerClass}>
      <div className={contentClass}>
        {showHero ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center overflow-y-auto pb-4 text-center">
            <div className="relative mb-5 flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-2xl bg-blue-400/20 blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6eb5ff] via-[#4a8fe8] to-[#2d6fd4] shadow-lg shadow-blue-300/40">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              {variant === 'drawer' ? 'How can I help you analyze?' : 'Meet Agent Analytics Intelligence'}
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
              Ask in plain English about approval times, status breakdowns, aging, and trends.
              Answers are grounded in your current dashboard data and filters.
            </p>

            <div className="mt-6 w-full max-w-md">
              <p className="mb-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                Suggested
              </p>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => {
                  const Icon = SUGGESTION_ICONS[index % SUGGESTION_ICONS.length]
                  return (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => submitPrompt(suggestion)}
                      disabled={isStreaming || !connected}
                      className="flex w-full items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 disabled:opacity-50"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-maruti-blue">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="line-clamp-2">{suggestion}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto py-2 pr-1">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'max-w-[90%] bg-maruti-blue text-white'
                      : 'w-full max-w-full border border-gray-200 bg-gray-50 text-gray-800'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <UserMessageContent content={msg.content} />
                  ) : (
                    <AssistantMessageContent content={msg.content} />
                  )}
                </div>
              </div>
            ))}

            {(isStreaming || isThinking || streamingText) && (
              <div className="flex justify-start">
                <div className="w-full max-w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm leading-relaxed text-gray-800">
                  {streamingText ? (
                    <AssistantMessageContent content={streamingText} showCharts={false} />
                  ) : isThinking ? (
                    <span className="flex items-center gap-2 text-gray-500">
                      <span className="inline-flex gap-0.5">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.3s]" />
                      </span>
                      Analyzing data…
                    </span>
                  ) : (
                    <span className="inline-flex gap-1 text-gray-400">
                      <span className="animate-bounce">·</span>
                      <span className="animate-bounce [animation-delay:0.1s]">·</span>
                      <span className="animate-bounce [animation-delay:0.2s]">·</span>
                    </span>
                  )}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {error && (
          <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-sm text-red-600">
            {error}
          </p>
        )}

        {!connected && !error && (
          <p className="mb-3 text-center text-xs text-gray-400">Connecting to AI assistant…</p>
        )}

        <form onSubmit={handleSubmit} className="mt-4 shrink-0 border-t border-gray-200/60 pt-4">
          <div className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about your analytics data"
              disabled={isStreaming}
              className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />

            <button
              type="submit"
              disabled={!input.trim() || isStreaming || !connected}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-maruti-blue text-white transition hover:bg-maruti-blue-dark disabled:opacity-40"
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-gray-400">
            Agent Analytics Intelligence answers from your dashboard data — it may make mistakes.
          </p>
        </form>
      </div>

      {variant === 'tab' && onClose && (
        <div className="absolute right-4 top-4">
          <button
            type="button"
            onClick={() => {
              resetChat()
              onClose()
            }}
            className="rounded-full p-2 text-gray-400 hover:bg-white/60 hover:text-gray-600"
            aria-label="Reset conversation"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}

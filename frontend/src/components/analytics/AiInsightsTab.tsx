import { ArrowUp, Mic, Plus, RotateCcw, Sparkles, X } from 'lucide-react'
import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useChat } from '../../context/ChatContext'

const SUGGESTIONS = [
  'Create a ticket',
  'Approve pending tickets',
  'Update my sent back tickets',
  'Help me find a ticket',
]

export default function AiInsightsTab() {
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

  function handleReset() {
    resetChat()
    setInput('')
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-b from-[#eef4fc] to-[#f8fbff] shadow-sm">
      <div className="absolute right-4 top-4 flex gap-2">
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full p-2 text-gray-400 hover:bg-white/60 hover:text-gray-600"
          aria-label="Reset conversation"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-full p-2 text-gray-400 hover:bg-white/60 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex min-h-[520px] flex-col px-6 pb-6 pt-10">
        {showHero ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <div className="relative mb-6 flex h-28 w-28 items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-2xl" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#6eb5ff] via-[#4a8fe8] to-[#2d6fd4] shadow-lg shadow-blue-300/40">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-maruti-blue">Meet our all new, Ticket AI</h2>
            <p className="mt-3 max-w-lg text-sm leading-relaxed text-gray-500">
              The next-generation AI assistant built for the Maruti ecosystem, engineered to stay
              accurate, reliable, and secure...
            </p>
            <a
              href="#"
              className="mt-4 text-sm font-medium text-maruti-blue hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              Learn More ↗
            </a>
          </div>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto py-4 pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-maruti-blue text-white'
                      : 'border border-gray-200 bg-white text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {(isStreaming || isThinking || streamingText) && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm leading-relaxed text-gray-800">
                  {streamingText ? (
                    streamingText
                  ) : isThinking ? (
                    <span className="flex items-center gap-2 text-gray-500">
                      <span className="inline-flex gap-0.5">
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.15s]" />
                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-gray-400 [animation-delay:0.3s]" />
                      </span>
                      Thinking…
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

        {showHero && (
          <div className="mb-4 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => submitPrompt(suggestion)}
                disabled={isStreaming || !connected}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition hover:border-maruti-blue/30 hover:bg-blue-50 disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-auto">
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 shadow-sm">
            <button
              type="button"
              className="rounded-full p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              aria-label="Attach"
            >
              <Plus className="h-4 w-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything"
              disabled={isStreaming}
              className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />

            <button
              type="button"
              className="rounded-full p-2 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              aria-label="Voice input"
            >
              <Mic className="h-4 w-4" />
            </button>

            <button
              type="submit"
              disabled={!input.trim() || isStreaming || !connected}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-maruti-blue text-white transition hover:bg-maruti-blue-dark disabled:opacity-40"
              aria-label="Send message"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

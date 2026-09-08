import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { getAccessToken } from '../lib/auth'
import {
  createSessionId,
  getChatWebSocketUrl,
  parseWsMessage,
  sendChatPrompt,
  type ChatMessage,
} from '../lib/chat-api'
import type { CopilotAnalyticsContext } from '../lib/copilot-context'

type GetAnalyticsContext = () => Promise<CopilotAnalyticsContext>

export type ThinkingPhase = 'idle' | 'fetching_data' | 'routing_ai' | 'generating'

interface ChatContextValue {
  sessionId: string
  connected: boolean
  messages: ChatMessage[]
  streamingText: string
  isStreaming: boolean
  isThinking: boolean
  thinkingPhase: ThinkingPhase
  thinkingElapsedSeconds: number
  error: string | null
  sendMessage: (prompt: string) => Promise<void>
  resetChat: () => void
}

const ChatContext = createContext<ChatContextValue | null>(null)

interface ChatProviderProps {
  children: ReactNode
  getAnalyticsContext?: GetAnalyticsContext
}

export function ChatProvider({ children, getAnalyticsContext }: ChatProviderProps) {
  const [sessionId] = useState(createSessionId)
  const [connected, setConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [streamingText, setStreamingText] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isThinking, setIsThinking] = useState(false)
  const [thinkingPhase, setThinkingPhase] = useState<ThinkingPhase>('idle')
  const [thinkingElapsedSeconds, setThinkingElapsedSeconds] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<number | null>(null)
  const streamingTextRef = useRef('')
  const getAnalyticsContextRef = useRef(getAnalyticsContext)
  const thinkingTimerRef = useRef<number | null>(null)
  const thinkingStartedAtRef = useRef<number | null>(null)
  const thinkingElapsedSecondsRef = useRef(0)

  useEffect(() => {
    getAnalyticsContextRef.current = getAnalyticsContext
  }, [getAnalyticsContext])

  useEffect(() => {
    if (thinkingPhase === 'idle') {
      if (thinkingTimerRef.current) {
        window.clearInterval(thinkingTimerRef.current)
        thinkingTimerRef.current = null
      }
      thinkingStartedAtRef.current = null
      thinkingElapsedSecondsRef.current = 0
      setThinkingElapsedSeconds(0)
      return
    }

    if (!thinkingStartedAtRef.current) {
      thinkingStartedAtRef.current = Date.now()
    }

    thinkingTimerRef.current = window.setInterval(() => {
      if (thinkingStartedAtRef.current) {
        const elapsed = Math.max(
          1,
          Math.floor((Date.now() - thinkingStartedAtRef.current) / 1000),
        )
        thinkingElapsedSecondsRef.current = elapsed
        setThinkingElapsedSeconds(elapsed)
      }
    }, 500)

    return () => {
      if (thinkingTimerRef.current) {
        window.clearInterval(thinkingTimerRef.current)
        thinkingTimerRef.current = null
      }
    }
  }, [thinkingPhase])

  const finalizeAssistantMessage = useCallback(() => {
    const text = streamingTextRef.current.trim()
    const elapsedSeconds = thinkingElapsedSecondsRef.current
    streamingTextRef.current = ''
    setStreamingText('')

    if (text) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: text,
          thinking: { elapsedSeconds: elapsedSeconds || 1 },
        },
      ])
    }
  }, [])

  useEffect(() => {
    const token = getAccessToken()
    if (!token) return

    const authToken = token

    function connect() {
      const ws = new WebSocket(getChatWebSocketUrl(sessionId, authToken))
      wsRef.current = ws

      ws.onopen = () => {
        setError(null)
      }

      ws.onclose = () => {
        setConnected(false)
        reconnectTimer.current = window.setTimeout(connect, 2000)
      }

      ws.onerror = () => {
        setError('Connection to AI assistant failed')
      }

      ws.onmessage = (event) => {
        const data = parseWsMessage(event.data)
        if (!data) return

        if (data.type === 'status') {
          if (data.status === 'connected') {
            setConnected(true)
            setError(null)
          }
          if (data.status === 'thinking') {
            setIsThinking(true)
            setIsStreaming(true)
            setThinkingPhase((prev) => (prev === 'idle' ? 'routing_ai' : prev))
          }
          if (data.status === 'completed') {
            setIsThinking(false)
            setIsStreaming(false)
            setThinkingPhase('idle')
            finalizeAssistantMessage()
          }
          if (data.status === 'error') {
            setError(data.message ?? 'Something went wrong')
            setIsStreaming(false)
            setIsThinking(false)
            setThinkingPhase('idle')
            streamingTextRef.current = ''
            setStreamingText('')
          }
        }

        if (data.type === 'chunk') {
          setIsThinking(false)
          setThinkingPhase('generating')
          streamingTextRef.current += data.content
          setStreamingText(streamingTextRef.current)
        }
      }
    }

    connect()

    return () => {
      if (reconnectTimer.current) window.clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [sessionId, finalizeAssistantMessage])

  const sendMessage = useCallback(
    async (prompt: string) => {
      const trimmed = prompt.trim()
      if (!trimmed || isStreaming) return

      setError(null)
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: 'user', content: trimmed }])
      setIsStreaming(true)
      setIsThinking(true)
      setThinkingPhase('fetching_data')
      streamingTextRef.current = ''
      setStreamingText('')

      try {
        if (!connected) {
          throw new Error('Not connected to AI assistant. Please wait a moment and try again.')
        }

        let analyticsContext: CopilotAnalyticsContext | undefined
        if (getAnalyticsContextRef.current) {
          analyticsContext = await getAnalyticsContextRef.current()
        }

        setThinkingPhase('routing_ai')
        await sendChatPrompt(sessionId, trimmed, analyticsContext)
      } catch (err: unknown) {
        setIsStreaming(false)
        setIsThinking(false)
        setThinkingPhase('idle')
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosErr = err as { response?: { data?: { detail?: string } } }
          setError(axiosErr.response?.data?.detail ?? 'Failed to send message')
        } else if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Failed to send message')
        }
      }
    },
    [connected, isStreaming, sessionId],
  )

  const resetChat = useCallback(() => {
    setMessages([])
    streamingTextRef.current = ''
    setStreamingText('')
    setIsStreaming(false)
    setIsThinking(false)
    setThinkingPhase('idle')
    setError(null)
  }, [])

  return (
    <ChatContext.Provider
      value={{
        sessionId,
        connected,
        messages,
        streamingText,
        isStreaming,
        isThinking,
        thinkingPhase,
        thinkingElapsedSeconds,
        error,
        sendMessage,
        resetChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const ctx = useContext(ChatContext)
  if (!ctx) {
    throw new Error('useChat must be used within ChatProvider')
  }
  return ctx
}

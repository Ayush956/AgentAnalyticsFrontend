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

interface ChatContextValue {
  sessionId: string
  connected: boolean
  messages: ChatMessage[]
  streamingText: string
  isStreaming: boolean
  isThinking: boolean
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
  const [error, setError] = useState<string | null>(null)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimer = useRef<number | null>(null)
  const streamingTextRef = useRef('')
  const getAnalyticsContextRef = useRef(getAnalyticsContext)

  useEffect(() => {
    getAnalyticsContextRef.current = getAnalyticsContext
  }, [getAnalyticsContext])

  const finalizeAssistantMessage = useCallback(() => {
    const text = streamingTextRef.current.trim()
    streamingTextRef.current = ''
    setStreamingText('')

    if (text) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'assistant', content: text },
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
          }
          if (data.status === 'completed') {
            setIsThinking(false)
            setIsStreaming(false)
            finalizeAssistantMessage()
          }
          if (data.status === 'error') {
            setError(data.message ?? 'Something went wrong')
            setIsStreaming(false)
            setIsThinking(false)
            streamingTextRef.current = ''
            setStreamingText('')
          }
        }

        if (data.type === 'chunk') {
          setIsThinking(false)
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

        await sendChatPrompt(sessionId, trimmed, analyticsContext)
      } catch (err: unknown) {
        setIsStreaming(false)
        setIsThinking(false)
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

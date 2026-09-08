import api from './api'
import type { CopilotAnalyticsContext } from './copilot-context'

export interface MessageThinking {
  elapsedSeconds: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  thinking?: MessageThinking
}

export function createSessionId(): string {
  return crypto.randomUUID()
}

export function getChatWebSocketUrl(sessionId: string, token: string): string {
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const wsBase = base.replace(/^https?/, (match: string) => (match === 'https' ? 'wss' : 'ws'))
  return `${wsBase}/ws/chat/${sessionId}?token=${encodeURIComponent(token)}`
}

export async function sendChatPrompt(
  sessionId: string,
  prompt: string,
  analyticsContext?: CopilotAnalyticsContext,
): Promise<void> {
  await api.post('/api/chat', {
    session_id: sessionId,
    prompt,
    analytics_context: analyticsContext ?? null,
  })
}

export type WsServerMessage =
  | { type: 'chunk'; content: string }
  | {
      type: 'status'
      status: 'connected' | 'thinking' | 'completed' | 'error'
      session_id?: string
      message?: string
    }

export function parseWsMessage(raw: string): WsServerMessage | null {
  try {
    return JSON.parse(raw) as WsServerMessage
  } catch {
    return null
  }
}

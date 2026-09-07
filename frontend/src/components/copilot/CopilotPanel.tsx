import { RotateCcw, Sparkles, X } from 'lucide-react'
import { useEffect } from 'react'
import { useChat } from '../../context/ChatContext'
import CopilotChat from './CopilotChat'

interface CopilotPanelProps {
  open: boolean
  onClose: () => void
}

export default function CopilotPanel({ open, onClose }: CopilotPanelProps) {
  const { resetChat } = useChat()

  useEffect(() => {
    if (!open) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <button
        type="button"
        aria-label="Close copilot"
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
        onClick={onClose}
      />

      <aside
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[420px] flex-col border-l border-gray-200 bg-white shadow-2xl"
        role="dialog"
        aria-label="Agent Analytics Intelligence"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-gray-900">Agent Analytics Intelligence</h2>
              <p className="text-xs text-gray-400">Data-grounded copilot</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={resetChat}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="New conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 flex-col">
          <CopilotChat variant="drawer" onClose={onClose} />
        </div>
      </aside>
    </>
  )
}

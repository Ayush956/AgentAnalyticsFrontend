import {
  AlertCircle,
  Ban,
  BarChart3,
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCheck,
  Layers,
  LogOut,
  Menu,
  RotateCcw,
  Shield,
  Sparkles,
  Timer,
  Undo2,
  User,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clearAccessToken, getStoredUser } from '../../lib/auth'
import {
  DOT_COLORS,
  INITIAL_NOTIFICATIONS,
  type NotificationItem,
} from '../../data/notifications'

const iconMap: Record<string, LucideIcon> = {
  'check-circle': CheckCircle2,
  clock: Clock,
  'alert-circle': AlertCircle,
  ban: Ban,
  undo: Undo2,
  timer: Timer,
  shield: Shield,
  users: Users,
  'file-check': FileCheck,
  layers: Layers,
}

export function getMetricIcon(name: string): LucideIcon {
  return iconMap[name] ?? BarChart3
}

interface DashboardLayoutProps {
  children: ReactNode
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export default function DashboardLayout({
  children,
  sidebarCollapsed,
  onToggleSidebar,
}: DashboardLayoutProps) {
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS)
  const profileRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const user = getStoredUser()
  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    if (!profileOpen && !notificationsOpen) return

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      if (profileOpen && profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false)
      }
      if (
        notificationsOpen &&
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [profileOpen, notificationsOpen])

  function handleLogout() {
    clearAccessToken()
    setProfileOpen(false)
    navigate('/login', { replace: true })
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  return (
    <div className="flex min-h-screen bg-[#f4f6f9]">
      <aside
        className={`relative flex shrink-0 flex-col bg-maruti-blue text-white transition-all duration-200 ${
          sidebarCollapsed ? 'w-16' : 'w-52'
        }`}
      >
        <div className="flex h-14 items-center border-b border-white/10 px-4">
          {!sidebarCollapsed && (
            <div className="leading-tight">
              <div className="text-[11px] font-semibold tracking-widest text-white/80">MARUTI</div>
              <div className="text-sm font-bold tracking-wide">SUZUKI</div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-2">
          <a
            href="#"
            className={`flex items-center gap-3 rounded-md bg-white/15 px-3 py-2.5 text-sm font-medium ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <BarChart3 className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Analytics</span>}
          </a>
        </nav>

        <button
          type="button"
          onClick={onToggleSidebar}
          className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white text-maruti-blue shadow-sm hover:bg-gray-50"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
        </button>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="text-lg font-bold tracking-wide text-maruti-blue">
            <span className="text-[13px] font-semibold">MARUTI</span>{' '}
            <span className="text-[13px] font-bold">SUZUKI</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen((open) => !open)
                  setProfileOpen(false)
                }}
                className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-[380px] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                  <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
                    <h3 className="text-base font-semibold text-maruti-blue">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-maruti-blue">
                        {unreadCount} new
                      </span>
                    )}
                  </div>

                  <ul className="max-h-[360px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <li
                        key={notification.id}
                        className={`border-b border-gray-100 px-4 py-3 last:border-b-0 ${
                          notification.read ? 'bg-white' : 'bg-slate-50'
                        }`}
                      >
                        <div className="flex gap-3">
                          <span
                            className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${DOT_COLORS[notification.dotColor]}`}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                            <p className="mt-0.5 text-sm leading-snug text-gray-600">
                              {notification.description}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">{notification.timestamp}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="border-t border-gray-100 px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-sm font-semibold text-maruti-blue hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setProfileOpen((open) => !open)
                  setNotificationsOpen(false)
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-maruti-blue-light text-maruti-blue hover:bg-blue-100"
                aria-label="User profile"
                aria-expanded={profileOpen}
              >
                <User className="h-4 w-4" />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                  {user && (
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="truncate text-sm font-medium text-gray-900">{user.full_name}</p>
                      <p className="truncate text-xs text-gray-500">{user.email}</p>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              )}
            </div>
            <button
              type="button"
              className="rounded p-2 text-gray-500 hover:bg-gray-100"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

export { Sparkles, RotateCcw }

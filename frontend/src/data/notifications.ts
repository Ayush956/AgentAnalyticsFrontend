export type NotificationDotColor = 'orange' | 'green' | 'purple'

export interface NotificationItem {
  id: string
  title: string
  description: string
  timestamp: string
  dotColor: NotificationDotColor
  read: boolean
}

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Approval Required',
    description:
      'Ticket/2026/008 — Cybersecurity Platform Procurement is pending your approval.',
    timestamp: '01 Jun, 02:50 pm',
    dotColor: 'orange',
    read: false,
  },
  {
    id: '2',
    title: 'Ticket Sent Back',
    description:
      'Ticket/2026/004 — Cloud Infrastructure Upgrade has been sent back for revision.',
    timestamp: '15 May, 09:35 pm',
    dotColor: 'orange',
    read: false,
  },
  {
    id: '3',
    title: 'Ticket Approved',
    description: 'Ticket/2026/002 — HR Training Program has been approved.',
    timestamp: '20 Apr, 07:35 pm',
    dotColor: 'green',
    read: true,
  },
  {
    id: '4',
    title: 'Information Requested',
    description: 'Ticket/2026/006 — WFH Policy requires additional information from you.',
    timestamp: '12 Apr, 11:20 am',
    dotColor: 'purple',
    read: false,
  },
]

export const DOT_COLORS: Record<NotificationDotColor, string> = {
  orange: 'bg-orange-500',
  green: 'bg-teal-500',
  purple: 'bg-purple-500',
}

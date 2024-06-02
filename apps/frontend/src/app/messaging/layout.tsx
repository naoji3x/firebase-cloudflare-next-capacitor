'use client'
import { MessagingProvider } from '@/features/messaging/providers/messaging-provider'
import { MouseEvent, ReactNode } from 'react'

const MessagingLayout = ({ children }: { children: ReactNode }) => {
  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
  }
  return (
    <div onContextMenu={handleContextMenu} className="overscroll-y-none">
      <MessagingProvider>{children}</MessagingProvider>
    </div>
  )
}

export default MessagingLayout

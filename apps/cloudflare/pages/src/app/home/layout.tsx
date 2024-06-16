'use client'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/features/auth/providers/auth-provider'
import { MessagingProvider } from '@/features/messaging/providers/messaging-provider'
import { MouseEvent, ReactNode } from 'react'

const HomeLayout = ({ children }: { children: ReactNode }) => {
  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
  }
  return (
    <div onContextMenu={handleContextMenu} className="overscroll-y-none">
      <MessagingProvider>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </MessagingProvider>
    </div>
  )
}

export default HomeLayout

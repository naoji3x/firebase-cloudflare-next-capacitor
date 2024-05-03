'use client'
import { AuthProvider } from '@/features/auth/providers/auth-provider'
import { MouseEvent, ReactNode } from 'react'

const HomeLayout = ({ children }: { children: ReactNode }) => {
  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
  }
  return (
    <div onContextMenu={handleContextMenu} className="overscroll-y-none">
      <AuthProvider>{children}</AuthProvider>
    </div>
  )
}

export default HomeLayout

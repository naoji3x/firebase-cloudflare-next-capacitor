'use client'

import { Shell } from '@/components/shells/shell'
import { Button } from '@/components/ui/button'
import { signOut } from '@/features/auth/lib/google-auth'
import { useAuth } from '@/features/auth/providers/auth-provider'

const Home = () => {
  const user = useAuth()

  return (
    <main>
      <div className="mx-auto max-w-4xl bg-white p-5">
        <Shell className="max-w-xs">
          {user ? user.name : 'No user'}
          <Button
            onClick={async () => {
              console.log('clicked')
              await signOut()
            }}
          >
            Sign Out
          </Button>
        </Shell>
      </div>
    </main>
  )
}

export default Home

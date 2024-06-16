'use client'

import { Button } from '@/components/ui/button'
import { signOut } from '@/features/auth/lib/google-auth'

const SignOut = () => {
  return (
    <main>
      <div className="mx-auto max-w-4xl bg-white p-5">
        <Button
          variant={'secondary'}
          onClick={async () => {
            console.log('clicked')
            await signOut()
          }}
        >
          Sign Out
        </Button>
      </div>
    </main>
  )
}

export default SignOut

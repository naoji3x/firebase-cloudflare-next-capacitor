'use client'

import { Button } from '@/components/ui/button'
import { auth } from '@/firebase/client'
import { signOut as signOutFirebase } from 'firebase/auth'
import { signOut as signOutNextAuth, useSession } from 'next-auth/react'
import { useState } from 'react'

const SignOutButton = () => {
  const { data: session = null } = useSession()
  const [signingOut, setSigningOut] = useState(false)

  const onClick = async () => {
    try {
      setSigningOut(true)
      await signOutFirebase(auth)
      await signOutNextAuth({ redirect: false, callbackUrl: '/' })
      setSigningOut(false)
    } catch (error) {
      console.error(error)
    }
    globalThis.location.href = '/'
  }

  return (
    <Button disabled={session === null || signingOut} onClick={() => onClick()}>
      Sign Out
    </Button>
  )
}

export default SignOutButton

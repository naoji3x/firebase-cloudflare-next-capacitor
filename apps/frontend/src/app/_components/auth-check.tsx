'use client'
import { functions } from '@/firebase/client'
import { Auth } from '@apps/firebase-functions/src/types/auth'
import { httpsCallable } from 'firebase/functions'
import { useEffect, useState } from 'react'

const AuthCheck = () => {
  const [serverAuth, setServerAuth] = useState<Auth | null>(null)
  useEffect(() => {
    const func = async () => {
      setServerAuth(
        (await httpsCallable<void, Auth | null>(functions, 'getAuth')()).data
      )
    }
    func()
  }, [])
  return (
    <div className="text-center">
      <p>
        {serverAuth
          ? `Auth ID: ${serverAuth.name}`
          : 'Can not get any user data.'}
      </p>
    </div>
  )
}

export default AuthCheck

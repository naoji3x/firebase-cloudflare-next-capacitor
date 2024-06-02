'use client'
import { useMessaging } from '@/features/messaging/providers/messaging-provider'

const Index = () => {
  const messaging = useMessaging()

  return (
    <main>
      <div className="mx-auto max-w-4xl bg-white p-5"></div>
      {messaging?.token ? messaging.token : 'no token.'}
    </main>
  )
}

export default Index

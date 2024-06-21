export const runtime = 'edge'

import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import SocialSignIn from './_components/social-sign-in'

const Index = async () => {
  const session = await auth()
  if (session) {
    redirect('/home')
  }

  return (
    <main>
      <div className="mx-auto max-w-4xl bg-white p-5">
        <SocialSignIn />
      </div>
    </main>
  )
}

export default Index

// export const runtime = 'edge'
import SocialSignIn from '@/app/_components/social-sign-in'

import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const Index = async () => {
  const session = await getServerSession(authOptions)
  const user = session?.user
  if (user) {
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

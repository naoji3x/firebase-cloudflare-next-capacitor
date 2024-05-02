'use client'

import SignOutButton from '@/components/google-sign-out-button'
import { Shell } from '@/components/shells/shell'
import SocialSignIn from './_components/social-sign-in'

const Home = () => {
  return (
    <main>
      <div className="mx-auto max-w-4xl bg-white p-5">
        <SocialSignIn />
        <Shell className="max-w-xs">
          <SignOutButton />
        </Shell>
      </div>
    </main>
  )
}

export default Home

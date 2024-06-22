export const runtime = 'edge'

import SocialSignIn from './_components/social-sign-in'

const Index = async () => {
  return (
    <main>
      <div className="mx-auto max-w-4xl bg-white p-5">
        <SocialSignIn />
      </div>
    </main>
  )
}

export default Index

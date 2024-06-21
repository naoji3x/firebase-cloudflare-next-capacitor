import { signOut } from '@/auth'

const SignOut = () => {
  return (
    <form
      action={async () => {
        'use server'
        await signOut({ redirectTo: '/' })
      }}
    >
      <button className="border p-2 bg-black text-white rounded" type="submit">
        SignOut
      </button>
    </form>
  )
}

export default SignOut

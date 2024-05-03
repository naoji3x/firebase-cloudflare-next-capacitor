'use client'
import { signOut } from '@/features/auth/lib/google-auth'
import { auth } from '@/firebase/client'
import {
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth'
import { useSession } from 'next-auth/react'
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'

type UserContext = {
  name: string
  email: string
  authId: string
  photoUrl?: string | null
}

export type UserContextType = UserContext | null | undefined

const AuthContext = createContext<UserContextType>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session = null } = useSession()
  const [userContext, setUserContext] = useState<UserContextType>()

  const toUserContext = (user: FirebaseUser): UserContext => ({
    name: user.displayName || '',
    email: user.email || '',
    authId: user.uid,
    photoUrl: user.photoURL || ''
  })

  // トークンを再取得する
  useEffect(() => {
    if (session) {
      if (auth.currentUser) {
        // サインインしている場合はユーザー情報を設定する。
        setUserContext(toUserContext(auth.currentUser))
      } else {
        // サインインしていない場合はサインインしてユーザー情報を取得する。
        const func = async () => {
          try {
            const cred = GoogleAuthProvider.credential(session?.user.id_token)
            await signInWithCredential(auth, cred)
            if (auth.currentUser) {
              setUserContext(toUserContext(auth.currentUser))
            } else {
              // エラー時はとにかくサインアウトする
              console.error('Failed to sign in')
              await signOut()
            }
          } catch (error) {
            // エラー時はとにかくサインアウトする
            console.error(error)
            await signOut()
          }
        }
        func()
      }
    }
  }, [session])

  return (
    <AuthContext.Provider value={userContext}>
      {userContext ? (
        children
      ) : (
        <div
          className="h-screen w-screen flex justify-center items-center flex-col space-y-10"
          aria-label="読み込み中"
        >
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
    </AuthContext.Provider>
  )
}

export const useAuth = (): UserContextType => useContext(AuthContext)

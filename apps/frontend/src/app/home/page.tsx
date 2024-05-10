'use client'

import { Shell } from '@/components/shells/shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { signOut } from '@/features/auth/lib/google-auth'
import { useAuth } from '@/features/auth/providers/auth-provider'
import { firestore, functions } from '@/firebase/client'
import { Auth } from '@apps/firebase-functions/src/types/auth'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { useEffect, useState } from 'react'

type Todo = {
  id: string
  instruction: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

const getAuth = async (): Promise<Auth | null> => {
  const func = httpsCallable<void, Auth>(functions, 'getAuth')
  const response = await func()
  return response.data
}

const Home = () => {
  const [inputValue, setInputValue] = useState('')
  const [todos, setTodos] = useState<Todo[]>([])
  const [serverAuth, setServerAuth] = useState<Auth | null>(null)
  const user = useAuth()

  const collectionName = `users/${user?.authId}/todos`

  const addTodo = async () => {
    if (inputValue === '') return
    if (!user) return
    try {
      // const timestamp = serverTimestamp() as Timestamp
      console.log(inputValue)

      const todo: Omit<Todo, 'id'> = {
        instruction: inputValue,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const docRef = await addDoc(collection(firestore, collectionName), todo)
      console.log('Document written with ID: ', docRef.id)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  useEffect(() => {
    const func = async () => {
      console.log('calling getAuth')
      setServerAuth(await getAuth())
    }
    func()
  }, [])

  useEffect(() => {
    const col = collection(firestore, collectionName)
    const unsubscribe = onSnapshot(col, (snapshot) => {
      const newTodos: Todo[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            instruction: doc.data().instruction,
            createdAt: doc.data().createdAt.toDate(),
            updatedAt: doc.data().updatedAt.toDate()
          }) as Todo
      )
      setTodos(newTodos)
    })
    // コンポーネントがアンマウントされたときにリスナーを解除する
    return () => unsubscribe()
  }, [collectionName])

  return (
    <main>
      <div className="mx-auto max-w-4xl bg-white p-5">
        <Shell className="max-w-xs">
          {user ? user.name : 'No user'}
          <Button
            variant={'secondary'}
            onClick={async () => {
              console.log('clicked')
              await signOut()
            }}
          >
            Sign Out
          </Button>
          <Input
            className="rounded-full"
            placeholder="Todo"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button onClick={addTodo}>保存</Button>

          <div>
            {serverAuth
              ? serverAuth.authId +
                ',' +
                serverAuth.name +
                ',' +
                serverAuth.email
              : 'null'}
          </div>

          <div>
            {todos.map((t) => (
              <div key={t.id}>
                {t.id} : {t.instruction} : `{t.completed ? '完了' : '未完了'}`
              </div>
            ))}
          </div>
        </Shell>
      </div>
    </main>
  )
}

export default Home

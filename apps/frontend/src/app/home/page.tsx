'use client'

import TodoCard from '@/components/elements/todo-card'
import { Shell } from '@/components/shells/shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signOut } from '@/features/auth/lib/google-auth'
import { useAuth } from '@/features/auth/providers/auth-provider'
import { functions } from '@/firebase/client'
import { addTodo, getImageUrl, useTodos } from '@/hooks/todos'
import { Auth } from '@apps/firebase-functions/src/types/auth'
import { Todo } from '@apps/firebase-functions/src/types/todo'
import { WithId } from '@apps/firebase-functions/src/types/utils'
import 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import { useEffect, useState } from 'react'

const Card = ({ todo }: { todo: WithId<Todo> }) => {
  const [imageUrl, setImageUrl] = useState<string>('')
  useEffect(() => {
    const func = async () => setImageUrl(await getImageUrl(todo.image))
    func()
  }, [todo.image])

  return (
    <TodoCard
      title={todo.title}
      instruction={todo.instruction}
      scheduledAt={todo.scheduledAt}
      createdAt={todo.createdAt}
      updatedAt={todo.updatedAt}
      imageUrl={imageUrl}
    />
  )
}

const getAuth = async (): Promise<Auth | null> => {
  const func = httpsCallable<void, Auth | null>(functions, 'getAuth')
  const response = await func()
  return response.data
}

const Home = () => {
  const user = useAuth()
  const collectionName = `users/${user?.authId}/todos`
  const [file, setFile] = useState<File | undefined>(undefined)
  const [inputValue, setInputValue] = useState('')
  const [serverAuth, setServerAuth] = useState<Auth | null>(null)
  const { todos } = useTodos(collectionName)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleAddTodo = async () => {
    if (inputValue === '') return
    if (!user) return
    try {
      await addTodo({
        collectionName,
        uid: user.authId,
        instruction: inputValue,
        scheduledAt: new Date(),
        done: false,
        imageFile: file
      })
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

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="picture">Picture</Label>
            <Input id="picture" type="file" onChange={handleFileChange} />
          </div>
          <Button onClick={handleAddTodo}>保存</Button>

          <div>
            {serverAuth ? (
              <>
                <div>{serverAuth.uid}</div>
                <div>name: {serverAuth.name}</div>
                <div>email: {serverAuth.email}</div>
              </>
            ) : (
              'no auth data'
            )}
          </div>
          <div>
            {todos.map((t) => (
              <div key={t.id}>
                <Card todo={t} />
              </div>
            ))}
          </div>
        </Shell>
      </div>
    </main>
  )
  /*
          <div>
            {todos.map((t) => (
              <div key={t.id}>
                <Card todo={t} />
              </div>
            ))}
          </div>
*/
}

export default Home

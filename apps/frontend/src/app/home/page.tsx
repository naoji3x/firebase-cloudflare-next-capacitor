'use client'

import TodoCard from '@/components/elements/todo-card'
import { Shell } from '@/components/shells/shell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signOut } from '@/features/auth/lib/google-auth'
import { useAuth } from '@/features/auth/providers/auth-provider'
import { useMessaging } from '@/features/messaging/providers/messaging-provider'
import { functions } from '@/firebase/client'
import { useMessage } from '@/hooks/message'
import { addTodo, getImageUrl, useTodos } from '@/hooks/todos'
import { Auth } from '@apps/firebase-functions/src/types/auth'
import { Message } from '@apps/firebase-functions/src/types/message'
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
  const response = await httpsCallable<void, Auth | null>(
    functions,
    'auth-get'
  )()
  return response.data
}

const sendMessage = async (
  title: string,
  body: string,
  token: string
): Promise<void> => {
  const func = httpsCallable<Message, void>(functions, 'message-send')
  const message: Message = {
    title,
    body,
    tokens: [token]
  }
  const response = await func(message)
}

const Home = () => {
  const user = useAuth()
  const messaging = useMessaging()
  const { message } = useMessage()
  const collectionName = `users/${user?.uid}/todos`
  const [file, setFile] = useState<File | undefined>(undefined)
  const [inputValue, setInputValue] = useState('')
  const [serverAuth, setServerAuth] = useState<Auth | null>(null)
  const { todos } = useTodos(user?.uid)

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
        uid: user.uid,
        instruction: inputValue,
        scheduledAt: new Date(),
        done: false,
        imageFile: file
      })
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  const handleSendMessage = async () => {
    if (!messaging?.token) return
    try {
      console.log('sending message : ' + messaging.token)
      await sendMessage('title', 'テストです。', messaging.token)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  useEffect(() => {
    const func = async () => {
      console.log('calling getAuth')
      const response = await httpsCallable<void, string>(
        functions,
        'hello-world-kebab'
      )()
      console.log('response', response)
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
          <Button onClick={handleSendMessage}>メッセージ</Button>
          <div>
            <div>メッセージ: {message && message.notification?.body}</div>
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
            {messaging ? (
              <div className="max-w-sm break-words whitespace-pre-wrap">
                token: {messaging.token}
              </div>
            ) : (
              'no messaging data'
            )}
          </div>
          <div>
            {todos.map((t) => (
              <div key={t.id} className="mb-3">
                <Card todo={t} />
              </div>
            ))}
          </div>
        </Shell>
      </div>
    </main>
  )
}

export default Home

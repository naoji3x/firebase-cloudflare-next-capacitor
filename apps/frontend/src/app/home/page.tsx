'use client'

import TodoCard from '@/components/elements/todo-card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { signOut } from '@/features/auth/lib/google-auth'
import { useAuth } from '@/features/auth/providers/auth-provider'
import { addTodo, getImageUrl } from '@/features/db/api/todo'
import { upsertToken } from '@/features/db/api/user'
import { useTodos } from '@/features/db/hooks/todos'
import { useMessage } from '@/features/messaging/hooks/message'
import { useMessaging } from '@/features/messaging/providers/messaging-provider'
import { functions } from '@/firebase/client'
import { useSpeechToast } from '@/hooks/speech-toast'
import { Auth } from '@apps/firebase-functions/src/types/auth'
import { Message } from '@apps/firebase-functions/src/types/message'
import { Todo } from '@apps/firebase-functions/src/types/todo'
import { WithId } from '@apps/firebase-functions/src/types/utils'
import { Label } from '@radix-ui/react-label'
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
  const [file, setFile] = useState<File | undefined>(undefined)
  const [todoValue, setTodoValue] = useState('')
  const [messageValue, setMessageValue] = useState('')
  const [serverAuth, setServerAuth] = useState<Auth | null>(null)
  const { todos } = useTodos(user?.uid)
  const { setToastMessage } = useSpeechToast()
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  // register fcm token
  useEffect(() => {
    if (!messaging || messaging.token === null || !user) return
    const token: string = messaging.token
    const func = async () => {
      console.log('requesting permission')
      await upsertToken(user.uid, token)
      console.log('getting token')
    }
    func()
  }, [messaging, user])

  // show toast message
  useEffect(() => {
    if (!message) return
    console.log('message: ', message)
    setToastMessage({
      title: message?.notification?.title,
      description: message?.notification?.body || ''
    })
  }, [message, setToastMessage])

  // handler for adding todo
  const handleAddTodo = async () => {
    if (todoValue === '') return
    if (!user) return
    try {
      const now = new Date()
      now.setMinutes(now.getMinutes() + 10)
      await addTodo({
        uid: user.uid,
        instruction: todoValue,
        scheduledAt: now,
        done: false,
        imageFile: file
      })
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  // handler for sending message
  const handleSendMessage = async () => {
    if (!messaging?.token) return
    if (messageValue === '') return
    try {
      console.log('sending message : ' + messaging.token)
      await sendMessage('メッセージ', messageValue, messaging.token)
    } catch (e) {
      console.error('Error adding document: ', e)
    }
  }

  // get server auth data
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
    <div className="flex flex-col min-h-screen">
      <header className="w-full bg-foreground text-background py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">{user ? user.name : 'No user'}</h1>
          <Button
            variant={'secondary'}
            onClick={async () => {
              console.log('clicked')
              await signOut()
            }}
          >
            Sign Out
          </Button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center bg-gray-100">
        <section className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Input</h2>
          <Input
            className="rounded-full"
            placeholder="Todo"
            value={todoValue}
            onChange={(e) => setTodoValue(e.target.value)}
          />
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="picture">Picture</Label>
            <Input id="picture" type="file" onChange={handleFileChange} />
          </div>
          <div className="text-right my-3">
            <Button onClick={handleAddTodo} disabled={!todoValue}>
              保存
            </Button>
          </div>

          <Input
            className="rounded-full"
            placeholder="Message"
            value={messageValue}
            onChange={(e) => setMessageValue(e.target.value)}
          />
          <div className="text-right my-3">
            <Button onClick={handleSendMessage} disabled={!messageValue}>
              メッセージ
            </Button>
          </div>

          <div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="Server Auth">
                <AccordionTrigger>Server Auth</AccordionTrigger>
                <AccordionContent>
                  {serverAuth ? (
                    <>
                      <div>{serverAuth.uid}</div>
                      <div>name: {serverAuth.name}</div>
                      <div>email: {serverAuth.email}</div>
                    </>
                  ) : (
                    'no auth data'
                  )}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="Token">
                <AccordionTrigger>Token</AccordionTrigger>
                <AccordionContent>
                  {messaging ? (
                    <div>{messaging.token}</div>
                  ) : (
                    'no messaging data'
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <section className="container mx-auto px-4 py-8 text-center bg-white">
          <h2 className="text-2xl font-semibold mb-4">Todo</h2>

          <div className="flex flex-wrap justify-center">
            {todos.map((t) => (
              <div key={t.id} className="w-full sm:w-1/2 lg:w-1/3 p-4">
                <Card todo={t} />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="w-full bg-foreground text-background  py-4">
        <div className="container mx-auto px-4 text-center">
          <p>firebase-cloudflare-next-capacitor</p>
        </div>
      </footer>
    </div>
  )
}

export default Home

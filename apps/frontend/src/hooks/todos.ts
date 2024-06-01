import { firestore, storage } from '@/firebase/client'
import {
  Todo,
  firestoreToTodo,
  todoFirestoreSchema
} from '@apps/firebase-functions/src/types/todo'
import { WithId } from '@apps/firebase-functions/src/types/utils'
import 'firebase/firestore'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'
import { ref, uploadBytes } from 'firebase/storage'
import { useEffect, useState } from 'react'

export const useTodos = (collectionName: string) => {
  const [todos, setTodos] = useState<WithId<Todo>[]>([])

  useEffect(() => {
    const col = collection(firestore, collectionName)
    const unsubscribe = onSnapshot(col, (snapshot) => {
      const newTodos: WithId<Todo>[] = snapshot.docs
        .map((doc) => {
          const parsedData = todoFirestoreSchema.safeParse(doc.data())
          if (!parsedData.success) {
            console.error(parsedData.error)
            return null
          } else {
            return {
              id: doc.id,
              ...firestoreToTodo(parsedData.data)
            }
          }
        })
        .filter((t): t is WithId<Todo> => t !== null)
        .sort(
          (lhs, rhs) => rhs.scheduledAt.getTime() - lhs.scheduledAt.getTime()
        )

      setTodos(newTodos)
    })
    // コンポーネントがアンマウントされたときにリスナーを解除する
    return () => unsubscribe()
  }, [collectionName])

  return { todos }
}

type addTodoInput = {
  collectionName: string
  uid: string
  title?: string
  instruction: string
  scheduledAt: Date
  done: boolean
  imageFile?: File
}

const handleUpload = async (file: File): Promise<string | null> => {
  if (!file) return null
  const path = 'images/' + crypto.randomUUID()
  console.log('Uploading file... ' + path)
  const storageRef = ref(storage, path)
  try {
    await uploadBytes(storageRef, file)
    console.log('File uploaded successfully')
    return path
  } catch (error) {
    console.error('Error uploading file:', error)
    return null
  }
}

export const addTodo = async ({
  collectionName,
  uid,
  title,
  instruction,
  scheduledAt,
  done,
  imageFile
}: addTodoInput) => {
  const imagePath = imageFile ? await handleUpload(imageFile) : undefined
  const todo: Todo = {
    uid,
    title,
    instruction,
    scheduledAt,
    done,
    image: imagePath ?? undefined
  }
  const docRef = await addDoc(collection(firestore, collectionName), todo)
  console.log('Document written with ID: ', docRef.id)
}

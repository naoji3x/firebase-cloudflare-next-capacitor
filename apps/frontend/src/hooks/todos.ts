'use client'

import { firestore, storage } from '@/firebase/client'
import {
  Todo,
  firestoreToTodo,
  todoFirestoreSchema
} from '@apps/firebase-functions/src/types/todo'
import { WithId } from '@apps/firebase-functions/src/types/utils'
import 'firebase/firestore'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useEffect, useState } from 'react'

const collectionName = (uid: string) => `users/${uid}/todos`

export const useTodos = (uid?: string) => {
  const [todos, setTodos] = useState<WithId<Todo>[]>([])

  useEffect(() => {
    if (!uid) return
    const col = collection(firestore, collectionName(uid))
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
  }, [uid])

  return { todos }
}

type addTodoInput = {
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
  const docRef = await addDoc(collection(firestore, collectionName(uid)), todo)
  console.log('Document written with ID: ', docRef.id)
}

export const getImageUrl = async (image?: string) =>
  image ? await getDownloadURL(ref(storage, image)) : ''

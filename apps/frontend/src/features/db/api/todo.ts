'use client'

import { firestore, storage } from '@/firebase/client'
import { Todo } from '@apps/firebase-functions/src/types/todo'
import 'firebase/firestore'
import { addDoc, collection } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const collectionName = (uid: string) => `users/${uid}/todos`

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

type addTodoInput = {
  uid: string
  title?: string
  instruction: string
  scheduledAt: Date
  done: boolean
  imageFile?: File
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

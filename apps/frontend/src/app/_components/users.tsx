'use client'

import { firestore } from '@/firebase/client'
import { collection, onSnapshot } from 'firebase/firestore'
import { useEffect, useState } from 'react'

type User = {
  id: string
}

export const Users = () => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const col = collection(firestore, 'users')
    const unsubscribe = onSnapshot(col, (snapshot) => {
      const newUsers: User[] = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id
          }) as User
      )
      setUsers(newUsers)
    })
    // コンポーネントがアンマウントされたときにリスナーを解除する
    return () => unsubscribe()
  }, [])

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.id}</div>
      ))}
    </div>
  )
}

export default Users

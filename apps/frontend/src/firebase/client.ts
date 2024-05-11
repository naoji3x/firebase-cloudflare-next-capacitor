import { env } from '@/env.mjs'
import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  connectFirestoreEmulator,
  getFirestore,
  initializeFirestore
} from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'

export const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_API_KEY,
  authDomain: env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_APP_ID
}

const isEmulator = () => {
  const useEmulator = env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR
  return useEmulator ? useEmulator === 'true' : false
}

export const firebase = getApps()?.length
  ? getApps()[0]
  : initializeApp(firebaseConfig)

initializeFirestore(firebase, {
  ignoreUndefinedProperties: true,
  experimentalForceLongPolling: isEmulator()
})

export const firebaseApp = firebase

export const auth = getAuth(firebaseApp)
export const functions = getFunctions(firebaseApp, 'asia-northeast1')
export const firestore = getFirestore(firebaseApp)

if (isEmulator()) {
  connectFunctionsEmulator(functions, 'localhost', 5001)
  connectFirestoreEmulator(firestore, '127.0.0.1', 8080)
}

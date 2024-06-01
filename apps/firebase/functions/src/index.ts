/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { Auth } from '@/types/auth'
import { initializeApp } from 'firebase-admin/app'
import { Timestamp } from 'firebase-admin/firestore'
import * as logger from 'firebase-functions/logger'
import {
  onDocumentCreated,
  onDocumentUpdated
} from 'firebase-functions/v2/firestore'
import { onCall } from 'firebase-functions/v2/https'
import { setGlobalOptions } from 'firebase-functions/v2/options'

// regionは固定値で設定する。環境変数から読み込もうとしたが、エラーになる。
// 関数の中では環境変数が使えるが、トップレベルでは使えない。
setGlobalOptions({ region: 'asia-northeast1' })
initializeApp()

// Functionに渡された認証情報の取得
export const getAuth = onCall<void, Auth | null>((event): Auth | null => {
  logger.info('now getting auth ...', { structuredData: true })
  if (event.auth) {
    return {
      uid: event.auth.uid,
      name: event.auth.token.name,
      email: event.auth.token.email
    }
  }
  return null
})

/**
 * Firestoreのデータを作成する際に、createdAtとupdatedAtを挿入する。
 */
export const createTodoTimestamp = onDocumentCreated(
  '/users/{uid}/todos/{todoId}',
  (event) => {
    const snapshot = event.data
    if (!snapshot) return null
    logger.info('now creating timestamps ...', { structuredData: true })
    return snapshot.ref.set(
      {
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      { merge: true }
    )
  }
)

/**
 * Firestoreのデータを書き換える際に、updatedAtを更新する。
 */
export const updateTodoTimestamp = onDocumentUpdated(
  '/users/{uid}/todos/{todoId}',
  (event) => {
    const updatedAtBefore = event.data?.before?.data().updatedAt
    if (!updatedAtBefore) return null
    const updatedAtAfter = event.data?.after?.data().updatedAt
    if (updatedAtBefore.isEqual(updatedAtAfter)) return null

    logger.info('now updating updatedAt ...', { structuredData: true })
    return event.data?.after.ref.set(
      {
        updatedAt: Timestamp.now()
      },
      { merge: true }
    )
  }
)

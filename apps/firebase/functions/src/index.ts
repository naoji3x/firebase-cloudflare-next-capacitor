/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { Auth } from '@/types/auth'
import { Message } from '@/types/message'
import { initializeApp } from 'firebase-admin/app'
import { Timestamp } from 'firebase-admin/firestore'
import * as functions from 'firebase-functions'
import * as logger from 'firebase-functions/logger'
import {
  onDocumentCreated,
  onDocumentUpdated
} from 'firebase-functions/v2/firestore'
import { onCall } from 'firebase-functions/v2/https'
import { setGlobalOptions } from 'firebase-functions/v2/options'
import { onTaskDispatched } from 'firebase-functions/v2/tasks'
import * as messageService from './services/message-service'

// ** note **
// firebase functions v1では関数名に大文字が使えるが、v2からは使えない。
// ケバブケースにするためには、関数名をオブジェクトに入れる。

// 関数の中では環境変数が使えるが、トップレベルでは使えない。
// regionは固定値で設定する。環境変数から読み込もうとしたが、エラーになる。
const region = 'asia-northeast1'

// v2のregionを設定
setGlobalOptions({ region })
// initializeApp({ credential: applicationDefault() })
initializeApp()

// 以下の関数は、v1の関数のサンプル
export const helloWorld = functions.region(region).https.onCall(() => {
  const message = 'Hello world!'
  logger.info(region + ':' + message + ':' + new Date().toLocaleString())
  return message
})

const helloWorldV2 = onCall<void, string>((request): string => {
  return (
    'Hello v2 world!: ' + request.auth?.uid + ',' + request.auth?.token.name ||
    '' + ',' + request.auth?.token.email ||
    ''
  )
})

// 以下の関数は、v2の関数のサンプル。関数名に大文字が使えないので、ケバブケースにする。
const helloWorldKebab = onCall<void, string>((request): string => {
  return 'Hello kebab world!: ' + request.auth?.uid
})

// 関数をエクスポートする際に、オブジェクトに入れることで、ケバブケースにできる。
exports.hello = { world: { kebab: helloWorldKebab, v2: helloWorldV2 } }

// Functionに渡された認証情報を取得する関数
const getAuth = onCall<void, Auth | null>((request): Auth | null => {
  if (request.auth) {
    return {
      uid: request.auth.uid,
      name: request.auth.token.name,
      email: request.auth.token.email
    }
  }
  return null
})

exports.auth = { get: getAuth }

// メッセージを送信する関数
const sendMessage = onCall<Message, void>(async (request) => {
  if (!request.auth) return
  const message = request.data
  if (!message) return
  await messageService.sendMessage(message)
})

// メッセージを送信するタスク
const scheduleMessage = onTaskDispatched<Message>(
  {
    // region: region,
    retryConfig: {
      maxAttempts: 5,
      minBackoffSeconds: 60
    },
    rateLimits: {
      maxConcurrentDispatches: 6
    }
  },
  async (request) => await messageService.sendMessage(request.data)
)

exports.message = { send: sendMessage, task: scheduleMessage }

// Firestoreのデータを作成する際に、createdAtとupdatedAtを挿入する。
const createTodoTimestamp = onDocumentCreated(
  '/users/{uid}/todos/{todoId}',
  (event) => {
    const snapshot = event.data
    if (!snapshot) return null
    logger.info('now creating timestamps ...', { structuredData: true })
    /*
    const scheduledAt = snapshot.data().scheduledAt.toDate()
    let taskId = undefined
    if (scheduledAt > new Date()) {
      taskId = crypto.randomUUID()
      messageService.queueMessage(taskId, scheduledAt, {
        title: snapshot.data().title,
        body: snapshot.data().body,
        tokens: snapshot.data().tokens
      })
    }
    */
    return snapshot.ref.set(
      {
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      { merge: true }
    )
  }
)

// Firestoreのデータを書き換える際に、updatedAtを更新する。
const updateTodoTimestamp = onDocumentUpdated(
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

exports.todo = {
  created: createTodoTimestamp,
  updated: updateTodoTimestamp
}

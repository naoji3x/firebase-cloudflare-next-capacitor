/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { Auth } from '@/types/auth'
import * as functions from 'firebase-functions'
import * as logger from 'firebase-functions/logger'

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// regionは固定値で設定する。環境変数から読み込もうとしたが、エラーになる。
// 関数の中では環境変数が使えるが、トップレベルでは使えない。
const region = 'asia-northeast1'

type Context = functions.https.CallableContext
export const requestHelloWorld = functions
  .region(region)
  .https.onRequest((request, response) => {
    logger.info('Hello logs!', { structuredData: true })
    response.send('Hello from Firebase!')
  })

type Data = {
  name: string
}
export const callHelloWorld = functions
  .region(region)
  .https.onCall((data: Data, context: Context) => {
    const message = 'Hello from Firebase! ' + data.name + context?.auth?.uid
    logger.info(region + ':' + message + ':' + new Date().toLocaleString())
    return message
  })

export const getAuth = functions
  .region(region)
  .https.onCall((data, context: Context): Auth | null => {
    console.log('now getting auth ...')
    // logger.info('notify: ' + JSON.stringify(message))
    console.log(context?.auth)
    if (context?.auth) {
      return {
        authId: context.auth.uid,
        name: context.auth.token.name,
        email: context.auth.token.email
      }
    }
    return {
      authId: 'null',
      name: 'null',
      email: 'null'
    }
  })

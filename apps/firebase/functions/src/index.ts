/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as functions from 'firebase-functions'
import * as logger from 'firebase-functions/logger'
// import { env } from './env.mjs'

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// regionは固定値で設定する。環境変数から読み込もうとしたが、エラーになる。
// 関数の中では環境変数が使えるが、トップレベルでは使えない。
const region = 'asia-northeast1'

export const requestHelloWorld = functions
  .region(region)
  .https.onRequest((request, response) => {
    logger.info('Hello logs!', { structuredData: true })
    response.send('Hello from Firebase!')
  })

export const callHelloWorld = functions.region(region).https.onCall(() => {
  const message = 'Hello world!'
  logger.info(region + ':' + message + ':' + new Date().toLocaleString())
  return message
})

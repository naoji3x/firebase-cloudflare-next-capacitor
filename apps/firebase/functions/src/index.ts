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

// regionは固定値で設定する。環境変数から読み込もうとしたが、エラーになる。
// 関数の中では環境変数が使えるが、トップレベルでは使えない。
const region = 'asia-northeast1'
const https = functions.region(region).https
type Context = functions.https.CallableContext

// Functionに渡された認証情報の取得
export const getAuth = https.onCall((data, context: Context): Auth | null => {
  logger.info('now getting auth ...', { structuredData: true })
  if (context?.auth) {
    return {
      uid: context.auth.uid,
      name: context.auth.token.name,
      email: context.auth.token.email
    }
  }
  return null
})

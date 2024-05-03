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

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

const region = 'asia-northeast1'

export const helloWorld = functions
  .region(region)
  .https.onRequest((request, response) => {
    logger.info('Hello logs!', { structuredData: true })
    response.send('Hello from Firebase!')
  })

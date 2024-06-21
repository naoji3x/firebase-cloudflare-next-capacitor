import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string(),
    AUTH_GOOGLE_ID: z.string(),
    AUTH_GOOGLE_SECRET: z.string()
    // VERSION: z.string()
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string(),
    NEXT_PUBLIC_API_KEY: z.string(),
    NEXT_PUBLIC_AUTH_DOMAIN: z.string(),
    NEXT_PUBLIC_PROJECT_ID: z.string(),
    NEXT_PUBLIC_STORAGE_BUCKET: z.string(),
    NEXT_PUBLIC_MESSAGING_SENDER_ID: z.string(),
    NEXT_PUBLIC_APP_ID: z.string(),
    NEXT_PUBLIC_VAPID_KEY: z.string(),
    NEXT_PUBLIC_USE_FIREBASE_EMULATOR: z.string().optional()
  },

  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,

    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    NEXT_PUBLIC_AUTH_DOMAIN: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
    NEXT_PUBLIC_PROJECT_ID: process.env.NEXT_PUBLIC_PROJECT_ID,
    NEXT_PUBLIC_STORAGE_BUCKET: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
    NEXT_PUBLIC_MESSAGING_SENDER_ID:
      process.env.NEXT_PUBLIC_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_APP_ID: process.env.NEXT_PUBLIC_APP_ID,
    NEXT_PUBLIC_VAPID_KEY: process.env.NEXT_PUBLIC_VAPID_KEY,
    NEXT_PUBLIC_USE_FIREBASE_EMULATOR:
      process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR
  }
})

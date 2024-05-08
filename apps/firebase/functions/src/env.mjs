import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'
export const env = createEnv({
  server: {
    REGION: z.string()
  },
  runtimeEnv: {
    REGION: process.env.REGION
  }
})

/*
このモジュールを使うためには、tsconfig.json に以下の設定が必要です。
{
  "compilerOptions": {
    "module": "esnext",
    "allowJs": true,
    "moduleResolution": "bundler",
*/

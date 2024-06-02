import { z } from 'zod'

export const messageSchema = z.object({
  title: z.string().optional(),
  body: z.string()
})
export type Message = z.infer<typeof messageSchema>

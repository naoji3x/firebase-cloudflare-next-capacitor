import { z } from 'zod'

// Todoのレスポンスボディの型
export const todoJsonSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  instruction: z.string(),
  done: z.boolean(),
  scheduledAt: z.string().datetime(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})
export type TodoJson = z.infer<typeof todoJsonSchema>
export type Todo = Omit<TodoJson, 'scheduledAt' | 'createdAt' | 'updatedAt'> & {
  scheduledAt: Date
  createdAt: Date
  updatedAt: Date
}

// TodoJson -> Todoへの変換
export const jsonToTodo = (json: TodoJson): Todo => ({
  ...json,
  scheduledAt: new Date(Date.parse(json.scheduledAt)),
  createdAt: new Date(Date.parse(json.createdAt)),
  updatedAt: new Date(Date.parse(json.updatedAt))
})

// Todo -> TodoJsonへの変換
export const todoToJson = (todo: Todo): TodoJson => ({
  ...todo,
  scheduledAt: todo.scheduledAt.toISOString(),
  createdAt: todo.createdAt.toISOString(),
  updatedAt: todo.updatedAt.toISOString()
})

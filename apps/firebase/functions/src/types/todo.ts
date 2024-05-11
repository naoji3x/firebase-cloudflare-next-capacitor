import { z } from 'zod'

const head = {
  uid: z.string(),
  title: z.string().optional(),
  instruction: z.string(),
  done: z.boolean()
}

const jsonBody = {
  scheduledAt: z.string().datetime(),
  createdAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime().optional()
}

const plainBody = {
  scheduledAt: z.date(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional()
}

// Todoのレスポンスボディの型
export const todoJsonSchema = z.object({
  ...head,
  ...jsonBody
})

// Todoのfirestoreの型
export const todoSchema = z.object({
  ...head,
  ...plainBody
})

export type TodoJson = z.infer<typeof todoJsonSchema>
export type Todo = z.infer<typeof todoSchema>

// TodoJson -> Todoへの変換
export const jsonToTodo = (json: TodoJson): Todo => ({
  ...json,
  scheduledAt: new Date(Date.parse(json.scheduledAt)),
  createdAt: json.createdAt ? new Date(Date.parse(json.createdAt)) : undefined,
  updatedAt: json.updatedAt ? new Date(Date.parse(json.updatedAt)) : undefined
})

// Todo -> TodoJsonへの変換
export const todoToJson = (todo: Todo): TodoJson => ({
  ...todo,
  scheduledAt: todo.scheduledAt.toISOString(),
  createdAt: todo.createdAt ? todo.createdAt.toISOString() : undefined,
  updatedAt: todo.updatedAt ? todo.updatedAt.toISOString() : undefined
})

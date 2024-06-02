import { Message } from '@/types/message'
import { getFunctions } from 'firebase-admin/functions'
import { BatchResponse, getMessaging } from 'firebase-admin/messaging'
import { getFunctionUrl } from './tasks'

// メッセージを送信する
export const sendMessage = async ({
  notification, // 通知するメッセージ
  data, // メッセージに含めるデータ
  tokens // 送り先のトークン
}: {
  notification?: { title?: string; body?: string }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any
  tokens: string[]
}): Promise<BatchResponse> => {
  return await getMessaging().sendEachForMulticast({
    notification,
    data,
    tokens
  })
}

// メッセージをキューに登録する
export const queueMessage = async (
  id: string, // タスクのID
  scheduleTime: Date, // タスクの実行予定時刻
  message: Message, // 送信するメッセージ
  region = 'asia-northeast1', // リージョン
  funcName = 'sendMessage' // 関数名
) => {
  const queue = getFunctions().taskQueue(
    `locations/${region}/functions/${funcName}`
  )
  const targetUri = await getFunctionUrl(funcName, region)
  const func = queue.enqueue(message, { scheduleTime, uri: targetUri, id })
  await Promise.all([func])
}

// タスクの削除
export const deleteTask = async (
  id: string, // タスクのID
  region = 'asia-northeast1', // リージョン
  funcName = 'sendMessage' // 関数名
): Promise<void> => {
  const queue = getFunctions().taskQueue(
    `locations/${region}/functions/${funcName}`
  )
  const func = queue.delete(id)
  await Promise.all([func])
}

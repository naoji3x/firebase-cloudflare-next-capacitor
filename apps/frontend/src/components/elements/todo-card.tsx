import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import Image from 'next/image'

const TodoCard = ({
  className = '',
  title = 'title',
  instruction = 'instruction',
  scheduledAt = new Date(),
  createdAt = new Date(),
  updatedAt = new Date(),
  imageUrl = '',
  ...props
}) => {
  return (
    <Card className={cn('w-[350px]', className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="instruction">内容</Label>
              <Input
                id="instruction"
                placeholder="Name of your project"
                value={instruction}
              />
              <Label htmlFor="instruction">予定日時</Label>
              {format(scheduledAt, 'yyyy/MM/dd HH:mm', { locale: ja })}
              <Label htmlFor="instruction">登録日</Label>
              {format(createdAt, 'yyyy/MM/dd HH:mm', { locale: ja })}
              <Label htmlFor="instruction">更新日</Label>
              {format(updatedAt, 'yyyy/MM/dd HH:mm', { locale: ja })}
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt="Todo"
                  width={500}
                  height={300}
                  layout="responsive"
                />
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="destructive">削除</Button>
        <Button>更新</Button>
      </CardFooter>
    </Card>
  )
}

export default TodoCard

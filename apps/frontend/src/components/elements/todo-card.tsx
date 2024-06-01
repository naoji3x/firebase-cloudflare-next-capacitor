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

const TodoCard = ({
  className = '',
  title = '',
  instruction = 'instruction',
  scheduledAt = new Date(),
  createdAt = new Date(),
  updatedAt = new Date(),
  imageUrl = '',
  ...props
}) => {
  return (
    <Card className={cn('w-[350px]', className)} {...props}>
      <CardHeader>{title && <CardTitle>{title}</CardTitle>}</CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="instruction">内容</Label>
              <Input
                id="instruction"
                placeholder="Name of your project"
                defaultValue={instruction}
              />
              <div className="flex justify-between items-center">
                <Label htmlFor="instruction">予定日時</Label>
                <span>
                  {format(scheduledAt, 'yyyy/MM/dd HH:mm', { locale: ja })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <Label htmlFor="instruction">登録日</Label>
                <span>
                  {format(createdAt, 'yyyy/MM/dd HH:mm', { locale: ja })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <Label htmlFor="instruction">更新日</Label>
                <span>
                  {format(updatedAt, 'yyyy/MM/dd HH:mm', { locale: ja })}
                </span>
              </div>
              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="Todo" className="w-full h-auto" />
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

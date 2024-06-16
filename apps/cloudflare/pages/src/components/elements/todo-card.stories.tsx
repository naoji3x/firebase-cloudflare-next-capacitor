import type { Meta, StoryObj } from '@storybook/react'
import TodoCard from './todo-card'

const meta = {
  title: 'components/TodoCard',
  component: TodoCard,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof TodoCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: '日課',
    instruction: '朝起きたら顔を洗う。',
    scheduledAt: new Date('2024-02-01T00:00:00Z'),
    createdAt: new Date('2024-01-01T07:00:00Z'),
    updatedAt: new Date('2024-01-01T07:00:00Z'),
    imageUrl: 'https://source.unsplash.com/random/300x300'
  }
}

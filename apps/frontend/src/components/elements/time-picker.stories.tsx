import type { Meta, StoryObj } from '@storybook/react'
import TimePicker from './time-picker'

const meta = {
  title: 'components/TimePicker',
  component: TimePicker,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof TimePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    date: new Date(),
    onValueChange: (date: Date) => console.log(date)
  }
}

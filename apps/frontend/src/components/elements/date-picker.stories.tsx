import type { Meta, StoryObj } from '@storybook/react'
import DatePicker from './date-picker'

const meta = {
  title: 'components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    date: new Date(),
    onSelect: (date?: Date) => console.log(date)
  }
}

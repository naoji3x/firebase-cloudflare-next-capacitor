import type { Meta, StoryObj } from '@storybook/react'
import SignOutButton from './sign-out-button'

const meta = {
  title: 'features/auth/components/SignOutButton',
  component: SignOutButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof SignOutButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

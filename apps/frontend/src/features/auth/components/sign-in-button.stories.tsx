import type { Meta, StoryObj } from '@storybook/react'
import SignInButton from './sign-in-button'

const meta = {
  title: 'features/auth/components/SignInButton',
  component: SignInButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof SignInButton>

export default meta
type Story = StoryObj<typeof meta>

export const Enabled: Story = {}

export const Disabled: Story = {
  args: {
    disabled: true
  }
}

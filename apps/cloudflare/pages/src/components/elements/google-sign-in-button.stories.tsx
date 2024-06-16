import type { Meta, StoryObj } from '@storybook/react'
import GoogleSignInButton from './google-sign-in-button'

const meta = {
  title: 'components/GoogleSignInButton',
  component: GoogleSignInButton,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs']
} satisfies Meta<typeof GoogleSignInButton>

export default meta
type Story = StoryObj<typeof meta>

export const Enabled: Story = {}

export const DestructiveIcon: Story = {
  args: {
    variant: 'destructive',
    size: 'icon'
  }
}
export const Disabled: Story = {
  args: {
    disabled: true
  }
}

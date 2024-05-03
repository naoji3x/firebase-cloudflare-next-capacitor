'use client'

import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export const GoogleSignInButton: React.FC<ButtonProps> = ({
  className = '',
  children = 'Googleでログイン',
  ...props
}) => {
  const { size } = props
  return (
    <Button
      className={cn(
        size !== 'icon' ? 'px-4 py-2' : '',
        'border flex gap-2 border-slate-200 rounded-lg transition-color duration-200 active:border-slate-500 hover:shadow-md',
        className
      )}
      {...props}
    >
      <Image
        width={24}
        height={24}
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        loading="lazy"
        alt="google logo"
      />
      {size !== 'icon' ? children : null}
    </Button>
  )
}

export default GoogleSignInButton

/*
interface Props {
  disabled?: boolean
}

export const GoogleSignInButton = ({ disabled = false }: Props) => {
  const onClick = async () => {
    const res = await signIn('google')
  }

  return (
    <Button
      onClick={() => onClick()}
      className="px-4 py-2 border flex gap-2 border-slate-200 rounded-lg text-slate-700 hover:border-slate-200 hover:text-slate-900 hover:shadow transition duration-150 bg-white shadow hover:bg-gray-200"
      disabled={disabled}
    >
      <Image
        width={24}
        height={24}
        src="https://www.svgrepo.com/show/475656/google-color.svg"
        loading="lazy"
        alt="google logo"
      />
      <span>Googleでログイン</span>
    </Button>
  )
}

export default GoogleSignInButton
*/

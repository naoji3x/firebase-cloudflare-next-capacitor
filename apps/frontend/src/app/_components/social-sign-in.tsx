'use client'
import { type Metadata } from 'next'

import { GoogleSignIn } from '@/components/google-sign-in'
import { Shell } from '@/components/shells/shell'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account'
}

const SocialSignIn = () => {
  const [agreed, setAgreed] = useState(false)

  return (
    <section className="pb-2 bg-white">
      <div className="container mx-auto px-4">
        <Shell className="max-w-lg">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl mx-auto">
                あなたのアカウントで始めましょう！
              </CardTitle>
              <CardDescription className="mx-auto pt-2">
                Googleのアカウントで始められます。
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center space-x-2 mx-auto">
                <Checkbox
                  id="terms"
                  checked={agreed}
                  onCheckedChange={(checked) => {
                    setAgreed(checked === 'indeterminate' ? false : checked)
                  }}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  利用規約とプライバシーポリシーに同意しました。
                </label>
              </div>
              <GoogleSignIn disabled={!agreed} />
            </CardContent>
          </Card>
        </Shell>
      </div>
    </section>
  )
}

export default SocialSignIn

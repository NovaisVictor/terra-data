'use client'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useServerAction } from 'zsa-react'

import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { signInAction } from '@/actions/auth/sign-in-action'

export function SignInForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { isPending, executeFormAction, error } = useServerAction(
    signInAction,
    {
      onSuccess() {
        toast.success('Login realizado com sucesso')
        router.push('/')
      },
      onError() {
        toast.error('Credencias invalidas')
      },
    },
  )

  return (
    <div className="space-y-4">
      <form action={executeFormAction} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <Input
            name="email"
            type="email"
            id="email"
            defaultValue={searchParams.get('email') ?? ''}
          />
          {error?.fieldErrors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {error?.fieldErrors?.email}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Senha</Label>
          <Input name="password" type="password" id="password" />
          {error?.fieldErrors?.password && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {error?.fieldErrors?.password}
            </p>
          )}

          <Link
            href="/auth/forgot-password"
            className="text-sm font-medium text-foreground hover:underline"
          >
            Esqueceu sua senha?
          </Link>
        </div>
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            'Entrar com e-mail'
          )}
        </Button>
        <Button variant={'link'} className="w-full" asChild>
          <Link href="/sign-up">Criar uma nova conta</Link>
        </Button>
      </form>
    </div>
  )
}

'use client'
import { Loader2, UserPlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useServerAction } from 'zsa-react'
import { createInviteAction } from '@/actions/invites/create-invite-action'
import { toast } from 'sonner'

export function CreateInviteForm() {
  const { error, executeFormAction, isPending } = useServerAction(
    createInviteAction,
    {
      onSuccess() {
        toast.success('Convite criada com sucesso')
      },
      onError(args) {
        toast.error(args.err.message)
      },
    },
  )

  return (
    <form action={executeFormAction} className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <Input
            name="email"
            type="email"
            id="email"
            placeholder="jhon@example.com"
          />
          {error?.fieldErrors?.email && (
            <p className="text-xs font-medium text-red-500 dark:text-red-400">
              {error?.fieldErrors?.email}
            </p>
          )}
        </div>

        <Select name="role" defaultValue="MEMBER">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="MEMBER">Membro</SelectItem>
          </SelectContent>
        </Select>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <UserPlus className="mr-2 size-4" />
              Convidar usuário
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

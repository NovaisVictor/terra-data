'use client'
import { acceptInviteAction } from '@/actions/invites/accept-invite-action'
import { getPendingInvitesAction } from '@/actions/invites/get-pending-invites-action'
import { rejectInviteAction } from '@/actions/invites/reject-invite-action'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Check, Loader2, UserPlus2, X } from 'lucide-react'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Button } from './ui/button'
import { useServerActionQuery } from '@/hooks/server-action-hooks'

dayjs.extend(relativeTime)

export function PendingInvites() {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(false)
  const { data, isLoading } = useServerActionQuery(getPendingInvitesAction, {
    queryKey: ['pending-invites'],
    input: undefined,
  })

  async function handleAccpetInvite(inviteId: string) {
    await acceptInviteAction({ inviteId })

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }
  async function handleRejectInvite(inviteId: string) {
    await rejectInviteAction({ inviteId })

    queryClient.invalidateQueries({ queryKey: ['pending-invites'] })
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size={'icon'} variant={'ghost'}>
          <UserPlus2 className="size-4" />
          <span className="sr-only">
            Convites pendentes ({data?.invites.length ?? 0}){' '}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 space-y-2">
        <span className="flex items-center text-xs font-medium">
          Convites pendentes{' '}
          {isLoading ? (
            <Loader2 className="ml-1 size-3 animate-spin" />
          ) : (
            <>({data?.invites.length})</>
          )}
        </span>

        {data?.invites.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum convite encontrado.
          </p>
        )}

        {data?.invites.map((invite) => {
          return (
            <div className="space-y-2" key={invite.id}>
              <p className="text-balance leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">
                  {invite.author?.name ?? 'Alguém'}
                </span>{' '}
                convidou você para entrar em{' '}
                <span className="font-medium text-foreground">
                  {invite.company.name}
                </span>{' '}
                <span className="text-xs">
                  {dayjs(invite.createdAt).fromNow()}
                </span>
              </p>

              <div className="flex gap-1">
                <Button
                  size={'xs'}
                  variant={'outline'}
                  onClick={() => {
                    handleAccpetInvite(invite.id)
                  }}
                >
                  <Check className="mr-1.5 size-3" />
                  Aceitar
                </Button>

                <Button
                  size={'xs'}
                  variant={'ghost'}
                  className="text-muted-foreground"
                  onClick={() => {
                    handleRejectInvite(invite.id)
                  }}
                >
                  <X className="mr-1.5 size-3" />
                  Recusar
                </Button>
              </div>
            </div>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}

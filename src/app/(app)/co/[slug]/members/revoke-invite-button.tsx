'use client'
import { XOctagon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { revokeInviteAction } from '@/actions/invites/revoke-invite-action'
import { useServerAction } from 'zsa-react'

interface RevokeInviteButtonProps {
  inviteId: string
}

export function RevokeInviteButton({ inviteId }: RevokeInviteButtonProps) {
  const { isPending, execute } = useServerAction(revokeInviteAction)

  return (
    <Button
      onClick={() => execute({ inviteId })}
      size={'sm'}
      variant={'destructive'}
      disabled={isPending}
    >
      <XOctagon className="mr-2 size-4" />
      Revoke invite
    </Button>
  )
}

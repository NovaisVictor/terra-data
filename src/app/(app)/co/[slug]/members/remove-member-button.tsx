'use client'

import { removeMemberAction } from '@/actions/members/remove-member-action'
import { Button } from '@/components/ui/button'
import { UserMinus } from 'lucide-react'
import { useServerAction } from 'zsa-react'

interface RemoveMemberButtonProps {
  memberId: string
  disable: boolean
}

export function RemoveMemberButton({
  memberId,
  disable,
}: RemoveMemberButtonProps) {
  const { isPending, execute } = useServerAction(removeMemberAction)
  return (
    <Button
      onClick={() => execute({ memberId })}
      size={'sm'}
      variant={'destructive'}
      disabled={disable || isPending}
    >
      <UserMinus className="mr-2 size-4" />
      Remover
    </Button>
  )
}

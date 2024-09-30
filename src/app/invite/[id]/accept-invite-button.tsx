'use client'
import { acceptInviteAction } from '@/actions/invites/accept-invite-action'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface AcceptInviteButtonProps {
  inviteId: string
  name: string
}

export function AcceptInviteButton({
  inviteId,
  name,
}: AcceptInviteButtonProps) {
  const router = useRouter()
  return (
    <Button
      onClick={async () => {
        const [, acceptErr] = await acceptInviteAction({ inviteId })
        if (acceptErr) {
          console.error(acceptErr)
        } else {
          router.push('/')
        }
      }}
      variant={'secondary'}
      className="w-full"
    >
      <CheckCircle className="mr-2 size-4" />
      Entrar em {name}
    </Button>
  )
}

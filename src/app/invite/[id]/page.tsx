import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { ArrowLeft, LogIn, LogOut } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { getInviteAction } from '@/actions/invites/get-invite-action'
import { isAuthenticated } from '@/app/auth/auth'
import { getProfileAction } from '@/actions/auth/get-profile-action'
import { AcceptInviteButton } from './accept-invite-button'

dayjs.extend(relativeTime)

interface InvitePageProps {
  params: {
    id: string
  }
}
export default async function InvitePage({ params }: InvitePageProps) {
  const inviteId = params.id
  const [inviteData, inviteErr] = await getInviteAction({ inviteId })
  if (inviteErr) {
    console.error(inviteErr)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <p className="text-destructive">Convite não encontrado</p>
      </div>
    )
  }
  const invite = inviteData.invite

  const isUserAuthenticated = isAuthenticated()
  let currentUserEmail = null

  if (isUserAuthenticated) {
    const [profileData, profileErr] = await getProfileAction()
    if (profileErr) {
      console.error(profileErr)
      return
    }
    const user = profileData.user
    currentUserEmail = user.email
  }
  const userIsAuthenticatedWithSameEmailFromInvite =
    currentUserEmail === invite.email

  async function signInFromInvite() {
    'use server'

    cookies().set('inviteId', inviteId)

    redirect(`/sign-in?email=${invite.email}`)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-sm flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="size-16">
            {invite.author?.avatarUrl && (
              <AvatarImage src={invite.author.avatarUrl} />
            )}
            <AvatarFallback />
          </Avatar>

          <p className="text-balance text-center leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">
              {invite.author?.name ?? 'Someone'}
            </span>{' '}
            Convidou você para entrar na empresa{' '}
            <span className="font-medium text-foreground">
              {invite.company.name}
            </span>{' '}
            <span className="text-xs">{dayjs(invite.createdAt).fromNow()}</span>
          </p>
        </div>

        <Separator />

        {!isUserAuthenticated && (
          <form action={signInFromInvite}>
            <Button type="submit" variant={'secondary'} className="w-full">
              <LogIn className="mr-2 size-4" />
              Entre para aceitar o convite
            </Button>
          </form>
        )}

        {userIsAuthenticatedWithSameEmailFromInvite && (
          <AcceptInviteButton inviteId={inviteId} name={invite.company.name} />
        )}

        {isUserAuthenticated && !userIsAuthenticatedWithSameEmailFromInvite && (
          <div className="space-y-4">
            <p className="text-balance text-center text-sm leading-relaxed text-muted-foreground">
              Esse convite foi enviado para{' '}
              <span className="font-medium text-foreground">
                {invite.email}
              </span>{' '}
              mas você está logado como{' '}
              <span className="font-medium text-foreground">
                {currentUserEmail}
              </span>{' '}
            </p>
            <div className="space-y-2">
              <Button className="w-full" variant={'secondary'} asChild>
                <a href={'/api/auth/sign-out'}>
                  <LogOut className="mr-2 size-4" />
                  Sair de {currentUserEmail}
                </a>
              </Button>
              <Button className="w-full" variant={'secondary'} asChild>
                <Link href={'/'}>
                  <ArrowLeft className="mr-2 size-4" />
                  Voltar para o dashboard
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

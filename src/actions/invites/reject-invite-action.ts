'use server'
import { prisma } from '@/lib/prisma'
import { authProcedure } from '../procedures/auth-procedure'
import { z } from 'zod'

export const rejectInviteAction = authProcedure
  .createServerAction()
  .input(
    z.object({
      inviteId: z.string(),
    }),
  )
  .handler(async ({ ctx: { user }, input: { inviteId } }) => {
    const invite = await prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
    })

    if (!invite) {
      throw new Error('Invite not found')
    }
    if (invite.email !== user.email) {
      throw new Error('This invite belongs to another user.')
    }

    await prisma.member.delete({
      where: {
        id: inviteId,
      },
    })
  })

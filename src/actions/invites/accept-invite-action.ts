'use server'
import { prisma } from '@/lib/prisma'
import { authProcedure } from '../procedures/auth-procedure'
import { z } from 'zod'
import { cookies } from 'next/headers'

export const acceptInviteAction = authProcedure
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

    await prisma.$transaction([
      prisma.member.create({
        data: {
          userId: user.id,
          companyId: invite.companyId,
          role: invite.role,
        },
      }),
      prisma.invite.delete({
        where: {
          id: inviteId,
        },
      }),
    ])
    cookies().delete('inviteId')
  })

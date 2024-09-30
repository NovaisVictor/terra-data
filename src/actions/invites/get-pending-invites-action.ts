'use server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { roleSchema } from '../../../casl/roles'
import { authProcedure } from '../procedures/auth-procedure'

export const getPendingInvitesAction = authProcedure
  .createServerAction()
  .output(
    z.object({
      invites: z.array(
        z.object({
          id: z.string().uuid(),
          role: roleSchema,
          email: z.string().email(),
          createdAt: z.date(),
          company: z.object({
            name: z.string(),
          }),
          author: z
            .object({
              id: z.string().uuid(),
              name: z.string().nullable(),
              avatarUrl: z.string().url().nullable(),
            })
            .nullable(),
        }),
      ),
    }),
  )
  .handler(async ({ ctx: { user } }) => {
    const invites = await prisma.invite.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
        company: {
          select: {
            name: true,
          },
        },
      },
      where: {
        email: user.email,
      },
    })

    if (!invites) {
      throw new Error('Invite not found')
    }

    return { invites }
  })

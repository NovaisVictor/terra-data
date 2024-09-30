'use server'
import { prisma } from '@/lib/prisma'

import { z } from 'zod'
import { roleSchema } from '../../../casl/roles'
import { createServerAction } from 'zsa'

export const getInviteAction = createServerAction()
  .input(
    z.object({
      inviteId: z.string().uuid(),
    }),
  )
  .output(
    z.object({
      invite: z.object({
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
    }),
  )
  .handler(async ({ input: { inviteId } }) => {
    const invite = await prisma.invite.findUnique({
      where: {
        id: inviteId,
      },
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
    })

    if (!invite) {
      throw new Error('Invite not found')
    }

    return { invite }
  })

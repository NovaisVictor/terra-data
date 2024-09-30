'use server'

import { prisma } from '@/lib/prisma'
import { authProcedure } from '../procedures/auth-procedure'

import { z } from 'zod'

export const getProfileAction = authProcedure
  .createServerAction()
  .output(
    z.object({
      user: z.object({
        id: z.string(),
        name: z.string().nullable(),
        email: z.string(),
        avatarUrl: z.string().nullable(),
        isAdmin: z.boolean(),
      }),
    }),
  )
  .handler(async ({ ctx }) => {
    const { user } = ctx

    const userFiltered = await prisma.user.findFirst({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        isAdmin: true,
      },
    })

    if (!userFiltered) {
      throw new Error('User not exists')
    }
    return { user: userFiltered }
  })

'use server'

import { prisma } from '@/lib/prisma'
import { authProcedure } from '../procedures/auth-procedure'
import { z } from 'zod'

export const getCompaniesAction = authProcedure
  .createServerAction()
  .output(
    z.object({
      companies: z.array(
        z.object({
          id: z.string().uuid(),
          name: z.string(),
          slug: z.string(),
          cnpj: z.string(),
          avatarUrl: z.string().nullable(),
        }),
      ),
    }),
  )
  .handler(async ({ ctx: { user } }) => {
    if (user.isAdmin) {
      const companies = await prisma.company.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          cnpj: true,
          avatarUrl: true,
        },
      })
      return { companies }
    }

    const companies = await prisma.company.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        cnpj: true,
        avatarUrl: true,
      },
      where: {
        members: {
          some: {
            userId: user.id,
          },
        },
      },
    })

    return { companies }
  })

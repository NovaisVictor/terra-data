'use server'

import { prisma } from '@/lib/prisma'
import { authProcedure } from '../procedures/auth-procedure'

import { getCurrentCo } from '@/app/auth/auth'
import { z } from 'zod'

export const getCompanyAction = authProcedure
  .createServerAction()
  .output(
    z.object({
      company: z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        cnpj: z.string(),
        ownerId: z.string().nullable(),
        avatarUrl: z.string().nullable(),
      }),
    }),
  )
  .handler(async () => {
    const currentCo = getCurrentCo()!
    const company = await prisma.company.findFirst({
      select: {
        id: true,
        name: true,
        slug: true,
        cnpj: true,
        avatarUrl: true,
        ownerId: true,
      },
      where: {
        slug: currentCo,
      },
    })

    if (!company) {
      throw new Error('Empresa não encontrada')
    }

    return { company }
  })

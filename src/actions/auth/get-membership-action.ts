'use server'
import { prisma } from '@/lib/prisma'
import { authProcedure } from '../procedures/auth-procedure'
import { z } from 'zod'
import { roleSchema } from '../../../casl/roles'
import { getCurrentCo } from '@/app/auth/auth'
import type { inferServerActionReturnData } from 'zsa'

export const getUserMembershipAction = authProcedure
  .createServerAction()
  .output(
    z.object({
      company: z.object({
        id: z.string(),
        name: z.string(),
        cnpj: z.string(),
        slug: z.string(),
        avatarUrl: z.string().nullable(),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
      membership: z.object({
        id: z.string(),
        companyId: z.string(),
        userId: z.string(),
        role: roleSchema,
      }),
    }),
  )
  .handler(async ({ ctx: { user } }) => {
    const slug = getCurrentCo()!

    const member = await prisma.member.findFirst({
      where: {
        userId: user.id,
        company: {
          slug,
        },
      },
      include: {
        company: true,
      },
    })

    if (!member) {
      throw new Error(`You're not a member of this company.`)
    }

    const { company, ...membership } = member

    return { company, membership }
  })

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type getUserMembershipActionReturnData = inferServerActionReturnData<
  typeof getUserMembershipAction
>

'use server'
import { prisma } from '@/lib/prisma'

import { z } from 'zod'

import { getUserPermissions } from '@/utils/get-user-permissions'
import { roleSchema } from '../../../casl/roles'
import { membershipProcedure } from '../procedures/membership-procedure'

export const getInvitesAction = membershipProcedure
  .createServerAction()
  .output(
    z.object({
      invites: z.array(
        z.object({
          id: z.string().uuid(),
          role: roleSchema,
          email: z.string().email(),
          createdAt: z.date(),
          author: z
            .object({
              id: z.string().uuid(),
              name: z.string().nullable(),
            })
            .nullable(),
        }),
      ),
    }),
  )
  .handler(async ({ ctx: { membership, company, user } }) => {
    const { cannot } = getUserPermissions(user.id, membership.role)

    if (cannot('get', 'Invite')) {
      throw new Error(`You're not allowed to get company invites.`)
    }

    const invites = await prisma.invite.findMany({
      where: { companyId: company.id },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return { invites }
  })

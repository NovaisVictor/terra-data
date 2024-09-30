'use server'

import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { z } from 'zod'
import { revalidateTag } from 'next/cache'
import { membershipProcedure } from '../procedures/membership-procedure'

export const removeMemberAction = membershipProcedure
  .createServerAction()
  .input(
    z.object({
      memberId: z.string(),
    }),
  )
  .handler(
    async ({ input: { memberId }, ctx: { company, membership, user } }) => {
      const { cannot } = getUserPermissions(user.id, membership.role)

      if (cannot('delete', 'User')) {
        throw new Error(
          `You're not allowed to remove this member from the company.`,
        )
      }

      await prisma.member.delete({
        where: { id: memberId, companyId: company.id },
      })
      revalidateTag(`${company.slug}/members`)
    },
  )

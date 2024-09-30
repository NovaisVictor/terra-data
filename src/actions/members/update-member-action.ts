'use server'

import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'

import { z } from 'zod'
import { roleSchema } from '../../../casl/roles'
import { revalidateTag } from 'next/cache'
import { membershipProcedure } from '../procedures/membership-procedure'

export const updateMembersAction = membershipProcedure
  .createServerAction()
  .input(
    z.object({
      memberId: z.string(),
      role: roleSchema,
    }),
  )
  .handler(async ({ input, ctx }) => {
    const { cannot } = getUserPermissions(ctx.user.id, ctx.membership.role)

    if (cannot('update', 'User')) {
      throw new Error(`You're not allowed to update this member.`)
    }

    await prisma.member.update({
      where: { id: input.memberId, companyId: ctx.company.id },
      data: { role: input.role },
    })
    revalidateTag(`${ctx.company.slug}/members`)
  })

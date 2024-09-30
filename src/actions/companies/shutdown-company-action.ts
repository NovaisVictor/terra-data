'use server'
import { prisma } from '@/lib/prisma'

import { membershipProcedure } from '../procedures/membership-procedure'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { revalidateTag } from 'next/cache'

export const shutdownCompanyAction = membershipProcedure
  .createServerAction()
  .handler(async ({ ctx: { membership, company, user } }) => {
    const { cannot } = getUserPermissions(user.id, membership.role)
    console.log(company.slug)
    if (cannot('delete', 'Company')) {
      throw new Error(`You're not allowed to dele an company.`)
    }

    await prisma.company.delete({
      where: {
        id: company.id,
      },
    })
    revalidateTag('companies')
  })

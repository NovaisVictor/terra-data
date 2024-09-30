'use server'

import { prisma } from '@/lib/prisma'
import { getUserPermissions } from '@/utils/get-user-permissions'
import { membershipProcedure } from '../procedures/membership-procedure'

export const getMembersAction = membershipProcedure
  .createServerAction()
  .handler(async ({ ctx: { company, membership, user } }) => {
    const { cannot } = getUserPermissions(user.id, membership.role)

    if (cannot('get', 'User')) {
      throw new Error(`You're not allowed to see company members.`)
    }

    const members = await prisma.member.findMany({
      select: {
        id: true,
        role: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
      where: { companyId: company.id },
      orderBy: {
        role: 'asc',
      },
    })

    const membersWithRoles = members.map(
      ({ user: { id: userId, ...user }, ...member }) => {
        return {
          ...user,
          ...member,
          userId,
        }
      },
    )

    return { members: membersWithRoles }
  })

'use server'
import { prisma } from '@/lib/prisma'

import { z } from 'zod'

import { getUserPermissions } from '@/utils/get-user-permissions'
import { revalidateTag } from 'next/cache'
import { membershipProcedure } from '../procedures/membership-procedure'

export const revokeInviteAction = membershipProcedure
  .createServerAction()
  .input(
    z.object({
      inviteId: z.string(),
    }),
  )
  .handler(
    async ({ ctx: { membership, company, user }, input: { inviteId } }) => {
      const { cannot } = getUserPermissions(user.id, membership.role)

      if (cannot('delete', 'Invite')) {
        throw new Error(`You're not allowed to dele an invite.`)
      }

      const invite = await prisma.invite.findUnique({
        where: {
          id: inviteId,
          companyId: company.id,
        },
      })

      if (!invite) {
        throw new Error('Invite not found.')
      }

      await prisma.invite.delete({
        where: {
          id: inviteId,
        },
      })
      revalidateTag(`${company.slug}/invites`)
    },
  )

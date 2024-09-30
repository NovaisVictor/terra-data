'use server'
import { prisma } from '@/lib/prisma'

import { z } from 'zod'

import { getUserPermissions } from '@/utils/get-user-permissions'
import { roleSchema } from '../../../casl/roles'
import { revalidateTag } from 'next/cache'
import { membershipProcedure } from '../procedures/membership-procedure'

export const createInviteAction = membershipProcedure
  .createServerAction()
  .input(
    z.object({
      email: z.string().email(),
      role: roleSchema,
    }),
    {
      type: 'formData',
    },
  )
  .output(z.object({ inviteId: z.string().uuid() }))
  .handler(
    async ({ ctx: { membership, company, user }, input: { email, role } }) => {
      const { cannot } = getUserPermissions(user.id, membership.role)

      if (cannot('create', 'Invite')) {
        throw new Error(`You're not allowed to create new invites.`)
      }

      const inviteWithSameEmail = await prisma.invite.findUnique({
        where: {
          email_companyId: {
            email,
            companyId: company.id,
          },
        },
      })

      if (inviteWithSameEmail) {
        throw new Error('Another invite with same e-mail already exists.')
      }

      const memberWithSameEmail = await prisma.member.findFirst({
        where: {
          companyId: company.id,
          user: {
            email,
          },
        },
      })

      if (memberWithSameEmail) {
        throw new Error(
          'A member with this e-mail already belongs to your company.',
        )
      }

      const invite = await prisma.invite.create({
        data: {
          companyId: company.id,
          email,
          role,
          authorId: user.id,
        },
      })

      revalidateTag(`${company.slug}/invites`)

      return { inviteId: invite.id }
    },
  )

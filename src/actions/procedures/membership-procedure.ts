import { createServerActionProcedure } from 'zsa'
import { authProcedure } from './auth-procedure'
import { prisma } from '@/lib/prisma'
import { getCurrentCo } from '@/app/auth/auth'

export const membershipProcedure = createServerActionProcedure(
  authProcedure,
).handler(async ({ ctx: { user } }) => {
  const slug = getCurrentCo()!

  if (!slug) {
    throw new Error('Company not found')
  }

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
    throw new Error(`You're not a member of this organization.`)
  }
  const { company, ...membership } = member

  return { company, membership, user }
})

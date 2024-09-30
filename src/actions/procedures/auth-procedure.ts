import { prisma } from '@/lib/prisma'
import { verify } from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { env } from 'process'
import { createServerActionProcedure } from 'zsa'

export const authProcedure = createServerActionProcedure().handler(async () => {
  const token = cookies().get('token')?.value
  if (!token) {
    throw new Error('Token not found')
  }

  try {
    const { sub } = verify(token, env.JWT_SECRET!)

    if (!sub) {
      throw new Error('User not found')
    }

    const user = await prisma.user.findFirst({
      where: {
        id: sub.toString(),
      },
    })

    if (!user) {
      throw new Error('User not found')
    }
    return { user }
  } catch (error) {
    redirect('/api/auth/sign-out')
  }
})

'use server'

import { createServerAction } from 'zsa'
import z from 'zod'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'
import { env } from 'process'
// import { acceptInviteAction } from '../invites/accept-invite-action'

export const signInAction = createServerAction()
  .input(
    z.object({
      email: z
        .string()
        .email({ message: 'Please, provide a valid e-mail address.' }),
      password: z
        .string()
        .min(1, { message: 'Please, provide your password.' }),
    }),
    {
      type: 'formData',
    },
  )
  .handler(async ({ input: { email, password } }) => {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    })

    if (!user) {
      throw new Error('Credenciais invalidas')
    }

    const isPasswordValid = await compare(password, user.passwordHash)

    if (!isPasswordValid) {
      throw new Error('Credenciais invalidas')
    }
    const token = sign({ sub: user.id }, env.JWT_SECRET!)

    cookies().set('token', token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    // const inviteId = cookies().get('inviteId')?.value

    // if (inviteId) {
    //   await acceptInviteAction({ inviteId })
    //   cookies().delete('inviteId')
    // }
  })

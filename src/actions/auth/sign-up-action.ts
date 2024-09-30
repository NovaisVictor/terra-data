'use server'

import { createServerAction } from 'zsa'
import z from 'zod'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export const signUpAction = createServerAction()
  .input(
    z
      .object({
        name: z.string(),
        email: z
          .string()
          .email({ message: 'Please, provide a valid e-mail address.' }),
        password: z
          .string()
          .min(6, { message: 'Please, provide your password.' }),
        password_confirmation: z.string(),
        avatarUrl: z.string().nullish(),
      })
      .refine((data) => data.password === data.password_confirmation, {
        message: 'Password confirmation does not match.',
        path: ['password_confirmation'],
      }),
    {
      type: 'formData',
    },
  )
  .handler(async ({ input: { name, email, password, avatarUrl } }) => {
    const userWithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (userWithSameEmail) {
      throw new Error('User with this e-mail already exists.')
    }

    const passwordHash = await hash(password, 6)

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        avatarUrl,
      },
    })
  })

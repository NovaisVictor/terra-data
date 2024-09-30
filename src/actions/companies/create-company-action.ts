'use server'

import { revalidateTag } from 'next/cache'

import { createSlug } from '@/utils/create-slug'
import { prisma } from '@/lib/prisma'
import { authProcedure } from '../procedures/auth-procedure'
import { companySchema } from './company-schema'
import { z } from 'zod'

export const createCompanyAction = authProcedure
  .createServerAction()
  .input(companySchema, {
    type: 'formData',
  })
  .output(
    z.object({
      slug: z.string(),
    }),
  )
  .handler(async ({ input: { name, cnpj }, ctx }) => {
    const { user } = ctx
    const slug = createSlug(name)

    if (!user.isAdmin) {
      throw new Error('You not allowed to create one company')
    }

    const sameCnpjCompany = await prisma.company.findFirst({
      where: {
        cnpj,
      },
    })

    if (sameCnpjCompany) {
      throw new Error('Company with this cnpj already exists')
    }

    const company = await prisma.company.create({
      data: {
        name,
        cnpj,
        slug,
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: 'SUPER_ADMIN',
          },
        },
      },
    })
    revalidateTag('companies')
    return { slug: company.slug }
  })

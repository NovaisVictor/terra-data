'use server'

import { revalidateTag } from 'next/cache'

import { prisma } from '@/lib/prisma'
import { authProcedure } from '../procedures/auth-procedure'

import { getCurrentCo } from '@/app/auth/auth'
import { companySchema } from './company-schema'

export const updateCompanyAction = authProcedure
  .createServerAction()
  .input(companySchema, {
    type: 'formData',
  })
  .handler(async ({ input: { name, cnpj } }) => {
    const currentCo = getCurrentCo()!

    const sameCnpjCompany = await prisma.company.findFirst({
      where: {
        cnpj,
      },
    })

    if (sameCnpjCompany) {
      throw new Error('Company with this cnpj already exists')
    }

    await prisma.company.update({
      data: {
        name,
        cnpj,
      },
      where: {
        slug: currentCo,
      },
    })

    revalidateTag('companies')
  })

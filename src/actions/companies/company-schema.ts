import { z } from 'zod'
// import { cnpj } from 'cpf-cnpj-validator'

export const companySchema = z.object({
  name: z
    .string()
    .min(4, { message: 'Por favor, insira ao menos 4 caracteres.' }),
  cnpj: z.string({
    required_error: 'CNPJ é obrigatório.',
  }),
  // .refine(
  //   (data) => {
  //     const cleanCnpj = data.replace(/\D/g, '')
  //     const isValid = cnpj.isValid(cleanCnpj)
  //     return isValid
  //   },
  //   {
  //     message: 'Por favor, insira um cnpj válido.',
  //     path: ['cnpj'],
  //   },
  // ),
})

export type CompanySchema = z.infer<typeof companySchema>

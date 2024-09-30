import { z } from 'zod'

export const tableSchema = z.object({
  __typename: z.literal('Table').default('Table'),
  id: z.string(),
  ownerId: z.string(),
})
export type Tables = z.infer<typeof tableSchema>

import { z } from 'zod'

import { tableSchema } from '../models/table'

export const tableSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('transfer_ownership'),
  ]),
  z.union([z.literal('Table'), tableSchema]),
])

export type TableSubject = z.infer<typeof tableSubject>

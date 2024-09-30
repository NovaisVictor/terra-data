import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import type { User } from './models/user'
import type { Role } from './roles'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  SUPER_ADMIN: function (_, { can }) {
    can('manage', 'all')
  },
  ADMIN(user: User, { can, cannot }) {
    can('manage', 'all')

    cannot(['transfer_ownership', 'update', 'create', 'delete'], 'Company')
    cannot(['transfer_ownership', 'update'], 'Company')
    can(['transfer_ownership', 'update'], 'Company', {
      ownerId: { $eq: user.id },
    })
  },
  MEMBER(_, { can }) {
    can('get', 'User')
    can('get', 'Table')
    can('get', 'Company')
    // can(['update', 'delete'], 'Table', { ownerId: { $eq: user.id } })
  },
}

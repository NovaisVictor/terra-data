import { defineAbilityFor } from '../../casl'
import { userSchema } from '../../casl/models/user'
import type { Role } from '../../casl/roles'

export function getUserPermissions(userId: string, role: Role) {
  const authUser = userSchema.parse({
    id: userId,
    role,
  })

  const ability = defineAbilityFor(authUser)

  ability.can = ability.can.bind(ability)
  ability.cannot = ability.cannot.bind(ability)
  return ability
}

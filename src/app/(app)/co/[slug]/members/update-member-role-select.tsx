'use client'

import type { ComponentProps } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Role } from '../../../../../../casl/roles'
import { updateMembersAction } from '@/actions/members/update-member-action'

interface UpdateMemberRoleSelectProps extends ComponentProps<typeof Select> {
  memberId: string
}
export function UpdateMemberRoleSelect({
  memberId,
  ...props
}: UpdateMemberRoleSelectProps) {
  async function updateMemberRole(role: Role) {
    await updateMembersAction({ memberId, role })
  }
  return (
    <Select onValueChange={updateMemberRole} {...props}>
      <SelectTrigger className="h-8 w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="MEMBER">Membro</SelectItem>
      </SelectContent>
    </Select>
  )
}

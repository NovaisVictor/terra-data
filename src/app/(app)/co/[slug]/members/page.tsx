import { ability } from '@/app/auth/auth'
import { MemberList } from './member-list'
import { Invites } from './invites'

export default async function MembersPage() {
  const permissions = await ability()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Membros</h1>

      <div className="space-y-4">
        {permissions?.can('get', 'Invite') && <Invites />}
        {permissions?.can('get', 'User') && <MemberList />}
      </div>
    </div>
  )
}

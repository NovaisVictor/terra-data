import { getInvitesAction } from '@/actions/invites/get-invites-action'
import { ability } from '@/app/auth/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { RevokeInviteButton } from './revoke-invite-button'
import { CreateInviteForm } from './create-invite-form'

export async function Invites() {
  const permissions = await ability()

  const [data, err] = await getInvitesAction()

  if (err) {
    console.error(err)
    return
  }
  return (
    <div className="space-y-4">
      {permissions?.can('create', 'Invite') && (
        <Card>
          <CardHeader>
            <CardTitle>Convidar usuário</CardTitle>
          </CardHeader>
          <CardContent>
            <CreateInviteForm />
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Invites</h2>
        <div className="rounded border">
          <Table>
            <TableBody>
              {data.invites.map((invite) => {
                return (
                  <TableRow key={invite.id}>
                    <TableCell className="py-2.5">
                      <span className="text-muted-foreground">
                        {invite.email}
                      </span>
                    </TableCell>
                    <TableCell className="py-2.5 text-center">
                      {invite.role}
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex justify-end">
                        {permissions?.can('delete', 'Invite') && (
                          <RevokeInviteButton inviteId={invite.id} />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
              {data.invites.length === 0 && (
                <TableRow>
                  <TableCell className="text-center text-muted-foreground">
                    Nenhum convite encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

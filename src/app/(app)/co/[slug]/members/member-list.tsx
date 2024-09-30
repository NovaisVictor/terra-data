import { ability } from '@/app/auth/auth'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { ArrowLeftRight, Crown } from 'lucide-react'
import Image from 'next/image'
import { companySchema } from '../../../../../../casl/models/company'
import { getUserMembershipAction } from '@/actions/auth/get-membership-action'
import { getCompanyAction } from '@/actions/companies/get-company-action'
import { getMembersAction } from '@/actions/members/get-members-action'
import { RemoveMemberButton } from './remove-member-button'
import { UpdateMemberRoleSelect } from './update-member-role-select'

export async function MemberList() {
  const permissions = await ability()
  // const [{ membership }, { members }, { company }] = await Promise.all([
  //   getMembership(currentOrg!),
  //   getMembers(currentOrg!),
  //   getCompany(currentOrg!),
  // ])

  const [membershipData] = await getUserMembershipAction()
  const [companyData] = await getCompanyAction()
  const [membersData] = await getMembersAction()
  // const { isPending, execute } = useServerAction(removeMemberAction)

  const authCompany = companySchema.parse(companyData?.company)

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Membros</h2>
      <div className="rounded border">
        <Table>
          <TableBody>
            {membersData?.members.map((member) => {
              return (
                <TableRow key={member.id}>
                  <TableCell className="py-2.5" style={{ width: 40 }}>
                    <Avatar>
                      <AvatarFallback />
                      {member.avatarUrl && (
                        <Image
                          src={member.avatarUrl}
                          width={32}
                          height={32}
                          alt=""
                          className="aspect-square size-full"
                        />
                      )}
                    </Avatar>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex flex-col">
                      <span className="inline-flex items-center gap-2 font-medium">
                        {member.name}
                        {member.userId === membershipData?.membership.userId &&
                          ' (eu)'}
                        {companyData?.company.ownerId === member.userId && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Crown className="size-3" />
                            Proprietário
                          </span>
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {member.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-2.5">
                    <div className="flex items-center justify-end gap-2">
                      {permissions?.can('transfer_ownership', authCompany) && (
                        <Button size={'sm'} variant={'ghost'}>
                          <ArrowLeftRight className="mr-2 size-4" />
                          Transferir propriedade
                        </Button>
                      )}
                      <UpdateMemberRoleSelect
                        memberId={member.id}
                        value={member.role}
                        disabled={
                          member.userId === membershipData?.membership.userId ||
                          member.userId === companyData?.company.ownerId ||
                          permissions?.cannot('update', 'User')
                        }
                      />
                      {permissions?.can('delete', 'User') && (
                        <RemoveMemberButton
                          disable={
                            member.userId ===
                              membershipData?.membership.userId ||
                            member.userId === companyData?.company.ownerId
                          }
                          memberId={member.id}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

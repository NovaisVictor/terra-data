import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { CompanyForm } from '@/app/(app)/create-company/company-form'
import { getCompanyAction } from '@/actions/companies/get-company-action'
import { ability } from '@/app/auth/auth'
import { ShutdownCompanyButton } from './shutdown-company-button'

export default async function Settings() {
  const [data, err] = await getCompanyAction()

  if (err) {
    console.error(err.data)
    return
  }
  const permissions = await ability()

  const canUpdateCompany = permissions?.can('update', 'Company')
  const canShutdownCompany = permissions?.can('delete', 'Company')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <div className="space-y-4">
        {canUpdateCompany && (
          <Card>
            <CardHeader>
              <CardTitle>Configurações da empresa</CardTitle>
              <CardDescription>Atualize os detalhes da empresa</CardDescription>
            </CardHeader>
            <CardContent>
              <CompanyForm
                initialData={{
                  name: data.company.name,
                  cnpj: data.company.cnpj,
                }}
                isUpdating
              />
            </CardContent>
          </Card>
        )}

        {canShutdownCompany && (
          <Card>
            <CardHeader>
              <CardTitle>Deletar empresa</CardTitle>
              <CardDescription>
                Isso vai excluir todos os registros da empresa, incluindo as
                Tabelas. Você não pode desfazer essa ação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ShutdownCompanyButton />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

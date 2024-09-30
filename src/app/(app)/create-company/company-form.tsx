'use client'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { createCompanyAction } from '@/actions/companies/create-company-action'
import { updateCompanyAction } from '@/actions/companies/update-company-action'
import { useServerAction } from 'zsa-react'
import { toast } from 'sonner'
import type { CompanySchema } from '@/actions/companies/company-schema'
import { redirect } from 'next/navigation'

interface CompanyFormProps {
  isUpdating?: boolean
  initialData?: CompanySchema
}

export function CompanyForm({
  isUpdating = false,
  initialData,
}: CompanyFormProps) {
  const formAction = isUpdating ? updateCompanyAction : createCompanyAction

  const { isPending, executeFormAction, error } = useServerAction(formAction, {
    onSuccess({ data }) {
      toast.success(
        isUpdating
          ? 'Empresa atualizada com sucesso'
          : 'Empresa criada com sucesso',
      )
      if (!isUpdating) {
        redirect(`/co/${data.slug}`)
      }
    },
    onError({ err }) {
      toast.error(`${err.message}`)
    },
  })

  return (
    <form action={executeFormAction} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">Nome</Label>
        <Input
          name="name"
          type="text"
          id="name"
          defaultValue={initialData?.name}
        />
        {error?.fieldErrors?.name && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {error.fieldErrors.name}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <Label htmlFor="cnpj">CNPJ</Label>
        <Input
          name="cnpj"
          type="text"
          id="cnpj"
          defaultValue={initialData?.cnpj}
        />
        {error?.fieldErrors?.cnpj && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {error.fieldErrors.cnpj}
          </p>
        )}
      </div>
      <Button className="w-full" type="submit" disabled={isPending}>
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Salvar empresa'
        )}
      </Button>
    </form>
  )
}

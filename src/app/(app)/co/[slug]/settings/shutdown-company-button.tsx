'use client'
import { Loader2, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { shutdownCompanyAction } from '@/actions/companies/shutdown-company-action'
import { useServerAction } from 'zsa-react'
import { toast } from 'sonner'
import { redirect } from 'next/navigation'

export function ShutdownCompanyButton() {
  const { isPending, execute } = useServerAction(shutdownCompanyAction, {
    onError(err) {
      toast.error(`Server action error: ${err.err.message}`)
    },
    onSuccess: () => {
      toast.success('Empresa deletada com sucesso')
      redirect('/')
    },
  })

  return (
    <Button
      onClick={() => execute()}
      type="submit"
      variant={'destructive'}
      className="w-56"
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin" />
        </>
      ) : (
        <>
          <XCircle className="mr-4 size-4" />
          Deletar empresa
        </>
      )}
    </Button>
  )
}

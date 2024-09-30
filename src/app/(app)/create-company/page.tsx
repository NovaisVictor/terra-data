import { Header } from '@/components/header'

import { CompanyForm } from './company-form'

export default function CreateCompany() {
  return (
    <div className="space-y-4 py-4">
      <Header />
      <main className="mx-auto w-full max-w-[1200px] space-y-4">
        <h1 className="text-2xl font-bold">Cadastrar empresa</h1>
        <CompanyForm />
      </main>
    </div>
  )
}

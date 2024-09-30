import { InterceptedSheetContent } from '@/components/intercepted-sheet-content'
import { Sheet, SheetHeader, SheetTitle } from '@/components/ui/sheet'

import { CompanyForm } from '../../create-company/company-form'

export default function CreateCompany() {
  return (
    <Sheet>
      <InterceptedSheetContent>
        <SheetHeader>
          <SheetTitle>Cadastrar empresa</SheetTitle>
        </SheetHeader>

        <div className="py-4">
          <CompanyForm />
        </div>
      </InterceptedSheetContent>
    </Sheet>
  )
}

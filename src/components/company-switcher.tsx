import { ChevronsUpDown, CircleFadingPlus } from 'lucide-react'
import Link from 'next/link'

import { getCurrentCo } from '@/app/auth/auth'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { getInitials } from '@/utils/get-initials'
import { getCompaniesAction } from '@/actions/companies/get-companies-action'
import { getProfileAction } from '@/actions/auth/get-profile-action'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { CompanyForm } from '@/app/(app)/create-company/company-form'
import { Button } from './ui/button'

export async function CompanySwitcher() {
  const currentCo = getCurrentCo()

  const [profileData, errProfile] = await getProfileAction()
  if (errProfile) {
    return
  }

  const [companiesData, errCompanies] = await getCompaniesAction()
  if (errCompanies) {
    return
  }
  const companies = companiesData.companies
  const currentCompany = companies.find((company) => company.slug === currentCo)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-10 p-1.5 flex w-[184px] items-center gap-2 rounded-md text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-primary">
        {currentCompany ? (
          <>
            <Avatar className="mr-1 size-6">
              {currentCompany.avatarUrl && (
                <AvatarImage src={currentCompany.avatarUrl} />
              )}
              <AvatarFallback>
                {getInitials(currentCompany.name)}
              </AvatarFallback>
            </Avatar>
            <span className="truncate text-left">{currentCompany.name}</span>
          </>
        ) : (
          <span className="text-muted-foreground">Selecionar cliente</span>
        )}
        <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        alignOffset={-16}
        sideOffset={12}
        className="w-[200px]"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>Clientes</DropdownMenuLabel>
          {companies.map((company) => {
            return (
              <DropdownMenuItem key={company.id} asChild>
                <Link href={`/co/${company.slug}`}>
                  <Avatar className="mr-2 size-4">
                    {company.avatarUrl && (
                      <AvatarImage src={company.avatarUrl} />
                    )}
                    <AvatarFallback>{getInitials(company.name)}</AvatarFallback>
                  </Avatar>
                  <span className="truncate">{company.name}</span>
                </Link>
              </DropdownMenuItem>
            )
          })}

          {profileData.user.isAdmin && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant={'link'} className="text-foreground px-2">
                      <CircleFadingPlus className="mr-2 size-4" />
                      Cadastrar nova
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Cadastrar novo cliente</SheetTitle>
                    </SheetHeader>

                    <div className="py-4">
                      <CompanyForm />
                    </div>
                  </SheetContent>
                </Sheet>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

import { ability, getCurrentCo } from '@/app/auth/auth'
import { NavLink } from './nav-link'
import { Button } from './ui/button'

export async function Tabs() {
  const currentCo = getCurrentCo()!
  const permissions = await ability()

  return (
    <div>
      <nav className="flex items-center gap-2">
        <Button
          variant={'ghost'}
          size={'default'}
          className="border border-transparent text-muted-foreground data-[current=true]:text-foreground"
          asChild
        >
          <NavLink href={`/co/${currentCo}`}>Dashboard</NavLink>
        </Button>

        {permissions?.can('get', 'User') && (
          <Button
            variant={'ghost'}
            size={'default'}
            className="border border-transparent text-muted-foreground data-[current=true]:text-foreground"
            asChild
          >
            <NavLink href={`/co/${currentCo}/members`}>Membros</NavLink>
          </Button>
        )}

        {permissions?.can('manage', 'Company') && (
          <Button
            variant={'ghost'}
            size={'default'}
            className="border border-transparent text-muted-foreground data-[current=true]:text-foreground"
            asChild
          >
            <NavLink href={`/co/${currentCo}/settings`}>Configurações</NavLink>
          </Button>
        )}
      </nav>
    </div>
  )
}

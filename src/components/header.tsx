import { getCurrentCo } from '@/app/auth/auth'
import { CompanySwitcher } from './company-switcher'
import { PendingInvites } from './pending-invites'
import { ProfileButton } from './profile-button'
import { Tabs } from './tabs'
import { ThemeToggle } from './theme/theme-toggle'
import { Separator } from './ui/separator'

export function Header() {
  const currentCo = getCurrentCo()
  return (
    <div className="mx-auto flex max-w-[1200px] items-center justify-between border-b py-4">
      <div className="flex gap-4 items-center">
        <CompanySwitcher />
        {currentCo && <Tabs />}
      </div>
      <div className="flex items-center space-x-4">
        <PendingInvites />
        <ThemeToggle />
        <Separator orientation="vertical" className="h-5" />
        <ProfileButton />
      </div>
    </div>
  )
}

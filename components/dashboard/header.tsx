'use client'

import { UserMenu } from './user-menu'
import { AssistantSwitcher } from './assistant-switcher'
import { NotificationDropdown } from './notification-dropdown'

export function Header() {

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <AssistantSwitcher />
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown />
        <UserMenu />
      </div>
    </header>
  )
}
'use client'

import { useSession } from 'next-auth/react'
import { Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserMenu } from './user-menu'

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div>

      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <Bell className="w-5 h-5" />
        </Button>
        <UserMenu />
      </div>
    </header>
  )
}
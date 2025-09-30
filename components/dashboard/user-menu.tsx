'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Settings, 
  Key, 
  LogOut, 
  ChevronDown 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar } from '@/components/ui/avatar'

export function UserMenu() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut({ 
      callbackUrl: '/login',
      redirect: true 
    })
  }

  const handleSettings = () => {
    router.push('/settings')
    setIsOpen(false)
  }

  const handlePasswordChange = () => {
    // Voor nu navigeren naar settings, later kan dit een aparte pagina worden
    router.push('/settings')
    setIsOpen(false)
  }

  if (!session?.user) {
    return null
  }

  const userInitials = session.user.name
    ? session.user.name
        .split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="flex items-center gap-2 px-3 py-2 h-auto"
        >
          <Avatar className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
            {session.user.image ? (
              <img 
                src={session.user.image} 
                alt={session.user.name || 'User'} 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span>{userInitials}</span>
            )}
          </Avatar>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900">
              {session.user.name}
            </span>
            <span className="text-xs text-gray-500">
              {session.user.email}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        align="end" 
        className="w-56 mt-2"
        sideOffset={8}
      >
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-gray-900">
            {session.user.name}
          </p>
          <p className="text-xs text-gray-500">
            {session.user.email}
          </p>
        </div>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSettings}
          className="cursor-pointer"
        >
          <Settings className="w-4 h-4 mr-2" />
          Instellingen
        </DropdownMenuItem>
        
        <DropdownMenuItem 
          onClick={handlePasswordChange}
          className="cursor-pointer"
        >
          <Key className="w-4 h-4 mr-2" />
          Wachtwoord wijzigen
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Uitloggen
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

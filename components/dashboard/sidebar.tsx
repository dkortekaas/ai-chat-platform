'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  Settings, 
  BarChart3,
  Bot,
  Database,
  Bell,
  Shield,
  Users,
  CreditCard
} from 'lucide-react'

const baseNavigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Assistants', href: '/assistants', icon: Bot },
  { name: 'Kennisbank', href: '/kennisbank', icon: Database },
  { name: 'Gesprekken', href: '/conversations', icon: MessageSquare },
  { name: 'Notificaties', href: '/notifications', icon: Bell },
  { name: 'Instellingen', href: '/settings', icon: Settings },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
]

const superuserNavigation = [
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { name: 'Admin Notificaties', href: '/admin/notifications', icon: Shield },
]

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  
  // Different navigation based on user role
  const navigation = session?.user?.role === 'SUPERUSER' 
    ? [
        { name: 'Dashboard', href: '/', icon: LayoutDashboard },
        { name: 'Assistants', href: '/assistants', icon: Bot },
        { name: 'Analytics', href: '/analytics', icon: BarChart3 },
        ...superuserNavigation
      ]
    : baseNavigation

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center">
          <Bot className="h-8 w-8 text-indigo-500" />
          <span className="ml-2 text-xl font-semibold text-gray-900">
            AI Chat
          </span>
        </div>
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" className="-mx-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== '/' && pathname.startsWith(item.href))
                  
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          isActive
                            ? 'bg-gray-50 text-indigo-500'
                            : 'text-gray-700 hover:text-indigo-500 hover:bg-gray-50',
                          'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive ? 'text-indigo-500' : 'text-gray-400 group-hover:text-indigo-500',
                            'h-6 w-6 shrink-0'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}

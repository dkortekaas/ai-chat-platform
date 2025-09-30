import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Upload, Settings, BarChart3 } from 'lucide-react'

const actions = [
  {
    title: 'Document toevoegen',
    description: 'Upload een nieuw document voor je kennisbank',
    href: '/dashboard/documents',
    icon: Upload,
    color: 'bg-blue-500'
  },
  {
    title: 'Chatbot aanpassen',
    description: 'Pas de instellingen van je chatbot aan',
    href: '/dashboard/settings',
    icon: Settings,
    color: 'bg-green-500'
  },
  {
    title: 'Analytics bekijken',
    description: 'Bekijk de prestaties van je chatbot',
    href: '/dashboard/analytics',
    icon: BarChart3,
    color: 'bg-purple-500'
  }
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Snelle acties</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {actions.map((action) => (
            <Link key={action.title} href={action.href}>
              <div className="group relative rounded-lg border p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3">
                  <div className={`rounded-lg p-2 ${action.color}`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {action.description}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

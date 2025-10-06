'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

// Import tab components
import { PersonalDetailsTab } from '@/components/account/personal-details-tab'
import { EmailSettingsTab } from '@/components/account/email-settings-tab'
import { ChangePasswordTab } from '@/components/account/change-password-tab'
import { SubscriptionTab } from '@/components/account/subscription-tab'
import { TeamTab } from '@/components/account/team-tab'

const tabs = [
  { id: 'personal-details', name: 'Personal Details', component: PersonalDetailsTab },
  { id: 'email-settings', name: 'Email Settings', component: EmailSettingsTab },
  { id: 'change-password', name: 'Change Password', component: ChangePasswordTab },
  { id: 'subscription', name: 'Subscription', component: SubscriptionTab },
  { id: 'team', name: 'Team', component: TeamTab },
]

function AccountPageContent() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('personal-details')

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && tabs.find(t => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
          <div className="w-2 h-2 bg-yellow-600 rounded-full ml-1"></div>
        </div>
        <h1 className="text-2xl font-semibold text-gray-900">My Account</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-indigo-400 text-indigo-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AccountPageContent />
    </Suspense>
  )
}

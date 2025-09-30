'use client'

import { useSession } from 'next-auth/react'
import { StatsCard } from '@/components/dashboard/stats-card'
import { QuickActions } from '@/components/dashboard/quick-actions'

export default function DashboardPage() {
  const { data: session } = useSession()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">  
          Welkom terug, {session?.user?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Totaal Gesprekken"
          value="1,234"
          change="+12%"
          changeType="increase"
        />
        <StatsCard
          title="Gemiddelde Rating"
          value="4.8"
          change="+0.2"
          changeType="increase"
        />
        <StatsCard
          title="Documenten"
          value="42"
          change="+3"
          changeType="increase"
        />
        <StatsCard
          title="Responstijd"
          value="1.2s"
          change="-0.3s"
          changeType="decrease"
        />
      </div>

      <QuickActions />
    </div>
  )
}

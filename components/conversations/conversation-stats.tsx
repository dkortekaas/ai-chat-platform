'use client'

import { Card, CardContent } from '@/components/ui/card'

interface ConversationStatsProps {
  all: number
  conversations: number
  empty: number
}

export function ConversationStats({ all, conversations, empty }: ConversationStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{all.toLocaleString()}</div>
            <div className="text-sm text-gray-500">All</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{conversations.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Conversations</div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{empty.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Empty</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// Mock data - replace with real chart library like recharts
const conversationData = [
  { date: '1 Jan', conversations: 45 },
  { date: '2 Jan', conversations: 52 },
  { date: '3 Jan', conversations: 38 },
  { date: '4 Jan', conversations: 61 },
  { date: '5 Jan', conversations: 55 },
  { date: '6 Jan', conversations: 67 },
  { date: '7 Jan', conversations: 73 }
]

export function ConversationsChart() {
  const maxConversations = Math.max(...conversationData.map(d => d.conversations))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Gesprekken per Dag</CardTitle>
        <Select defaultValue="7days">
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">7 dagen</SelectItem>
            <SelectItem value="30days">30 dagen</SelectItem>
            <SelectItem value="90days">90 dagen</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Simple bar chart */}
          <div className="flex items-end space-x-2 h-32">
            {conversationData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="bg-indigo-500 rounded-t w-full transition-all duration-300 hover:bg-blue-700"
                  style={{ 
                    height: `${(item.conversations / maxConversations) * 100}%`,
                    minHeight: '4px'
                  }}
                />
                <div className="text-xs text-gray-500 mt-2 text-center">
                  {item.date}
                </div>
              </div>
            ))}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-indigo-500 rounded"></div>
              <span className="text-gray-600">Gesprekken</span>
            </div>
            <div className="text-gray-500">
              Totaal: {conversationData.reduce((sum, item) => sum + item.conversations, 0)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

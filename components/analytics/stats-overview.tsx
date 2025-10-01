import { Card, CardContent } from '@/components/ui/card'
import { MessageSquare, Star, Clock, TrendingUp } from 'lucide-react'

interface StatsOverviewProps {
  stats: {
    totalConversations: number
    averageRating: number
    averageResponseTime: number
    conversationGrowth: number
  }
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const cards = [
    {
      title: 'Total Conversaties',
      value: stats.totalConversations.toLocaleString(),
      icon: MessageSquare,
      color: 'text-indigo-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Gemiddelde Rating',
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      suffix: '/ 5',
    },
    {
      title: 'Reactietijd',
      value: stats.averageResponseTime.toFixed(0),
      icon: Clock,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      suffix: 'ms',
    },
    {
      title: 'Groei',
      value: `${stats.conversationGrowth > 0 ? '+' : ''}${stats.conversationGrowth}%`,
      icon: TrendingUp,
      color: 'text-indigo-500',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const Icon = card.icon
        
        return (
          <Card key={card.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    {card.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {card.value}
                    {card.suffix && (
                      <span className="text-sm text-gray-500 ml-1">
                        {card.suffix}
                      </span>
                    )}
                  </p>
                </div>
                
                <div className={`p-3 rounded-lg ${card.bgColor}`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
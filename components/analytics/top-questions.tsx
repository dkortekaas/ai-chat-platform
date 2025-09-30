import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, TrendingUp } from 'lucide-react'

// Mock data - replace with real data
const topQuestions = [
  {
    question: 'Wat zijn de technische specificaties?',
    count: 89,
    trend: 'up',
    category: 'Product'
  },
  {
    question: 'Hoe kan ik contact opnemen met support?',
    count: 67,
    trend: 'up',
    category: 'Support'
  },
  {
    question: 'Wat zijn de prijzen?',
    count: 54,
    trend: 'down',
    category: 'Pricing'
  },
  {
    question: 'Is er een gratis proefperiode?',
    count: 43,
    trend: 'up',
    category: 'Pricing'
  },
  {
    question: 'Hoe installeer ik het product?',
    count: 38,
    trend: 'stable',
    category: 'Support'
  },
  {
    question: 'Welke betalingsmethoden accepteren jullie?',
    count: 32,
    trend: 'up',
    category: 'Billing'
  },
  {
    question: 'Kan ik mijn abonnement opzeggen?',
    count: 28,
    trend: 'down',
    category: 'Billing'
  },
  {
    question: 'Is er een mobile app beschikbaar?',
    count: 24,
    trend: 'up',
    category: 'Product'
  }
]

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Product':
      return 'bg-blue-100 text-blue-800'
    case 'Support':
      return 'bg-green-100 text-green-800'
    case 'Pricing':
      return 'bg-yellow-100 text-yellow-800'
    case 'Billing':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-3 w-3 text-green-600" />
    case 'down':
      return <TrendingUp className="h-3 w-3 text-red-600 rotate-180" />
    default:
      return <div className="h-3 w-3" />
  }
}

export function TopQuestions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Meest Gestelde Vragen</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topQuestions.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {item.question}
                  </span>
                  {getTrendIcon(item.trend)}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
                    {item.category}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {item.count} keer gevraagd
                  </span>
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-900 ml-4">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

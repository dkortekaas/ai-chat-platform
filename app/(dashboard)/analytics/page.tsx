import { StatsOverview } from '@/components/analytics/stats-overview'
import { RatingChart } from '@/components/analytics/rating-chart'
import { ConversationsChart } from '@/components/analytics/conversations-chart'
import { TopQuestions } from '@/components/analytics/top-questions'

export default function AnalyticsPage() {
  const mockStats = {
    totalConversations: 1234,
    averageRating: 4.8,
    averageResponseTime: 1200,
    conversationGrowth: 12
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Inzichten in je chatbot prestaties
        </p>
      </div>

      <StatsOverview stats={mockStats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RatingChart />
        <ConversationsChart />
      </div>

      <TopQuestions />
    </div>
  )
}

import { ConversationDetail } from '@/components/conversations/conversation-detail'
import { RatingForm } from '@/components/conversations/rating-form'

interface ConversationDetailPageProps {
  params: {
    id: string
  }
}

export default function ConversationDetailPage({ params }: ConversationDetailPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Gesprek Details</h1>
        <p className="mt-1 text-sm text-gray-500">
          Bekijk gesprek {params.id}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ConversationDetail conversationId={params.id} />
        </div>
        <div>
          <RatingForm conversationId={params.id} />
        </div>
      </div>
    </div>
  )
}

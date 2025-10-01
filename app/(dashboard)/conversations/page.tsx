import { ConversationList } from '@/components/conversations/conversation-list'
import { ConversationStats } from '@/components/conversations/conversation-stats'

export default function ConversationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Conversations</h1>
        <p className="mt-1 text-sm text-gray-500">
          Access and review the interactions between your website visitors and the assistant
        </p>
      </div>

      <ConversationStats 
        all={26271}
        conversations={124}
        empty={26147}
      />

      <ConversationList />
    </div>
  )
}

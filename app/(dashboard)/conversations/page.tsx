import { ConversationList } from '@/components/conversations/conversation-list'
import { ConversationFilters } from '@/components/conversations/conversation-filters'
import { ConversationExportButton } from '@/components/conversations/conversation-export-button'

export default function ConversationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Gesprekken</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overzicht van alle chatbot gesprekken
          </p>
        </div>
        <ConversationExportButton />
      </div>

      <ConversationFilters />
      <ConversationList />
    </div>
  )
}

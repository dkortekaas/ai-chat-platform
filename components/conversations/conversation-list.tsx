'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ConversationCard } from '@/components/conversations/conversation-card'
import { ConversationFilters } from '@/components/conversations/conversation-filters'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { Pagination } from '@/components/shared/pagination'

interface Filters {
  rated: 'all' | 'true' | 'false'
  rating: number | null
  search: string
  dateFrom: string
  dateTo: string
}

interface Conversation {
  id: string
  userId: string
  messages: number
  rating: number | null
  startedAt: string
  lastMessageAt: string
  status: 'active' | 'completed'
  topic: string
}

const fetchConversations = async (params: any) => {
  // Mock implementation - replace with actual API call
  return {
    data: [],
    pagination: {
      totalPages: 1,
      totalItems: 0
    }
  }
}

export function ConversationList() {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [filters, setFilters] = useState<Filters>({
    rated: 'all',
    rating: null,
    search: '',
    dateFrom: '',
    dateTo: '',
  })

  const { data, isLoading } = useQuery({
    queryKey: ['conversations', page, pageSize, filters],
    queryFn: () => fetchConversations({ page, limit: pageSize, ...filters }),
  })

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <ConversationFilters filters={filters} onChange={setFilters} />

      <div className="space-y-4">
        {data?.data.map((conversation: Conversation) => (
          <ConversationCard 
            key={conversation.id} 
            conversation={conversation} 
          />
        ))}
      </div>

      {data && (
        <Pagination
          currentPage={page}
          totalPages={data.pagination.totalPages}
          pageSize={pageSize}
          totalItems={data.pagination.totalItems}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  )
}
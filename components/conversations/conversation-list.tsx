'use client'

import { useEffect, useState } from 'react'
import { ConversationTable } from '@/components/conversations/conversation-table'
import { ConversationFilters } from '@/components/conversations/conversation-filters'
import { Pagination } from '@/components/shared/pagination'
import { LoadingSpinner } from '@/components/shared/loading-spinner'
import { useAssistant } from '@/contexts/assistant-context'

interface Filters {
  type: string
  time: string
  duration: string
}

interface Conversation {
  id: string
  question: string
  answer: string
  responseTime: number | null
  rating: number | null
  createdAt: string
  tokensUsed: number | null
}

interface ApiResponse {
  items: Conversation[]
  total: number
  page: number
  pageSize: number
}

export function ConversationList() {
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    time: 'all',
    duration: 'all',
  })
  const { currentAssistant } = useAssistant()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [isLoading, setIsLoading] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [conversations, setConversations] = useState<Conversation[]>([])

  useEffect(() => {
    const fetchConversations = async () => {
      if (!currentAssistant?.id) return
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          assistantId: currentAssistant.id,
          page: String(currentPage),
          pageSize: String(pageSize)
        })
        const res = await fetch(`/api/conversations?${params.toString()}`)
        if (res.ok) {
          const data: ApiResponse = await res.json()
          setConversations(data.items)
          setTotalItems(data.total)
        } else {
          setConversations([])
          setTotalItems(0)
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchConversations()
  }, [currentAssistant?.id, currentPage, pageSize])

  const totalPages = Math.ceil((totalItems || 0) / pageSize)

  return (
    <div className="space-y-6">
      <ConversationFilters filters={filters} onChange={setFilters} />
      {isLoading ? (
        <div className="flex justify-center py-8"><LoadingSpinner /></div>
      ) : (
        <ConversationTable conversations={conversations} />
      )}
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      )}
    </div>
  )
}
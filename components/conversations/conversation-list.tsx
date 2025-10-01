'use client'

import { useState } from 'react'
import { ConversationTable } from '@/components/conversations/conversation-table'
import { ConversationFilters } from '@/components/conversations/conversation-filters'
import { Pagination } from '@/components/shared/pagination'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

interface Filters {
  type: string
  time: string
  duration: string
}

interface Conversation {
  id: string
  userInput: string
  time: string
  messages: { user: number; assistant: number }
  duration: string
}

// Generate more mock data for pagination
const generateMockConversations = (): Conversation[] => {
  const conversations: Conversation[] = []
  const timeOptions = ['2 days ago', '6 days ago', '6 months ago', '1 year ago', '2 years ago']
  const messageOptions = [
    { user: 0, assistant: 0 },
    { user: 0, assistant: 1 },
    { user: 1, assistant: 1 },
    { user: 2, assistant: 3 },
    { user: 1, assistant: 2 }
  ]
  
  for (let i = 1; i <= 150; i++) {
    conversations.push({
      id: i.toString(),
      userInput: '-',
      time: timeOptions[Math.floor(Math.random() * timeOptions.length)],
      messages: messageOptions[Math.floor(Math.random() * messageOptions.length)],
      duration: Math.random() > 0.5 ? '1 second' : `${Math.floor(Math.random() * 60) + 1} seconds`
    })
  }
  
  return conversations
}

const allMockConversations = generateMockConversations()

export function ConversationList() {
  const [filters, setFilters] = useState<Filters>({
    type: 'all',
    time: 'all',
    duration: 'all',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // Calculate pagination
  const totalItems = allMockConversations.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentConversations = allMockConversations.slice(startIndex, endIndex)

  return (
    <div className="space-y-6">
      <ConversationFilters filters={filters} onChange={setFilters} />
      <ConversationTable conversations={currentConversations} />
      
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
'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronDown } from 'lucide-react'

interface Conversation {
  id: string
  question: string
  answer: string
  responseTime: number | null
  rating: number | null
  createdAt: string
  tokensUsed: number | null
}

interface ConversationTableProps {
  conversations: Conversation[]
}

export function ConversationTable({ conversations }: ConversationTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-medium">Question</TableHead>
            <TableHead className="font-medium flex items-center gap-1">
              Created
              <ChevronDown className="h-4 w-4" />
            </TableHead>
            <TableHead className="font-medium flex items-center gap-1">
              Response Time
              <ChevronDown className="h-4 w-4" />
            </TableHead>
            <TableHead className="font-medium flex items-center gap-1">
              Rating
              <ChevronDown className="h-4 w-4" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.map((conversation) => (
            <TableRow key={conversation.id}>
              <TableCell className="max-w-xs truncate">{conversation.question}</TableCell>
              <TableCell>{new Date(conversation.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                {conversation.responseTime ? `${conversation.responseTime}ms` : '-'}
              </TableCell>
              <TableCell>
                {conversation.rating ? `${conversation.rating}/5` : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

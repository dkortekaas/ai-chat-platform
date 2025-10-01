'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronDown, User, MessageCircle } from 'lucide-react'

interface Conversation {
  id: string
  userInput: string
  time: string
  messages: { user: number; assistant: number }
  duration: string
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
            <TableHead className="font-medium">User Input</TableHead>
            <TableHead className="font-medium flex items-center gap-1">
              Time
              <ChevronDown className="h-4 w-4" />
            </TableHead>
            <TableHead className="font-medium flex items-center gap-1">
              # Messages
              <ChevronDown className="h-4 w-4" />
            </TableHead>
            <TableHead className="font-medium flex items-center gap-1">
              Duration
              <ChevronDown className="h-4 w-4" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {conversations.map((conversation) => (
            <TableRow key={conversation.id}>
              <TableCell className="text-gray-500">-</TableCell>
              <TableCell>{conversation.time}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <span>{conversation.messages.user}</span>
                  <MessageCircle className="h-4 w-4 text-gray-400" />
                  <span>{conversation.messages.assistant}</span>
                </div>
              </TableCell>
              <TableCell>{conversation.duration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bot, User, Clock } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/loading-spinner'

interface Conversation {
  id: string
  question: string
  answer: string
  createdAt: string
}

interface ConversationDetailProps {
  conversationId: string
}

export function ConversationDetail({ conversationId }: ConversationDetailProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchConversation = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/conversations/${conversationId}`)
        if (res.ok) {
          const data: Conversation = await res.json()
          setConversation(data)
        } else {
          setConversation(null)
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchConversation()
  }, [conversationId])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>Gesprek Details</span>
          <Badge variant="secondary">1 gesprek</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8"><LoadingSpinner /></div>
        ) : conversation ? (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="flex space-x-3 flex-row-reverse space-x-reverse">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 max-w-xs lg:max-w-md text-right">
                <div className="rounded-lg px-3 py-2 text-sm bg-indigo-500 text-white">
                  <p className="whitespace-pre-wrap">{conversation.question}</p>
                </div>
                <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500 justify-end">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(conversation.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 max-w-xs lg:max-w-md">
                <div className="rounded-lg px-3 py-2 text-sm bg-gray-100 text-gray-900">
                  <p className="whitespace-pre-wrap">{conversation.answer}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">Conversation not found</div>
        )}
      </CardContent>
    </Card>
  )
}

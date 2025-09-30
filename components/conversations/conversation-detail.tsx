'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Bot, User, Clock } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: string
}

interface ConversationDetailProps {
  conversationId: string
}

// Mock data - replace with real data
const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hallo, ik heb een vraag over jullie product.',
    sender: 'user',
    timestamp: '2024-01-15T14:30:00Z'
  },
  {
    id: '2',
    content: 'Hallo! Ik help je graag verder. Wat zou je willen weten over ons product?',
    sender: 'bot',
    timestamp: '2024-01-15T14:30:15Z'
  },
  {
    id: '3',
    content: 'Ik wil graag weten wat de technische specificaties zijn.',
    sender: 'user',
    timestamp: '2024-01-15T14:31:00Z'
  },
  {
    id: '4',
    content: 'Natuurlijk! Hier zijn de belangrijkste technische specificaties van ons product:\n\n• Processor: Intel Core i7\n• RAM: 16GB DDR4\n• Opslag: 512GB SSD\n• Scherm: 15.6" Full HD\n\nHeb je nog andere vragen?',
    sender: 'bot',
    timestamp: '2024-01-15T14:31:30Z'
  },
  {
    id: '5',
    content: 'Perfect, dat is precies wat ik zocht. Dank je wel!',
    sender: 'user',
    timestamp: '2024-01-15T14:32:00Z'
  },
  {
    id: '6',
    content: 'Graag gedaan! Is er nog iets anders waarmee ik je kan helpen?',
    sender: 'bot',
    timestamp: '2024-01-15T14:32:15Z'
  }
]

export function ConversationDetail({ conversationId }: ConversationDetailProps) {
  // TODO: Fetch conversation by ID
  const messages = mockMessages

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
          <Badge variant="secondary">
            {messages.length} berichten
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex space-x-3 ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback>
                  {message.sender === 'user' ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              
              <div className={`flex-1 max-w-xs lg:max-w-md ${
                message.sender === 'user' ? 'text-right' : ''
              }`}>
                <div
                  className={`rounded-lg px-3 py-2 text-sm ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>
                <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  <span>{formatTime(message.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

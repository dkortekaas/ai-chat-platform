'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  MoreVertical, 
  Bot,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Copy,
  Settings,
  ArrowLeft
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
// Removed modal-based AssistantForm in favor of dedicated create page
import { DeleteConfirmationModal } from '@/components/kennisbank/delete-confirmation-modal'
import { useToast } from '@/hooks/use-toast'
import { useAssistant } from '@/contexts/assistant-context'

interface Assistant {
  id: string
  userId: string
  name: string
  welcomeMessage: string
  placeholderText: string
  primaryColor: string
  secondaryColor: string
  tone: string
  language: string
  maxResponseLength: number
  temperature: number
  fallbackMessage: string
  position: string
  showBranding: boolean
  isActive: boolean
  apiKey: string
  allowedDomains: string[]
  rateLimit: number
  createdAt: string
  updatedAt: string
}

export default function AssistantsPage() {
  const router = useRouter()
  const { assistants, refreshAssistants, isLoading } = useAssistant()
  // Form modal removed; navigation used instead
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [assistantToDelete, setAssistantToDelete] = useState<Assistant | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  const handleAddAssistant = () => {
    router.push('/assistants/new')
  }

  const handleEditAssistant = (assistant: Assistant) => {
    router.push(`/assistants/${assistant.id}/edit`)
  }

  const handleDuplicateAssistant = async (assistant: Assistant) => {
    try {
      const response = await fetch('/api/assistants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${assistant.name} (Copy)`,
          welcomeMessage: assistant.welcomeMessage,
          placeholderText: assistant.placeholderText,
          primaryColor: assistant.primaryColor,
          secondaryColor: assistant.secondaryColor,
          tone: assistant.tone,
          language: assistant.language,
          maxResponseLength: assistant.maxResponseLength,
          temperature: assistant.temperature,
          fallbackMessage: assistant.fallbackMessage,
          position: assistant.position,
          showBranding: assistant.showBranding,
          isActive: assistant.isActive,
          allowedDomains: assistant.allowedDomains,
          rateLimit: assistant.rateLimit
        }),
      })

      if (response.ok) {
        toast({
          title: 'Assistant duplicated',
          description: 'The assistant has been duplicated successfully.',
        })
        refreshAssistants()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to duplicate assistant')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to duplicate assistant',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteAssistant = (assistant: Assistant) => {
    setAssistantToDelete(assistant)
    setIsDeleteModalOpen(true)
  }

  const confirmDeleteAssistant = async () => {
    if (!assistantToDelete) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/assistants/${assistantToDelete.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Assistant deleted',
          description: 'The assistant has been deleted successfully.',
        })
        refreshAssistants()
        setIsDeleteModalOpen(false)
        setAssistantToDelete(null)
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete assistant')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete assistant',
        variant: 'destructive',
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDeleteModalClose = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false)
      setAssistantToDelete(null)
    }
  }

  // Removed form callbacks; not needed with dedicated page

  const formatCreatedDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 7) return `${diffInDays} days ago`
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`
    return `${Math.floor(diffInDays / 365)} years ago`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">AI Assistants</h1>
            <p className="mt-1 text-sm text-gray-500">
              Create and manage multiple AI assistants, each with their own knowledge base and settings.
            </p>
          </div>
        </div>
        <Button 
          className="bg-indigo-500 hover:bg-indigo-600"
          onClick={handleAddAssistant}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Assistant
        </Button>
      </div>

      {/* Assistants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </Card>
          ))
        ) : assistants.length === 0 ? (
          <div className="col-span-full">
            <Card className="p-12 text-center">
              <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Assistants Yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first AI assistant to get started with managing knowledge bases and conversations.
              </p>
              <Button 
                className="bg-indigo-500 hover:bg-indigo-600"
                onClick={handleAddAssistant}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Assistant
              </Button>
            </Card>
          </div>
        ) : (
          assistants.map((assistant) => (
            <Card key={assistant.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Assistant Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: assistant.primaryColor }}
                    >
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{assistant.name}</h3>
                      <p className="text-sm text-gray-500">
                        {assistant.language.toUpperCase()} • {assistant.tone}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditAssistant(assistant)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateAssistant(assistant)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDeleteAssistant(assistant)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Assistant Description */}
                <p className="text-sm text-gray-600 line-clamp-2">
                  {assistant.welcomeMessage}
                </p>

                {/* Assistant Status */}
                <div className="flex items-center justify-between">
                  {assistant.isActive ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">
                      <XCircle className="w-3 h-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    Created {formatCreatedDate(assistant.createdAt)}
                  </span>
                </div>

                {/* Assistant Actions */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEditAssistant(assistant)}
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push('/kennisbank')}
                  >
                    Knowledge
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Creation moved to /assistants/new */}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        onConfirm={confirmDeleteAssistant}
        title="Delete Assistant"
        description="Are you sure you want to delete this assistant? This will also delete all associated knowledge base content, conversations, and settings. This action cannot be undone."
        itemName={assistantToDelete?.name || ''}
        isLoading={isDeleting}
      />
    </div>
  )
}

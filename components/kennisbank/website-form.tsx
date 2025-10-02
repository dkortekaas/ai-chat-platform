'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useAssistant } from '@/contexts/assistant-context'

interface Website {
  id: string
  url: string
  name?: string
  description?: string
  pages: number
  syncSpeed?: number
  syncInterval: string
  lastSync?: string
  status: 'PENDING' | 'SYNCING' | 'COMPLETED' | 'ERROR'
  errorMessage?: string
}

interface WebsiteFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  website?: Website | null
}

export function WebsiteForm({ isOpen, onClose, onSuccess, website }: WebsiteFormProps) {
  const { currentAssistant } = useAssistant()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    url: website?.url || '',
    name: website?.name || '',
    description: website?.description || '',
    syncInterval: website?.syncInterval || 'never'
  })
  const { toast } = useToast()

  const isEditing = !!website

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentAssistant) {
      toast({
        title: 'Error',
        description: 'No assistant selected',
        variant: 'destructive',
      })
      return
    }
    
    setIsLoading(true)

    try {
      const url = isEditing ? `/api/websites/${website.id}` : '/api/websites'
      const method = isEditing ? 'PUT' : 'POST'

      const requestData = isEditing 
        ? formData 
        : { ...formData, assistantId: currentAssistant.id }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      })

      if (!response.ok) {
        const error = await response.json()
        
        // Handle specific error cases
        if (response.status === 409 && error.code === 'DUPLICATE_URL') {
          throw new Error('This website URL has already been added to this assistant. Please choose a different URL or edit the existing one.')
        }
        
        throw new Error(error.error || 'Failed to save website')
      }

      toast({
        title: isEditing ? 'Website updated' : 'Website added',
        description: isEditing 
          ? 'The website has been updated successfully.' 
          : 'The website has been added successfully.',
      })

      onSuccess()
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        url: website?.url || '',
        name: website?.name || '',
        description: website?.description || '',
        syncInterval: website?.syncInterval || 'never'
      })
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit Website' : 'Add Website'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the website information below.' 
              : 'Add a new website URL to your knowledge base.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL *</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input
              id="name"
              placeholder="Website name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the website"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="syncInterval">Sync Interval</Label>
            <Select
              value={formData.syncInterval}
              onValueChange={(value) => setFormData(prev => ({ ...prev, syncInterval: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sync interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="never">Never</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (isEditing ? 'Update' : 'Add')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

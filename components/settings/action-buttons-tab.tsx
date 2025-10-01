'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import { useAssistant } from '@/contexts/assistant-context'
import { useToast } from '@/hooks/use-toast'

interface ActionButtonsTabProps {
  onChanges: (hasChanges: boolean) => void
}

interface ActionButton {
  id: string
  buttonText: string
  question: string
  priority: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export function ActionButtonsTab({ onChanges }: ActionButtonsTabProps) {
  const [buttons, setButtons] = useState<ActionButton[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingButton, setEditingButton] = useState<ActionButton | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    buttonText: '',
    question: '',
    priority: 50,
    enabled: true
  })
  
  const { currentAssistant } = useAssistant()
  const { toast } = useToast()

  // Fetch action buttons on component mount
  useEffect(() => {
    if (currentAssistant?.id) {
      fetchActionButtons()
    }
  }, [currentAssistant?.id])

  const fetchActionButtons = async () => {
    if (!currentAssistant?.id) return
    
    try {
      setIsLoading(true)
      const response = await fetch(`/api/action-buttons?assistantId=${currentAssistant.id}`)
      if (response.ok) {
        const data = await response.json()
        setButtons(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch action buttons",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching action buttons:', error)
      toast({
        title: "Error",
        description: "Failed to fetch action buttons",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddButton = () => {
    setEditingButton(null)
    setFormData({
      buttonText: '',
      question: '',
      priority: 50,
      enabled: true
    })
    setIsDialogOpen(true)
  }

  const handleEditButton = (button: ActionButton) => {
    setEditingButton(button)
    setFormData({
      buttonText: button.buttonText,
      question: button.question,
      priority: button.priority,
      enabled: button.enabled
    })
    setIsDialogOpen(true)
  }

  const handleSaveButton = async () => {
    if (!currentAssistant?.id) return
    
    setIsSaving(true)
    try {
      const url = editingButton 
        ? `/api/action-buttons/${editingButton.id}`
        : '/api/action-buttons'
      
      const method = editingButton ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(editingButton ? {} : { assistantId: currentAssistant.id }),
          ...formData
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: `Action button ${editingButton ? 'updated' : 'created'} successfully`,
        })
        setIsDialogOpen(false)
        fetchActionButtons() // Refresh the list
        onChanges(true)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || `Failed to ${editingButton ? 'update' : 'create'} action button`,
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error saving action button:', error)
      toast({
        title: "Error",
        description: `Failed to ${editingButton ? 'update' : 'create'} action button`,
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteButton = async (id: string) => {
    if (!confirm('Are you sure you want to delete this action button?')) return
    
    try {
      const response = await fetch(`/api/action-buttons/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Action button deleted successfully",
        })
        fetchActionButtons() // Refresh the list
        onChanges(true)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to delete action button",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error deleting action button:', error)
      toast({
        title: "Error",
        description: "Failed to delete action button",
        variant: "destructive"
      })
    }
  }

  const handleToggleEnabled = async (id: string) => {
    const button = buttons.find(btn => btn.id === id)
    if (!button) return
    
    try {
      const response = await fetch(`/api/action-buttons/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled: !button.enabled
        })
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Action button updated successfully",
        })
        fetchActionButtons() // Refresh the list
        onChanges(true)
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to update action button",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error updating action button:', error)
      toast({
        title: "Error",
        description: "Failed to update action button",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading action buttons...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Action Buttons</h3>
          <p className="text-sm text-gray-600">Add pre-set buttons for faster user interactions and navigation</p>
        </div>
        <Button 
          onClick={handleAddButton}
          className="bg-indigo-500 hover:bg-indigo-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add action button
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {buttons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No action buttons yet. Create your first one!</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Button</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead className="cursor-pointer">
                    Priority
                    <span className="ml-1">▼</span>
                  </TableHead>
                  <TableHead className="cursor-pointer">
                    Enabled
                    <span className="ml-1">▼</span>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buttons.map((button) => (
                  <TableRow key={button.id}>
                    <TableCell className="font-medium">{button.buttonText}</TableCell>
                    <TableCell>{button.question}</TableCell>
                    <TableCell>{button.priority}</TableCell>
                    <TableCell>
                      <Switch
                        checked={button.enabled}
                        onCheckedChange={() => handleToggleEnabled(button.id)}
                        className="data-[state=checked]:bg-indigo-500"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditButton(button)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteButton(button.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingButton ? 'Edit Action Button' : 'Add Action Button'}
            </DialogTitle>
            <DialogDescription>
              Configure the action button settings
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="button-text">Button text *</Label>
              <Input
                id="button-text"
                value={formData.buttonText}
                onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                placeholder="Enter button text"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="question">Question *</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Enter associated question"
                disabled={isSaving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input
                id="priority"
                type="number"
                min="1"
                max="100"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 50 })}
                placeholder="Enter priority (1-100)"
                disabled={isSaving}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
                className="data-[state=checked]:bg-indigo-500"
                disabled={isSaving}
              />
              <Label htmlFor="enabled">Enabled</Label>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveButton}
              className="bg-indigo-500 hover:bg-indigo-600"
              disabled={isSaving || !formData.buttonText.trim() || !formData.question.trim()}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

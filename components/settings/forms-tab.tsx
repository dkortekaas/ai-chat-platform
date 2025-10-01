'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Save, Trash2 } from 'lucide-react'

interface FormsTabProps {
  onChanges: (hasChanges: boolean) => void
}

interface ContactForm {
  id: string
  name: string
  description: string
  fields: FormField[]
  enabled: boolean
  redirectUrl?: string
}

interface FormField {
  id: string
  name: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select'
  required: boolean
  placeholder?: string
  options?: string[]
}

const initialForms: ContactForm[] = [
  {
    id: '1',
    name: 'Contact Form',
    description: 'Standard contact form for general inquiries',
    enabled: true,
    fields: [
      { id: '1', name: 'Name', type: 'text', required: true, placeholder: 'Your full name' },
      { id: '2', name: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
      { id: '3', name: 'Message', type: 'textarea', required: true, placeholder: 'Your message...' }
    ]
  },
  {
    id: '2',
    name: 'Support Request',
    description: 'Form for technical support requests',
    enabled: true,
    fields: [
      { id: '1', name: 'Name', type: 'text', required: true, placeholder: 'Your full name' },
      { id: '2', name: 'Email', type: 'email', required: true, placeholder: 'your@email.com' },
      { id: '3', name: 'Issue Type', type: 'select', required: true, options: ['Technical', 'Billing', 'General'] },
      { id: '4', name: 'Description', type: 'textarea', required: true, placeholder: 'Describe your issue...' }
    ]
  }
]

export function FormsTab({ onChanges }: FormsTabProps) {
  const [forms, setForms] = useState<ContactForm[]>(initialForms)
  const [editingForm, setEditingForm] = useState<ContactForm | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const handleToggleForm = (id: string) => {
    setForms(forms.map(form => 
      form.id === id 
        ? { ...form, enabled: !form.enabled }
        : form
    ))
    onChanges(true)
  }

  const handleDeleteForm = (id: string) => {
    setForms(forms.filter(form => form.id !== id))
    onChanges(true)
  }

  const handleEditForm = (form: ContactForm) => {
    setEditingForm(form)
    setIsEditing(true)
  }

  const handleSaveForm = () => {
    if (editingForm) {
      setForms(forms.map(form => 
        form.id === editingForm.id 
          ? editingForm
          : form
      ))
    }
    setIsEditing(false)
    setEditingForm(null)
    onChanges(true)
  }

  const handleAddField = () => {
    if (editingForm) {
      const newField: FormField = {
        id: Date.now().toString(),
        name: 'New Field',
        type: 'text',
        required: false,
        placeholder: 'Enter value...'
      }
      setEditingForm({
        ...editingForm,
        fields: [...editingForm.fields, newField]
      })
    }
  }

  const handleRemoveField = (fieldId: string) => {
    if (editingForm) {
      setEditingForm({
        ...editingForm,
        fields: editingForm.fields.filter(field => field.id !== fieldId)
      })
    }
  }

  const handleUpdateField = (fieldId: string, updates: Partial<FormField>) => {
    if (editingForm) {
      setEditingForm({
        ...editingForm,
        fields: editingForm.fields.map(field => 
          field.id === fieldId 
            ? { ...field, ...updates }
            : field
        )
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Contact Forms</h3>
          <p className="text-sm text-gray-600">Configure contact forms and data collection</p>
        </div>
        <Button 
          onClick={() => {
            setEditingForm({
              id: Date.now().toString(),
              name: 'New Form',
              description: '',
              fields: [],
              enabled: true
            })
            setIsEditing(true)
          }}
          className="bg-indigo-500 hover:bg-indigo-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Form
        </Button>
      </div>

      {/* Forms List */}
      <div className="grid gap-4">
        {forms.map((form) => (
          <Card key={form.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{form.name}</CardTitle>
                  <CardDescription>{form.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={form.enabled}
                    onCheckedChange={() => handleToggleForm(form.id)}
                    className="data-[state=checked]:bg-indigo-500"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditForm(form)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteForm(form.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-gray-700">Form Fields:</h4>
                <div className="flex flex-wrap gap-2">
                  {form.fields.map((field) => (
                    <span
                      key={field.id}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm"
                    >
                      {field.name} ({field.type})
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Form Dialog */}
      {isEditing && editingForm && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Form: {editingForm.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="form-name">Form Name</Label>
                <Input
                  id="form-name"
                  value={editingForm.name}
                  onChange={(e) => setEditingForm({ ...editingForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="redirect-url">Redirect URL (optional)</Label>
                <Input
                  id="redirect-url"
                  value={editingForm.redirectUrl || ''}
                  onChange={(e) => setEditingForm({ ...editingForm, redirectUrl: e.target.value })}
                  placeholder="https://example.com/thank-you"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="form-description">Description</Label>
              <Textarea
                id="form-description"
                value={editingForm.description}
                onChange={(e) => setEditingForm({ ...editingForm, description: e.target.value })}
                placeholder="Describe the purpose of this form"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Form Fields</h4>
                <Button onClick={handleAddField} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Field
                </Button>
              </div>
              
              <div className="space-y-3">
                {editingForm.fields.map((field) => (
                  <div key={field.id} className="p-4 border rounded-lg space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-2">
                        <Label>Field Name</Label>
                        <Input
                          value={field.name}
                          onChange={(e) => handleUpdateField(field.id, { name: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Field Type</Label>
                        <Select
                          value={field.type}
                          onValueChange={(value: FormField['type']) => handleUpdateField(field.id, { type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Placeholder</Label>
                        <Input
                          value={field.placeholder || ''}
                          onChange={(e) => handleUpdateField(field.id, { placeholder: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={field.required}
                          onCheckedChange={(checked) => handleUpdateField(field.id, { required: checked })}
                          className="data-[state=checked]:bg-indigo-500"
                        />
                        <Label>Required field</Label>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveField(field.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSaveForm}
                className="bg-indigo-500 hover:bg-indigo-600"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Form
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

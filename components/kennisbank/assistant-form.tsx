'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Dialog } from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ColorPicker } from '@/components/chatbot/color-picker'
import { useToast } from '@/hooks/use-toast'

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

interface AssistantFormProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  assistant?: Assistant | null
}

export function AssistantForm({ isOpen, onClose, onSuccess, assistant }: AssistantFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    welcomeMessage: 'Hallo! Hoe kan ik je helpen?',
    placeholderText: 'Stel een vraag...',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    tone: 'professional',
    language: 'nl',
    maxResponseLength: 500,
    temperature: 0.7,
    fallbackMessage: 'Sorry, ik kan deze vraag niet beantwoorden op basis van de beschikbare informatie.',
    position: 'bottom-right',
    showBranding: true,
    isActive: true,
    allowedDomains: [] as string[],
    rateLimit: 10
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [domainInput, setDomainInput] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    if (assistant) {
      setFormData({
        name: assistant.name,
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
      })
    } else {
      // Reset form for new assistant
      setFormData({
        name: '',
        welcomeMessage: 'Hallo! Hoe kan ik je helpen?',
        placeholderText: 'Stel een vraag...',
        primaryColor: '#3B82F6',
        secondaryColor: '#1E40AF',
        tone: 'professional',
        language: 'nl',
        maxResponseLength: 500,
        temperature: 0.7,
        fallbackMessage: 'Sorry, ik kan deze vraag niet beantwoorden op basis van de beschikbare informatie.',
        position: 'bottom-right',
        showBranding: true,
        isActive: true,
        allowedDomains: [],
        rateLimit: 10
      })
    }
  }, [assistant, isOpen])

  const handleInputChange = (field: string, value: string | number | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addDomain = () => {
    if (domainInput.trim() && !formData.allowedDomains.includes(domainInput.trim())) {
      setFormData(prev => ({
        ...prev,
        allowedDomains: [...prev.allowedDomains, domainInput.trim()]
      }))
      setDomainInput('')
    }
  }

  const removeDomain = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      allowedDomains: prev.allowedDomains.filter(d => d !== domain)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Assistant name is required',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)
    try {
      const url = assistant ? `/api/assistants/${assistant.id}` : '/api/assistants'
      const method = assistant ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: assistant ? 'Assistant updated' : 'Assistant created',
          description: assistant ? 'The assistant has been updated successfully.' : 'The assistant has been created successfully.',
        })
        onSuccess()
        onClose()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save assistant')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save assistant',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {assistant ? 'Edit Assistant' : 'Create New Assistant'}
              </h2>
              <Button variant="ghost" size="icon" onClick={onClose}>
                ×
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter assistant name"
                    required
                  />
                </div>

              </div>

              {/* Messages */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Messages</h3>
                
                <div>
                  <Label htmlFor="welcomeMessage">Welcome Message</Label>
                  <Input
                    id="welcomeMessage"
                    value={formData.welcomeMessage}
                    onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                    placeholder="Enter welcome message"
                  />
                </div>

                <div>
                  <Label htmlFor="placeholderText">Placeholder Text</Label>
                  <Input
                    id="placeholderText"
                    value={formData.placeholderText}
                    onChange={(e) => handleInputChange('placeholderText', e.target.value)}
                    placeholder="Enter placeholder text"
                  />
                </div>

                <div>
                  <Label htmlFor="fallbackMessage">Fallback Message</Label>
                  <Textarea
                    id="fallbackMessage"
                    value={formData.fallbackMessage}
                    onChange={(e) => handleInputChange('fallbackMessage', e.target.value)}
                    placeholder="Enter fallback message"
                    rows={2}
                  />
                </div>
              </div>

              {/* Appearance */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Appearance</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Primary Color</Label>
                    <ColorPicker
                      color={formData.primaryColor}
                      onChange={(color) => handleInputChange('primaryColor', color)}
                    />
                  </div>
                  <div>
                    <Label>Secondary Color</Label>
                    <ColorPicker
                      color={formData.secondaryColor}
                      onChange={(color) => handleInputChange('secondaryColor', color)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="position">Position</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => handleInputChange('position', value)}
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                  </Select>
                </div>
              </div>

              {/* Behavior */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Behavior</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tone">Tone</Label>
                    <Select
                      value={formData.tone}
                      onValueChange={(value) => handleInputChange('tone', value)}
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="casual">Casual</option>
                      <option value="formal">Formal</option>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={formData.language}
                      onValueChange={(value) => handleInputChange('language', value)}
                    >
                      <option value="nl">Dutch</option>
                      <option value="en">English</option>
                      <option value="de">German</option>
                      <option value="fr">French</option>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maxResponseLength">Max Response Length</Label>
                    <Input
                      id="maxResponseLength"
                      type="number"
                      value={formData.maxResponseLength}
                      onChange={(e) => handleInputChange('maxResponseLength', parseInt(e.target.value))}
                      min="100"
                      max="2000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      min="0"
                      max="1"
                      value={formData.temperature}
                      onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
                    />
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Security</h3>
                
                <div>
                  <Label htmlFor="rateLimit">Rate Limit (requests per minute)</Label>
                  <Input
                    id="rateLimit"
                    type="number"
                    value={formData.rateLimit}
                    onChange={(e) => handleInputChange('rateLimit', parseInt(e.target.value))}
                    min="1"
                    max="1000"
                  />
                </div>

                <div>
                  <Label>Allowed Domains</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={domainInput}
                      onChange={(e) => setDomainInput(e.target.value)}
                      placeholder="Enter domain (e.g., example.com)"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDomain())}
                    />
                    <Button type="button" onClick={addDomain} variant="outline">
                      Add
                    </Button>
                  </div>
                  {formData.allowedDomains.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.allowedDomains.map((domain) => (
                        <Badge key={domain} variant="secondary" className="flex items-center gap-1">
                          {domain}
                          <button
                            type="button"
                            onClick={() => removeDomain(domain)}
                            className="ml-1 hover:text-red-600"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-indigo-500 hover:bg-indigo-600">
                  {isSubmitting ? 'Saving...' : (assistant ? 'Update Assistant' : 'Create Assistant')}
                </Button>
              </div>
            </form>
          </div>
        </Card>
      </div>
    </Dialog>
  )
}

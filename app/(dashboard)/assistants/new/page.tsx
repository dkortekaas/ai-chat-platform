'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ColorPicker } from '@/components/chatbot/color-picker'
import { ChatbotPreview } from '@/components/settings/chatbot-preview'
import { useToast } from '@/hooks/use-toast'
import { 
  ArrowLeft, 
  Save, 
  X, 
  Plus,
  Info
} from 'lucide-react'

const toneOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Vriendelijk' },
  { value: 'casual', label: 'Casual' },
  { value: 'formal', label: 'Formeel' }
]

const languageOptions = [
  { value: 'nl', label: 'Nederlands' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' }
]

const positionOptions = [
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'bottom-left', label: 'Bottom Left' },
  { value: 'top-right', label: 'Top Right' },
  { value: 'top-left', label: 'Top Left' }
]

const fontOptions = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Source Sans Pro',
  'Nunito'
]

export default function NewAssistantPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [isSaving, setIsSaving] = useState(false)
  const [domainInput, setDomainInput] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    welcomeMessage: 'Hallo! Hoe kan ik je helpen?',
    placeholderText: 'Stel een vraag...',
    primaryColor: '#3B82F6',
    secondaryColor: '#1E40AF',
    fontFamily: 'Inter',
    assistantName: 'PS in foodservice',
    assistantSubtitle: 'We helpen je graag verder!',
    selectedAvatar: 'chat-bubble',
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

  const handleInputChange = (field: string, value: string | boolean | number) => {
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

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'Assistant name is required',
        variant: 'destructive'
      })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/assistants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          welcomeMessage: formData.welcomeMessage,
          placeholderText: formData.placeholderText,
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor,
          tone: formData.tone,
          language: formData.language,
          maxResponseLength: formData.maxResponseLength,
          temperature: formData.temperature,
          fallbackMessage: formData.fallbackMessage,
          position: formData.position,
          showBranding: formData.showBranding,
          isActive: formData.isActive,
          allowedDomains: formData.allowedDomains,
          rateLimit: formData.rateLimit
        })
      })

      if (!response.ok) throw new Error('Failed to create assistant')

      const created = await response.json()
      toast({ title: 'Success', description: 'Assistant created successfully' })
      router.push(`/assistants/${created.id}/edit`)
    } catch {
      toast({ title: 'Error', description: 'Failed to create assistant', variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/assistants')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Create Assistant</h1>
            <p className="text-sm text-gray-500">Configure your new AI assistant</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={() => router.push('/assistants')}
            disabled={isSaving}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-indigo-500 hover:bg-indigo-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Create Assistant'}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Column */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Basic Information</span>
                <Info className="w-4 h-4 text-gray-400" />
              </CardTitle>
              <CardDescription>
                Configure the basic settings for your assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter assistant name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter assistant description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select value={formData.tone} onValueChange={(value) => handleInputChange('tone', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={formData.language} onValueChange={(value) => handleInputChange('language', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Look and Feel */}
          <Card>
            <CardHeader>
              <CardTitle>Look & Feel</CardTitle>
              <CardDescription>
                Customize the appearance of your assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fontFamily">Font Family</Label>
                  <Select value={formData.fontFamily} onValueChange={(value) => handleInputChange('fontFamily', value)}>
                    <SelectTrigger>
                      <SelectValue>
                        <span style={{ fontFamily: `"${formData.fontFamily}", sans-serif` }}>{formData.fontFamily}</span>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: `"${font}", sans-serif` }}>{font}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {positionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Assistant Name</Label>
                  <Input
                    value={formData.assistantName}
                    onChange={(e) => handleInputChange('assistantName', e.target.value)}
                    placeholder="Enter assistant name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Assistant Subtitle</Label>
                  <Input
                    value={formData.assistantSubtitle}
                    onChange={(e) => handleInputChange('assistantSubtitle', e.target.value)}
                    placeholder="Enter assistant subtitle"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Avatar</Label>
                <div className="flex space-x-3">
                  {[
                    { id: 'chat-bubble', icon: '💬', name: 'Chat Bubble' },
                    { id: 'robot', icon: '🤖', name: 'Robot' },
                    { id: 'assistant', icon: '👤', name: 'Assistant' },
                    { id: 'support', icon: '🎧', name: 'Support' },
                    { id: 'help', icon: '❓', name: 'Help' }
                  ].map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => handleInputChange('selectedAvatar', avatar.id)}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl transition-colors ${
                        formData.selectedAvatar === avatar.id
                          ? 'border-indigo-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {avatar.icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <ColorPicker
                    color={formData.primaryColor}
                    onChange={(color) => handleInputChange('primaryColor', color)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Secondary Color</Label>
                  <ColorPicker
                    color={formData.secondaryColor}
                    onChange={(color) => handleInputChange('secondaryColor', color)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages */}
          <Card>
            <CardHeader>
              <CardTitle>Messages</CardTitle>
              <CardDescription>
                Configure the messages your assistant will use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="welcomeMessage">Welcome Message</Label>
                <Textarea
                  id="welcomeMessage"
                  value={formData.welcomeMessage}
                  onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                  placeholder="Enter welcome message"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="placeholderText">Placeholder Text</Label>
                <Input
                  id="placeholderText"
                  value={formData.placeholderText}
                  onChange={(e) => handleInputChange('placeholderText', e.target.value)}
                  placeholder="Enter placeholder text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fallbackMessage">Fallback Message</Label>
                <Textarea
                  id="fallbackMessage"
                  value={formData.fallbackMessage}
                  onChange={(e) => handleInputChange('fallbackMessage', e.target.value)}
                  placeholder="Enter fallback message"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Settings */}
          <Card>
            <CardHeader>
              <CardTitle>AI Settings</CardTitle>
              <CardDescription>
                Configure the AI behavior and responses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
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
                <div className="space-y-2">
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
            </CardContent>
          </Card>

          {/* Security & Access */}
          <Card>
            <CardHeader>
              <CardTitle>Security & Access</CardTitle>
              <CardDescription>
                Configure security settings and access control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rateLimit">Rate Limit (requests per minute)</Label>
                <Input
                  id="rateLimit"
                  type="number"
                  value={formData.rateLimit}
                  onChange={(e) => handleInputChange('rateLimit', parseInt(e.target.value))}
                  min="1"
                  max="100"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Allowed Domains</Label>
                <div className="flex space-x-2">
                  <Input
                    value={domainInput}
                    onChange={(e) => setDomainInput(e.target.value)}
                    placeholder="Enter domain (e.g., example.com)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDomain())}
                  />
                  <Button type="button" onClick={addDomain} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.allowedDomains.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.allowedDomains.map((domain) => (
                      <Badge key={domain} variant="secondary" className="flex items-center space-x-1">
                        <span>{domain}</span>
                        <button
                          onClick={() => removeDomain(domain)}
                          className="ml-1 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Column */}
        <div className="space-y-6">
          <ChatbotPreview
            fontFamily={formData.fontFamily}
            assistantName={formData.assistantName}
            assistantSubtitle={formData.assistantSubtitle}
            selectedAvatar={formData.selectedAvatar}
            primaryColor={formData.primaryColor}
            secondaryColor={formData.secondaryColor}
            welcomeMessage={formData.welcomeMessage}
            placeholderText={formData.placeholderText}
          />
        </div>
      </div>
    </div>
  )
}



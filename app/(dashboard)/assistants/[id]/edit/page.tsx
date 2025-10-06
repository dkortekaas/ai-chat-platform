'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { ColorPicker } from '@/components/chatbot/color-picker'
import { ChatbotPreview } from '@/components/settings/chatbot-preview'
import { useToast } from '@/hooks/use-toast'
import { useAssistant } from '@/contexts/assistant-context'
import { 
  ArrowLeft, 
  X, 
  Plus,
  Info
} from 'lucide-react'
import SaveButton from '@/components/ui/save-button'

interface Assistant {
  id: string
  name: string
  description?: string
  welcomeMessage: string
  placeholderText: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  assistantName: string
  assistantSubtitle: string
  selectedAvatar: string
  tone: string
  language: string
  maxResponseLength: number
  temperature: number
  fallbackMessage: string
  position: string
  showBranding: boolean
  isActive: boolean
  allowedDomains: string[]
  rateLimit: number
  createdAt: string
  updatedAt: string
}

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

const avatarOptions = [
  { id: 'chat-bubble', icon: '💬', name: 'Chat Bubble' },
  { id: 'robot', icon: '🤖', name: 'Robot' },
  { id: 'assistant', icon: '👤', name: 'Assistant' },
  { id: 'support', icon: '🎧', name: 'Support' },
  { id: 'help', icon: '❓', name: 'Help' }
]

export default function EditAssistantPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { } = useAssistant()
  
  const [assistant, setAssistant] = useState<Assistant | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
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

  // Load assistant data
  useEffect(() => {
    const loadAssistant = async () => {
      if (!params.id) return
      
      try {
        const response = await fetch(`/api/assistants/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setAssistant(data)
          setFormData({
            name: data.name,
            description: data.description || '',
            welcomeMessage: data.welcomeMessage,
            placeholderText: data.placeholderText,
            primaryColor: data.primaryColor,
            secondaryColor: data.secondaryColor,
            fontFamily: data.fontFamily || 'Inter',
            assistantName: data.assistantName || 'PS in foodservice',
            assistantSubtitle: data.assistantSubtitle || 'We helpen je graag verder!',
            selectedAvatar: data.selectedAvatar || 'chat-bubble',
            tone: data.tone,
            language: data.language,
            maxResponseLength: data.maxResponseLength,
            temperature: data.temperature,
            fallbackMessage: data.fallbackMessage,
            position: data.position,
            showBranding: data.showBranding,
            isActive: data.isActive,
            allowedDomains: data.allowedDomains,
            rateLimit: data.rateLimit
          })
        } else {
          toast({
            title: 'Error',
            description: 'Failed to load assistant',
            variant: 'destructive'
          })
          router.push('/assistants')
        }
      } catch (error) {
        console.error('Error loading assistant:', error)
        toast({
          title: 'Error',
          description: 'Failed to load assistant',
          variant: 'destructive'
        })
        router.push('/assistants')
      } finally {
        setIsLoading(false)
      }
    }

    loadAssistant()
  }, [params.id, router])

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setHasChanges(true)
  }

  const addDomain = () => {
    if (domainInput.trim() && !formData.allowedDomains.includes(domainInput.trim())) {
      setFormData(prev => ({
        ...prev,
        allowedDomains: [...prev.allowedDomains, domainInput.trim()]
      }))
      setDomainInput('')
      setHasChanges(true)
    }
  }

  const removeDomain = (domain: string) => {
    setFormData(prev => ({
      ...prev,
      allowedDomains: prev.allowedDomains.filter(d => d !== domain)
    }))
    setHasChanges(true)
  }

  const handleSave = useCallback(async () => {
    if (!assistant) return

    setIsSaving(true)
    try {
      const response = await fetch(`/api/assistants/${assistant.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedAssistant = await response.json()
        setAssistant(updatedAssistant)
        setHasChanges(false)
        toast({
          title: 'Success',
          description: 'Assistant updated successfully',
        })
      } else {
        throw new Error('Failed to update assistant')
      }
    } catch (error) {
      console.error('Error updating assistant:', error)
      toast({
        title: 'Error',
        description: 'Failed to update assistant',
        variant: 'destructive'
      })
    } finally {
      setIsSaving(false)
    }
  }, [assistant, formData])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading assistant...</p>
        </div>
      </div>
    )
  }

  if (!assistant) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Assistant not found</p>
          <Button onClick={() => router.push('/assistants')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Assistants
          </Button>
        </div>
      </div>
    )
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
            <h1 className="text-2xl font-semibold text-gray-900">Edit Assistant</h1>
            <p className="text-sm text-gray-500">
              Configure your AI assistant settings
            </p>
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
          <SaveButton
            onClick={handleSave}
            isLoading={isSaving}
            disabled={!hasChanges}
          >
            Save Changes
          </SaveButton>
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
                  <Label htmlFor="assistantName">Assistant Name</Label>
                  <Input
                    id="assistantName"
                    value={formData.assistantName}
                    onChange={(e) => handleInputChange('assistantName', e.target.value)}
                    placeholder="Enter assistant name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assistantSubtitle">Assistant Subtitle</Label>
                  <Input
                    id="assistantSubtitle"
                    value={formData.assistantSubtitle}
                    onChange={(e) => handleInputChange('assistantSubtitle', e.target.value)}
                    placeholder="Enter assistant subtitle"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Avatar</Label>
                <div className="flex space-x-3">
                  {avatarOptions.map((avatar) => (
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

          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>
                Control the availability of your assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Active</Label>
                  <p className="text-sm text-gray-500">
                    Enable or disable the assistant
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                  className="data-[state=checked]:bg-indigo-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Branding</Label>
                  <p className="text-sm text-gray-500">
                    Display your branding in the chat widget
                  </p>
                </div>
                <Switch
                  checked={formData.showBranding}
                  onCheckedChange={(checked) => handleInputChange('showBranding', checked)}
                  className="data-[state=checked]:bg-indigo-500"
                />
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

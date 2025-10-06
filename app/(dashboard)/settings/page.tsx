'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { 
  TestTube,
  ArrowUp
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAssistant } from '@/contexts/assistant-context'
import { useToast } from '@/hooks/use-toast'

// Import tab components
import { LookAndFeelTab } from '@/components/settings/look-and-feel-tab'
import { ActionButtonsTab } from '@/components/settings/action-buttons-tab'
import { FormsTab } from '@/components/settings/forms-tab'
import { IntegrationsTab } from '@/components/settings/integrations-tab'
import { WidgetTab } from '@/components/settings/widget-tab'

const tabs = [
  { id: 'look-and-feel', name: 'Look & Feel', component: LookAndFeelTab },
  { id: 'action-buttons', name: 'Action Buttons', component: ActionButtonsTab },
  { id: 'forms', name: 'Forms', component: FormsTab },
  { id: 'integrations', name: 'Integrations', component: IntegrationsTab },
  { id: 'widget', name: 'Widget', component: WidgetTab },
]

export default function SettingsPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState('look-and-feel')
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const { currentAssistant } = useAssistant()
  const { toast } = useToast()

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab && tabs.find(t => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component

  const handleSaveAll = async () => {
    if (!currentAssistant || !hasChanges) return

    setIsSaving(true)
    try {
      // The individual tabs handle their own saving
      // This is just a placeholder for future global save functionality
      toast({
        title: "Success",
        description: "All changes saved successfully",
      })
      setHasChanges(false)
    } catch (error) {
      console.error('Error saving changes:', error)
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Chatbot Instellingen</h1>
          <p className="mt-1 text-sm text-gray-500">
            Pas je chatbot aan naar jouw wensen
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            disabled={!hasChanges || isSaving}
            onClick={handleSaveAll}
            className="flex items-center space-x-2"
          >
            <ArrowUp className="w-4 h-4" />
            <span>
              {isSaving ? 'Saving...' : hasChanges ? 'Save changes' : 'No changes'}
            </span>
          </Button>
          <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600">
            <TestTube className="w-4 h-4 mr-2" />
            Test
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm',
                activeTab === tab.id
                  ? 'border-indigo-400 text-indigo-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {ActiveComponent && <ActiveComponent onChanges={setHasChanges} />}
      </div>
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { ChevronDown } from 'lucide-react'

interface Filters {
  type: string
  time: string
  duration: string
}

export function ConversationFilters({ }: { filters: Filters, onChange: (filters: Filters) => void }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Button variant="outline" className="flex items-center gap-2">
        Type All
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      <Button variant="outline" className="flex items-center gap-2">
        Time
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      <Button variant="outline" className="flex items-center gap-2">
        Duration
        <ChevronDown className="h-4 w-4" />
      </Button>
      
      <Button variant="ghost" className="text-sm text-gray-500 hover:text-gray-700">
        Clear filters
      </Button>
    </div>
  )
}

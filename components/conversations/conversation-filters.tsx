'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Calendar, Filter, X } from 'lucide-react'

interface Filters {
  rated: 'all' | 'true' | 'false'
  rating: number | null
  search: string
  dateFrom: string
  dateTo: string
}

export function ConversationFilters( { filters, onChange }: { filters: Filters, onChange: (filters: Filters) => void } ) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <Select defaultValue="all-time">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-time">Alle tijd</SelectItem>
              <SelectItem value="today">Vandaag</SelectItem>
              <SelectItem value="week">Deze week</SelectItem>
              <SelectItem value="month">Deze maand</SelectItem>
              <SelectItem value="custom">Aangepast</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-ratings">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-ratings">Alle ratings</SelectItem>
              <SelectItem value="5-stars">5 sterren</SelectItem>
              <SelectItem value="4-stars">4+ sterren</SelectItem>
              <SelectItem value="3-stars">3+ sterren</SelectItem>
              <SelectItem value="no-rating">Geen rating</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-topics">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Onderwerp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-topics">Alle onderwerpen</SelectItem>
              <SelectItem value="product-info">Product informatie</SelectItem>
              <SelectItem value="support">Technische ondersteuning</SelectItem>
              <SelectItem value="general">Algemene vragen</SelectItem>
              <SelectItem value="billing">Facturering</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <X className="mr-2 h-4 w-4" />
            Filters wissen
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

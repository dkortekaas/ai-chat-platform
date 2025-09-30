'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Globe, Plus } from 'lucide-react'

export function DocumentUrlForm() {
  const [url, setUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsLoading(true)
    // TODO: Implement URL processing logic
    console.log('Processing URL:', url)
    
    setTimeout(() => {
      setIsLoading(false)
      setUrl('')
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>Website toevoegen</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              Website URL
            </label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/help"
              required
            />
            <p className="text-xs text-gray-500">
              Voeg een URL toe om de inhoud automatisch te verwerken
            </p>
          </div>

          <Button type="submit" disabled={!url.trim() || isLoading} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            {isLoading ? 'Verwerken...' : 'URL toevoegen'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

interface RatingFormProps {
  conversationId: string
  currentRating?: number | null
  currentNotes?: string | null
  onSuccess?: () => void
}

export function RatingForm({ 
  conversationId, 
  currentRating,
  currentNotes,
  onSuccess 
}: RatingFormProps) {
  const [rating, setRating] = useState(currentRating || 0)
  const [notes, setNotes] = useState(currentNotes || '')
  const [hoveredRating, setHoveredRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: 'Error',
        description: 'Selecteer een rating',
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(
        `/api/conversations/${conversationId}/rating`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating, notes }),
        }
      )

      if (!response.ok) throw new Error('Failed to save rating')

      toast({
        title: 'Success',
        description: 'Beoordeling opgeslagen',
      })

      onSuccess?.()
    } catch {
      toast({
        title: 'Error',
        description: 'Opslaan mislukt',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Beoordeel antwoord</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Star Rating */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Rating
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
                className="focus:outline-none"
              >
                <Star
                  className={cn(
                    'w-8 h-8 transition-colors',
                    (hoveredRating || rating) >= value
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Notities (optioneel)
          </label>
          <Textarea
            placeholder="Voeg opmerkingen toe..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
          />
        </div>

        {/* Submit */}
        <Button 
          onClick={handleSubmit} 
          disabled={submitting || rating === 0}
          className="w-full"
        >
          {submitting ? 'Opslaan...' : 'Opslaan'}
        </Button>
      </CardContent>
    </Card>
  )
}
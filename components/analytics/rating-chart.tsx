'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Star } from 'lucide-react'

// Mock data - replace with real chart library like recharts
const ratingData = [
  { rating: 5, count: 456, percentage: 68 },
  { rating: 4, count: 123, percentage: 18 },
  { rating: 3, count: 67, percentage: 10 },
  { rating: 2, count: 23, percentage: 3 },
  { rating: 1, count: 8, percentage: 1 }
]

export function RatingChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rating Verdeling</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {ratingData.map((item) => (
            <div key={item.rating} className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 w-12">
                <span className="text-sm font-medium">{item.rating}</span>
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
              </div>
              
              <div className="flex-1">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
              
              <div className="text-sm text-gray-500 w-16 text-right">
                {item.count}
              </div>
              
              <div className="text-sm text-gray-500 w-10 text-right">
                {item.percentage}%
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Gemiddelde rating:</span>
            <div className="flex items-center space-x-1">
              <span className="font-medium">4.8</span>
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

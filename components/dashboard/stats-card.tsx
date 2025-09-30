import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string
  change: string
  changeType: 'increase' | 'decrease'
}

export function StatsCard({ title, value, change, changeType }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {changeType === 'increase' ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Badge 
            variant={changeType === 'increase' ? 'default' : 'destructive'}
            className="text-xs"
          >
            {change}
          </Badge>
          <span>ten opzichte van vorige maand</span>
        </div>
      </CardContent>
    </Card>
  )
}

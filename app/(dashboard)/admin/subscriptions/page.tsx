'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Loader2, 
  Users,
  CreditCard,
  TrendingUp,
  DollarSign,
  Calendar,
  Search,
  Filter
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { SUBSCRIPTION_PLANS } from '@/lib/stripe'

interface SubscriptionUser {
  id: string
  name: string
  email: string
  role: 'SUPERUSER' | 'ADMIN' | 'USER'
  subscriptionStatus: string
  subscriptionPlan: string | null
  stripeCustomerId: string | null
  stripeSubscriptionId: string | null
  trialStartDate: string | null
  trialEndDate: string | null
  subscriptionStartDate: string | null
  subscriptionEndDate: string | null
  subscriptionCancelAt: string | null
  subscriptionCanceled: boolean
  createdAt: string
  _count: {
    assistants: number
  }
}

interface SubscriptionStats {
  totalUsers: number
  trialUsers: number
  activeSubscriptions: number
  monthlyRevenue: number
  planDistribution: Record<string, number>
}

const statusColors = {
  TRIAL: 'bg-blue-100 text-blue-800 border-blue-200',
  ACTIVE: 'bg-green-100 text-green-800 border-green-200',
  CANCELED: 'bg-red-100 text-red-800 border-red-200',
  PAST_DUE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  UNPAID: 'bg-orange-100 text-orange-800 border-orange-200',
  INCOMPLETE: 'bg-gray-100 text-gray-800 border-gray-200',
  INCOMPLETE_EXPIRED: 'bg-gray-100 text-gray-800 border-gray-200',
  PAUSED: 'bg-purple-100 text-purple-800 border-purple-200'
}

export default function AdminSubscriptionsPage() {
  const [users, setUsers] = useState<SubscriptionUser[]>([])
  const [stats, setStats] = useState<SubscriptionStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [planFilter, setPlanFilter] = useState('all')
  
  const { toast } = useToast()
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Check if user is superuser
    if (session?.user?.role !== 'SUPERUSER') {
      router.push('/dashboard')
      return
    }
    
    fetchSubscriptions()
  }, [session, router])

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/subscriptions')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setStats(data.stats)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch subscription data",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error)
      toast({
        title: "Error",
        description: "Failed to fetch subscription data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.subscriptionStatus === statusFilter
    const matchesPlan = planFilter === 'all' || user.subscriptionPlan === planFilter
    
    return matchesSearch && matchesStatus && matchesPlan
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const getPlanName = (plan: string | null) => {
    if (!plan) return 'Geen abonnement'
    return SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS]?.name || plan
  }

  const getPlanPrice = (plan: string | null) => {
    if (!plan) return 0
    return SUBSCRIPTION_PLANS[plan as keyof typeof SUBSCRIPTION_PLANS]?.price || 0
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading subscription data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Subscription Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overzicht van alle gebruikers en hun abonnementen
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Totaal Gebruikers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trial Gebruikers</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.trialUsers}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actieve Abonnementen</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSubscriptions}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Maandelijkse Omzet</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Zoek op naam of email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Statussen</SelectItem>
                  <SelectItem value="TRIAL">Trial</SelectItem>
                  <SelectItem value="ACTIVE">Actief</SelectItem>
                  <SelectItem value="CANCELED">Geannuleerd</SelectItem>
                  <SelectItem value="PAST_DUE">Achterstallig</SelectItem>
                  <SelectItem value="UNPAID">Onbetaald</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Plannen</SelectItem>
                  <SelectItem value="STARTER">Starter</SelectItem>
                  <SelectItem value="PROFESSIONAL">Professional</SelectItem>
                  <SelectItem value="BUSINESS">Business</SelectItem>
                  <SelectItem value="ENTERPRISE">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Geen gebruikers gevonden</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gebruiker</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Prijs</TableHead>
                  <TableHead>Chatbots</TableHead>
                  <TableHead>Trial Eindigt</TableHead>
                  <TableHead>Abonnement Eindigt</TableHead>
                  <TableHead>Aangemaakt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name || 'Geen naam'}</div>
                          <div className="text-sm text-gray-500">{user.role}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600">{user.email}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[user.subscriptionStatus as keyof typeof statusColors]}>
                        {user.subscriptionStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {getPlanName(user.subscriptionPlan)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {user.subscriptionPlan ? formatCurrency(getPlanPrice(user.subscriptionPlan)) : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">
                        {user._count.assistants}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {user.trialEndDate ? new Date(user.trialEndDate).toLocaleDateString('nl-NL') : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {user.subscriptionEndDate ? new Date(user.subscriptionEndDate).toLocaleDateString('nl-NL') : '-'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('nl-NL')}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

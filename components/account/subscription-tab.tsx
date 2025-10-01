'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, RefreshCw, CreditCard, AlertCircle, CheckCircle } from 'lucide-react'
import { SUBSCRIPTION_PLANS } from '@/lib/stripe'
import { useToast } from '@/hooks/use-toast'

interface SubscriptionData {
  user: {
    id: string
    email: string
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
    isTrialActive: boolean
    trialDaysRemaining: number
    currentPlan: any
  }
}

export function SubscriptionTab() {
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [managing, setManaging] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSubscriptionData()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      const response = await fetch('/api/subscriptions')
      if (response.ok) {
        const data = await response.json()
        setSubscriptionData(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch subscription data",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
      toast({
        title: "Error",
        description: "Failed to fetch subscription data",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (plan: string) => {
    setUpgrading(true)
    try {
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan }),
      })

      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        const error = await response.json()
        toast({
          title: "Error",
          description: error.error || "Failed to create subscription",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error creating subscription:', error)
      toast({
        title: "Error",
        description: "Failed to create subscription",
        variant: "destructive"
      })
    } finally {
      setUpgrading(false)
    }
  }

  const handleManageSubscription = async () => {
    setManaging(true)
    try {
      const response = await fetch('/api/subscriptions/manage')
      if (response.ok) {
        const { url } = await response.json()
        window.location.href = url
      } else {
        toast({
          title: "Error",
          description: "Failed to open subscription management",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Error managing subscription:', error)
      toast({
        title: "Error",
        description: "Failed to open subscription management",
        variant: "destructive"
      })
    } finally {
      setManaging(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading subscription data...</span>
      </div>
    )
  }

  if (!subscriptionData) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600">Failed to load subscription data</p>
      </div>
    )
  }

  const { user } = subscriptionData
  const isTrial = user.subscriptionStatus === 'TRIAL'
  const isActive = user.subscriptionStatus === 'ACTIVE'
  const isExpired = isTrial ? !user.isTrialActive : false

  return (
    <div className="space-y-6">
      {/* Trial Status Alert */}
      {isTrial && (
        <Card className={`p-4 ${isExpired ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
          <div className="flex items-center space-x-3">
            {isExpired ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-blue-500" />
            )}
            <div>
              <h3 className={`font-medium ${isExpired ? 'text-red-800' : 'text-blue-800'}`}>
                {isExpired ? 'Trial Periode Verlopen' : 'Trial Periode Actief'}
              </h3>
              <p className={`text-sm ${isExpired ? 'text-red-600' : 'text-blue-600'}`}>
                {isExpired 
                  ? 'Je trial periode is verlopen. Upgrade naar een betaald abonnement om door te gaan.'
                  : `Je hebt nog ${user.trialDaysRemaining} dagen over in je trial periode.`
                }
              </p>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Subscription Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Huidig Abonnement</h3>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900">
                {isTrial ? 'Trial Periode' : user.currentPlan?.name || 'Geen abonnement'}
              </h4>
              <Badge className={`mt-1 ${
                isTrial ? 'bg-blue-100 text-blue-800' :
                isActive ? 'bg-green-100 text-green-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {isTrial ? 'Trial' : user.subscriptionStatus}
              </Badge>
            </div>
            
            {user.currentPlan && (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Prijs:</span>
                  <span className="font-medium">€{user.currentPlan.price}/maand</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Chatbots:</span>
                  <span className="font-medium">
                    {user.currentPlan.limits.assistants === -1 ? 'Onbeperkt' : user.currentPlan.limits.assistants}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gesprekken/maand:</span>
                  <span className="font-medium">
                    {user.currentPlan.limits.conversationsPerMonth === -1 ? 'Onbeperkt' : user.currentPlan.limits.conversationsPerMonth}
                  </span>
                </div>
                {user.subscriptionEndDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vervalt:</span>
                    <span className="font-medium">
                      {new Date(user.subscriptionEndDate).toLocaleDateString('nl-NL')}
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {isTrial && !isExpired && (
              <div className="pt-4 border-t">
                <h5 className="font-medium text-gray-900 mb-2">Trial Details</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gestart:</span>
                    <span className="font-medium">
                      {user.trialStartDate ? new Date(user.trialStartDate).toLocaleDateString('nl-NL') : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Eindigt:</span>
                    <span className="font-medium">
                      {user.trialEndDate ? new Date(user.trialEndDate).toLocaleDateString('nl-NL') : '-'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dagen over:</span>
                    <span className="font-medium text-blue-600">{user.trialDaysRemaining}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex space-x-3">
              {isActive && (
                <Button 
                  onClick={handleManageSubscription}
                  disabled={managing}
                  variant="outline" 
                  className="border-indigo-500 text-indigo-500 hover:bg-indigo-50"
                >
                  {managing ? 'Loading...' : 'Beheer Abonnement'}
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Available Plans Card */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Beschikbare Abonnementen</h3>
            </div>
            
            <div className="space-y-3">
              {Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => (
                <div key={key} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                    <span className="text-lg font-bold text-indigo-600">€{plan.price}/maand</span>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-1 mb-3">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    onClick={() => handleUpgrade(key)}
                    disabled={upgrading || (user.subscriptionPlan === key)}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white"
                    size="sm"
                  >
                    {upgrading ? 'Loading...' : 
                     user.subscriptionPlan === key ? 'Huidig Plan' : 
                     'Upgrade'}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Payment Methods Card */}
      {user.stripeCustomerId && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Betalingsmethoden</h3>
            </div>
            
            <div className="flex items-center space-x-3">
              <CreditCard className="w-8 h-8 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Betalingsmethoden beheren</p>
                <p className="text-sm text-gray-600">Beheer je betalingsmethoden via Stripe</p>
              </div>
              <Button 
                onClick={handleManageSubscription}
                disabled={managing}
                variant="outline" 
                size="sm"
                className="ml-auto"
              >
                {managing ? 'Loading...' : 'Beheer'}
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

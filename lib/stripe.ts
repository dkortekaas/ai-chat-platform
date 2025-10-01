import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

// Subscription plans configuration
export const SUBSCRIPTION_PLANS = {
  STARTER: {
    name: 'Starter',
    price: 19,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    features: [
      '1 chatbot',
      '100 gesprekken per maand',
      'Basis support',
      'Standaard templates'
    ],
    limits: {
      assistants: 1,
      conversationsPerMonth: 100,
      documentsPerAssistant: 10,
      websitesPerAssistant: 3
    }
  },
  PROFESSIONAL: {
    name: 'Professional',
    price: 49,
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
    features: [
      '3 chatbots',
      '500 gesprekken per maand',
      'Prioriteit support',
      'Aangepaste templates',
      'Analytics dashboard'
    ],
    limits: {
      assistants: 3,
      conversationsPerMonth: 500,
      documentsPerAssistant: 50,
      websitesPerAssistant: 10
    }
  },
  BUSINESS: {
    name: 'Business',
    price: 149,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    features: [
      '10 chatbots',
      '2000 gesprekken per maand',
      'Premium support',
      'API toegang',
      'Geavanceerde analytics',
      'White-label opties'
    ],
    limits: {
      assistants: 10,
      conversationsPerMonth: 2000,
      documentsPerAssistant: 200,
      websitesPerAssistant: 50
    }
  },
  ENTERPRISE: {
    name: 'Enterprise',
    price: 499,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Onbeperkte chatbots',
      'Onbeperkte gesprekken',
      'Dedicated support',
      'Volledige API toegang',
      'Custom integraties',
      'SLA garantie',
      'On-premise opties'
    ],
    limits: {
      assistants: -1, // unlimited
      conversationsPerMonth: -1, // unlimited
      documentsPerAssistant: -1, // unlimited
      websitesPerAssistant: -1 // unlimited
    }
  }
} as const;

export type SubscriptionPlanType = keyof typeof SUBSCRIPTION_PLANS;

// Helper function to get plan by price ID
export function getPlanByPriceId(priceId: string): SubscriptionPlanType | null {
  for (const [planKey, plan] of Object.entries(SUBSCRIPTION_PLANS)) {
    if (plan.priceId === priceId) {
      return planKey as SubscriptionPlanType;
    }
  }
  return null;
}

// Helper function to check if user has access to feature
export function hasAccessToFeature(
  userPlan: SubscriptionPlanType | null,
  feature: keyof typeof SUBSCRIPTION_PLANS.STARTER.limits
): boolean {
  if (!userPlan) return false;
  
  const plan = SUBSCRIPTION_PLANS[userPlan];
  const limit = plan.limits[feature];
  
  // -1 means unlimited
  return limit === -1;
}

// Helper function to get usage limit
export function getUsageLimit(
  userPlan: SubscriptionPlanType | null,
  feature: keyof typeof SUBSCRIPTION_PLANS.STARTER.limits
): number {
  if (!userPlan) return 0;
  
  const plan = SUBSCRIPTION_PLANS[userPlan];
  return plan.limits[feature];
}

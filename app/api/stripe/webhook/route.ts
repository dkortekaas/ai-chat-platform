import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}

async function handleSubscriptionCreated(subscription: any) {
  const customerId = subscription.customer;
  const subscriptionId = subscription.id;
  const priceId = subscription.items.data[0]?.price.id;
  
  if (!priceId) {
    console.error('No price ID found in subscription');
    return;
  }

  // Find user by Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId }
  });

  if (!user) {
    console.error('User not found for customer ID:', customerId);
    return;
  }

  // Determine plan from price ID
  const plan = getPlanByPriceId(priceId);
  if (!plan) {
    console.error('Unknown price ID:', priceId);
    return;
  }

  // Update user subscription
  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'ACTIVE',
      subscriptionPlan: plan,
      stripeSubscriptionId: subscriptionId,
      subscriptionStartDate: new Date(subscription.current_period_start * 1000),
      subscriptionEndDate: new Date(subscription.current_period_end * 1000),
      subscriptionCanceled: false,
      subscriptionCancelAt: null
    }
  });

  console.log(`Subscription created for user ${user.id}: ${plan}`);
}

async function handleSubscriptionUpdated(subscription: any) {
  const customerId = subscription.customer;
  const subscriptionId = subscription.id;
  
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId }
  });

  if (!user) {
    console.error('User not found for customer ID:', customerId);
    return;
  }

  const updateData: any = {
    subscriptionEndDate: new Date(subscription.current_period_end * 1000),
  };

  // Handle cancellation
  if (subscription.cancel_at_period_end) {
    updateData.subscriptionCancelAt = new Date(subscription.current_period_end * 1000);
    updateData.subscriptionCanceled = true;
  } else {
    updateData.subscriptionCancelAt = null;
    updateData.subscriptionCanceled = false;
  }

  // Handle status changes
  switch (subscription.status) {
    case 'active':
      updateData.subscriptionStatus = 'ACTIVE';
      break;
    case 'past_due':
      updateData.subscriptionStatus = 'PAST_DUE';
      break;
    case 'canceled':
      updateData.subscriptionStatus = 'CANCELED';
      break;
    case 'unpaid':
      updateData.subscriptionStatus = 'UNPAID';
      break;
    case 'incomplete':
      updateData.subscriptionStatus = 'INCOMPLETE';
      break;
    case 'incomplete_expired':
      updateData.subscriptionStatus = 'INCOMPLETE_EXPIRED';
      break;
    case 'paused':
      updateData.subscriptionStatus = 'PAUSED';
      break;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: updateData
  });

  console.log(`Subscription updated for user ${user.id}: ${subscription.status}`);
}

async function handleSubscriptionDeleted(subscription: any) {
  const customerId = subscription.customer;
  
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId }
  });

  if (!user) {
    console.error('User not found for customer ID:', customerId);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'CANCELED',
      subscriptionCanceled: true,
      subscriptionEndDate: new Date()
    }
  });

  console.log(`Subscription deleted for user ${user.id}`);
}

async function handlePaymentSucceeded(invoice: any) {
  const customerId = invoice.customer;
  
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId }
  });

  if (!user) {
    console.error('User not found for customer ID:', customerId);
    return;
  }

  // Update subscription status to active if it was past due
  if (user.subscriptionStatus === 'PAST_DUE') {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'ACTIVE'
      }
    });
  }

  console.log(`Payment succeeded for user ${user.id}`);
}

async function handlePaymentFailed(invoice: any) {
  const customerId = invoice.customer;
  
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId: customerId }
  });

  if (!user) {
    console.error('User not found for customer ID:', customerId);
    return;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      subscriptionStatus: 'PAST_DUE'
    }
  });

  console.log(`Payment failed for user ${user.id}`);
}

function getPlanByPriceId(priceId: string): string | null {
  const plans = {
    [process.env.STRIPE_STARTER_PRICE_ID!]: 'STARTER',
    [process.env.STRIPE_PROFESSIONAL_PRICE_ID!]: 'PROFESSIONAL',
    [process.env.STRIPE_BUSINESS_PRICE_ID!]: 'BUSINESS',
    [process.env.STRIPE_ENTERPRISE_PRICE_ID!]: 'ENTERPRISE',
  };
  
  return plans[priceId] || null;
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is superuser
    if (session.user.role !== 'SUPERUSER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch all users with subscription data
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        trialStartDate: true,
        trialEndDate: true,
        subscriptionStartDate: true,
        subscriptionEndDate: true,
        subscriptionCancelAt: true,
        subscriptionCanceled: true,
        createdAt: true,
        _count: {
          select: {
            assistants: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate stats
    const totalUsers = users.length;
    const trialUsers = users.filter(user => user.subscriptionStatus === 'TRIAL').length;
    const activeSubscriptions = users.filter(user => user.subscriptionStatus === 'ACTIVE').length;
    
    // Calculate monthly revenue
    const monthlyRevenue = users
      .filter(user => user.subscriptionStatus === 'ACTIVE' && user.subscriptionPlan)
      .reduce((total, user) => {
        const plan = user.subscriptionPlan as keyof typeof SUBSCRIPTION_PLANS;
        const planPrice = SUBSCRIPTION_PLANS[plan]?.price || 0;
        return total + planPrice;
      }, 0);

    // Calculate plan distribution
    const planDistribution = users.reduce((acc, user) => {
      if (user.subscriptionPlan) {
        acc[user.subscriptionPlan] = (acc[user.subscriptionPlan] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const stats = {
      totalUsers,
      trialUsers,
      activeSubscriptions,
      monthlyRevenue,
      planDistribution
    };

    return NextResponse.json({
      users,
      stats
    });
  } catch (error) {
    console.error('Error fetching subscription data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

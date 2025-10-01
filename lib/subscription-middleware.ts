import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { getUserSubscriptionStatus } from './subscription';

export async function checkSubscriptionAccess(
  request: NextRequest,
  requiredFeature: 'assistant' | 'document' | 'website' | 'conversation'
): Promise<{ allowed: boolean; redirect?: NextResponse }> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { allowed: false };
    }

    // Superusers and admins always have access
    if (session.user.role === 'SUPERUSER' || session.user.role === 'ADMIN') {
      return { allowed: true };
    }

    const subscriptionStatus = await getUserSubscriptionStatus(session.user.id);

    // Check if user has access to the required feature
    if (subscriptionStatus.isExpired) {
      return {
        allowed: false,
        redirect: NextResponse.redirect(new URL('/account?tab=subscription&expired=true', request.url))
      };
    }

    // Check specific feature limits
    switch (requiredFeature) {
      case 'assistant':
        if (!subscriptionStatus.canCreateAssistant) {
          return {
            allowed: false,
            redirect: NextResponse.redirect(new URL('/account?tab=subscription&limit=assistant', request.url))
          };
        }
        break;
      case 'document':
        if (!subscriptionStatus.canCreateDocument) {
          return {
            allowed: false,
            redirect: NextResponse.redirect(new URL('/account?tab=subscription&limit=document', request.url))
          };
        }
        break;
      case 'website':
        if (!subscriptionStatus.canCreateWebsite) {
          return {
            allowed: false,
            redirect: NextResponse.redirect(new URL('/account?tab=subscription&limit=website', request.url))
          };
        }
        break;
      case 'conversation':
        // For conversations, we check if the user is within their monthly limit
        // This would need to be implemented in the conversation creation logic
        break;
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking subscription access:', error);
    return { allowed: false };
  }
}

export async function requireActiveSubscription(
  request: NextRequest
): Promise<{ allowed: boolean; redirect?: NextResponse }> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return { allowed: false };
    }

    // Superusers and admins always have access
    if (session.user.role === 'SUPERUSER' || session.user.role === 'ADMIN') {
      return { allowed: true };
    }

    const subscriptionStatus = await getUserSubscriptionStatus(session.user.id);

    if (subscriptionStatus.isExpired) {
      return {
        allowed: false,
        redirect: NextResponse.redirect(new URL('/account?tab=subscription&expired=true', request.url))
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return { allowed: false };
  }
}

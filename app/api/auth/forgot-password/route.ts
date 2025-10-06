import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function generateToken(length: number = 48): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let token = ''
  for (let i = 0; i < length; i++) {
    token += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return token
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'E-mailadres is vereist' }, { status: 400 })
    }

    console.info('[forgot-password] request for email:', email)
    const user = await prisma.user.findUnique({ where: { email } })

    // For security, always respond with success even if user doesn't exist
    if (!user) {
      console.info('[forgot-password] no user found for email')
      return NextResponse.json({ 
        message: 'Indien het e-mailadres bestaat, is er een resetlink verzonden.',
        devInfo: 'userNotFound'
      })
    }

    // Invalidate existing tokens for this identifier
    await prisma.verificationToken.deleteMany({ where: { identifier: email } })

    const token = generateToken(64)
    const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires
      }
    })

    const baseUrl = process.env.NEXTAUTH_URL || process.env.VERCEL_URL || ''
    const origin = baseUrl?.startsWith('http') ? baseUrl : (baseUrl ? `https://${baseUrl}` : new URL(request.url).origin)
    const resetLink = `${origin}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(email)}`

    // TODO: integrate email provider. For now, log the link for development.
    console.log('[forgot-password] Password reset link:', resetLink)

    return NextResponse.json({ message: 'Indien het e-mailadres bestaat, is er een resetlink verzonden.', resetLink })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 })
  }
}



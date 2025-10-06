import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, email, password } = await request.json()

    if (!token || !email || !password) {
      return NextResponse.json({ error: 'Token, e-mail en nieuw wachtwoord zijn vereist' }, { status: 400 })
    }

    if (typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Wachtwoord moet minimaal 6 karakters zijn' }, { status: 400 })
    }

    const vt = await prisma.verificationToken.findUnique({ where: { token } })
    if (!vt || vt.identifier !== email) {
      return NextResponse.json({ error: 'Ongeldige of verlopen token' }, { status: 400 })
    }

    if (vt.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } })
      return NextResponse.json({ error: 'Token is verlopen' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      // Clean token and return generic error
      await prisma.verificationToken.delete({ where: { token } })
      return NextResponse.json({ error: 'Ongeldige token' }, { status: 400 })
    }

    const hashed = await hash(password, 12)

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { password: hashed } }),
      prisma.verificationToken.delete({ where: { token } })
    ])

    return NextResponse.json({ message: 'Wachtwoord succesvol bijgewerkt' })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Interne serverfout' }, { status: 500 })
  }
}



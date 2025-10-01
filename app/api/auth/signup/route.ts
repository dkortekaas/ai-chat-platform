import { NextRequest, NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validatie
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Alle velden zijn verplicht' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Wachtwoord moet minimaal 6 karakters lang zijn' },
        { status: 400 }
      )
    }

    // Check of gebruiker al bestaat
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Er bestaat al een account met dit e-mailadres' },
        { status: 400 }
      )
    }

    // Hash wachtwoord
    const hashedPassword = await hash(password, 12)

    // Bereken trial periode (30 dagen vanaf nu)
    const now = new Date()
    const trialEndDate = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)) // 30 dagen

    // Maak nieuwe gebruiker aan met trial periode
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER', // Default role
        subscriptionStatus: 'TRIAL',
        trialStartDate: now,
        trialEndDate: trialEndDate
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        subscriptionStatus: true,
        trialStartDate: true,
        trialEndDate: true
      }
    })

    return NextResponse.json(
      { 
        message: 'Account succesvol aangemaakt',
        user 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van het account' },
      { status: 500 }
    )
  }
}

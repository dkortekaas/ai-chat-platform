import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Niet geautoriseerd' },
        { status: 401 }
      )
    }

    // Zoek bestaande instellingen voor de gebruiker
    let settings = await prisma.chatbot_settings.findFirst({
      where: {
        userId: session.user.id
      }
    })

    // Als er geen instellingen zijn, maak dan standaard instellingen aan
    if (!settings) {
      settings = await prisma.chatbot_settings.create({
        data: {
          id: `chatbot_${session.user.id}_${Date.now()}`,
          userId: session.user.id,
          name: 'AI Assistant',
          welcomeMessage: 'Hallo! Hoe kan ik je helpen?',
          placeholderText: 'Typ je vraag hier...',
          primaryColor: '#3B82F6',
          secondaryColor: '#10B981',
          tone: 'friendly',
          temperature: 0.7,
          maxResponseLength: 500,
          fallbackMessage: 'Sorry, ik begrijp je vraag niet. Kun je het anders formuleren?',
          apiKey: `api_${session.user.id}_${Date.now()}`,
          updatedAt: new Date()
        }
      })
    }

    return NextResponse.json(settings)

  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het ophalen van de instellingen' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Niet geautoriseerd' },
        { status: 401 }
      )
    }

    const data = await request.json()

    // Valideer de data
    const {
      name,
      welcomeMessage,
      placeholderText,
      primaryColor,
      secondaryColor,
      tone,
      temperature,
      maxResponseLength,
      fallbackMessage
    } = data

    if (!name || !welcomeMessage || !placeholderText) {
      return NextResponse.json(
        { error: 'Verplichte velden ontbreken' },
        { status: 400 }
      )
    }

    // Zoek bestaande instellingen
    let settings = await prisma.chatbot_settings.findFirst({
      where: {
        userId: session.user.id
      }
    })

    if (settings) {
      // Update bestaande instellingen
      settings = await prisma.chatbot_settings.update({
        where: {
          id: settings.id
        },
        data: {
          name,
          welcomeMessage,
          placeholderText,
          primaryColor,
          secondaryColor,
          tone,
          temperature,
          maxResponseLength,
          fallbackMessage,
          updatedAt: new Date()
        }
      })
    } else {
      // Maak nieuwe instellingen aan
      settings = await prisma.chatbot_settings.create({
        data: {
          id: `chatbot_${session.user.id}_${Date.now()}`,
          userId: session.user.id,
          name,
          welcomeMessage,
          placeholderText,
          primaryColor,
          secondaryColor,
          tone,
          temperature,
          maxResponseLength,
          fallbackMessage,
          apiKey: `api_${session.user.id}_${Date.now()}`,
          updatedAt: new Date()
        }
      })
    }

    return NextResponse.json({
      message: 'Instellingen succesvol opgeslagen',
      settings
    })

  } catch (error) {
    console.error('Settings PUT error:', error)
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het opslaan van de instellingen' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

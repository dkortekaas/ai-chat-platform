import { SettingsForm } from '@/components/chatbot/settings-form'
import { ChatbotPreview } from '@/components/chatbot/chatbot-preview'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

const prisma = new PrismaClient()

async function getSettings(userId: string) {
  try {
    let settings = await prisma.chatbotSettings.findFirst({
      where: {
        userId: userId
      }
    })

    // Als er geen instellingen zijn, maak dan standaard instellingen aan
    if (!settings) {
      settings = await prisma.chatbotSettings.create({
        data: {
          userId: userId,
          name: 'AI Assistant',
          welcomeMessage: 'Hallo! Hoe kan ik je helpen?',
          placeholderText: 'Typ je vraag hier...',
          primaryColor: '#3B82F6',
          secondaryColor: '#10B981',
          tone: 'friendly',
          temperature: 0.7,
          maxResponseLength: 500,
          fallbackMessage: 'Sorry, ik begrijp je vraag niet. Kun je het anders formuleren?'
        }
      })
    }

    return settings
  } finally {
    await prisma.$disconnect()
  }
}

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/login')
  }

  const settings = await getSettings(session.user.id)

  // Transform settings to match form schema
  const formData = {
    name: settings.name,
    welcomeMessage: settings.welcomeMessage,
    placeholderText: settings.placeholderText,
    primaryColor: settings.primaryColor,
    secondaryColor: settings.secondaryColor,
    tone: settings.tone as 'professional' | 'friendly' | 'casual',
    temperature: settings.temperature,
    maxResponseLength: settings.maxResponseLength,
    fallbackMessage: settings.fallbackMessage
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Chatbot Instellingen</h1>
        <p className="mt-1 text-sm text-gray-500">
          Pas je chatbot aan naar jouw wensen
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <SettingsForm initialData={formData} />
        </div>
        <div>
          <ChatbotPreview />
        </div>
      </div>
    </div>
  )
}

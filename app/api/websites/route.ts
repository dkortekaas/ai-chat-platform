import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/websites - Get all websites for a specific assistant
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const assistantId = searchParams.get('assistantId')

    if (!assistantId) {
      return NextResponse.json(
        { error: 'Assistant ID is required' },
        { status: 400 }
      )
    }

    // Verify the assistant belongs to the user
    const assistant = await prisma.assistant.findFirst({
      where: {
        id: assistantId,
        userId: session.user.id
      }
    })

    if (!assistant) {
      return NextResponse.json(
        { error: 'Assistant not found' },
        { status: 404 }
      )
    }

    const websites = await prisma.website.findMany({
      where: {
        assistantId
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(websites)
  } catch (error) {
    console.error('Error fetching websites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch websites' },
      { status: 500 }
    )
  }
}

// POST /api/websites - Create a new website
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { url, name, description, syncInterval, assistantId } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    if (!assistantId) {
      return NextResponse.json(
        { error: 'Assistant ID is required' },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    // Verify the assistant belongs to the user
    const assistant = await prisma.assistant.findFirst({
      where: {
        id: assistantId,
        userId: session.user.id
      }
    })

    if (!assistant) {
      return NextResponse.json(
        { error: 'Assistant not found' },
        { status: 404 }
      )
    }

    // Check if website already exists for this assistant
    const existingWebsite = await prisma.website.findFirst({
      where: { 
        assistantId,
        url 
      }
    })

    if (existingWebsite) {
      return NextResponse.json(
        { error: 'Website with this URL already exists for this assistant' },
        { status: 409 }
      )
    }

    const website = await prisma.website.create({
      data: {
        assistantId,
        url,
        name: name || null,
        description: description || null,
        syncInterval: syncInterval || 'never',
        status: 'PENDING'
      }
    })

    return NextResponse.json(website, { status: 201 })
  } catch (error) {
    console.error('Error creating website:', error)
    return NextResponse.json(
      { error: 'Failed to create website' },
      { status: 500 }
    )
  }
}

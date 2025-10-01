import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/websites/[id] - Get a specific website
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const website = await prisma.website.findUnique({
      where: { id }
    })

    if (!website) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(website)
  } catch (error) {
    console.error('Error fetching website:', error)
    return NextResponse.json(
      { error: 'Failed to fetch website' },
      { status: 500 }
    )
  }
}

// PUT /api/websites/[id] - Update a website
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { url, name, description, syncInterval } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
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

    // Check if website exists
    const existingWebsite = await prisma.website.findUnique({
      where: { id }
    })

    if (!existingWebsite) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      )
    }

    // Check if URL is already taken by another website
    const urlConflict = await prisma.website.findFirst({
      where: {
        url,
        id: { not: id }
      }
    })

    if (urlConflict) {
      return NextResponse.json(
        { error: 'Website with this URL already exists' },
        { status: 409 }
      )
    }

    const website = await prisma.website.update({
      where: { id },
      data: {
        url,
        name: name || null,
        description: description || null,
        syncInterval: syncInterval || 'never'
      }
    })

    return NextResponse.json(website)
  } catch (error) {
    console.error('Error updating website:', error)
    return NextResponse.json(
      { error: 'Failed to update website' },
      { status: 500 }
    )
  }
}

// DELETE /api/websites/[id] - Delete a website
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    // Check if website exists
    const existingWebsite = await prisma.website.findUnique({
      where: { id }
    })

    if (!existingWebsite) {
      return NextResponse.json(
        { error: 'Website not found' },
        { status: 404 }
      )
    }

    await prisma.website.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Website deleted successfully' })
  } catch (error) {
    console.error('Error deleting website:', error)
    return NextResponse.json(
      { error: 'Failed to delete website' },
      { status: 500 }
    )
  }
}

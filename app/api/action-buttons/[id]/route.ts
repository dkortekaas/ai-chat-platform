import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const actionButton = await prisma.actionButton.findFirst({
      where: {
        id: params.id,
        assistant: {
          userId: session.user.id
        }
      }
    })

    if (!actionButton) {
      return NextResponse.json({ error: 'Action button not found' }, { status: 404 })
    }

    return NextResponse.json(actionButton)
  } catch (error) {
    console.error('Error fetching action button:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { buttonText, question, priority, enabled } = body

    // Verify the action button belongs to the user
    const existingButton = await prisma.actionButton.findFirst({
      where: {
        id: params.id,
        assistant: {
          userId: session.user.id
        }
      }
    })

    if (!existingButton) {
      return NextResponse.json({ error: 'Action button not found' }, { status: 404 })
    }

    const actionButton = await prisma.actionButton.update({
      where: { id: params.id },
      data: {
        ...(buttonText !== undefined && { buttonText }),
        ...(question !== undefined && { question }),
        ...(priority !== undefined && { priority }),
        ...(enabled !== undefined && { enabled })
      }
    })

    return NextResponse.json(actionButton)
  } catch (error) {
    console.error('Error updating action button:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify the action button belongs to the user
    const existingButton = await prisma.actionButton.findFirst({
      where: {
        id: params.id,
        assistant: {
          userId: session.user.id
        }
      }
    })

    if (!existingButton) {
      return NextResponse.json({ error: 'Action button not found' }, { status: 404 })
    }

    await prisma.actionButton.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Action button deleted successfully' })
  } catch (error) {
    console.error('Error deleting action button:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/projects - Get all projects with relations
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    // For development, allow access without session for testing
    // In production, uncomment the following lines:
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    const projects = await prisma.project.findMany({
      // Filter by user when authentication is fully implemented
      // where: {
      //   OR: [
      //     { ownerId: session.user.id },
      //     { members: { some: { userId: session.user.id } } }
      //   ]
      // },
      include: {
        owner: {
          select: { id: true, name: true, email: true }
        },
        // Phase 1: Count fields removed due to simplified relations
        // _count: {
        //   select: { 
        //     tasks: true,
        //     members: true 
        //   }
        // }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Projects GET error:', error)
    return NextResponse.json(
      { error: "Failed to fetch projects", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST /api/projects - Create new project
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    const body = await request.json()
    console.log('POST /api/projects - Request body:', JSON.stringify(body, null, 2))
    console.log('POST /api/projects - Session:', session ? 'exists' : 'null')
    const { name, description, projectGoal, projectValue, website, status, priority, projectType, startDate, endDate, timelineEvents } = body

    // Use session user ID or fallback to test user for development
    const userId = session?.user?.id || 'user_test_1' // For development testing

    // Create project and timeline events in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the project first
      const project = await tx.project.create({
        data: {
          name,
          description,
          projectGoal,
          projectValue: projectValue ? parseFloat(projectValue) : null,
          website,
          status: status || 'PLANNING',
          priority: priority || 'MEDIUM',
          projectType: projectType || 'DEVELOPMENT',
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          ownerId: userId
        },
        include: {
          owner: {
            select: { id: true, name: true, email: true }
          }
        }
      })

      // Create timeline events if provided
      let createdEvents: any[] = []
      if (timelineEvents && Array.isArray(timelineEvents) && timelineEvents.length > 0) {
        const timelineData = timelineEvents.map((event: any) => ({
          projectId: project.id,
          title: event.title,
          description: event.description || null,
          date: new Date(event.date),
          type: event.type || 'milestone'
        }))

        // Create timeline events individually (SQLite compatibility)
        for (const eventData of timelineData) {
          const createdEvent = await tx.timelineEvent.create({
            data: eventData
          })
          createdEvents.push(createdEvent)
        }
      }

      return { project, timelineEvents: createdEvents }
    })

    const { project, timelineEvents: createdTimelineEvents } = result

    return NextResponse.json({ 
      ...project, 
      timelineEvents: createdTimelineEvents 
    }, { status: 201 })
  } catch (error) {
    console.error('Projects POST error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { 
        error: "Failed to create project", 
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
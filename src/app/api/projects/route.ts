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
    const { name, description, projectGoal, projectValue, website, status, priority, projectType, startDate, endDate } = body

    // Use session user ID or fallback to test user for development
    const userId = session?.user?.id || 'user_test_1' // For development testing

    const project = await prisma.project.create({
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
        },
        // Phase 1: Count fields removed due to simplified relations
        // _count: {
        //   select: { 
        //     tasks: true,
        //     members: true 
        //   }
        // }
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Projects POST error:', error)
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    )
  }
}
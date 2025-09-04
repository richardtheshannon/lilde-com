import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/projects/[id]/tasks - Get all tasks for a project
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    
    // For development, allow access without session for testing
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    // }

    // First verify project exists
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { owner: true }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    const tasks = await prisma.task.findMany({
      where: { projectId: params.id },
      include: {
        assignee: {
          select: { id: true, name: true, email: true }
        },
        subtasks: {
          select: { id: true, title: true, status: true }
        },
        _count: {
          select: { comments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Tasks GET error:', error)
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 }
    )
  }
}

// POST /api/projects/[id]/tasks - Create new task
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    const body = await request.json()
    const { 
      title, 
      description, 
      status = 'TODO', 
      priority = 'MEDIUM',
      assigneeId,
      parentId,
      category,
      dueDate,
      timeEstimate
    } = body

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      )
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: params.id }
    })

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      )
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status,
        priority,
        projectId: params.id,
        assigneeId: assigneeId || null,
        parentId: parentId || null,
        category: category?.trim() || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        timeEstimate: timeEstimate ? parseFloat(timeEstimate.toString()) : null,
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true }
        },
        subtasks: {
          select: { id: true, title: true, status: true }
        },
        _count: {
          select: { comments: true }
        }
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Task POST error:', error)
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getSession } from '@/lib/auth'

const prisma = new PrismaClient()

// GET /api/projects/[id]/tasks/[taskId] - Get individual task
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    const session = await getSession()

    const task = await prisma.task.findFirst({
      where: { 
        id: params.taskId,
        projectId: params.id
      },
      include: {
        assignee: {
          select: { id: true, name: true, email: true }
        },
        parent: {
          select: { id: true, title: true }
        },
        subtasks: {
          select: { id: true, title: true, status: true }
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, email: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { comments: true }
        }
      }
    })

    if (!task) {
      return NextResponse.json(
        { error: "Task not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Task GET error:', error)
    return NextResponse.json(
      { error: "Failed to fetch task" },
      { status: 500 }
    )
  }
}

// PUT /api/projects/[id]/tasks/[taskId] - Update task
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    const session = await getSession()
    const body = await request.json()
    const { 
      title, 
      description, 
      status, 
      priority,
      assigneeId,
      parentId,
      category,
      dueDate,
      timeEstimate,
      timeSpent
    } = body

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 }
      )
    }

    const updatedTask = await prisma.task.update({
      where: { 
        id: params.taskId,
        projectId: params.id
      },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        status,
        priority,
        assigneeId: assigneeId || null,
        parentId: parentId || null,
        category: category?.trim() || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        timeEstimate: timeEstimate ? parseFloat(timeEstimate.toString()) : null,
        timeSpent: timeSpent ? parseFloat(timeSpent.toString()) : null,
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

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Task PUT error:', error)
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[id]/tasks/[taskId] - Delete task
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    const session = await getSession()

    await prisma.task.delete({
      where: { 
        id: params.taskId,
        projectId: params.id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Task DELETE error:', error)
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    )
  }
}
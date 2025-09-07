import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/timeline/today - Get timeline events for today
export async function GET(request: NextRequest) {
  try {
    // Get today's date range (start of day to end of day)
    const today = new Date()
    const startOfDay = new Date(today)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(today)
    endOfDay.setHours(23, 59, 59, 999)

    console.log('Fetching timeline events for date range:', startOfDay, 'to', endOfDay)

    // Fetch timeline events for today with project details
    const todayEvents = await prisma.timelineEvent.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            status: true,
            priority: true,
            projectType: true,
            owner: {
              select: { 
                id: true, 
                name: true, 
                email: true 
              }
            }
          }
        }
      },
      orderBy: { date: 'asc' }
    })

    console.log(`Found ${todayEvents.length} timeline events for today`)
    
    return NextResponse.json(todayEvents)
  } catch (error) {
    console.error('Timeline today GET error:', error)
    return NextResponse.json(
      { error: "Failed to fetch today's timeline events", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
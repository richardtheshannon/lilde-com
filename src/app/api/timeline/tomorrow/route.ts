import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/timeline/tomorrow - Get timeline events for tomorrow
export async function GET(request: NextRequest) {
  try {
    // Get tomorrow's date range (start of day to end of day)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const startOfDay = new Date(tomorrow)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(tomorrow)
    endOfDay.setHours(23, 59, 59, 999)

    console.log('Fetching timeline events for tomorrow:', startOfDay, 'to', endOfDay)

    // Fetch timeline events for tomorrow with project details
    const tomorrowEvents = await prisma.timelineEvent.findMany({
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

    console.log(`Found ${tomorrowEvents.length} timeline events for tomorrow`)
    
    return NextResponse.json(tomorrowEvents)
  } catch (error) {
    console.error('Timeline tomorrow GET error:', error)
    return NextResponse.json(
      { error: "Failed to fetch tomorrow's timeline events", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/timeline/overdue - Get overdue timeline events
export async function GET(request: NextRequest) {
  try {
    // Get current date/time
    const now = new Date()
    
    console.log('Fetching overdue timeline events before:', now)

    // Fetch timeline events that are in the past
    // Exclude events from completed projects
    const overdueEvents = await prisma.timelineEvent.findMany({
      where: {
        date: {
          lt: now
        },
        project: {
          status: {
            notIn: ['COMPLETED', 'CANCELLED']
          }
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
      orderBy: { date: 'desc' } // Most recently overdue first
    })

    console.log(`Found ${overdueEvents.length} overdue timeline events`)
    
    // Calculate how overdue each event is
    const eventsWithOverdueInfo = overdueEvents.map(event => {
      const eventDate = new Date(event.date)
      const msOverdue = now.getTime() - eventDate.getTime()
      const daysOverdue = Math.floor(msOverdue / (1000 * 60 * 60 * 24))
      const hoursOverdue = Math.floor(msOverdue / (1000 * 60 * 60))
      
      return {
        ...event,
        daysOverdue,
        hoursOverdue,
        overdueText: daysOverdue > 0 
          ? `${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`
          : `${hoursOverdue} hour${hoursOverdue !== 1 ? 's' : ''} overdue`
      }
    })
    
    return NextResponse.json(eventsWithOverdueInfo)
  } catch (error) {
    console.error('Timeline overdue GET error:', error)
    return NextResponse.json(
      { error: "Failed to fetch overdue timeline events", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
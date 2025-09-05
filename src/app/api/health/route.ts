import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const health: any = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  }

  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`
    health.status = 'healthy'
    health.database = 'connected'
    
    return NextResponse.json(health)
  } catch (error) {
    health.status = 'unhealthy'
    health.database = 'disconnected'
    health.error = error instanceof Error ? error.message : 'Database connection failed'
    
    // Return 503 Service Unavailable when database is down
    return NextResponse.json(health, { status: 503 })
  }
}
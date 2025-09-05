import { NextResponse } from 'next/server'

export async function GET() {
  // Simple health check that doesn't require database
  // Once database is configured, you can uncomment the DB check below
  
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  }

  // Optional: Check database connection when configured
  // try {
  //   const { prisma } = await import('@/lib/prisma')
  //   await prisma.$queryRaw`SELECT 1`
  //   health.database = 'connected'
  // } catch (error) {
  //   health.database = 'disconnected'
  //   // Don't fail health check if DB is not configured yet
  // }

  return NextResponse.json(health)
}
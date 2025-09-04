import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Fetch from our own API
    const response = await fetch('http://localhost:3000/api/projects', {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return NextResponse.json({ 
        error: 'Failed to fetch', 
        status: response.status,
        statusText: response.statusText 
      }, { status: 500 })
    }
    
    const data = await response.json()
    
    return NextResponse.json({
      success: true,
      count: data.length,
      firstProject: data[0] || null,
      projects: data
    })
  } catch (error) {
    return NextResponse.json({ 
      error: 'Exception occurred',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
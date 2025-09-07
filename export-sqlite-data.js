const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function exportData() {
  try {
    console.log('Exporting SQLite data...')
    
    // Export Users
    const users = await prisma.user.findMany()
    console.log(`Found ${users.length} users:`, users)
    
    // Export Projects  
    const projects = await prisma.project.findMany({
      include: {
        timelineEvents: true
      }
    })
    console.log(`Found ${projects.length} projects:`, projects)
    
    // Export Timeline Events
    const timelineEvents = await prisma.timelineEvent.findMany()
    console.log(`Found ${timelineEvents.length} timeline events:`, timelineEvents)
    
    // Save to JSON file for backup
    const exportData = {
      users,
      projects,
      timelineEvents,
      exportDate: new Date().toISOString()
    }
    
    fs.writeFileSync('sqlite-data-export.json', JSON.stringify(exportData, null, 2))
    console.log('Data exported to sqlite-data-export.json')
    
  } catch (error) {
    console.error('Export failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportData()
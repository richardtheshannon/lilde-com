const { PrismaClient } = require('@prisma/client')
const fs = require('fs')

const prisma = new PrismaClient()

async function importData() {
  try {
    console.log('Loading SQLite export data...')
    const exportData = JSON.parse(fs.readFileSync('sqlite-data-export.json', 'utf8'))
    
    console.log(`Found ${exportData.users.length} users, ${exportData.projects.length} projects, ${exportData.timelineEvents.length} timeline events`)
    
    // Import Users first
    console.log('Importing users...')
    for (const user of exportData.users) {
      // Convert string role to enum value
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role, // USER, ADMIN, VIEWER - already matches enum
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt)
      }
      
      await prisma.user.create({
        data: userData
      })
      console.log(`✅ Imported user: ${user.name} (${user.email})`)
    }
    
    // Import Projects
    console.log('Importing projects...')
    for (const project of exportData.projects) {
      // Convert string enums to proper enum values
      const projectData = {
        id: project.id,
        name: project.name,
        description: project.description,
        projectGoal: project.projectGoal,
        projectValue: project.projectValue,
        website: project.website,
        status: project.status, // PLANNING, IN_PROGRESS, etc.
        priority: project.priority, // MEDIUM, HIGH, etc.
        projectType: project.projectType, // DEVELOPMENT, DESIGN, etc.
        startDate: project.startDate ? new Date(project.startDate) : null,
        endDate: project.endDate ? new Date(project.endDate) : null,
        budget: project.budget,
        createdAt: new Date(project.createdAt),
        updatedAt: new Date(project.updatedAt),
        ownerId: project.ownerId
      }
      
      await prisma.project.create({
        data: projectData
      })
      console.log(`✅ Imported project: ${project.name}`)
    }
    
    // Import Timeline Events
    console.log('Importing timeline events...')
    for (const event of exportData.timelineEvents) {
      const eventData = {
        id: event.id,
        projectId: event.projectId,
        title: event.title,
        description: event.description,
        date: new Date(event.date),
        type: event.type,
        createdAt: new Date(event.createdAt),
        updatedAt: new Date(event.updatedAt)
      }
      
      await prisma.timelineEvent.create({
        data: eventData
      })
      console.log(`✅ Imported timeline event: ${event.title}`)
    }
    
    console.log('🎉 Data import completed successfully!')
    
    // Verify the import
    const userCount = await prisma.user.count()
    const projectCount = await prisma.project.count()
    const eventCount = await prisma.timelineEvent.count()
    
    console.log(`\\n📊 Final counts:`)
    console.log(`   Users: ${userCount}`)
    console.log(`   Projects: ${projectCount}`)
    console.log(`   Timeline Events: ${eventCount}`)
    
  } catch (error) {
    console.error('❌ Import failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importData()
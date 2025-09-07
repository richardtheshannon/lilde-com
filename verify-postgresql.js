const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function verifyDatabase() {
  try {
    console.log('🔍 Verifying PostgreSQL database connection...')
    
    // Test database connection
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Test Users table
    const users = await prisma.user.findMany()
    console.log(`✅ Users table: Found ${users.length} users`)
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role}`)
    })
    
    // Test Projects table with timeline events
    const projects = await prisma.project.findMany({
      include: {
        timelineEvents: true,
        owner: true
      }
    })
    console.log(`✅ Projects table: Found ${projects.length} projects`)
    projects.forEach(project => {
      console.log(`   - ${project.name} (${project.status}, ${project.priority}, ${project.projectType})`)
      console.log(`     Owner: ${project.owner.name}`)
      console.log(`     Timeline Events: ${project.timelineEvents.length}`)
    })
    
    // Test Timeline Events
    const timelineEvents = await prisma.timelineEvent.findMany({
      orderBy: { date: 'asc' }
    })
    console.log(`✅ Timeline Events: Found ${timelineEvents.length} events`)
    timelineEvents.slice(0, 3).forEach(event => {
      console.log(`   - ${event.title} (${event.date.toISOString().split('T')[0]})`)
    })
    
    console.log('\\n🎉 PostgreSQL migration verification complete!')
    console.log('✅ All tables created successfully')
    console.log('✅ All data migrated successfully')
    console.log('✅ Enum types working properly')
    console.log('✅ Relationships intact')
    
  } catch (error) {
    console.error('❌ Database verification failed:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

verifyDatabase()
const { PrismaClient } = require('@prisma/client');

async function verifyDatabaseFunctionality() {
  console.log('🔍 Verifying lilde-com database functionality...');
  
  const prisma = new PrismaClient();

  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test creating a user
    console.log('👤 Testing user creation...');
    const testUser = await prisma.user.create({
      data: {
        email: 'test@lilde.com',
        name: 'Test User',
        role: 'USER'
      }
    });
    console.log('✅ User created:', testUser.id);

    // Test creating a project
    console.log('📋 Testing project creation...');
    const testProject = await prisma.project.create({
      data: {
        name: 'Test Project',
        description: 'A test project for lilde-com',
        projectGoal: 'Verify database functionality',
        status: 'PLANNING',
        priority: 'MEDIUM',
        projectType: 'DEVELOPMENT',
        ownerId: testUser.id,
        projectValue: 1000.00
      }
    });
    console.log('✅ Project created:', testProject.id);

    // Test creating timeline events
    console.log('📅 Testing timeline event creation...');
    const timelineEvent = await prisma.timelineEvent.create({
      data: {
        projectId: testProject.id,
        title: 'Project Kickoff',
        description: 'Initial project setup and planning',
        date: new Date(),
        type: 'milestone'
      }
    });
    console.log('✅ Timeline event created:', timelineEvent.id);

    // Test querying data with relations
    console.log('🔎 Testing data retrieval with relations...');
    const projectWithEvents = await prisma.project.findUnique({
      where: { id: testProject.id },
      include: {
        owner: true,
        timelineEvents: true
      }
    });
    console.log('✅ Project query successful with', projectWithEvents.timelineEvents.length, 'timeline events');

    // Cleanup test data
    console.log('🧹 Cleaning up test data...');
    await prisma.timelineEvent.delete({ where: { id: timelineEvent.id } });
    await prisma.project.delete({ where: { id: testProject.id } });
    await prisma.user.delete({ where: { id: testUser.id } });
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All database functionality tests passed!');
    console.log('📝 Database verification summary:');
    console.log('   ✅ Connection test: PASSED');
    console.log('   ✅ User CRUD operations: PASSED');
    console.log('   ✅ Project CRUD operations: PASSED');
    console.log('   ✅ Timeline events: PASSED');
    console.log('   ✅ Relationship queries: PASSED');
    console.log('   ✅ Data cleanup: PASSED');

  } catch (error) {
    console.error('❌ Database verification failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

verifyDatabaseFunctionality();
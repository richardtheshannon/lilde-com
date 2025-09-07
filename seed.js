const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Create a test user
  const testUser = await prisma.user.create({
    data: {
      id: 'user_test_1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'USER',
    },
  })

  console.log('Created test user:', testUser)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
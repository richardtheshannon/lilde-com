const { Client } = require('pg')

async function grantCreateDB() {
  const adminClient = new Client({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'Superculture1@'
  })

  try {
    console.log('Connecting to PostgreSQL as admin...')
    await adminClient.connect()
    
    console.log('Granting CREATEDB privilege to hla_user...')
    await adminClient.query('ALTER USER hla_user CREATEDB')
    
    console.log('✅ CREATEDB privilege granted successfully!')
    
  } catch (error) {
    console.error('❌ Error granting privileges:', error.message)
  } finally {
    await adminClient.end()
  }
}

grantCreateDB()
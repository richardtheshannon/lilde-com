const { Client } = require('pg')

async function fixPermissions() {
  const adminClient = new Client({
    host: 'localhost',
    port: 5432,
    database: 'hla-dataspur',
    user: 'postgres',
    password: 'Superculture1@'
  })

  try {
    console.log('Connecting to hla-dataspur database as admin...')
    await adminClient.connect()
    
    console.log('Granting schema permissions...')
    await adminClient.query('GRANT ALL ON SCHEMA public TO hla_user')
    await adminClient.query('GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hla_user')
    await adminClient.query('GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hla_user')
    await adminClient.query('GRANT USAGE, CREATE ON SCHEMA public TO hla_user')
    
    console.log('✅ Schema permissions granted successfully!')
    
  } catch (error) {
    console.error('❌ Error granting permissions:', error.message)
  } finally {
    await adminClient.end()
  }
}

fixPermissions()
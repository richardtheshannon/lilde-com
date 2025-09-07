const { Client } = require('pg')

async function createDatabase() {
  // Connect to postgres database as superuser to create new database and user
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
    
    console.log('Dropping existing database and user if they exist...')
    await adminClient.query('DROP DATABASE IF EXISTS "hla-dataspur"')
    await adminClient.query('DROP USER IF EXISTS hla_user')
    
    console.log('Creating database...')
    await adminClient.query('CREATE DATABASE "hla-dataspur"')
    
    console.log('Creating user...')
    await adminClient.query("CREATE USER hla_user WITH PASSWORD 'hla_secure_2025'")
    
    console.log('Granting privileges...')
    await adminClient.query('GRANT ALL PRIVILEGES ON DATABASE "hla-dataspur" TO hla_user')
    
    console.log('✅ Database and user created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating database:', error.message)
  } finally {
    await adminClient.end()
  }
  
  // Test connection with new user
  const testClient = new Client({
    host: 'localhost',
    port: 5432,
    database: 'hla-dataspur',
    user: 'hla_user',
    password: 'hla_secure_2025'
  })
  
  try {
    console.log('Testing connection with new user...')
    await testClient.connect()
    const result = await testClient.query('SELECT current_database(), current_user')
    console.log('✅ Connection test successful:', result.rows[0])
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
  } finally {
    await testClient.end()
  }
}

createDatabase()
const { Client } = require('pg');

async function setupLildeDatabase() {
  console.log('🚀 Setting up PostgreSQL database for lilde-com...');
  
  // Connect to PostgreSQL as superuser to create database and user
  const adminClient = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'Superculture1@',
    database: 'postgres'
  });

  try {
    await adminClient.connect();
    console.log('✅ Connected to PostgreSQL as admin');

    // Create user first
    console.log('📝 Creating user lilde_user...');
    try {
      await adminClient.query(`CREATE USER lilde_user WITH PASSWORD 'Superculture1@';`);
      console.log('✅ User lilde_user created successfully');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  User lilde_user already exists, continuing...');
      } else {
        throw error;
      }
    }

    // Grant CREATEDB privilege
    console.log('🔑 Granting CREATEDB privilege to lilde_user...');
    await adminClient.query(`ALTER USER lilde_user CREATEDB;`);
    console.log('✅ CREATEDB privilege granted');

    // Create database
    console.log('💾 Creating database lilde_dataspur...');
    try {
      await adminClient.query(`CREATE DATABASE lilde_dataspur OWNER lilde_user;`);
      console.log('✅ Database lilde_dataspur created successfully');
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️  Database lilde_dataspur already exists, updating owner...');
        await adminClient.query(`ALTER DATABASE lilde_dataspur OWNER TO lilde_user;`);
        console.log('✅ Database ownership updated');
      } else {
        throw error;
      }
    }

    await adminClient.end();

    // Connect to the new database to grant schema permissions
    console.log('🔧 Setting up schema permissions...');
    const dbClient = new Client({
      host: 'localhost',
      port: 5432,
      user: 'postgres',
      password: 'Superculture1@',
      database: 'lilde_dataspur'
    });

    await dbClient.connect();
    
    // Grant all privileges on schema
    await dbClient.query(`GRANT ALL PRIVILEGES ON SCHEMA public TO lilde_user;`);
    await dbClient.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO lilde_user;`);
    await dbClient.query(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO lilde_user;`);
    await dbClient.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO lilde_user;`);
    await dbClient.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO lilde_user;`);
    
    console.log('✅ Schema permissions granted');
    await dbClient.end();

    // Test connection with new user
    console.log('🧪 Testing connection with new user...');
    const testClient = new Client({
      host: 'localhost',
      port: 5432,
      user: 'lilde_user',
      password: 'Superculture1@',
      database: 'lilde_dataspur'
    });

    await testClient.connect();
    const result = await testClient.query('SELECT version();');
    console.log('✅ Connection test successful:', result.rows[0].version.substring(0, 50) + '...');
    await testClient.end();

    console.log('\n🎉 Database setup completed successfully!');
    console.log('📝 Connection details:');
    console.log('   Database: lilde_dataspur');
    console.log('   User: lilde_user');
    console.log('   Password: Superculture1@');
    console.log('   Connection string: postgresql://lilde_user:Superculture1@@localhost:5432/lilde_dataspur?schema=public');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  }
}

setupLildeDatabase();
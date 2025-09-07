-- Create database and user for hla-dataspur project
DROP DATABASE IF EXISTS "hla-dataspur";
DROP USER IF EXISTS hla_user;

CREATE DATABASE "hla-dataspur";
CREATE USER hla_user WITH PASSWORD 'hla_secure_2025';
GRANT ALL PRIVILEGES ON DATABASE "hla-dataspur" TO hla_user;

-- Connect to the new database to set up permissions
\c "hla-dataspur";
GRANT ALL ON SCHEMA public TO hla_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO hla_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO hla_user;
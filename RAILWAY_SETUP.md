# Railway Deployment Setup Guide

## Environment Variables Configuration

### Required Variables for Your Application Service

In Railway, go to your **Application Service** (NOT the database service) and set these environment variables:

1. **PORT**
   - Set to: `8081` (or your desired port if different from default 8080)
   - Required if you're running multiple services or changed Railway's port setting

2. **DATABASE_URL**
   - Use Railway's reference variable to connect to your Postgres service
   - Set value to: `${{Postgres.DATABASE_URL}}`
   - Note: Replace "Postgres" with your actual database service name if different

3. **NEXTAUTH_URL**
   - Set to: `https://highline-dataspur-production.up.railway.app`
   - Important: Include the `https://` protocol

4. **NEXTAUTH_SECRET**
   - Use this generated secure key: `E91Rh4yDEa3E2I6baENZ7o0B8IIthORlQrwxSJrx+c4=`
   - Or generate your own using: `openssl rand -base64 32`

### How to Set Variables in Railway

1. Go to your Railway project
2. Click on your **Application Service** (not the database)
3. Go to the "Variables" tab
4. Click "RAW Editor" for easier editing
5. Add/Update these variables:

```env
PORT=8081
DATABASE_URL=${{Postgres.DATABASE_URL}}
NEXTAUTH_URL=https://highline-dataspur-production.up.railway.app
NEXTAUTH_SECRET=E91Rh4yDEa3E2I6baENZ7o0B8IIthORlQrwxSJrx+c4=
```

### Important Notes

- **Remove the placeholder DATABASE_URL** that currently says `postgresql://username:password@host:port/database`
- The `${{Postgres.DATABASE_URL}}` syntax tells Railway to use the connection string from your Postgres service
- Make sure NEXTAUTH_URL includes `https://` and matches your actual Railway domain
- Your PostgreSQL service variables look correct and don't need changes

### Deployment Commands

The application uses these npm scripts:
- `start:prod` - Runs migrations then starts the app (recommended for Railway)
- `start:railway` - Starts the app without migrations (use if migrations are already done)

Railway is configured to use `start:prod` by default.

### Verifying Deployment

1. After setting variables, Railway will automatically redeploy
2. Check the deployment logs for any errors
3. Visit `/api/health` endpoint to verify database connection
4. The health check should return:
   ```json
   {
     "status": "healthy",
     "database": "connected",
     "timestamp": "...",
     "environment": "production",
     "uptime": ...
   }
   ```

### Troubleshooting

If you still see 502 Bad Gateway:
1. Check deployment logs in Railway for specific errors
2. Ensure all environment variables are set correctly
3. Verify the database service is running
4. Check that migrations have run successfully

If health check fails:
- The endpoint will return status 503 with error details
- Check the error message for database connection issues
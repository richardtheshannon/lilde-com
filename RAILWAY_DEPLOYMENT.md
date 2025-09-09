# Railway Deployment Guide for lilde-com

This guide provides step-by-step instructions for deploying the lilde-com application to Railway.

## Prerequisites

- ✅ GitHub repository: `https://github.com/richardtheshannon/lilde-com`
- ✅ Railway account (sign up at [railway.app](https://railway.app))
- ✅ Local PostgreSQL database working (lilde_dataspur)

## Railway Deployment Steps

### 1. Create New Railway Project

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `richardtheshannon/lilde-com` repository

### 2. Add PostgreSQL Database Service

1. In your Railway project dashboard, click "New" → "Database" → "PostgreSQL"
2. Railway will automatically provision a PostgreSQL database
3. Note the generated database URL (you'll use this in environment variables)

### 3. Configure Environment Variables

In the Railway project settings, add these environment variables:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
NEXTAUTH_URL=https://[your-app-name].railway.app
NEXTAUTH_SECRET=lilde-nextauth-secret-2025-production-v1-secure-key-9a8b7c6d5e4f3g2h1i0j
PORT=8081
```

**Important Notes:**
- `DATABASE_URL` uses Railway's PostgreSQL service reference
- Replace `[your-app-name]` in `NEXTAUTH_URL` with your actual Railway app domain
- The `NEXTAUTH_SECRET` is already configured for production
- `PORT=8081` is required for Railway's port configuration

### 4. Deploy Configuration

The application is already configured for Railway deployment with:

- ✅ **railway.json**: Deployment configuration with health checks
- ✅ **package.json**: Production build scripts with automatic migrations
- ✅ **Health Check Endpoint**: `/api/health` for Railway monitoring
- ✅ **Database Migrations**: Automatic Prisma migrations on deploy

### 5. Deploy and Verify

1. Railway will automatically deploy when you push to main branch
2. Monitor the deployment logs in Railway dashboard
3. Once deployed, verify these endpoints:
   - Health check: `https://[your-app].railway.app/api/health`
   - Main application: `https://[your-app].railway.app`

## Configuration Files Already Set Up

### railway.json
```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 300,
    "region": "us-west1"
  }
}
```

### package.json Scripts
```json
{
  "start:prod": "npx prisma migrate deploy && next start -p $PORT -H 0.0.0.0"
}
```

## Post-Deployment Verification

1. **Health Check**: Visit `/api/health` to verify database connectivity
2. **Database**: Prisma migrations will run automatically on first deploy
3. **Features**: Test project creation, timeline upload, and theme switching
4. **Performance**: Monitor Railway metrics dashboard

## Troubleshooting

### Common Issues:

**Build Fails:**
- Check Railway build logs for TypeScript errors
- Ensure all dependencies are in package.json

**Database Connection Errors:**
- Verify `DATABASE_URL` environment variable
- Check PostgreSQL service is running in Railway

**502 Gateway Errors:**
- Ensure `PORT=8081` is set in environment variables
- Check health check endpoint is responding

### Support Files Created:

- `setup-lilde-db.js` - Local database setup script
- `verify-lilde-db.js` - Database functionality verification
- This deployment guide

## Security Notes

- ✅ Production-ready NEXTAUTH_SECRET configured
- ✅ PostgreSQL user with limited privileges
- ✅ Environment variables properly configured
- ✅ Health checks enabled for monitoring

## Next Steps After Deployment

1. **Custom Domain**: Configure custom domain in Railway settings if needed
2. **Monitoring**: Set up Railway monitoring alerts
3. **Backups**: Configure database backups in Railway PostgreSQL settings
4. **SSL**: Railway provides SSL certificates automatically
5. **Scaling**: Monitor usage and scale resources as needed

---

**Deployment Status**: ✅ Ready for Railway deployment
**Local Database**: ✅ Configured and tested
**GitHub Repository**: ✅ Updated and pushed
**Configuration**: ✅ Production-ready
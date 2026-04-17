# Deployment Guide - Oris Cloud Backend

## Railway Deployment

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub account
3. Create a new project

### Step 2: Connect GitHub Repository

1. Click "New Project"
2. Select "Deploy from GitHub"
3. Authorize Railway to access your GitHub
4. Select the `oris-cloud-backend` repository
5. Select the `main` branch

### Step 3: Add PostgreSQL Database

1. In Railway project, click "Add Service"
2. Select "PostgreSQL"
3. Railway will automatically create the database
4. The `DATABASE_URL` will be set automatically

### Step 4: Configure Environment Variables

In Railway project settings, add these variables:

```
JWT_SECRET=generate-with: openssl rand -base64 32
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://oriscloud.com.br,https://www.oriscloud.com.br
```

### Step 5: Deploy

1. Push code to GitHub
2. Railway will automatically detect changes
3. Build and deploy will start automatically
4. Check deployment logs for any errors

### Step 6: Run Migrations

After first deployment:

1. Go to Railway project
2. Click on the Node.js service
3. Open "Terminal" tab
4. Run: `npm run prisma:migrate`

### Step 7: Connect Frontend

Update your frontend to use the Railway backend URL:

```javascript
const API_URL = "https://your-railway-url.railway.app";
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| DATABASE_URL | PostgreSQL connection string | postgresql://user:pass@host:5432/db |
| JWT_SECRET | Secret for JWT signing | (generate with openssl rand -base64 32) |
| PORT | Server port | 3001 |
| NODE_ENV | Environment | production |
| CORS_ORIGIN | Allowed origins | https://oriscloud.com.br |

## Monitoring

### View Logs

1. Go to Railway project
2. Click on Node.js service
3. Click "Logs" tab
4. View real-time logs

### Database Monitoring

1. Click on PostgreSQL service
2. View connection info
3. Use Prisma Studio: `npm run prisma:studio`

## Troubleshooting

### Build Fails

1. Check Node.js version (should be 20+)
2. Verify all dependencies are in package.json
3. Check build logs for errors

### Database Connection Error

1. Verify DATABASE_URL is correct
2. Check PostgreSQL service is running
3. Run migrations: `npm run prisma:migrate`

### CORS Errors

1. Check CORS_ORIGIN includes your frontend URL
2. Verify frontend is sending correct headers
3. Restart the service

## Scaling

### Increase Resources

1. Go to Railway project
2. Click on Node.js service
3. Click "Settings"
4. Increase CPU/RAM as needed

### Database Backups

1. Railway automatically backs up PostgreSQL
2. View backups in PostgreSQL service settings
3. Can restore from backups if needed

## Custom Domain

1. Go to Railway project
2. Click on Node.js service
3. Go to "Settings"
4. Add custom domain
5. Update DNS records
6. Wait for SSL certificate

## Support

For Railway support: https://railway.app/docs
For backend issues: Check logs and error messages

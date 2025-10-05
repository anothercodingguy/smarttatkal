# 🚀 SmartTatkal Render Deployment Guide

This guide walks you through deploying SmartTatkal backend to Render and frontend to Vercel.

## 📋 Prerequisites

- GitHub repository with your SmartTatkal code
- [Render account](https://render.com/) (free tier available)
- [Vercel account](https://vercel.com/) (free tier available)

## 🔧 Backend Deployment on Render

### Step 1: Prepare Your Repository
Ensure your code is pushed to GitHub with the latest changes:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### Step 2: Create Render Web Service

1. **Go to Render Dashboard**
   - Visit [dashboard.render.com](https://dashboard.render.com/)
   - Click "New +" → "Web Service"

2. **Connect Repository**
   - Select "Build and deploy from a Git repository"
   - Connect your GitHub account
   - Choose your SmartTatkal repository

3. **Configure Service Settings**
   ```
   Name: smarttatkal-backend
   Environment: Node
   Region: Oregon (US West) or closest to your users
   Branch: main
   Root Directory: my-app/server
   ```

4. **Build & Start Commands**
   ```
   Build Command: npm ci && npm run build
   Start Command: npm start
   ```

### Step 3: Environment Variables

Add these environment variables in Render:

```env
NODE_ENV=production
PORT=10000
LOG_LEVEL=info
FRONTEND_URL=https://your-frontend-name.vercel.app
```

### Step 4: Advanced Settings

1. **Health Check Path**: `/health`
2. **Auto-Deploy**: Enable for automatic deployments on git push
3. **Instance Type**: Free (for development) or Starter+ (for production)

### Step 5: Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your backend
3. Monitor the build logs for any issues
4. Once deployed, note your backend URL: `https://smarttatkal-backend.onrender.com`

## 🌐 Frontend Deployment on Vercel

### Step 1: Deploy to Vercel

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"

2. **Import Repository**
   - Select your SmartTatkal repository
   - Set root directory: `my-app`

3. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

### Step 2: Environment Variables

Add this environment variable in Vercel:

```env
NEXT_PUBLIC_API_URL=https://smarttatkal-backend.onrender.com
```

### Step 3: Deploy

1. Click "Deploy"
2. Vercel will build and deploy your frontend
3. Note your frontend URL: `https://smarttatkal.vercel.app`

## 🔄 Update Backend with Frontend URL

After frontend deployment:

1. Go back to Render dashboard
2. Navigate to your backend service
3. Update the `FRONTEND_URL` environment variable:
   ```env
   FRONTEND_URL=https://smarttatkal.vercel.app
   ```
4. Redeploy the backend service

## ✅ Verification Steps

### 1. Test Backend Health
```bash
curl https://smarttatkal-backend.onrender.com/health
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-01-05T...",
  "uptime": 123.45
}
```

### 2. Test Frontend
- Visit your Vercel URL
- Check browser console for any CORS errors
- Test API connectivity

### 3. Test Integration
- Try searching for trains
- Verify API calls work between frontend and backend

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures on Render
```bash
# Check build logs in Render dashboard
# Common fixes:
- Ensure package.json has all dependencies
- Check Node.js version compatibility
- Verify build command is correct
```

#### 2. CORS Errors
```javascript
// Backend CORS is configured for:
- Your Vercel domain
- *.vercel.app domains
- localhost (for development)
```

#### 3. Environment Variables
```bash
# Verify in Render dashboard:
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-app.vercel.app
```

#### 4. Health Check Failures
```bash
# Ensure your backend responds to:
GET /health

# Should return 200 status with JSON response
```

### Performance Optimization

#### 1. Render Free Tier Limitations
- Service spins down after 15 minutes of inactivity
- Cold start time: 30-60 seconds
- Consider Starter plan for production use

#### 2. Vercel Optimization
- Automatic edge caching
- Global CDN distribution
- Serverless functions for API routes

## 📊 Monitoring & Maintenance

### Render Monitoring
- Check service logs in Render dashboard
- Monitor response times and uptime
- Set up alerts for service failures

### Vercel Analytics
- Enable Vercel Analytics for performance insights
- Monitor Core Web Vitals
- Track deployment success rates

## 🔄 Continuous Deployment

### Automatic Deployments
1. **Render**: Enable auto-deploy on git push
2. **Vercel**: Automatically deploys on git push to main branch

### Manual Deployments
```bash
# Trigger manual deployment
git push origin main

# Or use CLI tools
npx vercel --prod  # For frontend
# Render deploys automatically on git push
```

## 💰 Cost Considerations

### Free Tier Limits
- **Render**: 750 hours/month, sleeps after 15min inactivity
- **Vercel**: 100GB bandwidth, 6000 serverless function executions

### Upgrade Recommendations
- **Production**: Consider Render Starter ($7/month) for always-on backend
- **High Traffic**: Vercel Pro ($20/month) for advanced features

## 🔐 Security Checklist

- ✅ HTTPS enabled on both services
- ✅ Environment variables secured
- ✅ CORS properly configured
- ✅ Rate limiting implemented
- ✅ Security headers configured
- ✅ No sensitive data in logs

## 📈 Next Steps

1. **Custom Domain**: Add your own domain to both services
2. **Database**: Add PostgreSQL database on Render
3. **Monitoring**: Set up error tracking (Sentry, LogRocket)
4. **Analytics**: Add user analytics (Google Analytics, Mixpanel)
5. **Performance**: Implement caching strategies

---

Your SmartTatkal application is now live and production-ready! 🎉

**Frontend**: https://smarttatkal.vercel.app
**Backend**: https://smarttatkal-backend.onrender.com
# Free Hosting Deployment Guide

## Overview
This guide will help you deploy your Gamer Video App UI for free using:
- **Frontend**: Vercel (React/Vite)
- **Backend**: Railway or Render (Express.js)
- **Database**: Supabase (already configured)
- **Storage**: Cloudflare R2 (already configured)

## Prerequisites
1. GitHub account
2. Vercel account (free)
3. Railway account (free) or Render account (free)
4. Environment variables configured

## Step 1: Prepare Your Repository

### 1.1 Update Environment Variables
Make sure your environment variables are properly configured for production:

```bash
# Create .env file for local development
cp env.example .env
```

### 1.2 Update API URLs
You'll need to update the API base URL in your frontend code once you have your backend URL.

## Step 2: Deploy Backend (Railway - Recommended)

### 2.1 Deploy to Railway
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect it's a Node.js project

### 2.2 Configure Environment Variables
In Railway dashboard, add these environment variables:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=video-party-storage
```

### 2.3 Get Your Backend URL
Railway will provide a URL like: `https://your-app-name.railway.app`

## Step 3: Deploy Frontend (Vercel)

### 3.1 Deploy to Vercel
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure build settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

### 3.2 Update API URL
Once you have your backend URL, update the `vercel.json` file:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend-url.railway.app/api/$1"
    }
  ]
}
```

### 3.3 Configure Environment Variables
In Vercel dashboard, add:
```
VITE_API_URL=https://your-backend-url.railway.app
```

## Step 4: Alternative Backend Hosting (Render)

If Railway doesn't work, use Render:

### 4.1 Deploy to Render
1. Go to [Render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - Name: `gamer-video-backend`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `node server.js`

### 4.2 Configure Environment Variables
Add the same environment variables as in Railway.

## Step 5: Update Frontend Code

### 5.1 Update API Base URL
In your frontend code, make sure you're using environment variables for API calls:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
```

### 5.2 Test Your Deployment
1. Visit your Vercel frontend URL
2. Test video upload functionality
3. Check if videos are being stored in R2
4. Verify database operations in Supabase

## Step 6: Custom Domain (Optional)

### 6.1 Vercel Custom Domain
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Configure DNS as instructed

### 6.2 Backend Custom Domain
- Railway: Upgrade to paid plan for custom domains
- Render: Free tier includes custom domains

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure your backend allows your frontend domain
2. **Environment Variables**: Double-check all variables are set correctly
3. **Build Failures**: Check the build logs in your hosting platform
4. **API Timeouts**: Consider upgrading to paid plans for better performance

### Health Check
Your backend includes a health check endpoint: `/api/health`

## Cost Breakdown
- **Vercel**: Free (100GB bandwidth/month)
- **Railway**: Free ($5 credit/month)
- **Supabase**: Free (500MB database, 1GB bandwidth)
- **Cloudflare R2**: Free (10GB storage, 1M requests/month)

## Next Steps
1. Set up automatic deployments from GitHub
2. Configure monitoring and logging
3. Set up error tracking (Sentry)
4. Consider upgrading to paid plans as your app grows

## Support
- Vercel: [docs.vercel.com](https://docs.vercel.com)
- Railway: [docs.railway.app](https://docs.railway.app)
- Render: [render.com/docs](https://render.com/docs) 
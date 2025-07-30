# 🚀 Free Cloud Setup Guide

This guide will help you set up your video app with **100% free** cloud services.

## 📋 What You'll Get

- ✅ **Database**: Supabase (500MB free)
- ✅ **Video Storage**: Cloudflare R2 (10GB free)
- ✅ **Hosting**: Vercel (unlimited deployments)
- ✅ **Total Cost**: $0/month

## 🗄️ Step 1: Set up Supabase (Database)

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up with GitHub
   - Create a new project

2. **Get Your Credentials**
   - In your project dashboard, go to Settings → API
   - Copy your `Project URL`(postgresql://postgres:[YOUR-PASSWORD]@db.hstnboqfilzbhmxmjfyn.supabase.co:5432/postgres) and `anon public`(eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzdG5ib3FmaWx6YmhteG1qZnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTQ2MDksImV4cCI6MjA2OTI5MDYwOX0.Sb3RRCjaiZduTmpZzabPTWbrPLDaL1KAyxti5yXGhU0) key

   

3. **Create Database Table**
   ```sql
   CREATE TABLE clips (
     id BIGINT PRIMARY KEY,
     filename TEXT NOT NULL,
     original_name TEXT NOT NULL,
     size BIGINT NOT NULL,
     mimetype TEXT NOT NULL,
     title TEXT NOT NULL,
     description TEXT,
     game TEXT NOT NULL,
     tags JSONB DEFAULT '[]',
     is_private BOOLEAN DEFAULT false,
     uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     views INTEGER DEFAULT 0,
     likes INTEGER DEFAULT 0,
     video_url TEXT NOT NULL,
     storage_key TEXT NOT NULL
   );
   ```

## ☁️ Step 2: Set up Cloudflare R2 (Video Storage)

1. **Create Cloudflare Account**
   - Go to [cloudflare.com](https://cloudflare.com)
   - Sign up and verify your account

2. **Enable R2 Storage**
   - Go to R2 Object Storage in your dashboard
   - Click "Create bucket"
   - Name it `video-party-storage`

3. **Create API Token**
   - Go to My Profile → API Tokens
   - Create Custom Token
   - Permissions: Object Read/Write
   - Resources: Include → Specific bucket → Your bucket



4. **Get Your Credentials**
   - Note your Account ID
   605bc46c9ccdfba90ff0885535547b24
   - Save your API Token credentials (8h2XibQiVsa3IRfAi1r1FeoOC6U0uf-JFK5hHB4-)

## 🔧 Step 3: Configure Environment Variables

1. **Create `.env` file**
   ```bash
   cp env.example .env
   ```

2. **Fill in your credentials**
   ```env
   # Supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key

   # Cloudflare R2
   R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
   R2_ACCESS_KEY_ID=your-access-key
   R2_SECRET_ACCESS_KEY=your-secret-key
   R2_BUCKET_NAME=video-party-storage
   ```

## 🚀 Step 4: Deploy to Vercel (Free Hosting)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Set Environment Variables in Vercel**
   - Go to your project in Vercel dashboard
   - Settings → Environment Variables
   - Add all variables from your `.env` file

## 🎯 Step 5: Test Your Setup

1. **Start locally**
   ```bash
   npm run server
   ```

2. **Test upload**
   - Go to your app
   - Upload a video
   - Check if it appears in Supabase and R2

## 📊 Free Tier Limits

| Service | Free Limit | Cost After |
|---------|------------|------------|
| Supabase | 500MB DB + 1GB storage | $25/month |
| Cloudflare R2 | 10GB storage | $0.015/GB |
| Vercel | Unlimited deployments | $20/month |

## 🔍 Troubleshooting

### Common Issues:

1. **"Database connection failed"**
   - Check your Supabase URL and key
   - Ensure the table was created correctly

2. **"Video upload failed"**
   - Verify R2 credentials
   - Check bucket permissions

3. **"Environment variables not found"**
   - Make sure `.env` file exists
   - Restart your server after changes

## 🎉 You're Done!

Your app now runs on **100% free** cloud infrastructure:
- Videos stored in Cloudflare R2
- Metadata in Supabase
- Hosted on Vercel
- **Total cost: $0/month**

## 📈 Scaling Up

When you hit free limits:
- Supabase: $25/month for 8GB DB
- R2: $0.015/GB (very cheap)
- Vercel: $20/month for Pro features

But you can stay free for a long time! 🚀 

## Step 1: Create your `.env` file

Create a `.env` file in your project root with these values:

```env
# Supabase Configuration
SUPABASE_URL=https://hstnboqfilzbhmxmjfyn.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzdG5ib3FmaXp6YmhteG1qZnluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MTQ2MDksImV4cCI6MjA2OTI5MDYwOX0.Sb3RRCjaiZduTmpZzabPTWbrPLDaL1KAyxti5yXGhU0

# Cloudflare R2 Configuration
R2_ENDPOINT=https://605bc46c9ccdfba90ff0885535547b24.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-r2-access-key
R2_SECRET_ACCESS_KEY=your-r2-secret-key
R2_BUCKET_NAME=video-party-storage

# Server Configuration
PORT=3001
```

## Step 2: Get your R2 credentials

You need to get your R2 access key and secret key from the API token you created:

1. **Go back to your Cloudflare API token** 5vChJYjlpWKgcoUxTNpfzHNwJmbTmnmLlbk3FfhS
2. **Copy the Access Key ID and Secret Access Key**  from the token details
3. **Replace** `your-r2-access-key`07ca14facf3066e76f491f7ae111a132 and `your-r2-secret-key`e12716a6bff6c0ebbaac761d2ff105c43bdbefe28315679af9d37ce01ffc3cd1 in your `.env` file

## Step 3: Create the database table

Go to your Supabase SQL Editor and run this:

```sql
CREATE TABLE clips (
  id BIGINT PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  size BIGINT NOT NULL,
  mimetype TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  game TEXT NOT NULL,
  tags JSONB DEFAULT '[]',
  is_private BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  video_url TEXT NOT NULL,
  storage_key TEXT NOT NULL,
  thumbnail_url TEXT
);
```

## Step 4: Test your setup

1. **Start your server:**
   ```bash
   npm run server
   ```

2. **Test the upload functionality**

Your setup should now be complete! The key pieces you have:
- ✅ Supabase URL: `c`
- ✅ Supabase Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- ✅ Account ID: `605bc46c9ccdfba90ff0885535547b24`
- ✅ Bucket name: `video-party-storage`

Just need to add your R2 access credentials and you're good to go! 
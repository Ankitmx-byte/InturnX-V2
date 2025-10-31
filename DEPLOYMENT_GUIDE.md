# InturnX V2 - Vercel Production Deployment Guide

## Overview
InturnX V2 is a full-stack application with three main components:
- **Frontend**: React + Vite (deployed on Vercel)
- **Backend**: Node.js + Express (deployed on Vercel as serverless functions)
- **AI Service**: Python + FastAPI (deployed separately on Hugging Face Spaces or Railway)
- **Database**: MongoDB Atlas (cloud-hosted)

## Prerequisites
1. Vercel account (https://vercel.com)
2. MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
3. GitHub account with repository access
4. Hugging Face account (for AI service deployment)

## Step 1: Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a new cluster
3. Create a database user with strong password
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/inturnx`
5. Whitelist your IP or allow all IPs (0.0.0.0/0)

## Step 2: Generate Production Secrets

Generate strong secrets for production:
```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate API Keys if needed
```

## Step 3: Deploy Frontend + Backend on Vercel

### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from root directory:
```bash
vercel --prod
```

### Option B: Using GitHub Integration (Recommended)

1. Push code to GitHub repository
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: `npm run build --prefix client`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install && npm install --prefix server && npm install --prefix client`

5. Add Environment Variables in Vercel Dashboard:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your generated JWT secret
   - `CLIENT_URL`: https://your-domain.vercel.app
   - `AI_SERVICE_URL`: Your AI service URL (from Step 4)
   - `NODE_ENV`: production

6. Click Deploy

## Step 4: Deploy AI Service

### Option A: Hugging Face Spaces (Recommended for AI)

1. Go to https://huggingface.co/spaces
2. Create new Space
3. Select "Docker" runtime
4. Upload your `ai_service/` directory
5. Create `Dockerfile`:

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]
```

6. Space will be available at: `https://huggingface.co/spaces/username/space-name`

### Option B: Railway.app

1. Go to https://railway.app
2. Create new project
3. Connect GitHub repository
4. Select `ai_service` directory
5. Add environment variables
6. Deploy

## Step 5: Update Environment Variables

After deployment, update Vercel environment variables with:
- `AI_SERVICE_URL`: Your deployed AI service URL

## Step 6: Verify Deployment

1. Check frontend: https://your-domain.vercel.app
2. Check API health: https://your-domain.vercel.app/api/health
3. Test login functionality
4. Verify database connection

## Production Environment Variables

```env
# Server
PORT=3001
NODE_ENV=production

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inturnx

# Authentication
JWT_SECRET=your-strong-jwt-secret-key

# URLs
CLIENT_URL=https://your-domain.vercel.app
AI_SERVICE_URL=https://your-ai-service-url.com
```

## Monitoring & Logs

1. **Vercel Dashboard**: Monitor deployments and logs
2. **MongoDB Atlas**: Monitor database performance
3. **Error Tracking**: Set up Sentry or similar service

## Troubleshooting

### Issue: API calls failing
- Check CORS settings in server.js
- Verify environment variables are set
- Check MongoDB connection string

### Issue: Socket.io not working
- Vercel serverless functions don't support persistent connections
- Consider using a separate backend service for real-time features

### Issue: File uploads not working
- Vercel has file system limitations
- Use cloud storage (AWS S3, Cloudinary) instead

## Next Steps

1. Set up custom domain
2. Configure SSL/TLS
3. Set up CI/CD pipeline
4. Configure monitoring and alerts
5. Set up backup strategy for database

## Support

For issues, check:
- Vercel documentation: https://vercel.com/docs
- MongoDB documentation: https://docs.mongodb.com
- Express.js documentation: https://expressjs.com


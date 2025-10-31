# InturnX V2 - Quick Vercel Deployment Setup

## 🚀 Quick Start (5 minutes)

### 1. Prepare Your Secrets

Generate production secrets:
```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Create database user
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/inturnx`

### 3. Deploy on Vercel (GitHub Integration - Easiest)

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Select "Other" as framework
5. Configure:
   - **Root Directory**: `./`
   - **Build Command**: `npm run build --prefix client`
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install && npm install --prefix server && npm install --prefix client`

6. Add Environment Variables:
   ```
   MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/inturnx
   JWT_SECRET = your-generated-secret
   CLIENT_URL = https://your-domain.vercel.app
   AI_SERVICE_URL = https://your-ai-service.com
   NODE_ENV = production
   ```

7. Click "Deploy"

### 4. Deploy AI Service (Hugging Face Spaces)

1. Go to https://huggingface.co/spaces
2. Create new Space with Docker runtime
3. Upload `ai_service/` folder
4. Space will be live at: `https://huggingface.co/spaces/username/space-name`
5. Update `AI_SERVICE_URL` in Vercel

### 5. Verify Deployment

```bash
# Check if API is working
curl https://your-domain.vercel.app/api/health

# Should return:
# {"status":"OK","message":"InturnX Server is running"}
```

## 📋 Environment Variables Checklist

- [ ] `MONGODB_URI` - MongoDB Atlas connection string
- [ ] `JWT_SECRET` - Strong random secret (32+ characters)
- [ ] `CLIENT_URL` - Your Vercel domain
- [ ] `AI_SERVICE_URL` - Your AI service URL
- [ ] `NODE_ENV` - Set to "production"

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Hugging Face Spaces: https://huggingface.co/spaces
- GitHub: https://github.com

## ⚠️ Important Notes

1. **Socket.io Limitation**: Vercel serverless functions don't support persistent connections. For real-time features, consider:
   - Using a separate backend service (Railway, Render)
   - Using Vercel's WebSocket support (if available)
   - Polling instead of WebSockets

2. **File Uploads**: Vercel has file system limitations. Use cloud storage:
   - AWS S3
   - Cloudinary
   - Firebase Storage

3. **Database**: Always use MongoDB Atlas (cloud) for production, not local MongoDB

## 🆘 Troubleshooting

### Deployment fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in package.json
- Verify environment variables are set

### API returns 404
- Check if routes are correctly configured
- Verify CORS settings
- Check MongoDB connection

### Frontend can't reach API
- Verify `VITE_API_URL` is correct
- Check CORS headers in server.js
- Ensure API service is running

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Express Docs: https://expressjs.com


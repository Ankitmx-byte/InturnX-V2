# 🚀 InturnX V2 - Deploy to Vercel NOW

## Quick Deploy (10 minutes)

### Step 1: Prepare Secrets (2 min)
```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy the output - you'll need it in Step 3
```

### Step 2: Set Up MongoDB Atlas (3 min)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create a cluster (free tier)
4. Create a database user
5. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/inturnx`

### Step 3: Deploy on Vercel (5 min)

#### Option A: Using GitHub (Recommended)
1. Push code to GitHub
2. Go to https://vercel.com/new
3. Click "Import Git Repository"
4. Select your InturnX repository
5. Configure:
   - Root Directory: `./`
   - Build Command: `npm run build --prefix client`
   - Output Directory: `client/dist`
   - Install Command: `npm install && npm install --prefix server && npm install --prefix client`
6. Add Environment Variables:
   ```
   MONGODB_URI = mongodb+srv://user:pass@cluster.mongodb.net/inturnx
   JWT_SECRET = (paste your generated secret)
   CLIENT_URL = https://your-domain.vercel.app
   AI_SERVICE_URL = (leave empty for now)
   NODE_ENV = production
   ```
7. Click "Deploy"
8. Wait 2-3 minutes for deployment

#### Option B: Using Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
# Follow prompts and add environment variables
```

### Step 4: Verify Deployment (1 min)
```bash
# Check if API is working
curl https://your-domain.vercel.app/api/health

# Should return:
# {"status":"OK","message":"InturnX Server is running"}
```

### Step 5: Deploy AI Service (Optional but Recommended)
1. Go to https://huggingface.co/spaces
2. Create new Space with Docker runtime
3. Upload `ai_service/` folder
4. Wait for build
5. Get URL and update `AI_SERVICE_URL` in Vercel

## 📋 What Gets Deployed

- ✅ React Frontend (client/)
- ✅ Node.js Backend (server/)
- ✅ MongoDB Database (Atlas)
- ⏳ Python AI Service (separate - Hugging Face Spaces)

## 🔗 After Deployment

- Frontend: https://your-domain.vercel.app
- API: https://your-domain.vercel.app/api
- Health Check: https://your-domain.vercel.app/api/health

## 📚 Documentation

- **Full Guide**: See `DEPLOYMENT_GUIDE.md`
- **Checklist**: See `DEPLOYMENT_CHECKLIST.md`
- **Configuration**: See `PRODUCTION_CONFIG.md`
- **Quick Setup**: See `VERCEL_SETUP.md`

## ⚠️ Important Notes

1. **Socket.io**: Real-time features may not work on Vercel serverless
   - Solution: Use polling or deploy backend separately

2. **File Uploads**: Limited file system on Vercel
   - Solution: Use cloud storage (S3, Cloudinary)

3. **Database**: Always use MongoDB Atlas (cloud)
   - Never use local MongoDB in production

4. **Secrets**: Never commit `.env` files
   - Always use Vercel dashboard for secrets

## 🆘 Troubleshooting

### Deployment fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are installed
- Verify environment variables

### API returns 404
- Check if routes are configured
- Verify CORS settings
- Check MongoDB connection

### Frontend can't reach API
- Verify `VITE_API_URL` is correct
- Check CORS headers
- Ensure API service is running

## 🎯 Next Steps

1. ✅ Deploy frontend + backend
2. ✅ Deploy AI service
3. ✅ Test all features
4. ✅ Set up monitoring
5. ✅ Configure custom domain
6. ✅ Enable SSL/TLS
7. ✅ Set up CI/CD

## 📞 Need Help?

- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com
- GitHub Issues: Create an issue in your repo

---

**Ready to deploy? Start with Step 1 above! 🚀**


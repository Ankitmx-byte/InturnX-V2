# InturnX V2 - Production Deployment Checklist

## Pre-Deployment Setup

### 1. Generate Production Secrets
- [ ] Generate JWT Secret (32+ characters)
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- [ ] Document all secrets securely

### 2. Set Up MongoDB Atlas
- [ ] Create MongoDB Atlas account
- [ ] Create a new cluster (free tier available)
- [ ] Create database user with strong password
- [ ] Whitelist IP addresses (or allow all: 0.0.0.0/0)
- [ ] Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/inturnx`
- [ ] Test connection locally

### 3. Prepare GitHub Repository
- [ ] Ensure all code is committed
- [ ] Create `main` branch for production
- [ ] Set up branch protection rules
- [ ] Add `.env` files to `.gitignore`

## Vercel Deployment

### 4. Create Vercel Account
- [ ] Sign up at https://vercel.com
- [ ] Connect GitHub account
- [ ] Authorize Vercel to access repositories

### 5. Deploy Frontend + Backend
- [ ] Go to https://vercel.com/new
- [ ] Import InturnX repository
- [ ] Configure project:
  - [ ] Framework: Other
  - [ ] Root Directory: ./
  - [ ] Build Command: `npm run build --prefix client`
  - [ ] Output Directory: `client/dist`
  - [ ] Install Command: `npm install && npm install --prefix server && npm install --prefix client`

### 6. Set Environment Variables in Vercel
- [ ] `MONGODB_URI` = Your MongoDB Atlas connection string
- [ ] `JWT_SECRET` = Your generated JWT secret
- [ ] `CLIENT_URL` = https://your-domain.vercel.app
- [ ] `AI_SERVICE_URL` = (leave empty for now, update after AI deployment)
- [ ] `NODE_ENV` = production

### 7. Deploy
- [ ] Click "Deploy" button
- [ ] Wait for deployment to complete
- [ ] Check deployment logs for errors

## AI Service Deployment

### 8. Deploy AI Service (Hugging Face Spaces)
- [ ] Create Hugging Face account
- [ ] Go to https://huggingface.co/spaces
- [ ] Create new Space with Docker runtime
- [ ] Upload `ai_service/` folder
- [ ] Wait for build to complete
- [ ] Get Space URL: `https://huggingface.co/spaces/username/space-name`

### 9. Update Vercel Environment Variables
- [ ] Update `AI_SERVICE_URL` with Hugging Face Space URL
- [ ] Trigger redeploy in Vercel

## Post-Deployment Verification

### 10. Test Frontend
- [ ] Visit https://your-domain.vercel.app
- [ ] Check if page loads without errors
- [ ] Open browser console for any errors

### 11. Test API
- [ ] Check health endpoint: `https://your-domain.vercel.app/api/health`
- [ ] Should return: `{"status":"OK","message":"InturnX Server is running"}`

### 12. Test Authentication
- [ ] Try signing up with new account
- [ ] Try logging in
- [ ] Check if JWT token is stored
- [ ] Verify user profile loads

### 13. Test Database Connection
- [ ] Check MongoDB Atlas dashboard
- [ ] Verify data is being written
- [ ] Check connection metrics

### 14. Test AI Service
- [ ] Call AI endpoints from frontend
- [ ] Verify responses are received
- [ ] Check Hugging Face Space logs

## Production Monitoring

### 15. Set Up Monitoring
- [ ] Enable Vercel Analytics
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure MongoDB Atlas alerts
- [ ] Set up uptime monitoring

### 16. Configure Custom Domain (Optional)
- [ ] Add custom domain in Vercel
- [ ] Configure DNS records
- [ ] Enable SSL/TLS
- [ ] Update `CLIENT_URL` environment variable

### 17. Set Up CI/CD
- [ ] Configure GitHub Actions workflow
- [ ] Set up automatic deployments on push to main
- [ ] Configure staging environment

## Security Checklist

### 18. Security Hardening
- [ ] Verify CORS is properly configured
- [ ] Check JWT secret is strong
- [ ] Enable HTTPS only
- [ ] Set security headers
- [ ] Review MongoDB security settings
- [ ] Enable database backups
- [ ] Set up rate limiting

### 19. Documentation
- [ ] Update README with production URLs
- [ ] Document deployment process
- [ ] Create runbook for common issues
- [ ] Document rollback procedure

## Final Verification

### 20. Full System Test
- [ ] Test complete user flow:
  - [ ] Sign up
  - [ ] Login
  - [ ] Browse courses
  - [ ] Submit project
  - [ ] Apply for internship
  - [ ] Use AI features
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Check performance metrics

## Deployment Complete! 🎉

- [ ] All tests passed
- [ ] Monitoring is active
- [ ] Team is notified
- [ ] Documentation is updated
- [ ] Backup strategy is in place

## Rollback Plan

If issues occur:
1. Revert to previous deployment in Vercel
2. Check logs for errors
3. Fix issues locally
4. Commit and push
5. Redeploy

## Support Contacts

- Vercel Support: https://vercel.com/support
- MongoDB Support: https://www.mongodb.com/support
- GitHub Support: https://support.github.com


# InturnX V2 - Production Configuration Guide

## Environment Variables

### Frontend (client/.env.production)
```env
VITE_API_URL=https://your-domain.vercel.app/api
VITE_AI_SERVICE_URL=https://your-ai-service-url.com
```

### Backend (server/.env.production)
```env
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inturnx
JWT_SECRET=your-strong-jwt-secret-key-32-characters-minimum
CLIENT_URL=https://your-domain.vercel.app
AI_SERVICE_URL=https://your-ai-service-url.com
```

### AI Service (ai_service/.env)
```env
PORT=8000
```

## Vercel Dashboard Configuration

### Project Settings
1. **General**
   - Framework Preset: Other
   - Node.js Version: 18.x
   - Build Command: `npm run build --prefix client`
   - Output Directory: `client/dist`
   - Install Command: `npm install && npm install --prefix server && npm install --prefix client`

2. **Environment Variables**
   - Add all variables from Backend section above
   - Mark sensitive variables as "Sensitive"

3. **Domains**
   - Add your custom domain
   - Configure DNS records
   - Enable auto-renewal for SSL

4. **Git**
   - Production Branch: main
   - Deploy on Push: Enabled
   - Preview Deployments: Enabled

## MongoDB Atlas Configuration

### Cluster Setup
1. **Cluster Tier**: M0 (free) or higher
2. **Region**: Choose closest to your users
3. **Backup**: Enable automatic backups

### Database User
1. Create user with strong password
2. Grant roles: `readWriteAnyDatabase`
3. Whitelist IP addresses:
   - Vercel IPs (or allow all: 0.0.0.0/0)
   - Your development machine IP

### Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/inturnx?retryWrites=true&w=majority
```

## Security Configuration

### CORS Settings
```javascript
// Already configured in server.js
cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  credentials: true
})
```

### JWT Configuration
- Algorithm: HS256
- Expiration: 7 days (configurable)
- Secret: 32+ character random string

### Password Security
- Hashing: bcryptjs with salt rounds: 12
- Minimum length: 8 characters
- Complexity: Recommended but not enforced

## Performance Optimization

### Frontend
- [ ] Enable Vercel Analytics
- [ ] Optimize images
- [ ] Enable gzip compression
- [ ] Minify CSS/JS
- [ ] Use CDN for static assets

### Backend
- [ ] Enable database query optimization
- [ ] Implement caching (Redis)
- [ ] Use connection pooling
- [ ] Monitor API response times

### Database
- [ ] Create appropriate indexes
- [ ] Monitor query performance
- [ ] Enable compression
- [ ] Regular backups

## Monitoring & Logging

### Vercel Monitoring
- Dashboard: https://vercel.com/dashboard
- Real-time logs
- Deployment history
- Performance metrics

### MongoDB Monitoring
- Atlas Dashboard: https://cloud.mongodb.com
- Query performance
- Storage usage
- Connection metrics

## Backup & Disaster Recovery

### Database Backups
- MongoDB Atlas: Automatic daily backups (free tier)
- Retention: 7 days (free tier)
- Manual backups: Available anytime

### Code Backups
- GitHub: Primary backup
- Vercel: Deployment history
- Local: Keep local copy

## Scaling Considerations

### When to Scale
- Traffic exceeds 1000 req/sec
- Database size exceeds 1GB
- Response times > 500ms

### Scaling Options
1. **Database**: Upgrade MongoDB cluster tier
2. **Backend**: Use Vercel Pro or dedicated server
3. **Frontend**: Already on CDN (Vercel)
4. **AI Service**: Upgrade Hugging Face Space tier

## Maintenance Schedule

### Daily
- Monitor error logs
- Check API health
- Verify database connectivity

### Weekly
- Review performance metrics
- Check backup status
- Update dependencies (if needed)

### Monthly
- Security audit
- Performance optimization
- Database maintenance
- User feedback review

## Support Resources

- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Express Docs: https://expressjs.com
- React Docs: https://react.dev


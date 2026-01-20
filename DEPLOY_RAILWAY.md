# Railway Deployment Guide - LMB Maintenance Backend

## Step 1: Prepare Your Repository
1. Push your code to GitHub/GitLab
2. Ensure `.gitignore` excludes `.env` and `node_modules`

## Step 2: Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your LMB maintenance repository

## Step 3: Configure Environment Variables
In Railway dashboard, add these variables:

```
PORT=4000
NODE_ENV=production
JWT_SECRET=your-production-jwt-secret-min-32-chars
BOOTSTRAP_KEY=your-production-bootstrap-key
CLIENT_URL=https://your-frontend-url.netlify.app
DB_PATH=/data/maintenance.db
```

### Optional Email Settings:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=maintenance@lmb.local
REMINDER_CRON=0 8 * * *
```

## Step 4: Configure Volume (Persistent Database)
1. In Railway dashboard, go to your service
2. Click "Variables" tab
3. Add a **Volume**:
   - Mount path: `/data`
   - This ensures your SQLite database persists across deployments

## Step 5: Deploy
1. Railway will auto-deploy on git push
2. Get your backend URL from Railway dashboard
3. Example: `https://lmb-maintenance-production.up.railway.app`

## Step 6: Bootstrap Admin User
```bash
curl -X POST https://your-railway-url.railway.app/api/auth/bootstrap \
  -H "Content-Type: application/json" \
  -H "x-bootstrap-key: your-production-bootstrap-key" \
  -d '{
    "name": "Admin",
    "email": "admin@lmb.ca",
    "password": "YourSecurePassword123",
    "phone": "514-000-0000"
  }'
```

## Step 7: Update Frontend
Update your frontend `.env`:
```
VITE_API_BASE_URL=https://your-railway-url.railway.app/api
```

---

## Troubleshooting

### Database not persisting?
- Ensure `/data` volume is mounted
- Check DB_PATH points to `/data/maintenance.db`

### CORS errors?
- Verify CLIENT_URL matches your frontend URL exactly
- Include protocol (https://)

### Email not working?
- Check SMTP credentials
- For Gmail, use App Password, not regular password
- Verify firewall/network allows SMTP traffic

---

## Estimated Costs
- **Railway Free Tier:** $5/month credit (enough for small apps)
- **Paid:** ~$5-10/month for production use

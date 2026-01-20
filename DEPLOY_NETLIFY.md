# Netlify Deployment Guide - LMB Maintenance Frontend

## Step 1: Prepare for Production

### Create Production .env
Create `.env.production` file:
```
VITE_API_BASE_URL=https://your-railway-backend-url.railway.app/api
```

### Build Locally (Test)
```bash
npm run build
npm run preview
```
Visit `http://localhost:4173` to test production build

## Step 2: Deploy to Netlify

### Option A: Deploy from GitHub (Recommended)
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Sign up/login
4. Click "Add new site" → "Import from Git"
5. Choose your GitHub repository
6. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Add environment variable:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://your-railway-backend.railway.app/api`
8. Click "Deploy site"

### Option B: Manual Deploy (Drag & Drop)
1. Build locally: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `dist` folder to Netlify
4. Configure environment variables in Site settings

## Step 3: Configure Custom Domain (Optional)
1. In Netlify dashboard → "Domain settings"
2. Add custom domain (e.g., `maintenance.lmb.ca`)
3. Update DNS records as instructed
4. SSL certificate auto-provisions

## Step 4: Update Backend CORS
Update Railway environment variable:
```
CLIENT_URL=https://your-netlify-site.netlify.app
```
Or for custom domain:
```
CLIENT_URL=https://maintenance.lmb.ca
```

## Step 5: Test Production
1. Visit your Netlify URL
2. Login with admin credentials
3. Create test task
4. Verify all features work

---

## Continuous Deployment

With GitHub integration:
- Every push to `main` branch auto-deploys
- Netlify shows build logs
- Rollback available in dashboard

---

## Custom Build Command (if needed)

For specific Node version or custom build:
```
Build command: npm install && npm run build
Publish directory: dist
```

---

## Environment Variables

After deployment, manage variables in:
**Site settings → Build & deploy → Environment variables**

Add:
```
VITE_API_BASE_URL=https://your-backend-url/api
```

---

## Netlify.toml (Optional)

Create `netlify.toml` in project root for advanced config:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## Troubleshooting

### 404 on refresh?
Add redirect rule in `netlify.toml` (see above)

### API not connecting?
- Check `VITE_API_BASE_URL` in Netlify env vars
- Verify Railway backend URL is correct
- Check Railway CORS settings

### Build fails?
- Check Node version compatibility
- Verify all dependencies in `package.json`
- Review build logs in Netlify dashboard

---

## Estimated Costs
- **Netlify Free Tier:** 100GB bandwidth, 300 build minutes/month
- **Pro:** $19/month for larger teams
- **Perfect for LMB Maintenance app!**

---

## Final Checklist
- ✅ Backend deployed on Railway
- ✅ Frontend built and deployed on Netlify
- ✅ Environment variables configured
- ✅ CORS settings updated
- ✅ Admin user bootstrapped
- ✅ Test login works
- ✅ Custom domain configured (optional)

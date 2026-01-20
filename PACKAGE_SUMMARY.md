# LMB Maintenance App - Complete Package
## La Maison Benoit Labre - Application de Gestion de Maintenance

**Created for:** Hicham - Maintenance Manager  
**Date:** January 2026

---

## 📦 What's Included

✅ **Complete Full-Stack Application**
- React + Vite frontend with Tailwind CSS
- Node.js + Express backend with SQLite
- JWT authentication system
- Email reminder system (optional)
- 36 apartments + common/service areas pre-configured
- MEP, Architecture, Civil, FFS, FAS categories

✅ **All Source Code**
- Frontend: 7 pages + components
- Backend: Complete API with 15+ endpoints
- Database: Schema with 8 tables

✅ **Documentation (English + French)**
- README with full instructions
- Railway deployment guide (backend)
- Netlify deployment guide (frontend)
- Staff installation guide (bilingual)
- Environment variable examples

---

## 🚀 Quick Start (5 Minutes)

### 1. Extract the ZIP
```bash
unzip lmb-maintenance-app-complete.zip
cd lmb-maintenance-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create .env File
```bash
PORT=4000
JWT_SECRET=your-secure-secret-key-min-32-chars
BOOTSTRAP_KEY=your-bootstrap-secret
CLIENT_URL=http://localhost:5173
DB_PATH=./data/maintenance.db
```

### 4. Start Backend
```bash
npm run dev:server
```

### 5. Start Frontend (New Terminal)
```bash
npm run dev
```

### 6. Create Admin User
```bash
curl -X POST http://localhost:4000/api/auth/bootstrap \
  -H "Content-Type: application/json" \
  -H "x-bootstrap-key: your-bootstrap-secret" \
  -d '{
    "name": "Hicham",
    "email": "hicham@lmb.ca",
    "password": "SecurePass123",
    "phone": "514-000-0000"
  }'
```

### 7. Login
Open `http://localhost:5173` and login!

---

## 🌐 Deploy to Production

### Backend → Railway
1. Read `DEPLOY_RAILWAY.md`
2. Push code to GitHub
3. Connect Railway to your repo
4. Add environment variables
5. Add `/data` volume for database persistence
6. Deploy!

**Estimated Cost:** $5-10/month

### Frontend → Netlify
1. Read `DEPLOY_NETLIFY.md`
2. Build: `npm run build`
3. Drag `dist` folder to Netlify
4. Add `VITE_API_BASE_URL` environment variable
5. Done!

**Estimated Cost:** FREE (100GB bandwidth included)

---

## 📱 Features Implemented

### For Admins (You)
- ✅ Create/edit/assign maintenance tasks
- ✅ Setup preventive maintenance schedules
- ✅ Add contractors with ratings and reviews
- ✅ Create staff user accounts
- ✅ Track all 36 apartments + common areas
- ✅ Monitor costs and generate reports
- ✅ Email reminders 1 day before due dates

### For Staff
- ✅ View assigned tasks
- ✅ Update task status
- ✅ Add remarks and actual costs
- ✅ View preventive schedules
- ✅ Access contractor info
- ✅ See apartment details

---

## 📊 Database Schema

**8 Tables Pre-configured:**
1. `users` - Staff and admin accounts
2. `apartments` - 36 units + 13 common/service areas
3. `categories` - MEP, Architecture, Civil, FFS, FAS
4. `tasks` - Maintenance tasks with costs
5. `contractors` - Contractor directory with ratings
6. `preventive_schedules` - Recurring maintenance
7. `task_logs` - Audit trail
8. More...

---

## 🎨 UI/UX Highlights

- **Modern Design:** Clean Tailwind CSS styling
- **Responsive:** Works on desktop, tablet, mobile
- **User-Friendly:** Intuitive navigation
- **Professional:** Ready for staff use
- **Bilingual Ready:** Easy to translate

---

## 🔐 Security Features

- ✅ JWT token authentication
- ✅ Bcrypt password hashing
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Role-based access control (admin/staff)
- ✅ Bootstrap protection for admin creation

---

## 📧 Email Reminders (Optional)

Configure in `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=maintenance@lmb.local
REMINDER_CRON=0 8 * * *
```

Staff receive automatic reminders 1 day before task due dates!

---

## 📖 Documentation Files

1. **README.md** - Complete setup and usage guide (EN + FR)
2. **DEPLOY_RAILWAY.md** - Backend deployment to Railway
3. **DEPLOY_NETLIFY.md** - Frontend deployment to Netlify
4. **STAFF_GUIDE.md** - User guide for staff (EN + FR)
5. **.env.example** - Environment variable template
6. **AGENTS.md** - Project structure for AI agents

---

## 🛠 Tech Stack

**Frontend:**
- React 18.2.0
- Vite 5.0.8
- Tailwind CSS 3.4.0
- React Router 6.20.0
- Lucide React Icons

**Backend:**
- Node.js + Express 5.2.1
- SQLite (better-sqlite3 12.4.1)
- JWT (jsonwebtoken 9.0.2)
- Bcrypt (bcryptjs 2.4.3)
- Nodemailer 6.10.1
- Node-cron 4.2.1

---

## 📞 Next Steps

### Immediate (Local Testing)
1. Extract zip
2. Install dependencies
3. Create admin user
4. Test all features locally

### This Week (Deploy)
1. Deploy backend to Railway
2. Deploy frontend to Netlify
3. Bootstrap production admin
4. Test production deployment

### Ongoing (Staff Rollout)
1. Create staff accounts
2. Share STAFF_GUIDE.md with team
3. Train staff on task management
4. Setup preventive maintenance schedules

---

## 💡 Tips for Success

1. **Change all default passwords** in production
2. **Setup email reminders** to reduce missed tasks
3. **Train staff gradually** - start with 2-3 users
4. **Use preventive schedules** for recurring maintenance
5. **Track actual costs** to improve budget planning
6. **Add contractor reviews** to build knowledge base

---

## 🐛 Troubleshooting

**Can't login?**
- Verify admin user was created via bootstrap
- Check JWT_SECRET is set
- Check browser console for errors

**Tasks not showing?**
- Verify backend is running on port 4000
- Check frontend VITE_API_BASE_URL
- Check CORS settings (CLIENT_URL)

**Database errors?**
- Ensure data/ directory exists
- Check file permissions
- Verify DB_PATH in .env

---

## 📬 Support

**For Technical Issues:**
- Check README.md troubleshooting section
- Review deployment guides
- Contact: claude.ai (your AI assistant!)

**For Business Questions:**
- Contact: Hicham (Maintenance Manager)
- Location: La Maison Benoit Labre, Laval, QC

---

## ✨ What Makes This Special

This isn't a generic maintenance app - it's **specifically built for La Maison Benoit Labre:**

- ✅ **Exactly 36 apartments** pre-configured with your floor plan
- ✅ **Quebec-specific** language and formatting
- ✅ **Your categories:** MEP, Architecture, Civil, FFS, FAS
- ✅ **Common areas** included: Lobby, corridors, laundry, parking, etc.
- ✅ **Service areas:** Basement, boiler room, roof access
- ✅ **Bilingual documentation** for your Montreal/Quebec staff
- ✅ **Professional & ready** for immediate staff deployment

---

## 🎉 You're All Set!

Everything you need is in this package. Extract, install, and you're running in 5 minutes!

**Questions?** Review the README.md and deployment guides.

**Ready to deploy?** Follow DEPLOY_RAILWAY.md + DEPLOY_NETLIFY.md

**Good luck with your maintenance management! 🏢🔧**

---

*Built with ❤️ for La Maison Benoit Labre*  
*January 2026*

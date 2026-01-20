# Missing Files to Add to Your Repo

## 📁 Files to Replace/Add

### 1. index.html (REPLACE)
**Location:** Root directory  
**Change:** Line 11 changed from `/src/main.jsx` to `./src/main.jsx`

```html
<!-- OLD (WRONG) -->
<script type="module" src="/src/main.jsx"></script>

<!-- NEW (CORRECT) -->
<script type="module" src="./src/main.jsx"></script>
```

### 2. netlify.toml (ADD NEW FILE)
**Location:** Root directory  
**Purpose:** Configures Netlify build and enables React Router SPA redirects

---

## 🔧 How to Add These Files

### Option 1: Manual Update in GitHub
1. Go to your GitHub repo
2. Click on `index.html`
3. Click "Edit" (pencil icon)
4. Change line 11: `/src/main.jsx` → `./src/main.jsx`
5. Commit changes
6. Click "Add file" → "Create new file"
7. Name it `netlify.toml`
8. Paste the content from netlify.toml
9. Commit

### Option 2: Local Git
```bash
# In your local repo
# Replace index.html with the corrected version
# Add netlify.toml to root

git add index.html netlify.toml
git commit -m "Fix Netlify build - update paths and add config"
git push
```

### Option 3: Direct Edit
1. Download the 2 files I provided above
2. Replace `index.html` in your project root
3. Add `netlify.toml` to your project root
4. Push to GitHub

---

## ✅ Verification Checklist

After adding these files, verify:

- [ ] `index.html` line 11 has `./src/main.jsx` (with dot)
- [ ] `netlify.toml` exists in root directory
- [ ] Both files are committed to GitHub
- [ ] Netlify auto-deployed after push
- [ ] Build succeeds in Netlify dashboard

---

## 🚀 Netlify Build Settings

Make sure these are set in Netlify dashboard:

**Site settings → Build & deploy → Build settings:**
- Build command: `npm run build`
- Publish directory: `dist`

**Site settings → Environment variables:**
- Key: `VITE_API_BASE_URL`
- Value: `http://localhost:4000/api` (or your Railway URL)

---

## 🐛 If Still Failing

1. Check Netlify build log for exact error
2. Verify `src/main.jsx` file exists
3. Verify `package.json` has all dependencies
4. Try clearing Netlify build cache and redeploy

---

## 💡 Quick Fix Command

If you have the repo locally:

```bash
# Fix index.html
sed -i 's|"/src/main.jsx"|"./src/main.jsx"|' index.html

# Commit
git add index.html netlify.toml
git commit -m "Fix Netlify build paths"
git push
```

Netlify will auto-redeploy and should succeed! ✅

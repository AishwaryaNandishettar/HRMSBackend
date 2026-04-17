# ✅ Deployment Checklist

## Your MongoDB Credentials (Already Set!)

```
Username: hrmsadmin
Password: im75Jf9jb1ntQev2
Cluster: cluster0.aexpf8t.mongodb.net
Database: Data_base_hrms

Full Connection String:
mongodb+srv://hrmsadmin:im75Jf9jb1ntQev2@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority
```

---

## Step-by-Step Checklist

### ☐ Step 1: Migrate Data (5 minutes)

**Commands:**
```cmd
cd E:\HRMSProject
migrate-to-atlas.bat
```

**Expected Result:**
```
✅ MIGRATION COMPLETE!
Your data has been migrated to MongoDB Atlas!
```

**If it fails:**
- Make sure MongoDB is running locally
- Install MongoDB Database Tools if needed

---

### ☐ Step 2: Verify Data (2 minutes)

**In MongoDB Compass:**
1. New Connection
2. Paste: `mongodb+srv://hrmsadmin:im75Jf9jb1ntQev2@cluster0.aexpf8t.mongodb.net/Data_base_hrms`
3. Connect
4. Check collections exist with data

**Expected:**
- ✅ Database: Data_base_hrms
- ✅ Collections: employees (~42), attendance (~20), etc.

---

### ☐ Step 3: Push to GitHub (2 minutes)

**Commands:**
```bash
cd HRMS-Backend
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Expected Result:**
```
✅ Code pushed to GitHub
```

---

### ☐ Step 4: Deploy to Render (15 minutes)

**Go to:** https://render.com

**Configuration:**
- Name: `hrms-backend`
- Runtime: `Java`
- Build: `./mvnw clean package -DskipTests`
- Start: `java -jar target/*.jar`
- Type: `Free`

**Environment Variables:**

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | `mongodb+srv://hrmsadmin:im75Jf9jb1ntQev2@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority` |
| `SPRING_MAIL_USERNAME` | `aishushettar95@gmail.com` |
| `SPRING_MAIL_PASSWORD` | `bbfskhrhtnujkokk` |
| `JWT_SECRET` | `MyFixedSecretKey123456` |
| `PORT` | `8082` |

**Expected Result:**
```
✅ Deployment successful
✅ URL: https://hrms-backend.onrender.com
```

**Save your Render URL:** ___________________________

---

### ☐ Step 5: Update Vercel (5 minutes)

**Go to:** https://vercel.com/dashboard

**Steps:**
1. Select project: `hrmsfrontendapp2`
2. Settings → Environment Variables
3. Edit `VITE_API_BASE_URL`
4. Set to: `https://hrms-backend.onrender.com` (your Render URL)
5. Save
6. Deployments → Redeploy → "Redeploy from scratch"

**Expected Result:**
```
✅ Frontend redeployed
✅ Environment variables updated
```

---

### ☐ Step 6: Test (2 minutes)

**Test 1: Check Environment Variables**

Open: `https://hrmsfrontendapp2.vercel.app/env-check.html`

**Expected:**
```
✅ VITE_API_BASE_URL: https://hrms-backend.onrender.com
```

**Test 2: Try Login**

Open: `https://hrmsfrontendapp2.vercel.app`

**Expected:**
```
✅ Login works
✅ Redirects to Home
✅ All features work
```

---

## 🎉 Success Criteria

When everything is working:

- ✅ Migration script completed successfully
- ✅ Data visible in MongoDB Atlas
- ✅ Backend deployed to Render
- ✅ Backend URL accessible
- ✅ Frontend environment variables updated
- ✅ Frontend redeployed
- ✅ `/env-check.html` shows correct URL
- ✅ Login works
- ✅ Can access all pages

---

## 🆘 Troubleshooting

### Migration Fails

**Error:** "mongodump not found"
- **Fix:** Install MongoDB Database Tools
- **Link:** https://www.mongodb.com/try/download/database-tools

**Error:** "Authentication failed"
- **Fix:** Password is already correct in script
- **Check:** Network Access in Atlas allows 0.0.0.0/0

### Render Deployment Fails

**Check:**
1. Build logs in Render dashboard
2. All environment variables are set
3. MongoDB connection string is correct

**Common Issues:**
- Missing environment variables
- Wrong MongoDB URI format
- Build command incorrect

### Login Doesn't Work

**Check:**
1. `/env-check.html` shows correct backend URL
2. Browser console (F12) for errors
3. Render logs for backend errors
4. Wait 30-60 seconds (cold start on free tier)

**Debug:**
- Open browser DevTools (F12)
- Go to Network tab
- Try to login
- Check if request goes to correct URL
- Check response status

---

## 📊 Timeline

| Step | Time | Total |
|------|------|-------|
| Migrate Data | 5 min | 5 min |
| Verify Data | 2 min | 7 min |
| Push to GitHub | 2 min | 9 min |
| Deploy to Render | 15 min | 24 min |
| Update Vercel | 5 min | 29 min |
| Test | 2 min | 31 min |

**Total Time:** ~30 minutes

---

## 🎯 Final Architecture

```
User Browser
     ↓
Frontend (Vercel)
https://hrmsfrontendapp2.vercel.app
     ↓
Backend (Render)
https://hrms-backend.onrender.com
     ↓
Database (MongoDB Atlas)
cluster0.aexpf8t.mongodb.net
```

---

## 💾 Save These URLs

**Frontend:** https://hrmsfrontendapp2.vercel.app

**Backend:** _____________________________ (fill in after Render deployment)

**Database:** mongodb+srv://hrmsadmin:im75Jf9jb1ntQev2@cluster0.aexpf8t.mongodb.net/Data_base_hrms

---

**Start with Step 1 and check off each item as you complete it!** ✅

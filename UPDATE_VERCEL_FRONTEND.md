# 🚀 UPDATE FRONTEND TO CONNECT TO BACKEND

## ✅ BACKEND IS LIVE!

Your backend is successfully running at:
```
https://hrmsfullsplicationrender.onrender.com
```

---

## 📝 STEP 1: PUSH UPDATED FRONTEND CODE

I've updated your `.env` file with the correct backend URL. Now push it to GitHub:

```bash
cd HRMS-Frontend
git add .
git commit -m "Update backend URL to Render deployment"
git push origin main
cd ..
```

---

## 🌐 STEP 2: UPDATE VERCEL ENVIRONMENT VARIABLE

### Option A: Automatic (Vercel will auto-deploy from GitHub)

After pushing to GitHub, Vercel will automatically:
1. Detect the changes
2. Rebuild your frontend
3. Deploy with new backend URL

**Wait 2-3 minutes** for automatic deployment.

---

### Option B: Manual (Update in Vercel Dashboard)

If you want to update immediately without waiting for auto-deploy:

1. Go to: **https://vercel.com/dashboard**
2. Click on your **HRMS-Frontend** project
3. Click **"Settings"** tab
4. Click **"Environment Variables"** in left sidebar
5. Find **`VITE_API_BASE_URL`** variable
6. Click **"Edit"** button
7. Change value to:
   ```
   https://hrmsfullsplicationrender.onrender.com
   ```
8. Click **"Save"**
9. Go to **"Deployments"** tab
10. Click **"Redeploy"** on the latest deployment

---

## ⏱️ STEP 3: WAIT FOR DEPLOYMENT (2-3 minutes)

### Check Deployment Status:

1. Go to Vercel Dashboard
2. Click on your project
3. Look at **"Deployments"** tab
4. Wait for status to show **"Ready"** (green checkmark)

---

## ✅ STEP 4: TEST YOUR APPLICATION

### A. Test Backend Directly

Open in browser:
```
https://hrmsfullsplicationrender.onrender.com/api/auth/test
```

**Expected:** Some response (not 502 error)

---

### B. Test Frontend

1. Open your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
2. Try to **login** with your credentials
3. Check if login works and connects to backend

---

## 🔍 VERIFY CONNECTION

### Check Browser Console:

1. Open your frontend in browser
2. Press **F12** to open Developer Tools
3. Go to **"Console"** tab
4. Try to login
5. Look for API calls to: `https://hrmsfullsplicationrender.onrender.com`

**Success indicators:**
- ✅ API calls show status 200 or 201
- ✅ No CORS errors
- ✅ Login successful

**Error indicators:**
- ❌ CORS error (we'll fix this)
- ❌ Network error
- ❌ 403/401 errors (authentication issue)

---

## 🚨 IF YOU GET CORS ERROR

If you see error like:
```
Access to XMLHttpRequest blocked by CORS policy
```

We need to update backend CORS configuration. Let me know and I'll fix it!

---

## 📊 DEPLOYMENT CHECKLIST

- [ ] **Backend deployed on Render** ✅ DONE
  - URL: `https://hrmsfullsplicationrender.onrender.com`
  - Status: Live
  - Test: Shows Whitelabel Error Page (normal)

- [ ] **Frontend environment variable updated**
  - [ ] Push code to GitHub
  - [ ] Vercel auto-deploys
  - [ ] OR manually update in Vercel dashboard

- [ ] **Test end-to-end**
  - [ ] Open frontend URL
  - [ ] Try login
  - [ ] Check if API calls work

---

## 🎯 QUICK COMMANDS

Copy-paste these to push frontend changes:

```bash
cd HRMS-Frontend
git add .
git commit -m "Update backend URL to Render deployment"
git push origin main
cd ..
```

---

## ⏭️ WHAT'S NEXT?

After frontend is deployed:

1. ✅ Test login functionality
2. ✅ Test all features (attendance, payroll, etc.)
3. ✅ Fix any CORS issues if they appear
4. ✅ **DEPLOYMENT COMPLETE!**

---

**Push the frontend code now and tell me when it's done!** 🚀

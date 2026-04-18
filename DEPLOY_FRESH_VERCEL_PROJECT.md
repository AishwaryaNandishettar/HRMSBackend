# 🚀 DEPLOY NEW VERCEL PROJECT - STEP-BY-STEP GUIDE

## ✅ PREPARATION COMPLETE

I've cleaned up your `.env` file and pushed it to GitHub. Now let's create a fresh Vercel project!

---

## 📋 STEP-BY-STEP DEPLOYMENT

### STEP 1: GO TO VERCEL DASHBOARD

1. Open: **https://vercel.com/dashboard**
2. Make sure you're logged in

---

### STEP 2: CREATE NEW PROJECT

1. Click the **"Add New..."** button (top right)
2. Select **"Project"** from dropdown

---

### STEP 3: IMPORT GIT REPOSITORY

1. You'll see "Import Git Repository" page
2. Look for your repository: **HRMSBackend** (or similar name)
3. Click **"Import"** button next to it

**If you don't see your repository:**
- Click **"Adjust GitHub App Permissions"**
- Make sure Vercel has access to your repository
- Come back and refresh

---

### STEP 4: CONFIGURE PROJECT

You'll see a configuration page with these sections:

#### A. Project Name
- **Name:** `hrms-frontend-new` (or any name you want)
- This will be your URL: `https://hrms-frontend-new.vercel.app`

#### B. Framework Preset
- Should auto-detect: **Vite**
- If not, select **"Vite"** from dropdown

#### C. Root Directory
- Click **"Edit"** button
- Select **"HRMS-Frontend"** folder
- Click **"Continue"**

**IMPORTANT:** Make sure Root Directory is set to `HRMS-Frontend`!

#### D. Build and Output Settings
Leave as default:
- **Build Command:** `npm run build` (or `vite build`)
- **Output Directory:** `dist`
- **Install Command:** `npm install`

---

### STEP 5: ADD ENVIRONMENT VARIABLES

This is the MOST IMPORTANT step!

1. Scroll down to **"Environment Variables"** section
2. Click **"Add"** button for each variable below:

#### Variable 1: VITE_API_BASE_URL
- **Key:** `VITE_API_BASE_URL`
- **Value:** `https://hrmsfullbackendapplication.onrender.com`
- **Environment:** Select all (Production, Preview, Development)

#### Variable 2: VITE_TURN_USERNAME
- **Key:** `VITE_TURN_USERNAME`
- **Value:** `51e40078dfabc57d54164c2f`
- **Environment:** Select all

#### Variable 3: VITE_TURN_CREDENTIAL
- **Key:** `VITE_TURN_CREDENTIAL`
- **Value:** `KJnavaquyonnUlkx`
- **Environment:** Select all

**CRITICAL:** Make sure `VITE_API_BASE_URL` is EXACTLY:
```
https://hrmsfullbackendapplication.onrender.com
```
(No spaces, no typos, no extra characters!)

---

### STEP 6: DEPLOY

1. After adding all environment variables, click **"Deploy"** button
2. Wait for deployment (2-5 minutes)
3. Watch the build logs

---

### STEP 7: WAIT FOR DEPLOYMENT

You'll see:
- **"Building"** status (yellow)
- Build logs scrolling
- Then **"Ready"** status (green checkmark)

---

### STEP 8: TEST YOUR APP

1. Click on the deployment URL (e.g., `https://hrms-frontend-new.vercel.app`)
2. Press **F12** to open Console
3. Look for debug messages:
   ```
   🔍 VITE_API_BASE_URL: https://hrmsfullbackendapplication.onrender.com
   🔍 Axios baseURL: https://hrmsfullbackendapplication.onrender.com
   ```
4. Try to login with:
   - **Email:** `Aishwarya@company.com`
   - **Password:** `Admin123` (or whatever password you set)

---

## 📊 CONFIGURATION SUMMARY

| Setting | Value |
|---------|-------|
| **Project Name** | `hrms-frontend-new` (your choice) |
| **Framework** | Vite |
| **Root Directory** | `HRMS-Frontend` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **VITE_API_BASE_URL** | `https://hrmsfullbackendapplication.onrender.com` |
| **VITE_TURN_USERNAME** | `51e40078dfabc57d54164c2f` |
| **VITE_TURN_CREDENTIAL** | `KJnavaquyonnUlkx` |

---

## 🎯 VISUAL GUIDE

```
Vercel Dashboard
├── Click "Add New..." → "Project"
├── Import Git Repository
│   └── Select "HRMSBackend" repository
├── Configure Project
│   ├── Project Name: hrms-frontend-new
│   ├── Framework: Vite
│   ├── Root Directory: HRMS-Frontend ← IMPORTANT!
│   └── Environment Variables:
│       ├── VITE_API_BASE_URL = https://hrmsfullbackendapplication.onrender.com
│       ├── VITE_TURN_USERNAME = 51e40078dfabc57d54164c2f
│       └── VITE_TURN_CREDENTIAL = KJnavaquyonnUlkx
└── Click "Deploy"
```

---

## 🚨 COMMON MISTAKES TO AVOID

### ❌ MISTAKE 1: Wrong Root Directory
If you don't set Root Directory to `HRMS-Frontend`, the build will fail because Vercel will look for `package.json` in the wrong place.

### ❌ MISTAKE 2: Typo in Backend URL
Make sure it's:
```
https://hrmsfullbackendapplication.onrender.com
```
NOT:
- `hrmsbackend-xk1s.onrender.com` ← Old/wrong URL
- `hrms-backendapplication-demo.onrender.com` ← Different service

### ❌ MISTAKE 3: Forgetting Environment Variables
If you forget to add environment variables, the frontend will try to connect to `undefined` and fail.

---

## ✅ SUCCESS INDICATORS

After deployment, you should see:

### In Vercel Dashboard:
- ✅ Status: "Ready" (green)
- ✅ Deployment URL: `https://hrms-frontend-new.vercel.app`

### In Browser Console (F12):
```
✅ 🔍 VITE_API_BASE_URL: https://hrmsfullbackendapplication.onrender.com
✅ 🔍 Axios baseURL: https://hrmsfullbackendapplication.onrender.com
```

### When Logging In:
```
✅ POST https://hrmsfullbackendapplication.onrender.com/api/auth/login
✅ Status: 200 OK
✅ Response: { token: "...", user: {...} }
```

---

## 🆘 IF BUILD FAILS

### Error: "Cannot find package.json"
- **Fix:** Set Root Directory to `HRMS-Frontend`

### Error: "Build command failed"
- **Fix:** Make sure Build Command is `npm run build` or `vite build`

### Error: "Module not found"
- **Fix:** Make sure Install Command is `npm install`

---

## 📝 AFTER DEPLOYMENT

Once your new Vercel project is deployed:

1. ✅ Copy the new URL (e.g., `https://hrms-frontend-new.vercel.app`)
2. ✅ Update backend CORS if needed (add new URL)
3. ✅ Test login functionality
4. ✅ Delete old Vercel projects (optional)

---

## 🎉 FINAL CHECKLIST

- [ ] Go to Vercel dashboard
- [ ] Click "Add New" → "Project"
- [ ] Import HRMSBackend repository
- [ ] Set Project Name
- [ ] Set Framework to Vite
- [ ] **Set Root Directory to HRMS-Frontend** ← CRITICAL!
- [ ] Add VITE_API_BASE_URL environment variable
- [ ] Add VITE_TURN_USERNAME environment variable
- [ ] Add VITE_TURN_CREDENTIAL environment variable
- [ ] Click "Deploy"
- [ ] Wait for "Ready" status
- [ ] Test login
- [ ] **SUCCESS!** 🎉

---

**Start with STEP 1 - Go to Vercel dashboard and click "Add New" → "Project"!** 🚀

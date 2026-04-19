# 🔧 FIX VERCEL ENVIRONMENT VARIABLE

## ✅ GOOD NEWS

From your screenshots:
- ✅ Vercel deployed successfully
- ✅ Render deployed successfully (backend is live)
- ✅ No CORS errors in console
- ❌ Login still not working

## 🔍 THE PROBLEM

The Vercel environment variable `VITE_API_BASE_URL` is either:
1. Not set correctly
2. Or Vercel needs to be redeployed after setting it

---

## ✅ SOLUTION: UPDATE VERCEL ENVIRONMENT VARIABLE

### STEP 1: Go to Vercel Settings

1. Go to: https://vercel.com/dashboard
2. Click on: `hrmsbackendapplication`
3. Click: **Settings** tab
4. Click: **Environment Variables** (left sidebar)

### STEP 2: Check Current Variables

Look for `VITE_API_BASE_URL`

**If it exists:**
- Click: **Edit** (three dots → Edit)
- Check the value

**If it doesn't exist:**
- You need to add it

### STEP 3: Set Correct Value

**Delete old variable (if exists):**
- Click three dots → Delete

**Add new variable:**
- Click: **Add New**
- Key: `VITE_API_BASE_URL`
- Value: `https://newhmrsfullybackendapplication.onrender.com`
- Environment: Check **ALL** (Production, Preview, Development)
- Click: **Save**

### STEP 4: Add TURN Credentials (if missing)

**Variable 1:**
- Key: `VITE_TURN_USERNAME`
- Value: `51e40078dfabc57d54164c2f`
- Environment: ALL
- Click: **Save**

**Variable 2:**
- Key: `VITE_TURN_CREDENTIAL`
- Value: `KJnavaquyonnUlkx`
- Environment: ALL
- Click: **Save**

### STEP 5: IMPORTANT - Redeploy Vercel

**Environment variables only take effect after redeployment!**

1. Go to: **Deployments** tab
2. Find latest deployment
3. Click: **...** (three dots)
4. Click: **Redeploy**
5. **IMPORTANT:** Check "Use existing Build Cache" is **UNCHECKED**
6. Click: **Redeploy**
7. Wait 2-3 minutes

---

## 🧪 TEST AFTER REDEPLOYMENT

### Test 1: Check Environment Variable in Browser

1. Open: https://hrmsbackendapplication.vercel.app
2. Press: F12 (open console)
3. Type: `import.meta.env.VITE_API_BASE_URL`
4. Press: Enter

**Expected:** `https://newhmrsfullybackendapplication.onrender.com`

**If you see:** `undefined` or wrong URL → Variable not set correctly

### Test 2: Try Login

1. Enter: `Aishwarya@company.com`
2. Enter: `admin123`
3. Click: **Login**

**If still not working:** Go to Step 6

---

## 🎯 STEP 6: CHECK NETWORK TAB

1. Open: https://hrmsbackendapplication.vercel.app
2. Press: F12
3. Click: **Network** tab
4. Try to login
5. Look for request to `/api/auth/login`
6. Click on it
7. Check:
   - **Request URL:** Should be `https://newhmrsfullybackendapplication.onrender.com/api/auth/login`
   - **Status:** Should be 200 or 401
   - **Response:** Check what backend returned

**If Request URL is wrong:** Environment variable not set
**If Status is 401:** Wrong credentials or user doesn't exist
**If Status is 500:** Backend error
**If Status is 0:** Backend not reachable

---

## 🆘 ALTERNATIVE: UPDATE .env FILE AND REDEPLOY

If environment variables don't work, update the .env file:

### STEP 1: Update .env File

Open: `HRMS-Frontend/.env`

Change to:
```
VITE_API_BASE_URL=https://newhmrsfullybackendapplication.onrender.com
VITE_TURN_USERNAME=51e40078dfabc57d54164c2f
VITE_TURN_CREDENTIAL=KJnavaquyonnUlkx
```

### STEP 2: Push to GitHub

```bash
git add HRMS-Frontend/.env
git commit -m "Update .env with production backend URL"
git push origin main
```

### STEP 3: Wait for Vercel to Redeploy

Vercel will auto-deploy (2-3 minutes)

---

## 📋 CHECKLIST

- [ ] Go to Vercel Settings → Environment Variables
- [ ] Add/Update VITE_API_BASE_URL with Render URL
- [ ] Add VITE_TURN_USERNAME
- [ ] Add VITE_TURN_CREDENTIAL
- [ ] Save all variables
- [ ] Redeploy Vercel (without cache)
- [ ] Wait for deployment to complete
- [ ] Test environment variable in console
- [ ] Try login

---

## 🎯 MOST LIKELY ISSUE

**Vercel environment variable is not set or not taking effect.**

**Solution:**
1. Set environment variable in Vercel
2. Redeploy WITHOUT cache
3. Test again

---

**🔑 KEY: Environment variables only work after redeployment!**

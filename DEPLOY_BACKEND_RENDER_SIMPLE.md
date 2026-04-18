# 🚀 DEPLOY BACKEND TO RENDER - SUPER SIMPLE GUIDE

## ✅ WHY RENDER FOR BACKEND?

- ✅ **100% FREE** (no credit card required!)
- ✅ Supports Java Spring Boot
- ✅ 750 free hours/month (enough for 24/7)
- ✅ Automatic HTTPS
- ✅ Easy deployment from GitHub

**Vercel cannot run Java Spring Boot backends!**

---

## 📍 STEP-BY-STEP DEPLOYMENT

### STEP 1: Go to Render (1 minute)

1. Open: https://render.com/
2. Click **"Get Started for Free"**
3. Click **"Sign up with GitHub"**
4. Authorize Render (no card required!)

---

### STEP 2: Create Web Service (2 minutes)

1. Click **"New +"** (top right)
2. Click **"Web Service"**
3. Click **"Build and deploy from a Git repository"**
4. Click **"Next"**
5. Find your **"HRMSBackend"** repository
6. Click **"Connect"**

---

### STEP 3: Configure Service (3 minutes)

**Fill in EXACTLY like this:**

**Name:**
```
hrms-backend
```

**Region:**
```
Choose closest to you (e.g., Oregon, Frankfurt, Singapore)
```

**Branch:**
```
main
```

**Root Directory:**
```
(Leave empty)
```

**Runtime:**
```
Java (select from dropdown)
```

**Build Command:**
```
./mvnw clean package -DskipTests
```

**Start Command:**
```
java -Dserver.port=$PORT -jar target/hmrs-backend-0.0.1-SNAPSHOT.jar
```

**Instance Type:**
```
Free
```

---

### STEP 4: Add Environment Variables (2 minutes)

Click **"Advanced"** button

Click **"Add Environment Variable"**

**Add these 4 variables:**

**Variable 1:**
- Key: `MONGODB_URI`
- Value: `mongodb://localhost:27017/Data_base_hrms`
  (We'll update this with MongoDB Atlas later)

**Variable 2:**
- Key: `SPRING_MAIL_USERNAME`
- Value: `aishushettar95@gmail.com`

**Variable 3:**
- Key: `SPRING_MAIL_PASSWORD`
- Value: `bbfskhrhtnujkokk`

**Variable 4:**
- Key: `JWT_SECRET`
- Value: `MyFixedSecretKey123456`

---

### STEP 5: Create Service (1 minute)

1. Click **"Create Web Service"** button (bottom)
2. Render will start building
3. **Wait 10-15 minutes** (first build takes longer)

---

### STEP 6: Watch Build Logs (10-15 minutes)

You'll see logs like:

```
==> Cloning from https://github.com/...
==> Checking out commit...
==> Installing Java 21...
==> Installing Maven...
==> Running: ./mvnw clean package -DskipTests
==> Downloading dependencies... (takes 5-7 min)
==> Compiling Java code...
==> BUILD SUCCESS
==> Starting application...
==> Your service is live 🎉
```

---

### STEP 7: Get Your Backend URL (1 minute)

Once deployed, you'll see at the top:

```
https://hrms-backend.onrender.com
```

**📋 COPY THIS URL!**

**Test it:**
Open in browser: `https://hrms-backend.onrender.com/api/auth/login`

Should see a response (not 404).

---

## 📍 UPDATE VERCEL FRONTEND

Now update your frontend to use the Render backend:

### STEP 1: Go to Vercel Dashboard

1. Open: https://vercel.com/dashboard
2. Click your **HRMS Frontend** project

### STEP 2: Update Environment Variable

1. Click **"Settings"**
2. Click **"Environment Variables"**
3. Find `VITE_API_BASE_URL`
4. Click **"Edit"**
5. Change value to: `https://hrms-backend.onrender.com`
   (Use your actual Render URL!)
6. Click **"Save"**

### STEP 3: Redeploy Frontend

1. Click **"Deployments"** tab
2. Click on the latest deployment
3. Click **"..."** (three dots)
4. Click **"Redeploy"**
5. Wait 1-2 minutes

---

## ✅ TEST EVERYTHING

### Test Backend:
```
https://hrms-backend.onrender.com/api/auth/login
```
Should return a response.

### Test Frontend:
```
https://your-frontend.vercel.app
```
Try to login - should work!

---

## 🆘 TROUBLESHOOTING

### Build Failed on Render

**Check:**
1. Runtime is set to "Java"
2. Build command is correct
3. Start command is correct
4. Check logs for specific error

**Solution:**
- Go to Settings
- Verify all settings
- Click "Manual Deploy" → "Clear build cache & deploy"

### Application Not Starting

**Error:** "Web service failed to bind to $PORT"

**Solution:**
Make sure start command includes `-Dserver.port=$PORT`:
```
java -Dserver.port=$PORT -jar target/hmrs-backend-0.0.1-SNAPSHOT.jar
```

### Frontend Can't Connect

**Check:**
1. Backend URL in Vercel is correct
2. No typos
3. Backend is running (green status on Render)
4. Redeployed frontend after changing env var

---

## 💰 COST

**Render Free Tier:**
- ✅ 750 hours/month (enough for 24/7 with 1 service)
- ✅ Automatic HTTPS
- ✅ No credit card required
- ⚠️ Spins down after 15 min inactivity (first request takes 30-60 sec)

**Total Cost: $0/month** ✅

---

## 📊 YOUR ARCHITECTURE

```
User Browser
     ↓
Frontend (Vercel)
https://your-frontend.vercel.app
     ↓
Backend (Render)
https://hrms-backend.onrender.com
     ↓
Database (MongoDB Atlas)
mongodb+srv://...
```

---

## 🎯 QUICK CHECKLIST

- [ ] Render account created (with GitHub)
- [ ] Web Service created
- [ ] Runtime set to Java
- [ ] Build command set
- [ ] Start command set
- [ ] Environment variables added
- [ ] Service created
- [ ] Build completed (10-15 min)
- [ ] Backend URL copied
- [ ] Vercel env var updated
- [ ] Frontend redeployed
- [ ] Login tested
- [ ] Everything works! 🎉

---

## ⏱️ TOTAL TIME

- Render setup: 5 minutes
- Build time: 10-15 minutes
- Vercel update: 2 minutes
- **Total: ~20 minutes**

---

## 🚀 START NOW!

**Go to:** https://render.com/

**Sign up with GitHub (FREE, no card!)** ✅

**Then follow the steps above!** 💪

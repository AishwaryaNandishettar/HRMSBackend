# 🆓 COMPLETE FREE DEPLOYMENT GUIDE - NO PAYMENT REQUIRED

## 🎯 100% FREE STACK (No Credit Card Needed)

- **Backend:** Render.com (Free tier, no card required)
- **Frontend:** Vercel (Free tier, no card required)
- **Database:** MongoDB Atlas (Free tier, no card required)

**Total Cost: $0/month** ✅

---

## 📋 PART 1: SETUP MONGODB ATLAS (15 minutes)

### STEP 1: Create MongoDB Atlas Account

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with Google or email (FREE, no card required)
3. Verify your email

### STEP 2: Create Free Cluster

1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select:
   - **Provider:** AWS
   - **Region:** Choose closest to you (e.g., Mumbai, Singapore, US-East)
4. **Cluster Name:** `Cluster0` (default)
5. Click **"Create"**
6. Wait 3-5 minutes

### STEP 3: Create Database User

1. You'll see a security quickstart
2. **Authentication Method:** Username and Password
3. **Username:** `hrms_user`
4. **Password:** Click **"Autogenerate Secure Password"**
5. **📋 COPY AND SAVE THIS PASSWORD!** (Very important!)
6. Click **"Create User"**

### STEP 4: Setup Network Access

1. **Where would you like to connect from?**
2. Click **"My Local Environment"**
3. Click **"Add My Current IP Address"**
4. **OR** Click **"Allow Access from Anywhere"** (easier for deployment)
   - This adds `0.0.0.0/0`
5. Click **"Finish and Close"**

### STEP 5: Get Connection String

1. Click **"Connect"** button
2. Click **"Connect your application"**
3. **Driver:** Java
4. Copy the connection string:
   ```
   mongodb+srv://hrms_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace `<password>`** with your actual password from Step 3
6. **Add `/Data_base_hrms`** before the `?`

**Your final connection string:**
```
mongodb+srv://hrms_user:YourPassword123@cluster0.abc123.mongodb.net/Data_base_hrms?retryWrites=true&w=majority
```

**📋 SAVE THIS STRING!** You'll need it multiple times.

---

## 📋 PART 2: DEPLOY BACKEND TO RENDER (20 minutes)

### STEP 1: Create Render Account

1. Go to: https://render.com/
2. Click **"Get Started for Free"**
3. Sign up with **GitHub** (no card required!)
4. Authorize Render to access your repositories

### STEP 2: Create Web Service

1. Click **"New +"** (top right)
2. Click **"Web Service"**
3. Click **"Build and deploy from a Git repository"**
4. Click **"Connect account"** (if needed)
5. Find your **"HRMSBackend"** repository
6. Click **"Connect"**

### STEP 3: Configure Service

**Fill in these fields EXACTLY:**

| Field | Value |
|-------|-------|
| **Name** | `hrms-backend` |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | Leave empty |
| **Runtime** | Select **"Java"** from dropdown |
| **Build Command** | `./mvnw clean package -DskipTests` |
| **Start Command** | `java -Dserver.port=$PORT -jar target/hmrs-backend-0.0.1-SNAPSHOT.jar` |
| **Instance Type** | **Free** |

### STEP 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

**Add these 4 variables:**

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB connection string from Part 1 |
| `SPRING_MAIL_USERNAME` | `aishushettar95@gmail.com` |
| `SPRING_MAIL_PASSWORD` | `bbfskhrhtnujkokk` |
| `JWT_SECRET` | `MyFixedSecretKey123456` |

**⚠️ IMPORTANT:** Use your actual MongoDB connection string!

### STEP 5: Create Web Service

1. Click **"Create Web Service"**
2. Render will start building (takes 10-15 minutes first time)
3. Watch the logs

**Expected logs:**
```
==> Cloning repository
==> Installing Java 21
==> Running: ./mvnw clean package -DskipTests
==> Downloading dependencies... (5-7 min)
==> BUILD SUCCESS
==> Starting application
==> Your service is live 🎉
```

### STEP 6: Get Your Backend URL

Once deployed, you'll see:
```
https://hrms-backend.onrender.com
```

**📋 SAVE THIS URL!**

**Test it:**
Open: `https://hrms-backend.onrender.com/api/auth/login`

Should see a response (not 404).

---

## 📋 PART 3: DEPLOY FRONTEND TO VERCEL (10 minutes)

### STEP 1: Update Frontend Environment Variables

First, update your frontend to use the Render backend URL.

**Edit `HRMS-Frontend/.env`:**
```env
VITE_API_BASE_URL=https://hrms-backend.onrender.com
VITE_TURN_USERNAME=51e40078dfabc57d54164c2f
VITE_TURN_CREDENTIAL=KJnavaquyonnUlkx
```

**Replace `hrms-backend.onrender.com` with your actual Render URL!**

### STEP 2: Commit Changes

```bash
cd HRMS-Frontend
git add .env
git commit -m "Update backend URL for deployment"
git push origin main
```

### STEP 3: Create Vercel Account

1. Go to: https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel (FREE, no card required!)

### STEP 4: Import Project

1. Click **"Add New..."** → **"Project"**
2. Click **"Import"** next to your repository
3. If you don't see it, click **"Adjust GitHub App Permissions"**
4. Select your **HRMS** repository

### STEP 5: Configure Project

| Field | Value |
|-------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `HRMS-Frontend` (if monorepo) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

### STEP 6: Add Environment Variables

Click **"Environment Variables"** section:

| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://hrms-backend.onrender.com` |
| `VITE_TURN_USERNAME` | `51e40078dfabc57d54164c2f` |
| `VITE_TURN_CREDENTIAL` | `KJnavaquyonnUlkx` |

**Use your actual Render backend URL!**

### STEP 7: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes
3. You'll get a URL like: `https://hrms-frontend.vercel.app`

**📋 SAVE THIS URL!**

---

## 📋 PART 4: TEST EVERYTHING (5 minutes)

### STEP 1: Test Backend

Open: `https://hrms-backend.onrender.com/api/auth/login`

Should see a response (not 404 or error).

### STEP 2: Test Frontend

1. Open: `https://hrms-frontend.vercel.app`
2. You should see the login page
3. Press **F12** (open DevTools)
4. Go to **Console** tab
5. Try to login with test credentials
6. Check for errors

### STEP 3: Check API Connection

In browser console, type:
```javascript
console.log(import.meta.env.VITE_API_BASE_URL)
```

Should show: `https://hrms-backend.onrender.com`

---

## ✅ SUCCESS CHECKLIST

- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created (M0 Free)
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string obtained
- [ ] Render account created (no card!)
- [ ] Backend deployed to Render
- [ ] Backend URL obtained
- [ ] Backend tested (returns response)
- [ ] Vercel account created (no card!)
- [ ] Frontend environment variables updated
- [ ] Frontend deployed to Vercel
- [ ] Frontend URL obtained
- [ ] Login tested
- [ ] Everything works! 🎉

---

## 🆘 TROUBLESHOOTING

### Backend Build Fails on Render

**Error:** "Failed to build"

**Solution:**
1. Go to Render dashboard
2. Click your service
3. Click "Settings"
4. Make sure:
   - Runtime: Java
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -Dserver.port=$PORT -jar target/hmrs-backend-0.0.1-SNAPSHOT.jar`
5. Click "Manual Deploy" → "Clear build cache & deploy"

### MongoDB Connection Failed

**Error:** "MongoTimeoutException"

**Check:**
1. Connection string is correct
2. Password doesn't have special characters
3. Network access allows `0.0.0.0/0`
4. Database name is `Data_base_hrms`

### Frontend Can't Connect to Backend

**Error:** "Network Error" or "CORS Error"

**Check:**
1. Backend URL in Vercel environment variables is correct
2. Backend is running (open backend URL in browser)
3. No typos in environment variable names
4. Redeploy frontend after changing env vars

### Render Service Sleeping

**Issue:** First request takes 30-60 seconds

**Explanation:** Render free tier spins down after 15 minutes of inactivity.

**Solution:** This is normal for free tier. First request wakes it up.

---

## 💰 COST BREAKDOWN

| Service | Plan | Resources | Cost |
|---------|------|-----------|------|
| **MongoDB Atlas** | M0 Free | 512 MB storage | $0 |
| **Render** | Free | 750 hours/month | $0 |
| **Vercel** | Hobby | 100 GB bandwidth | $0 |
| **Total** | | | **$0/month** ✅ |

**No credit card required for any service!**

---

## 🎯 FINAL ARCHITECTURE

```
User Browser
     ↓
Frontend (Vercel)
https://hrms-frontend.vercel.app
     ↓
Backend (Render)
https://hrms-backend.onrender.com
     ↓
Database (MongoDB Atlas)
mongodb+srv://cluster0.xxxxx.mongodb.net
```

---

## 📞 NEED HELP?

If something doesn't work:

1. **Check logs:**
   - Render: Dashboard → Your Service → Logs
   - Vercel: Dashboard → Your Project → Deployments → View Function Logs
   - Browser: F12 → Console

2. **Common issues:**
   - Wrong environment variables
   - Typos in URLs
   - Backend not running
   - MongoDB connection string incorrect

3. **Share:**
   - Screenshot of error
   - Relevant logs
   - What step you're on

---

## 🎉 CONGRATULATIONS!

You now have a fully deployed HRMS application:

- ✅ Backend on Render (FREE)
- ✅ Frontend on Vercel (FREE)
- ✅ Database on MongoDB Atlas (FREE)
- ✅ No credit card required
- ✅ Professional deployment
- ✅ Automatic HTTPS
- ✅ Easy to update (just push to GitHub)

**Your URLs:**
- **Frontend:** https://hrms-frontend.vercel.app
- **Backend:** https://hrms-backend.onrender.com
- **Database:** MongoDB Atlas (cloud)

**Total time:** ~45 minutes
**Total cost:** $0/month

**Happy coding! 🚀**

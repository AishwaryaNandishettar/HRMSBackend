# 🚀 Deploy HRMS Backend to Render.com

## Why Deploy Backend?

Currently, you're using ngrok which:
- ❌ Expires after a few hours
- ❌ Requires your local machine to be running
- ❌ Changes URL every time you restart

**Solution:** Deploy backend to Render.com for a permanent URL.

---

## 📋 Prerequisites

1. ✅ MongoDB Atlas account (you already have this)
2. ✅ GitHub account
3. ✅ Render.com account (free - create at https://render.com)

---

## Step 1: Get Your MongoDB Connection String

From your screenshot, I can see you have MongoDB running locally. You need to use **MongoDB Atlas** (cloud) for deployment.

### Option A: If You Already Have MongoDB Atlas

1. Go to https://cloud.mongodb.com
2. Click on your cluster
3. Click **"Connect"**
4. Click **"Connect your application"**
5. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/Data_base_hrms
   ```
6. Replace `<username>` and `<password>` with your actual credentials

### Option B: Create New MongoDB Atlas Cluster (Free)

1. Go to https://cloud.mongodb.com
2. Sign up / Log in
3. Click **"Create"** → **"Shared"** (Free tier)
4. Choose a cloud provider (AWS recommended)
5. Choose a region (closest to you)
6. Click **"Create Cluster"** (takes 3-5 minutes)
7. Create a database user:
   - Click **"Database Access"** (left sidebar)
   - Click **"Add New Database User"**
   - Username: `hrms_user`
   - Password: Generate a secure password (save it!)
   - Click **"Add User"**
8. Whitelist all IPs:
   - Click **"Network Access"** (left sidebar)
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Click **"Confirm"**
9. Get connection string:
   - Click **"Database"** (left sidebar)
   - Click **"Connect"** on your cluster
   - Click **"Connect your application"**
   - Copy the connection string
   - Replace `<password>` with your actual password

**Example:**
```
mongodb+srv://hrms_user:YourPassword123@cluster0.abc123.mongodb.net/Data_base_hrms
```

---

## Step 2: Push Backend to GitHub

If your backend is not on GitHub yet:

```bash
cd HRMS-Backend

# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare backend for deployment"

# Create a new repository on GitHub
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/HRMS-Backend.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy to Render.com

### 3.1 Create Render Account

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with GitHub (recommended)

### 3.2 Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Select **"HRMS-Backend"** repository
4. Configure:

   **Basic Settings:**
   - Name: `hrms-backend`
   - Region: Choose closest to you
   - Branch: `main`
   - Root Directory: Leave empty (or `HRMS-Backend` if it's in a monorepo)
   - Runtime: `Java`
   - Build Command: `./mvnw clean package -DskipTests`
   - Start Command: `java -jar target/*.jar`

   **Instance Type:**
   - Select **"Free"** (0$/month)

### 3.3 Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://hrms_user:YourPassword@cluster0.xxxxx.mongodb.net/Data_base_hrms` |
| `SPRING_MAIL_USERNAME` | Your Gmail address |
| `SPRING_MAIL_PASSWORD` | Your Gmail app password |
| `JWT_SECRET` | `MyFixedSecretKey123456` |
| `PORT` | `8082` |

**Important:** Replace the MongoDB URI with your actual connection string!

### 3.4 Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (5-10 minutes)
3. You'll see build logs
4. When done, you'll get a URL like: `https://hrms-backend.onrender.com`

---

## Step 4: Test Backend

### Test 1: Check if backend is running

Open: `https://hrms-backend.onrender.com/api/auth/login`

You should see some response (not 404).

### Test 2: Use the test-backend.html

1. Open `test-backend.html` in your browser
2. Enter your Render URL: `https://hrms-backend.onrender.com`
3. Click "Test Connection"
4. Should show: ✅ Backend is reachable

---

## Step 5: Update Frontend Environment Variables

### In Vercel Dashboard:

1. Go to https://vercel.com/dashboard
2. Select your HRMS project
3. Settings → Environment Variables
4. **Edit** `VITE_API_BASE_URL`:
   - Old value: `https://trowel-eldercare-scouting.ngrok-free.dev`
   - New value: `https://hrms-backend.onrender.com`
5. Click **Save**
6. Go to Deployments → **Redeploy from scratch**

---

## Step 6: Update CORS in Backend

Your backend CORS already allows Vercel domains, but let's make sure:

The `CorsConfig.java` already has:
```java
config.setAllowedOriginPatterns(List.of(
    "https://*.ngrok-free.dev",
    "https://*.ngrok.io",
    "https://*.vercel.app"  // ✅ This allows your Vercel frontend
));
```

This is already correct! ✅

---

## 🎯 Final Result

After completing all steps:

1. ✅ Backend deployed to Render: `https://hrms-backend.onrender.com`
2. ✅ Backend connects to MongoDB Atlas (cloud database)
3. ✅ Frontend on Vercel connects to backend on Render
4. ✅ No more ngrok needed!
5. ✅ Everything works 24/7 without your local machine

---

## 📊 Architecture After Deployment

```
┌─────────────────┐
│   User Browser  │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Vercel (Frontend) │  https://hrmsfrontendapp2.vercel.app
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  Render (Backend)  │  https://hrms-backend.onrender.com
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│  MongoDB Atlas  │  Cloud Database
└─────────────────┘
```

---

## ⚠️ Important Notes

### About Render Free Tier

- ✅ Free forever
- ✅ Automatic HTTPS
- ✅ Automatic deployments from GitHub
- ⚠️ Spins down after 15 minutes of inactivity
- ⚠️ First request after spin-down takes 30-60 seconds

**Solution for spin-down:** Use a service like UptimeRobot to ping your backend every 10 minutes.

### About MongoDB Atlas Free Tier

- ✅ 512 MB storage (enough for small apps)
- ✅ Shared cluster
- ✅ Free forever

---

## 🔧 Troubleshooting

### Issue 1: Build Failed on Render

**Error:** `./mvnw: Permission denied`

**Solution:** Make mvnw executable:
```bash
cd HRMS-Backend
git update-index --chmod=+x mvnw
git commit -m "Make mvnw executable"
git push
```

Then redeploy on Render.

### Issue 2: MongoDB Connection Failed

**Error:** `MongoTimeoutException`

**Solutions:**
1. Check MongoDB Atlas Network Access allows 0.0.0.0/0
2. Verify connection string is correct
3. Check username/password are correct
4. Make sure database name is correct

### Issue 3: Backend Returns 502

**Cause:** Backend is starting up (cold start)

**Solution:** Wait 30-60 seconds and try again.

### Issue 4: CORS Error

**Solution:** Already configured in `CorsConfig.java` to allow `*.vercel.app`

---

## 🚀 Quick Start Checklist

- [ ] Create MongoDB Atlas cluster
- [ ] Get MongoDB connection string
- [ ] Push backend to GitHub
- [ ] Create Render account
- [ ] Deploy backend to Render
- [ ] Add environment variables in Render
- [ ] Wait for deployment to complete
- [ ] Test backend URL
- [ ] Update `VITE_API_BASE_URL` in Vercel
- [ ] Redeploy frontend
- [ ] Test login

---

## 💡 Pro Tips

1. **Use environment variables** for all sensitive data
2. **Enable auto-deploy** on Render (deploys automatically when you push to GitHub)
3. **Monitor logs** on Render dashboard to debug issues
4. **Use MongoDB Atlas** instead of local MongoDB
5. **Set up UptimeRobot** to keep backend awake

---

## 📞 Need Help?

If deployment fails, share:
1. Render build logs (screenshot)
2. Render runtime logs (screenshot)
3. MongoDB connection string (hide password!)
4. Error messages

---

## 🎉 Success!

Once deployed, you'll have:
- ✅ Permanent backend URL
- ✅ No need for ngrok
- ✅ No need to keep local machine running
- ✅ Automatic HTTPS
- ✅ Free hosting
- ✅ Professional deployment

Your app will be accessible 24/7 from anywhere! 🚀

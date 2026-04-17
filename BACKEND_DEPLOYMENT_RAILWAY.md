# 🚂 Deploy HRMS Backend to Railway.app (Alternative)

Railway is another excellent option for deploying your backend. It's often faster than Render.

---

## Why Railway?

- ✅ Faster cold starts than Render
- ✅ $5 free credit per month (enough for small apps)
- ✅ Easier setup
- ✅ Better performance
- ✅ Automatic HTTPS

---

## Step 1: Prepare MongoDB Atlas

Same as Render guide - you need MongoDB Atlas connection string.

**Quick steps:**
1. Go to https://cloud.mongodb.com
2. Create cluster (if not exists)
3. Create database user
4. Whitelist all IPs (0.0.0.0/0)
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/Data_base_hrms
   ```

---

## Step 2: Push to GitHub

```bash
cd HRMS-Backend
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

---

## Step 3: Deploy to Railway

### 3.1 Create Railway Account

1. Go to https://railway.app
2. Click **"Login"**
3. Sign in with GitHub

### 3.2 Create New Project

1. Click **"New Project"**
2. Click **"Deploy from GitHub repo"**
3. Select **"HRMS-Backend"** repository
4. Railway will auto-detect it's a Java/Maven project

### 3.3 Configure Build

Railway usually auto-detects, but if needed:

1. Click on your service
2. Go to **"Settings"**
3. Set:
   - **Build Command:** `./mvnw clean package -DskipTests`
   - **Start Command:** `java -jar target/*.jar`
   - **Root Directory:** Leave empty (or set if in monorepo)

### 3.4 Add Environment Variables

1. Click on your service
2. Go to **"Variables"** tab
3. Click **"New Variable"**

Add these:

```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/Data_base_hrms
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-app-password
JWT_SECRET=MyFixedSecretKey123456
PORT=8082
```

### 3.5 Generate Domain

1. Go to **"Settings"** tab
2. Scroll to **"Networking"**
3. Click **"Generate Domain"**
4. You'll get a URL like: `https://hrms-backend-production.up.railway.app`

---

## Step 4: Test Backend

Open: `https://your-app.up.railway.app/api/auth/login`

Should see some response (not 404).

---

## Step 5: Update Frontend

In Vercel:
1. Settings → Environment Variables
2. Edit `VITE_API_BASE_URL`
3. Set to: `https://your-app.up.railway.app`
4. Redeploy frontend

---

## 🎯 Comparison: Render vs Railway

| Feature | Render | Railway |
|---------|--------|---------|
| **Free Tier** | Forever free | $5/month credit |
| **Cold Start** | 30-60 seconds | 5-10 seconds |
| **Spin Down** | After 15 min | No spin down with credit |
| **Setup** | More steps | Easier |
| **Performance** | Good | Better |
| **Logs** | Good | Excellent |

**Recommendation:** 
- Use **Railway** if you want better performance
- Use **Render** if you want completely free (but slower)

---

## 💰 Railway Pricing

- **Free:** $5 credit/month
- **Usage:** ~$5-10/month for small app
- **First month:** Usually free with credit

**Tip:** $5 credit is enough if your app doesn't have much traffic.

---

## 🔧 Troubleshooting

Same as Render guide. Check:
1. Build logs
2. Runtime logs
3. MongoDB connection
4. Environment variables

---

## ✅ Success Checklist

- [ ] MongoDB Atlas ready
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Project deployed
- [ ] Environment variables set
- [ ] Domain generated
- [ ] Backend tested
- [ ] Frontend updated
- [ ] Login works!

---

Choose Railway if you want faster performance, or Render if you want completely free hosting!

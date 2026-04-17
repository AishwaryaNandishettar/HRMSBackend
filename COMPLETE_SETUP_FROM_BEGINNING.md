# 🚀 HRMS Complete Setup Guide - From Beginning to Deployment

This guide will take you from zero to a fully deployed HRMS application in the cloud.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [MongoDB Atlas Setup](#mongodb-atlas-setup)
4. [Backend Deployment (Render)](#backend-deployment)
5. [Frontend Deployment (Vercel)](#frontend-deployment)
6. [Testing & Verification](#testing--verification)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

1. **Java Development Kit (JDK) 21**
   - Download: https://adoptium.net/
   - Verify: `java -version` (should show version 21)

2. **Maven 3.9+**
   - Download: https://maven.apache.org/download.cgi
   - Verify: `mvn -version`

3. **Node.js 18+ and npm**
   - Download: https://nodejs.org/
   - Verify: `node -v` and `npm -v`

4. **Git**
   - Download: https://git-scm.com/
   - Verify: `git --version`

5. **MongoDB Compass** (Optional but recommended)
   - Download: https://www.mongodb.com/try/download/compass

### Required Accounts (All Free)

1. **GitHub Account** - https://github.com/signup
2. **MongoDB Atlas Account** - https://cloud.mongodb.com/
3. **Render Account** - https://render.com/
4. **Vercel Account** - https://vercel.com/signup

---

## Local Development Setup

### Step 1: Clone the Repository

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/HRMS-Project.git
cd HRMS-Project
```

### Step 2: Setup Backend Locally

```bash
# Navigate to backend folder
cd HRMS-Backend

# Install dependencies and build
mvn clean install

# Run the application
mvn spring-boot:run
```

**Expected Output:**
```
Started HmrsBackendApplication in X seconds
Tomcat started on port(s): 8082
```

**Test Backend:**
Open browser: http://localhost:8082/api/auth/login
- Should see some response (not 404)

### Step 3: Setup Frontend Locally

```bash
# Navigate to frontend folder (from project root)
cd HRMS-Frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8082" > .env
echo "VITE_TURN_USERNAME=51e40078dfabc57d54164c2f" >> .env
echo "VITE_TURN_CREDENTIAL=KJnavaquyonnUlkx" >> .env

# Run development server
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in XXX ms
➜ Local: http://localhost:5176/
```

**Test Frontend:**
Open browser: http://localhost:5176
- Should see login page

### Step 4: Setup Local MongoDB (Optional for Development)

**Option A: Install MongoDB Locally**
- Download: https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Default connection: `mongodb://localhost:27017`

**Option B: Use MongoDB Atlas (Recommended)**
- Skip local MongoDB and go directly to cloud setup
- See next section

---

## MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account

1. Go to https://cloud.mongodb.com/
2. Click "Try Free"
3. Sign up with Google/GitHub or email
4. Verify your email

### Step 2: Create a Cluster

1. After login, click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select:
   - **Cloud Provider:** AWS
   - **Region:** Choose closest to you (e.g., Mumbai, Singapore, US-East)
4. **Cluster Name:** `Cluster0` (default is fine)
5. Click **"Create Cluster"**
6. Wait 3-5 minutes for cluster creation

### Step 3: Create Database User

1. Click **"Database Access"** (left sidebar under SECURITY)
2. Click **"Add New Database User"**
3. Fill in:
   - **Authentication Method:** Password
   - **Username:** `hrms_user`
   - **Password:** Click **"Autogenerate Secure Password"**
   - **📋 IMPORTANT: Copy and save this password!**
4. **Database User Privileges:** Select **"Read and write to any database"**
5. Click **"Add User"**

**Save this information:**
```
Username: hrms_user
Password: [paste the generated password here]
```

### Step 4: Configure Network Access

1. Click **"Network Access"** (left sidebar under SECURITY)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` (allows all IPs)
   - ⚠️ For production, restrict to specific IPs
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Click **"Database"** (left sidebar)
2. Click **"Connect"** button on your Cluster0
3. Click **"Connect your application"**
4. **Driver:** Java, **Version:** 4.3 or later
5. Copy the connection string:

```
mongodb+srv://hrms_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. **Modify the connection string:**
   - Replace `<password>` with your actual password
   - Add `/Data_base_hrms` before the `?`

**Final connection string should look like:**
```
mongodb+srv://hrms_user:YourActualPassword@cluster0.xxxxx.mongodb.net/Data_base_hrms?retryWrites=true&w=majority
```

**📋 SAVE THIS STRING! You'll need it multiple times.**

### Step 6: Test Connection

**Using MongoDB Compass:**
1. Open MongoDB Compass
2. Click **"New Connection"**
3. Paste your connection string
4. Click **"Connect"**
5. You should see your cluster connected ✅

---

## Backend Deployment

### Step 1: Prepare Backend for Deployment

**1.1 Update application.properties**

Edit `HRMS-Backend/src/main/resources/application.properties`:

```properties
# Use environment variable for MongoDB
spring.data.mongodb.uri=${MONGODB_URI:mongodb://localhost:27017/Data_base_hrms}

# Use environment variables for email
spring.mail.username=${SPRING_MAIL_USERNAME}
spring.mail.password=${SPRING_MAIL_PASSWORD}

# JWT secret from environment
jwt.secret=${JWT_SECRET:MyFixedSecretKey123456}

# Port from environment
server.port=${PORT:8082}
```

**1.2 Make mvnw executable (Important for Linux/Mac)**

```bash
cd HRMS-Backend
git update-index --chmod=+x mvnw
```

**1.3 Commit changes**

```bash
git add .
git commit -m "Prepare backend for cloud deployment"
git push origin main
```

### Step 2: Deploy to Render

**2.1 Create Render Account**

1. Go to https://render.com/
2. Click **"Get Started"**
3. Sign up with **GitHub**
4. Authorize Render to access your repositories

**2.2 Create New Web Service**

1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"**
4. Find and select your **HRMS-Backend** repository
5. Click **"Connect"**

**2.3 Configure Service**

Fill in the following:

| Field | Value |
|-------|-------|
| **Name** | `hrms-backend` (or any name you prefer) |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | Leave empty (or `HRMS-Backend` if monorepo) |
| **Runtime** | `Java` |
| **Build Command** | `./mvnw clean package -DskipTests` |
| **Start Command** | `java -jar target/*.jar` |
| **Instance Type** | `Free` |

**2.4 Add Environment Variables**

Click **"Advanced"** → **"Add Environment Variable"**

Add these variables one by one:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | Your MongoDB Atlas connection string from earlier |
| `SPRING_MAIL_USERNAME` | Your Gmail address (e.g., `aishushettar95@gmail.com`) |
| `SPRING_MAIL_PASSWORD` | Your Gmail App Password (see below) |
| `JWT_SECRET` | `MyFixedSecretKey123456` |
| `PORT` | `8082` |

**Getting Gmail App Password:**
1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification (if not enabled)
3. Search for "App passwords"
4. Create new app password for "Mail"
5. Copy the 16-character password
6. Use this as `SPRING_MAIL_PASSWORD`

**2.5 Deploy**

1. Click **"Create Web Service"**
2. Render will start building your application
3. Wait 5-10 minutes for the first deployment
4. Watch the logs for any errors

**2.6 Get Your Backend URL**

Once deployed, you'll see:
```
Your service is live 🎉
https://hrms-backend-xxxx.onrender.com
```

**📋 SAVE THIS URL!**

**2.7 Test Backend**

Open in browser: `https://hrms-backend-xxxx.onrender.com/api/auth/login`

Should see a response (not 404 or error page).

---

## Frontend Deployment

### Step 1: Prepare Frontend

**1.1 Update .env file**

Edit `HRMS-Frontend/.env`:

```env
VITE_API_BASE_URL=https://hrms-backend-xxxx.onrender.com
VITE_TURN_USERNAME=51e40078dfabc57d54164c2f
VITE_TURN_CREDENTIAL=KJnavaquyonnUlkx
```

Replace `hrms-backend-xxxx.onrender.com` with your actual Render URL.

**1.2 Verify vite.config.js**

Make sure `HRMS-Frontend/vite.config.js` looks like this:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  define: {
    global: "window",
  },
  server: {
    port: 5176,
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

**1.3 Create vercel.json**

Create `HRMS-Frontend/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**1.4 Commit changes**

```bash
cd HRMS-Frontend
git add .
git commit -m "Configure frontend for Vercel deployment"
git push origin main
```

### Step 2: Deploy to Vercel

**2.1 Create Vercel Account**

1. Go to https://vercel.com/signup
2. Sign up with **GitHub**
3. Authorize Vercel

**2.2 Import Project**

1. Click **"Add New..."** → **"Project"**
2. Click **"Import"** next to your repository
3. Select **"HRMS-Frontend"** folder (if monorepo)

**2.3 Configure Project**

| Field | Value |
|-------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `HRMS-Frontend` (if monorepo) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |

**2.4 Add Environment Variables**

Click **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_API_BASE_URL` | `https://hrms-backend-xxxx.onrender.com` |
| `VITE_TURN_USERNAME` | `51e40078dfabc57d54164c2f` |
| `VITE_TURN_CREDENTIAL` | `KJnavaquyonnUlkx` |

**2.5 Deploy**

1. Click **"Deploy"**
2. Wait 1-2 minutes
3. You'll get a URL like: `https://hrms-frontend-xxxx.vercel.app`

**📋 SAVE THIS URL!**

---

## Testing & Verification

### Step 1: Test Environment Variables

Create `HRMS-Frontend/public/env-check.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Environment Check</title>
</head>
<body>
    <h1>Environment Variables Check</h1>
    <div id="result"></div>
    <script type="module">
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        const turnUser = import.meta.env.VITE_TURN_USERNAME;
        const turnCred = import.meta.env.VITE_TURN_CREDENTIAL;
        
        document.getElementById('result').innerHTML = `
            <p><strong>VITE_API_BASE_URL:</strong> ${apiUrl || '❌ NOT SET'}</p>
            <p><strong>VITE_TURN_USERNAME:</strong> ${turnUser || '❌ NOT SET'}</p>
            <p><strong>VITE_TURN_CREDENTIAL:</strong> ${turnCred ? '✅ SET' : '❌ NOT SET'}</p>
        `;
    </script>
</body>
</html>
```

Open: `https://your-frontend-url.vercel.app/env-check.html`

Should show:
```
✅ VITE_API_BASE_URL: https://hrms-backend-xxxx.onrender.com
✅ VITE_TURN_USERNAME: 51e40078dfabc57d54164c2f
✅ VITE_TURN_CREDENTIAL: SET
```

### Step 2: Test Login

1. Go to your frontend URL
2. Open Browser DevTools (F12)
3. Go to **Console** tab
4. Try to login with test credentials
5. Check for errors

**If login works:** ✅ Success!

**If login fails:** See Troubleshooting section below.

### Step 3: Test All Features

- ✅ Login/Logout
- ✅ View Employees
- ✅ Attendance Management
- ✅ Leave Requests
- ✅ Chat/Messaging
- ✅ Reports

---

## Troubleshooting

### Issue 1: Backend Build Failed on Render

**Error:** `Failed to execute goal... compilation failure`

**Solution:**
```bash
# Make sure Java 21 is specified in pom.xml
<properties>
    <java.version>21</java.version>
</properties>

# Commit and push
git add pom.xml
git commit -m "Fix Java version"
git push origin main
```

### Issue 2: MongoDB Connection Failed

**Error:** `MongoTimeoutException` or `Authentication failed`

**Check:**
1. Connection string is correct
2. Password doesn't have special characters (or is URL-encoded)
3. Network access allows `0.0.0.0/0`
4. Database user has correct permissions

**Solution:**
- Go to MongoDB Atlas → Database Access
- Edit user → Reset password
- Use simple password (no special characters)
- Update `MONGODB_URI` in Render

### Issue 3: CORS Error on Frontend

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**

Edit `HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/config/WebConfig.java`:

```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/**")
            .allowedOrigins(
                "http://localhost:5176",
                "https://*.vercel.app",
                "https://*.onrender.com"
            )
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
}
```

Commit, push, and Render will auto-redeploy.

### Issue 4: Environment Variables Not Working

**Error:** `VITE_API_BASE_URL is undefined`

**Solution:**
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Make sure all variables are set
4. Go to Deployments → Redeploy

### Issue 5: Render Service Sleeping

**Issue:** First request takes 30-60 seconds

**Explanation:** Render free tier spins down after 15 minutes of inactivity.

**Solution (Optional):**
- Use UptimeRobot (https://uptimerobot.com/) to ping your backend every 10 minutes
- Or upgrade to Render paid plan ($7/month)

---

## 🎉 Success Checklist

- [ ] Java 21 installed
- [ ] Maven installed
- [ ] Node.js installed
- [ ] Git installed
- [ ] GitHub account created
- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created
- [ ] Database user created
- [ ] Network access configured
- [ ] Connection string obtained
- [ ] Render account created
- [ ] Backend deployed to Render
- [ ] Backend URL obtained
- [ ] Backend tested (returns response)
- [ ] Vercel account created
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set in Vercel
- [ ] env-check.html shows correct values
- [ ] Login works
- [ ] All features tested

---

## 📊 Final Architecture

```
┌─────────────────────────────────────────────────┐
│                 User Browser                     │
└────────────────────┬────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────┐
│  Frontend (Vercel)                               │
│  https://hrms-frontend-xxxx.vercel.app          │
│  • React + Vite                                  │
│  • Static hosting                                │
│  • Automatic HTTPS                               │
│  • CDN distribution                              │
└────────────────────┬────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────┐
│  Backend (Render)                                │
│  https://hrms-backend-xxxx.onrender.com         │
│  • Spring Boot (Java 21)                         │
│  • REST API                                      │
│  • WebSocket support                             │
│  • Automatic deployments                         │
└────────────────────┬────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────┐
│  Database (MongoDB Atlas)                        │
│  mongodb+srv://cluster0.xxxxx.mongodb.net       │
│  • Cloud database                                │
│  • 512 MB free tier                              │
│  • Automatic backups                             │
│  • Global distribution                           │
└─────────────────────────────────────────────────┘
```

---

## 💰 Cost Breakdown

| Service | Plan | Storage/Resources | Cost |
|---------|------|-------------------|------|
| **MongoDB Atlas** | M0 Free | 512 MB | $0/month |
| **Render** | Free | 750 hours/month | $0/month |
| **Vercel** | Hobby | 100 GB bandwidth | $0/month |
| **GitHub** | Free | Unlimited repos | $0/month |
| **Total** | | | **$0/month** ✅ |

---

## 🚀 Next Steps

### For Development

1. **Setup Local Development:**
   ```bash
   # Backend
   cd HRMS-Backend
   mvn spring-boot:run
   
   # Frontend (new terminal)
   cd HRMS-Frontend
   npm run dev
   ```

2. **Make Changes:**
   - Edit code
   - Test locally
   - Commit and push

3. **Automatic Deployment:**
   - Render auto-deploys on push to main
   - Vercel auto-deploys on push to main

### For Production

1. **Custom Domain (Optional):**
   - Buy domain from Namecheap, GoDaddy, etc.
   - Add to Vercel: Settings → Domains
   - Add to Render: Settings → Custom Domain

2. **Monitoring:**
   - Use Render logs for backend
   - Use Vercel Analytics for frontend
   - Setup UptimeRobot for uptime monitoring

3. **Scaling:**
   - Upgrade MongoDB Atlas when you need more storage
   - Upgrade Render when you need always-on service
   - Vercel scales automatically

---

## 📚 Additional Resources

- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com/
- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **Spring Boot Docs:** https://spring.io/projects/spring-boot
- **Vite Docs:** https://vitejs.dev/

---

## 🆘 Need Help?

If you encounter issues:

1. **Check Logs:**
   - Render: Dashboard → Your Service → Logs
   - Vercel: Dashboard → Your Project → Deployments → View Function Logs
   - Browser: F12 → Console

2. **Common Issues:**
   - See Troubleshooting section above
   - Check environment variables
   - Verify connection strings
   - Test backend URL directly

3. **Share Information:**
   - Screenshot of error
   - Relevant logs
   - Steps to reproduce

---

## ✅ Congratulations!

You now have a fully deployed, production-ready HRMS application running in the cloud!

**Your URLs:**
- **Frontend:** https://hrms-frontend-xxxx.vercel.app
- **Backend:** https://hrms-backend-xxxx.onrender.com
- **Database:** MongoDB Atlas (cloud)

**Features:**
- ✅ 24/7 availability
- ✅ Automatic HTTPS
- ✅ Automatic deployments
- ✅ Free hosting
- ✅ Scalable architecture
- ✅ Professional setup

**Happy coding! 🎉**

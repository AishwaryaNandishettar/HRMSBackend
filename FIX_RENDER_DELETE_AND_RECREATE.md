# 🔧 FIX RENDER - DELETE AND RECREATE SERVICE

## ❌ PROBLEM:
Your current Render service is stuck trying to use Docker. The only way to fix this is to **delete the service completely** and create a new one.

---

## 🎯 EXACT STEPS TO FIX RENDER

### STEP 1: Delete Current Service (1 minute)

1. Go to your Render dashboard
2. Click on **"HRMSBackend-2"** service
3. Click **"Settings"** (left sidebar)
4. Scroll all the way down
5. Click **"Delete or suspend"** (right sidebar)
6. Click **"Delete Web Service"**
7. Type the service name to confirm
8. Click **"Delete"**

---

### STEP 2: Create New Service (2 minutes)

1. Click **"New +"** (top right)
2. Click **"Web Service"**
3. Click **"Connect a repository"**
4. Select **"HRMSBackend"** repository
5. Click **"Connect"**

---

### STEP 3: Configure Service (3 minutes)

**IMPORTANT: Fill these EXACTLY:**

| Field | Value |
|-------|-------|
| **Name** | `hrmsbackend` (or any name) |
| **Region** | Choose closest to you |
| **Branch** | `main` |
| **Root Directory** | Leave empty |
| **Runtime** | **Select "Java"** ⚠️ IMPORTANT! |
| **Build Command** | `./mvnw clean package -DskipTests` |
| **Start Command** | `java -jar target/*.jar` |
| **Instance Type** | Free |

**⚠️ CRITICAL: Make sure "Runtime" is set to "Java", NOT "Docker"!**

---

### STEP 4: Add Environment Variables (2 minutes)

Click **"Advanced"** → **"Add Environment Variable"**

**Add these 5 variables:**

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb://localhost:27017/Data_base_hrms` |
| `SPRING_MAIL_USERNAME` | `aishushettar95@gmail.com` |
| `SPRING_MAIL_PASSWORD` | `bbfskhrhtnujkokk` |
| `JWT_SECRET` | `MyFixedSecretKey123456` |
| `PORT` | `8082` |

---

### STEP 5: Create Service (1 minute)

1. Click **"Create Web Service"**
2. Render will start building
3. Watch the logs

---

### STEP 6: Wait for Build (5-10 minutes)

**Expected logs:**

```
==> Cloning from https://github.com/...
==> Checking out commit 57db314...
==> Detected Java application
==> Running: ./mvnw clean package -DskipTests
==> Downloading dependencies...
==> Compiling...
==> BUILD SUCCESS
==> Starting: java -jar target/*.jar
==> Your service is live 🎉
```

---

### STEP 7: Get Your URL (1 minute)

Once deployed, you'll see:
```
https://hrmsbackend-xxxx.onrender.com
```

**📋 COPY THIS URL!**

---

## ✅ WHY THIS WILL WORK:

- ✅ Fresh service with no Docker configuration
- ✅ Explicitly set to Java runtime
- ✅ No conflicting files
- ✅ Clean slate

---

## 🆘 IF IT STILL FAILS:

**Check the logs for:**

1. **"Detected Docker"** → You selected wrong runtime
   - Delete and recreate, select "Java"

2. **"mvnw: Permission denied"** → Already fixed in code
   - Should not happen

3. **"Failed to compile"** → Java version issue
   - Share the full error

---

## 📋 CHECKLIST:

- [ ] Delete current service
- [ ] Create new service
- [ ] Select "Java" runtime (NOT Docker)
- [ ] Set build command
- [ ] Set start command
- [ ] Add 5 environment variables
- [ ] Create service
- [ ] Wait 5-10 minutes
- [ ] Get URL
- [ ] Update Vercel
- [ ] Test

---

## ⏱️ TOTAL TIME: 15 minutes

---

## 🚂 OR USE RAILWAY (EASIER):

If you don't want to deal with Render's issues, use Railway instead:

**See:** `USE_RAILWAY_INSTEAD.md`

Railway automatically detects Java and works first time!

---

**YOUR CHOICE:**

1. **Fix Render:** Delete and recreate (15 min)
2. **Use Railway:** Simpler and faster (10 min)

**I recommend Railway!** 🚂

# 🔧 FIX RENDER DEPLOYMENT ERROR

## ❌ CURRENT ERROR
```
npm error code ENOENT
npm error syscall open
npm error path /opt/render/project/src/HRMS-Backend/package.json
npm error errno -2
npm error enoent Could not read package.json
```

## 🔍 ROOT CAUSE
Render is trying to use **Node.js/npm** instead of **Docker** for your Java Spring Boot application.

---

## ✅ SOLUTION: CHANGE RENDER TO USE DOCKER

### STEP 1: Go to Render Dashboard
1. Open: https://dashboard.render.com
2. Find your service: **hrms-backend-final**
3. Click on the service name

### STEP 2: Go to Settings
1. Click **"Settings"** tab (left sidebar)
2. Scroll down to **"Build & Deploy"** section

### STEP 3: Change Environment to Docker
Look for **"Environment"** setting:
- **Current**: `Node` ❌
- **Change to**: `Docker` ✅

**How to change:**
1. Click the dropdown next to "Environment"
2. Select **"Docker"**
3. Click **"Save Changes"**

### STEP 4: Verify Other Settings

**Root Directory:**
- Should be: `HRMS-Backend` ✅

**Build Command:**
- Should be: **EMPTY** (leave blank for Docker) ✅

**Start Command:**
- Should be: **EMPTY** (leave blank for Docker) ✅

**Dockerfile Path:**
- Should be: `Dockerfile` or leave blank ✅

### STEP 5: Set Environment Variables
Make sure these 4 variables are set in Render:

1. **MONGODB_URI**
   ```
   mongodb+srv://hrms_user:yWkztlbtsW7RGube@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0
   ```

2. **SPRING_MAIL_USERNAME**
   ```
   aishushettar95@gmail.com
   ```

3. **SPRING_MAIL_PASSWORD**
   ```
   bbfskhrhtnujkokk
   ```

4. **JWT_SECRET**
   ```
   MyFixedSecretKey123456
   ```

### STEP 6: Trigger Manual Deploy
1. Go to **"Manual Deploy"** section
2. Click **"Deploy latest commit"**
3. Wait for deployment to complete (5-10 minutes)

---

## 📊 EXPECTED SUCCESSFUL DEPLOYMENT

### Build Logs Should Show:
```
==> Building with Dockerfile
==> Step 1/8 : FROM maven:3.9-eclipse-temurin-21 AS build
==> Step 2/8 : WORKDIR /app
==> Step 3/8 : COPY pom.xml .
==> Step 4/8 : COPY src ./src
==> Step 5/8 : RUN mvn clean package -DskipTests
==> Step 6/8 : FROM eclipse-temurin:21-jre-alpine
==> Step 7/8 : COPY --from=build /app/target/hmrs-backend-0.0.1-SNAPSHOT.jar app.jar
==> Step 8/8 : ENTRYPOINT ["java", "-Dserver.port=${PORT:-8080}", "-jar", "app.jar"]
==> Build successful ✅
```

### Runtime Logs Should Show:
```
Started HmrsBackendApplication in X.XXX seconds
Tomcat started on port(s): 10000 (http)
```

---

## 🧪 TEST BACKEND AFTER DEPLOYMENT

### Test 1: Check if Backend is Live
Open browser and go to:
```
https://hrms-backend-final-ixpy.onrender.com
```

**Expected**: Whitelabel Error Page (This is GOOD!)

### Test 2: Test Login API
Open browser console (F12) and run:
```javascript
fetch('https://hrms-backend-final-ixpy.onrender.com/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test User',
    email: 'test@test.com',
    password: 'Test@123',
    role: 'EMPLOYEE'
  })
})
.then(r => r.json())
.then(d => console.log('✅ Success:', d))
.catch(e => console.error('❌ Error:', e));
```

---

## 🎨 UPDATE VERCEL FRONTEND

After backend is successfully deployed:

### STEP 1: Update Environment Variable
1. Go to: https://vercel.com/dashboard
2. Find project: **hrmsbackendfrontendapp**
3. Go to **Settings** → **Environment Variables**
4. Find **VITE_API_BASE_URL**
5. Change value to:
   ```
   https://hrms-backend-final-ixpy.onrender.com
   ```
6. Click **Save**

### STEP 2: Redeploy Frontend
1. Go to **Deployments** tab
2. Click **"Redeploy"** on latest deployment
3. Wait for deployment to complete

---

## 🐛 TROUBLESHOOTING

### Still Getting npm Error?
- Make sure you selected **"Docker"** not "Node"
- Clear build cache: Settings → Build & Deploy → Clear Build Cache
- Try manual deploy again

### Build Fails at Maven Step?
- Check if Dockerfile exists in HRMS-Backend folder
- Verify pom.xml is correct
- Check build logs for specific error

### Backend Starts but Can't Connect to MongoDB?
- Verify MONGODB_URI environment variable
- Check MongoDB Atlas IP whitelist (should be 0.0.0.0/0)
- Check MongoDB user credentials

### CORS Errors After Deployment?
- Already fixed in code! Just push latest changes to GitHub
- Render will auto-deploy after push

---

## 📝 SUMMARY

**The Problem:**
- Render was configured as Node.js app
- Java Spring Boot needs Docker

**The Solution:**
1. Change Environment to "Docker" in Render settings
2. Clear Build Command and Start Command
3. Redeploy

**After Fix:**
- Backend will build using Dockerfile
- Maven will compile Java code
- Application will run on Render's assigned port

---

## ✅ SUCCESS CHECKLIST

- [ ] Changed Render environment to Docker
- [ ] Cleared Build Command
- [ ] Cleared Start Command
- [ ] Set all 4 environment variables
- [ ] Triggered manual deploy
- [ ] Build completed successfully
- [ ] Backend is accessible at URL
- [ ] Updated Vercel environment variable
- [ ] Redeployed frontend
- [ ] Login works from Vercel frontend

---

**Current Status:**
- ❌ Render trying to use npm (wrong)
- ✅ Need to change to Docker (correct)

**After Fix:**
- ✅ Render will use Docker
- ✅ Java application will build and run
- ✅ Frontend can connect to backend

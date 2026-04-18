# 🚂 RAILWAY - MANUAL CONFIGURATION

## 🎯 IF AUTO-DETECT FAILS, DO THIS:

### STEP 1: Click on Your Service

On the Railway dashboard, click on the **"HRMSBackend"** card.

---

### STEP 2: Click "Settings"

Click the **"Settings"** tab at the top.

---

### STEP 3: Scroll to "Build"

You'll see a section called **"Build"**.

---

### STEP 4: Configure Build Settings

**Click "Configure"** or edit the build settings:

#### Build Command:
```
./mvnw clean package -DskipTests
```

#### Start Command:
```
java -jar target/hmrs-backend-0.0.1-SNAPSHOT.jar
```

**Or if that doesn't work:**
```
java -jar target/*.jar
```

---

### STEP 5: Add Environment Variables

1. Click **"Variables"** tab
2. Click **"New Variable"**
3. Add these 5 variables:

```
MONGODB_URI=mongodb://localhost:27017/Data_base_hrms
SPRING_MAIL_USERNAME=aishushettar95@gmail.com
SPRING_MAIL_PASSWORD=bbfskhrhtnujkokk
JWT_SECRET=MyFixedSecretKey123456
PORT=8080
```

**Note:** Railway uses port 8080 by default, not 8082.

---

### STEP 6: Redeploy

1. Go back to **"Deployments"** tab
2. Click **"Deploy"** button
3. Or Railway will auto-deploy after you save settings

---

### STEP 7: Watch Logs

Click on the deployment to see logs. Should see:

```
✓ Building...
✓ Downloading dependencies...
✓ Compiling...
✓ BUILD SUCCESS
✓ Starting application...
✓ Application started on port 8080
```

---

### STEP 8: Generate Domain

1. Click **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"**
4. You'll get: `https://hrmsbackend-production.up.railway.app`
5. **📋 COPY THIS URL!**

---

## ✅ EXPECTED RESULT:

Your backend will be live at:
```
https://hrmsbackend-production.up.railway.app
```

Test it:
```
https://hrmsbackend-production.up.railway.app/api/auth/login
```

Should see a response (not 404).

---

## 🆘 IF IT STILL FAILS:

### Error: "Could not find or load main class"

**Fix:** Update start command to:
```
java -jar target/hmrs-backend-0.0.1-SNAPSHOT.jar
```

### Error: "Port already in use"

**Fix:** Change PORT variable to `8080` instead of `8082`

### Error: "MongoDB connection failed"

**Fix:** We'll setup MongoDB Atlas next (see next guide)

---

## 📋 QUICK CHECKLIST:

- [ ] Click on service
- [ ] Click "Settings"
- [ ] Set build command
- [ ] Set start command
- [ ] Click "Variables"
- [ ] Add 5 environment variables
- [ ] Click "Deployments"
- [ ] Wait for build
- [ ] Generate domain
- [ ] Copy URL
- [ ] Test URL

---

**After Railway is working, we'll setup MongoDB Atlas!**

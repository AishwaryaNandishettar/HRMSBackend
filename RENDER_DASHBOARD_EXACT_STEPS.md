# 🎯 EXACT STEPS ON RENDER DASHBOARD - DO THIS NOW

## ✅ I JUST DID:
- ✅ Deleted Dockerfile (was causing Docker errors)
- ✅ Deleted render.yaml (was causing conflicts)
- ✅ Pushed to GitHub
- ✅ Render will detect the push in 1-2 minutes

---

## 🔴 YOU MUST DO THIS ON RENDER DASHBOARD NOW:

### STEP 1: Go to Settings

You're on the deployment page. Click **"Settings"** in the left sidebar.

---

### STEP 2: Scroll Down to "Build & Deploy"

You'll see these fields. **FILL THEM EXACTLY LIKE THIS:**

#### Environment:
**Change to:** `Java`

#### Build Command:
**Type exactly:**
```
./mvnw clean package -DskipTests
```

#### Start Command:
**Type exactly:**
```
java -jar target/*.jar
```

**Click "Save Changes"** button at the bottom.

---

### STEP 3: Click "Environment" (Left Sidebar)

You'll see a list of environment variables.

**Click "Add Environment Variable"** button.

---

### STEP 4: Add These 5 Variables

**Add them ONE BY ONE:**

#### Variable 1:
- **Key:** `MONGODB_URI`
- **Value:** `mongodb://localhost:27017/Data_base_hrms`
  
  *(We'll change this to Atlas later, but for now use this)*

#### Variable 2:
- **Key:** `SPRING_MAIL_USERNAME`
- **Value:** `aishushettar95@gmail.com`

#### Variable 3:
- **Key:** `SPRING_MAIL_PASSWORD`
- **Value:** `bbfskhrhtnujkokk`

#### Variable 4:
- **Key:** `JWT_SECRET`
- **Value:** `MyFixedSecretKey123456`

#### Variable 5:
- **Key:** `PORT`
- **Value:** `8082`

**Click "Save Changes"** after adding all 5.

---

### STEP 5: Go Back to Your Service

Click **"HRMSBackend-2"** at the top (your service name).

---

### STEP 6: Manual Deploy

Click **"Manual Deploy"** button (top right).

Click **"Deploy latest commit"**.

---

### STEP 7: Watch the Logs

You should see:

```
==> Cloning from https://github.com/...
==> Checking out commit 0c1aa7c...
==> Building...
==> ./mvnw clean package -DskipTests
==> Downloading dependencies...
==> Building application...
==> BUILD SUCCESS
==> Starting server...
==> Your service is live 🎉
```

**This will take 5-10 minutes.** ⏱️

---

## ✅ WHAT SHOULD HAPPEN:

1. ✅ Build starts
2. ✅ Maven downloads dependencies (takes 3-5 min first time)
3. ✅ Compiles Java code
4. ✅ Creates JAR file
5. ✅ Starts Spring Boot application
6. ✅ Shows "Your service is live 🎉"

---

## 🆘 IF IT STILL FAILS:

**Look at the error in the logs and tell me:**

1. What does the error say?
2. At what step does it fail?
3. Screenshot of the error

**Common errors:**

### "mvnw: Permission denied"
- Already fixed! ✅

### "No such file or directory"
- Make sure you're NOT using Docker environment
- Use Java environment

### "Failed to execute goal"
- This is a compilation error
- Share the full error message

---

## 📋 QUICK CHECKLIST:

- [ ] Click "Settings"
- [ ] Change Environment to "Java"
- [ ] Set Build Command: `./mvnw clean package -DskipTests`
- [ ] Set Start Command: `java -jar target/*.jar`
- [ ] Click "Save Changes"
- [ ] Click "Environment"
- [ ] Add 5 environment variables
- [ ] Click "Save Changes"
- [ ] Go back to service
- [ ] Click "Manual Deploy"
- [ ] Wait 5-10 minutes
- [ ] Check logs for success

---

## 🎯 SCREENSHOT GUIDE:

**On Settings → Build & Deploy page, you should see:**

```
┌─────────────────────────────────────────┐
│ Environment: [Java ▼]                   │
├─────────────────────────────────────────┤
│ Build Command:                          │
│ ./mvnw clean package -DskipTests        │
├─────────────────────────────────────────┤
│ Start Command:                          │
│ java -jar target/*.jar                  │
├─────────────────────────────────────────┤
│ [Save Changes]                          │
└─────────────────────────────────────────┘
```

**On Settings → Environment page, you should see:**

```
┌─────────────────────────────────────────┐
│ MONGODB_URI = mongodb://localhost:27017/Data_base_hrms
│ SPRING_MAIL_USERNAME = aishushettar95@gmail.com
│ SPRING_MAIL_PASSWORD = bbfskhrhtnujkokk
│ JWT_SECRET = MyFixedSecretKey123456
│ PORT = 8082
└─────────────────────────────────────────┘
```

---

## ⏱️ TIMELINE:

- **Now:** I pushed the fix
- **In 1-2 min:** Render detects the push
- **You do:** Update settings (Steps 1-4)
- **You do:** Manual deploy (Step 6)
- **In 5-10 min:** Build completes
- **Result:** Backend is live! 🎉

---

**START WITH STEP 1 NOW!** 

**Click "Settings" in the left sidebar!** ☝️

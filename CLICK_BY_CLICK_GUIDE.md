# 👆 CLICK-BY-CLICK GUIDE - FOLLOW EXACTLY

## 🎯 WHERE YOU ARE NOW:
You're on Render dashboard looking at deployment logs showing "Failed"

---

## 👆 CLICK 1: Settings
**Click "Settings"** in the left sidebar (you can see it in your screenshot)

---

## 👆 CLICK 2: Build & Deploy
**Click "Build & Deploy"** in the right sidebar (should be already selected)

---

## 📝 TYPE 1: Scroll down and find "Environment"
**Change dropdown from "Docker" to "Java"**

---

## 📝 TYPE 2: Find "Build Command" field
**Type exactly:**
```
./mvnw clean package -DskipTests
```

---

## 📝 TYPE 3: Find "Start Command" field
**Type exactly:**
```
java -jar target/*.jar
```

---

## 👆 CLICK 3: Save Changes
**Click "Save Changes"** button at the bottom

---

## 👆 CLICK 4: Environment
**Click "Environment"** in the left sidebar (under MANAGE section)

---

## 👆 CLICK 5: Add Environment Variable
**Click "Add Environment Variable"** button

---

## 📝 TYPE 4-8: Add 5 Variables

**For each variable, type Key and Value, then click "Add":**

### Variable 1:
- Key: `MONGODB_URI`
- Value: `mongodb://localhost:27017/Data_base_hrms`
- Click "Add"

### Variable 2:
- Key: `SPRING_MAIL_USERNAME`
- Value: `aishushettar95@gmail.com`
- Click "Add"

### Variable 3:
- Key: `SPRING_MAIL_PASSWORD`
- Value: `bbfskhrhtnujkokk`
- Click "Add"

### Variable 4:
- Key: `JWT_SECRET`
- Value: `MyFixedSecretKey123456`
- Click "Add"

### Variable 5:
- Key: `PORT`
- Value: `8082`
- Click "Add"

---

## 👆 CLICK 6: Save Changes
**Click "Save Changes"** button

---

## 👆 CLICK 7: Go back to service
**Click "HRMSBackend-2"** at the very top (your service name)

---

## 👆 CLICK 8: Manual Deploy
**Click "Manual Deploy"** button (top right corner)

---

## 👆 CLICK 9: Deploy latest commit
**Click "Deploy latest commit"**

---

## ⏱️ WAIT: 5-10 minutes
**Watch the logs. Should see:**
- Cloning...
- Building...
- BUILD SUCCESS
- Your service is live 🎉

---

## ✅ DONE!
**Copy your URL:** `https://hrmsbackend-2-xxxx.onrender.com`

---

## 🔢 SUMMARY:
- 9 clicks
- 8 things to type
- 10 minutes wait
- 1 working backend! 🎉

---

**START NOW! Click "Settings" in the left sidebar!** ☝️

# ✅ SIMPLE CHECKLIST - Just Follow This

## ✅ ALREADY DONE (By Me)
- ✅ Fixed your code
- ✅ Pushed to GitHub
- ✅ Render will auto-deploy

---

## 📋 YOU DO THIS (20 minutes total)

### □ STEP 1: MongoDB Atlas (5 min)
**Go to:** https://cloud.mongodb.com/

- [ ] Click "Add Current IP Address" (orange button)
- [ ] Click "Database Access" → "Add New Database User"
  - Username: `hrms_user`
  - Click "Autogenerate Password" → **COPY IT!**
  - Select "Read and write to any database"
  - Click "Add User"
- [ ] Click "Database" → "Connect" → "Connect your application"
  - Copy connection string
  - Replace `<password>` with your password
  - Add `/Data_base_hrms` before the `?`
  - **SAVE THIS STRING!**

**Your string should look like:**
```
mongodb+srv://hrms_user:abc123@cluster0.xxxxx.mongodb.net/Data_base_hrms?retryWrites=true&w=majority
```

---

### □ STEP 2: Render Settings (3 min)
**Go to:** https://dashboard.render.com/

- [ ] Click your service "HRMSBackend-2"
- [ ] Click "Settings"
- [ ] Under "Build & Deploy":
  - Change Environment to: `Java`
  - Build Command: `./mvnw clean package -DskipTests`
  - Start Command: `java -jar target/*.jar`
  - Click "Save Changes"
- [ ] Under "Environment Variables":
  - Add `MONGODB_URI` = (your connection string from Step 1)
  - Add `SPRING_MAIL_USERNAME` = `aishushettar95@gmail.com`
  - Add `SPRING_MAIL_PASSWORD` = `bbfskhrhtnujkokk`
  - Add `JWT_SECRET` = `MyFixedSecretKey123456`
  - Add `PORT` = `8082`
  - Click "Save Changes"

---

### □ STEP 3: Deploy on Render (10 min wait)
- [ ] Click "Manual Deploy" → "Deploy latest commit"
- [ ] Wait for build (watch logs)
- [ ] When done, copy your URL: `https://hrmsbackend-2-xxxx.onrender.com`

---

### □ STEP 4: Update Vercel (2 min)
**Go to:** https://vercel.com/dashboard

- [ ] Click your HRMS project
- [ ] Click "Settings" → "Environment Variables"
- [ ] Edit `VITE_API_BASE_URL` to your Render URL
- [ ] Click "Deployments" → "Redeploy"

---

### □ STEP 5: Test
- [ ] Open your frontend URL
- [ ] Try to login
- [ ] Should work! 🎉

---

## 🎯 CURRENT STATUS

**What I did:**
- ✅ Fixed render.yaml
- ✅ Fixed Dockerfile
- ✅ Pushed to GitHub

**What you need to do:**
1. Setup MongoDB Atlas (get connection string)
2. Update Render settings (add connection string)
3. Deploy
4. Update Vercel
5. Test

**Start with Step 1 now!** ☝️

---

## 🆘 HELP

**Stuck on MongoDB?**
- Just click the buttons I mentioned
- Copy the connection string
- Replace password
- Add `/Data_base_hrms`

**Stuck on Render?**
- Just change Environment to Java
- Add the 5 environment variables
- Click Deploy

**Login not working?**
- Press F12 in browser
- Check Console for errors
- Share screenshot

---

**Total time: 20 minutes**

**Start now! Go to:** https://cloud.mongodb.com/

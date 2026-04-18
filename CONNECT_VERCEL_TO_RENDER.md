# 🔗 CONNECT VERCEL FRONTEND TO RENDER BACKEND

## ✅ YOUR URLS

**Backend (Render):** `https://newhmrsfullybackendapplication.onrender.com`  
**Frontend (Vercel):** `https://hrmsbackendapplication.vercel.app`

---

## 🎯 STEP-BY-STEP GUIDE

### STEP 1: Update Backend CORS (Add New Vercel URL)

First, we need to add your Vercel URL to the backend's allowed origins.

**1.1** Update `SecurityConfig.java`:

Open: `HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/security/SecurityConfig.java`

Find this section (around line 45):
```java
config.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "http://localhost:5176",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5176",
    "https://hrmsbackendfullrenderingapplication.vercel.app",
    "https://hrmsbackendfrontendapp.vercel.app"
));
```

Change it to:
```java
config.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "http://localhost:5176",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5176",
    "https://hrmsbackendfullrenderingapplication.vercel.app",
    "https://hrmsbackendfrontendapp.vercel.app",
    "https://hrmsbackendapplication.vercel.app"
));
```

**1.2** Update `AuthController.java`:

Open: `HRMS-Backend/src/main/java/com/omoikaneinnovation/hmrsbackend/controller/AuthController.java`

Find this line (around line 15):
```java
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5176", "http://127.0.0.1:5173", "http://127.0.0.1:5176", "https://hrmsbackendfullrenderingapplication.vercel.app", "https://hrmsbackendfrontendapp.vercel.app"})
```

Change it to:
```java
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5176", "http://127.0.0.1:5173", "http://127.0.0.1:5176", "https://hrmsbackendfullrenderingapplication.vercel.app", "https://hrmsbackendfrontendapp.vercel.app", "https://hrmsbackendapplication.vercel.app"})
```

**1.3** Push to GitHub:
```bash
git add .
git commit -m "Add new Vercel URL to CORS"
git push origin main
```

**1.4** Wait for Render to auto-deploy (5-10 minutes)

---

### STEP 2: Update Vercel Environment Variable

**2.1** Go to Vercel Dashboard:
- Open: https://vercel.com/dashboard

**2.2** Find Your Project:
- Click on: `hrmsbackendapplication`

**2.3** Go to Settings:
- Click: **Settings** tab (top menu)

**2.4** Go to Environment Variables:
- Click: **Environment Variables** (left sidebar)

**2.5** Update or Add `VITE_API_BASE_URL`:

**If variable exists:**
- Find: `VITE_API_BASE_URL`
- Click: **Edit** (three dots → Edit)
- Change value to: `https://newhmrsfullybackendapplication.onrender.com`
- Click: **Save**

**If variable doesn't exist:**
- Click: **Add New**
- Key: `VITE_API_BASE_URL`
- Value: `https://newhmrsfullybackendapplication.onrender.com`
- Environment: Select **Production**, **Preview**, and **Development**
- Click: **Save**

**2.6** Add TURN credentials (if not already added):

**Add these two variables:**

**Variable 1:**
- Key: `VITE_TURN_USERNAME`
- Value: `51e40078dfabc57d54164c2f`
- Environment: All (Production, Preview, Development)

**Variable 2:**
- Key: `VITE_TURN_CREDENTIAL`
- Value: `KJnavaquyonnUlkx`
- Environment: All (Production, Preview, Development)

---

### STEP 3: Redeploy Vercel Frontend

**3.1** Go to Deployments:
- Click: **Deployments** tab (top menu)

**3.2** Redeploy:
- Find the latest deployment (top of list)
- Click: **three dots (...)** → **Redeploy**
- Click: **Redeploy** button to confirm

**3.3** Wait for deployment:
- Wait 2-3 minutes for deployment to complete
- Status should change to "Ready"

---

### STEP 4: Test Backend is Live

**4.1** Open backend URL in browser:
```
https://newhmrsfullybackendapplication.onrender.com
```

**Expected:** "Whitelabel Error Page" (this is GOOD! It means backend is running)

**4.2** Test API endpoint:
Open browser console (F12) and run:
```javascript
fetch('https://newhmrsfullybackendapplication.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@test.com',
    password: 'test123'
  })
})
.then(r => r.json())
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e));
```

**Expected:** Should return error "Invalid credentials" (this is good - backend is working!)

---

### STEP 5: Login to Your Application

**5.1** Open your Vercel frontend:
```
https://hrmsbackendapplication.vercel.app
```

**5.2** Login with your credentials:
- Email: `Aishwarya@company.com`
- Password: `admin123`

**5.3** Click Login

**✅ You should be logged in!**

---

## 🐛 TROUBLESHOOTING

### Issue 1: CORS Error in Browser Console

**Error:** `Access to fetch at '...' has been blocked by CORS policy`

**Solution:**
1. Make sure you pushed the updated CORS code to GitHub
2. Wait for Render to auto-deploy (check Render dashboard → Logs)
3. Clear browser cache and try again

---

### Issue 2: Backend Not Responding

**Error:** `Failed to fetch` or `Network error`

**Solution:**
1. Check if backend is live: https://newhmrsfullybackendapplication.onrender.com
2. Should see "Whitelabel Error Page"
3. If not, check Render dashboard → Logs for errors
4. Make sure environment variables are set in Render

---

### Issue 3: Login Returns 401 Unauthorized

**Error:** `Invalid credentials`

**Solution:**
1. Make sure you're using correct credentials: `Aishwarya@company.com` / `admin123`
2. Check if user exists in MongoDB
3. Try creating a new admin user (see Step 6 below)

---

### Issue 4: Vercel Shows Old Backend URL

**Error:** Still trying to connect to old backend

**Solution:**
1. Make sure you saved the environment variable in Vercel
2. Make sure you redeployed after changing the variable
3. Clear browser cache
4. Try in incognito/private window

---

## 🎯 STEP 6: Create Admin User (If Needed)

If login still doesn't work, create a new admin user:

**6.1** Open: https://hrmsbackendapplication.vercel.app

**6.2** Press `F12` (open console)

**6.3** Paste this code:
```javascript
fetch('https://newhmrsfullybackendapplication.onrender.com/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Admin User',
    email: 'admin@hrms.com',
    password: 'Admin@123',
    role: 'ADMIN'
  })
})
.then(r => r.json())
.then(d => {
  console.log('✅ User created:', d);
  alert('✅ Admin user created!\n\nEmail: admin@hrms.com\nPassword: Admin@123');
})
.catch(e => {
  console.error('❌ Error:', e);
  alert('❌ Error: ' + e.message);
});
```

**6.4** Press Enter

**6.5** Login with:
- Email: `admin@hrms.com`
- Password: `Admin@123`

---

## 📋 QUICK CHECKLIST

Before testing:

- [ ] Updated SecurityConfig.java with new Vercel URL
- [ ] Updated AuthController.java with new Vercel URL
- [ ] Pushed code to GitHub
- [ ] Render auto-deployed (check logs)
- [ ] Updated VITE_API_BASE_URL in Vercel to new Render URL
- [ ] Added TURN credentials in Vercel
- [ ] Redeployed Vercel frontend
- [ ] Backend is accessible (shows Whitelabel Error Page)
- [ ] Frontend is accessible

---

## 🔍 VERIFY ENVIRONMENT VARIABLES

### In Vercel:
Should have these 3 variables:
```
VITE_API_BASE_URL=https://newhmrsfullybackendapplication.onrender.com
VITE_TURN_USERNAME=51e40078dfabc57d54164c2f
VITE_TURN_CREDENTIAL=KJnavaquyonnUlkx
```

### In Render:
Should have these 4 variables:
```
MONGODB_URI=mongodb+srv://hrms_user:yWkztlbtsW7RGube@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0
SPRING_MAIL_USERNAME=aishushettar95@gmail.com
SPRING_MAIL_PASSWORD=bbfskhrhtnujkokk
JWT_SECRET=MyFixedSecretKey123456
```

---

## 📞 SUMMARY

**Your Setup:**
- Backend: https://newhmrsfullybackendapplication.onrender.com
- Frontend: https://hrmsbackendapplication.vercel.app
- Login: Aishwarya@company.com / admin123

**What to do:**
1. Update CORS in backend code
2. Push to GitHub
3. Update Vercel environment variable
4. Redeploy Vercel
5. Login!

---

**🎉 After following these steps, your application should work!**

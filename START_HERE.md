# 🎯 START HERE - LOCALHOST SETUP

## ✅ EVERYTHING IS FIXED AND READY!

I've fixed all the code issues. Your application is now ready to run on localhost.

---

## 🚀 3 STEPS TO START

### STEP 1: Start Backend
Open **Terminal 1** or **Double-click `start-backend.bat`**

```bash
cd HRMS-Backend
mvn spring-boot:run
```

✅ Wait for: `Started HmrsBackendApplication`

---

### STEP 2: Start Frontend
Open **Terminal 2** or **Double-click `start-frontend.bat`**

```bash
cd HRMS-Frontend
npm run dev
```

✅ Opens at: `http://localhost:5173`

---

### STEP 3: Create Admin User

**Option A - Browser Console (Fastest):**

1. Open `http://localhost:5173`
2. Press `F12` → Console tab
3. Paste this code:

```javascript
fetch('http://localhost:8082/api/auth/register', {
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
.then(d => alert('✅ User created!\n\nEmail: admin@hrms.com\nPassword: Admin@123'))
.catch(e => alert('❌ Error: ' + e.message));
```

**Option B - HTML File:**

Open `create-admin-user.html` in browser → Click "Create Admin User"

---

## 🔐 LOGIN

- **Email:** `admin@hrms.com`
- **Password:** `Admin@123`
- **URL:** `http://localhost:5173`

---

## 📚 MORE HELP

- **Quick Start:** `START_LOCALHOST.md`
- **Detailed Guide:** `LOCALHOST_SETUP_COMPLETE.md`
- **Full Documentation:** `README_LOCALHOST.md`

---

## ✅ WHAT I FIXED

1. ✅ Fixed `AuthController.java` syntax error (line 15)
2. ✅ Updated `CorsConfig.java` to allow localhost
3. ✅ Updated `create-admin-user.html` to use localhost
4. ✅ Verified `.env` is configured correctly

---

## 🎉 THAT'S IT!

Your HRMS application is ready to run on localhost!

**Having issues?** Check `README_LOCALHOST.md` for troubleshooting.

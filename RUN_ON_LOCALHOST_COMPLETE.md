# 🚀 COMPLETE LOCALHOST SETUP GUIDE

## ✅ FIXES APPLIED
1. Fixed `@CrossOrigin` syntax error in AuthController.java
2. Updated CORS origins in SecurityConfig.java
3. Frontend .env already set to localhost

---

## 📋 PREREQUISITES

Before starting, make sure you have:
- ✅ Java 21 installed
- ✅ Maven installed
- ✅ Node.js installed (v18 or higher)
- ✅ MongoDB Atlas account with connection string

---

## 🔧 STEP 1: BACKEND SETUP (Port 8082)

### 1.1 Navigate to Backend Folder
```bash
cd HRMS-Backend
```

### 1.2 Verify application.properties
The file should have these settings:
```properties
server.port=8082
spring.data.mongodb.uri=${MONGODB_URI}
spring.mail.username=${SPRING_MAIL_USERNAME}
spring.mail.password=${SPRING_MAIL_PASSWORD}
jwt.secret=${JWT_SECRET}
```

### 1.3 Set Environment Variables (Windows)

**Option A: Set in Command Prompt (Temporary)**
```cmd
set MONGODB_URI=mongodb+srv://hrms_user:yWkztlbtsW7RGube@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0
set SPRING_MAIL_USERNAME=aishushettar95@gmail.com
set SPRING_MAIL_PASSWORD=bbfskhrhtnujkokk
set JWT_SECRET=MyFixedSecretKey123456
```

**Option B: Set in PowerShell (Temporary)**
```powershell
$env:MONGODB_URI="mongodb+srv://hrms_user:yWkztlbtsW7RGube@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0"
$env:SPRING_MAIL_USERNAME="aishushettar95@gmail.com"
$env:SPRING_MAIL_PASSWORD="bbfskhrhtnujkokk"
$env:JWT_SECRET="MyFixedSecretKey123456"
```

**Option C: Create .env file in HRMS-Backend folder**
Create a file named `.env` in `HRMS-Backend` folder:
```
MONGODB_URI=mongodb+srv://hrms_user:yWkztlbtsW7RGube@cluster0.aexpf8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority&appName=Cluster0
SPRING_MAIL_USERNAME=aishushettar95@gmail.com
SPRING_MAIL_PASSWORD=bbfskhrhtnujkokk
JWT_SECRET=MyFixedSecretKey123456
```

### 1.4 Run Backend Server
```bash
mvn spring-boot:run
```

**Expected Output:**
```
Started HmrsBackendApplication in X.XXX seconds
Tomcat started on port(s): 8082 (http)
```

### 1.5 Test Backend
Open browser and go to: `http://localhost:8082`

You should see: **"Whitelabel Error Page"** (This is GOOD - it means server is running!)

---

## 🎨 STEP 2: FRONTEND SETUP (Port 5173)

### 2.1 Navigate to Frontend Folder
Open a **NEW terminal** and run:
```bash
cd HRMS-Frontend
```

### 2.2 Verify .env File
The file `HRMS-Frontend/.env` should contain:
```
VITE_API_BASE_URL=http://localhost:8082
VITE_TURN_USERNAME=51e40078dfabc57d54164c2f
VITE_TURN_CREDENTIAL=KJnavaquyonnUlkx
```

### 2.3 Install Dependencies (First Time Only)
```bash
npm install
```

### 2.4 Run Frontend Server
```bash
npm run dev
```

**Expected Output:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### 2.5 Open Application
Open browser and go to: `http://localhost:5173`

---

## 👤 STEP 3: CREATE ADMIN USER

### 3.1 Open Browser Console
1. Go to `http://localhost:5173`
2. Press `F12` to open Developer Tools
3. Click on **Console** tab

### 3.2 Run This Code in Console
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
.then(d => {
  console.log('✅ User created:', d);
  alert('✅ Admin user created!\n\nEmail: admin@hrms.com\nPassword: Admin@123');
})
.catch(e => {
  console.error('❌ Error:', e);
  alert('❌ Error: ' + e.message);
});
```

### 3.3 Login
- **Email**: `admin@hrms.com`
- **Password**: `Admin@123`

---

## 🐛 TROUBLESHOOTING

### Backend Not Starting?
1. Check if Java 21 is installed: `java -version`
2. Check if port 8082 is already in use
3. Verify MongoDB connection string is correct
4. Check environment variables are set

### Frontend Not Connecting?
1. Verify backend is running on port 8082
2. Check `.env` file has correct URL
3. Clear browser cache and reload
4. Check browser console for errors

### CORS Errors?
- Already fixed in the code! Just make sure you pushed the latest changes.

### Login Not Working?
1. Make sure you created admin user using the console code
2. Check backend logs for authentication errors
3. Verify MongoDB has the user data

---

## 📝 QUICK REFERENCE

### Backend Commands
```bash
cd HRMS-Backend
mvn spring-boot:run
```

### Frontend Commands
```bash
cd HRMS-Frontend
npm run dev
```

### URLs
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:8082
- **Backend API**: http://localhost:8082/api/auth/login

---

## 🎯 NEXT STEPS AFTER LOCALHOST WORKS

If you want to deploy to cloud later:
1. Push code to GitHub
2. Deploy backend to Render.com (with Docker environment)
3. Deploy frontend to Vercel
4. Update frontend .env with production backend URL

---

## ⚠️ IMPORTANT NOTES

1. **Keep both terminals running** - Backend and Frontend need separate terminals
2. **Environment variables** - Must be set before running backend
3. **Port 8082** - Backend runs on 8082, not 8080
4. **Create admin user** - Must be done before first login
5. **MongoDB Atlas** - Make sure your IP is whitelisted (0.0.0.0/0 for all IPs)

---

## ✅ SUCCESS CHECKLIST

- [ ] Java 21 installed
- [ ] Maven installed
- [ ] Node.js installed
- [ ] Backend running on port 8082
- [ ] Frontend running on port 5173
- [ ] Admin user created
- [ ] Successfully logged in
- [ ] No CORS errors in console

---

**Need help?** Check the error messages in:
- Backend terminal
- Frontend terminal
- Browser console (F12)

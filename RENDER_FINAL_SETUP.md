# 🎯 RENDER FINAL SETUP - CORRECT MONGODB URI

## ⚠️ THE PROBLEM:

Your MongoDB connection string is not in the correct format in Render's environment variables.

## ✅ THE SOLUTION:

Use this EXACT format (no quotes, no extra spaces):

```
mongodb+srv://hrms_user:YOUR_PASSWORD@cluster0.aexp6f8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority
```

---

## 📍 COMPLETE STEPS:

### STEP 1: Delete Current Service

1. Go to: https://dashboard.render.com/
2. Click on your service
3. Click "Settings" (left sidebar)
4. Scroll down
5. Click "Delete Web Service"
6. Confirm deletion

### STEP 2: Create New Service

1. Click "New +" → "Web Service"
2. Connect your HRMSBackend repository
3. Fill in the form:

**Name:**
```
hrms-backend
```

**Root Directory:**
```
HRMS-Backend
```

**Environment:**
```
Docker
```

**Branch:**
```
main
```

**Dockerfile Path:**
```
Dockerfile
```

**Instance Type:**
```
Free
```

### STEP 3: Add Environment Variables

Click "Advanced" → "Add Environment Variable"

**⚠️ CRITICAL: Copy-paste these EXACTLY (no quotes!):**

**Variable 1:**
```
Key: MONGODB_URI
Value: mongodb+srv://hrms_user:YOUR_PASSWORD@cluster0.aexp6f8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority
```

**⚠️ Replace `YOUR_PASSWORD` with your actual MongoDB password!**

**Variable 2:**
```
Key: SPRING_MAIL_USERNAME
Value: aishushettar95@gmail.com
```

**Variable 3:**
```
Key: SPRING_MAIL_PASSWORD
Value: bbfskhrhtnujkokk
```

**Variable 4:**
```
Key: JWT_SECRET
Value: MyFixedSecretKey123456
```

### STEP 4: Create Service

1. Click "Create Web Service"
2. Wait 10-15 minutes
3. Check logs

---

## ✅ CORRECT FORMAT EXAMPLES:

**✅ CORRECT:**
```
mongodb+srv://hrms_user:abc123@cluster0.aexp6f8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority
```

**❌ WRONG (has quotes):**
```
"mongodb+srv://hrms_user:abc123@cluster0.aexp6f8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority"
```

**❌ WRONG (missing mongodb+srv://):**
```
hrms_user:abc123@cluster0.aexp6f8t.mongodb.net/Data_base_hrms
```

**❌ WRONG (has spaces):**
```
mongodb+srv://hrms_user:abc123@cluster0.aexp6f8t.mongodb.net/Data_base_hrms ?retryWrites=true&w=majority
```

---

## 🔑 YOUR MONGODB PASSWORD:

You need to use the password you saved when creating the MongoDB user.

**If you forgot it:**
1. Go to MongoDB Atlas
2. Click "Database Access"
3. Find your user `hrms_user`
4. Click "Edit"
5. Click "Edit Password"
6. Generate new password
7. Copy it
8. Use it in the connection string

---

## 📋 FINAL CONNECTION STRING FORMAT:

```
mongodb+srv://[USERNAME]:[PASSWORD]@[CLUSTER].mongodb.net/[DATABASE]?retryWrites=true&w=majority
```

**Your values:**
- USERNAME: `hrms_user`
- PASSWORD: Your actual password (no brackets!)
- CLUSTER: `cluster0.aexp6f8t`
- DATABASE: `Data_base_hrms`

**Final result:**
```
mongodb+srv://hrms_user:YourActualPassword@cluster0.aexp6f8t.mongodb.net/Data_base_hrms?retryWrites=true&w=majority
```

---

## ⚠️ IMPORTANT NOTES:

1. **NO quotes** around the connection string
2. **NO spaces** in the connection string
3. **Replace password** with actual password (no angle brackets)
4. **Must start with** `mongodb+srv://`
5. **Must include** `/Data_base_hrms` before the `?`

---

## 🎯 QUICK TEST:

After creating the service, check the logs. You should see:

**✅ SUCCESS:**
```
Started HmrsBackendApplication
Tomcat started on port 8080
```

**❌ FAILURE:**
```
The connection string is invalid
```

If you see the failure message, the MONGODB_URI is still wrong.

---

**Delete your current service and create a new one with the CORRECT MongoDB URI format!** 🚀

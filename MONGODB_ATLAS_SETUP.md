# 🗄️ MongoDB Atlas Setup Guide

## You Already Have Cluster0! ✅

I can see from your screenshot that you already have a MongoDB Atlas cluster set up. Now you just need to:
1. Get the connection string
2. Migrate your local data
3. Use it in deployment

---

## Step 1: Add Your IP Address (IMPORTANT!)

⚠️ **I see the warning: "Current IP Address not added"**

**Fix this first:**

1. Click **"Add Current IP Address"** button (in the orange warning)
2. Or go to **"Network Access"** (left sidebar)
3. Click **"Add IP Address"**
4. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
5. Click **"Confirm"**

**Why?** This allows your backend (when deployed) to connect to MongoDB Atlas.

---

## Step 2: Create Database User (If You Haven't)

1. Click **"Database Access"** (left sidebar)
2. Check if you have a user already
3. If not, click **"Add New Database User"**
4. Fill in:
   - **Authentication Method:** Password
   - **Username:** `hrms_user` (or any name)
   - **Password:** Click "Autogenerate Secure Password"
   - **📋 COPY AND SAVE THE PASSWORD!** You'll need it!
   - **Database User Privileges:** "Read and write to any database"
5. Click **"Add User"**

---

## Step 3: Get Connection String

### Method 1: From Clusters Page

1. Go to **"Clusters"** (left sidebar - DATABASE section)
2. Click **"Connect"** button on Cluster0
3. Click **"Connect your application"**
4. You'll see a connection string like:
   ```
   mongodb+srv://hrms_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Copy this string**

### Method 2: From Migration Page

I see you're on the Migration page. You can also:
1. Look at the "Connect to your source cluster" field
2. The format shown is: `mongodb://<username>:<password>@<hostname>:<port>`
3. But for Atlas, use the format from Method 1 above

---

## Step 4: Prepare Your Connection String

Take the connection string and modify it:

**Original:**
```
mongodb+srv://hrms_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

**Replace:**
- `<password>` → Your actual password (the one you copied)
- Add `/Data_base_hrms` before the `?`

**Final Result:**
```
mongodb+srv://hrms_user:YourActualPassword@cluster0.xxxxx.mongodb.net/Data_base_hrms?retryWrites=true&w=majority
```

**Example with fake data:**
```
mongodb+srv://hrms_user:MyP@ssw0rd123@cluster0.abc123.mongodb.net/Data_base_hrms?retryWrites=true&w=majority
```

---

## Step 5: Test Connection Locally

Before deploying, test if the connection works:

### Option A: Using MongoDB Compass

1. Open MongoDB Compass
2. Click "New Connection"
3. Paste your connection string
4. Click "Connect"
5. You should see your cluster!

### Option B: Update application.properties Temporarily

1. Open `HRMS-Backend/src/main/resources/application.properties`
2. Find this line:
   ```properties
   spring.data.mongodb.uri=${MONGODB_URI:mongodb://localhost:27017/Data_base_hrms}
   ```
3. Temporarily change to:
   ```properties
   spring.data.mongodb.uri=mongodb+srv://hrms_user:YourPassword@cluster0.xxxxx.mongodb.net/Data_base_hrms?retryWrites=true&w=majority
   ```
4. Run your backend:
   ```bash
   cd HRMS-Backend
   ./mvnw spring-boot:run
   ```
5. If it starts without errors, connection works! ✅
6. **Change it back** to use environment variable:
   ```properties
   spring.data.mongodb.uri=${MONGODB_URI:mongodb://localhost:27017/Data_base_hrms}
   ```

---

## Step 6: Migrate Your Local Data to Atlas

You have data in your local MongoDB (I saw ~42 employees, attendance records, etc.). Let's move it to Atlas:

### Using Command Line (Fastest):

```bash
# 1. Export from local MongoDB
mongodump --db Data_base_hrms --out ./mongodb_backup

# 2. Import to Atlas (use YOUR connection string)
mongorestore --uri="mongodb+srv://hrms_user:YourPassword@cluster0.xxxxx.mongodb.net/Data_base_hrms" ./mongodb_backup/Data_base_hrms
```

### Using MongoDB Compass (Easier):

**Export from Local:**
1. Connect to `mongodb://localhost:27017`
2. Select database: `Data_base_hrms`
3. For each collection:
   - Click collection
   - Click "Export Collection"
   - Choose JSON format
   - Save file

**Import to Atlas:**
1. Connect to your Atlas connection string
2. Create database: `Data_base_hrms` (if not exists)
3. For each collection:
   - Click "Add Data" → "Import File"
   - Select the JSON file
   - Click "Import"

### Using Atlas Migration Tool:

I see you're on the Migration page! You can use this:

1. In "Connect to your source cluster" field, enter:
   ```
   mongodb://localhost:27017
   ```
2. Select your destination cluster (Cluster0)
3. Follow the wizard
4. **Note:** Your local MongoDB must be accessible from the internet for this to work

---

## Step 7: Verify Data in Atlas

After migration:

1. In MongoDB Compass, connect to Atlas
2. Check database: `Data_base_hrms`
3. Verify collections exist:
   - admins
   - employees (should have ~42 documents)
   - attendance (should have ~20 documents)
   - departments
   - designations
   - chat_messages
   - etc.

---

## Step 8: Use in Deployment

When deploying to Render/Railway, add this environment variable:

**Variable Name:** `MONGODB_URI`

**Variable Value:** (your connection string)
```
mongodb+srv://hrms_user:YourPassword@cluster0.xxxxx.mongodb.net/Data_base_hrms?retryWrites=true&w=majority
```

Your `application.properties` is already configured to use this environment variable! ✅

---

## 🔒 Security Tips

1. **Never commit connection string to Git**
   - Always use environment variables
   - Your `application.properties` already does this ✅

2. **Use strong password**
   - Use the auto-generated password from Atlas
   - Don't use simple passwords

3. **Whitelist IPs properly**
   - For development: Allow 0.0.0.0/0 (all IPs)
   - For production: Whitelist specific IPs if possible

4. **Rotate credentials regularly**
   - Change password every few months
   - Update in all environments

---

## ✅ Checklist

- [ ] IP address added (0.0.0.0/0)
- [ ] Database user created
- [ ] Password saved securely
- [ ] Connection string obtained
- [ ] Connection string formatted correctly
- [ ] Tested connection with MongoDB Compass
- [ ] Local data migrated to Atlas
- [ ] Data verified in Atlas
- [ ] Connection string ready for deployment

---

## 🆘 Troubleshooting

### Error: "Authentication failed"

**Solution:**
- Check username is correct
- Check password is correct (no typos)
- Make sure you replaced `<password>` in connection string

### Error: "Connection timeout"

**Solution:**
- Check Network Access allows 0.0.0.0/0
- Verify connection string format
- Check internet connection

### Error: "Database not found"

**Solution:**
- Make sure you added `/Data_base_hrms` in connection string
- Database name is case-sensitive

---

## 📞 Next Steps

Once you have your connection string:

1. **Test it locally** (using MongoDB Compass)
2. **Migrate your data** (using mongodump/mongorestore)
3. **Deploy backend** (to Render or Railway)
4. **Add MONGODB_URI** as environment variable
5. **Test login** on deployed app

---

## 💡 Quick Reference

**Your Connection String Format:**
```
mongodb+srv://USERNAME:PASSWORD@cluster0.XXXXX.mongodb.net/Data_base_hrms?retryWrites=true&w=majority
```

**Replace:**
- `USERNAME` → Your MongoDB Atlas username
- `PASSWORD` → Your MongoDB Atlas password
- `XXXXX` → Your cluster ID (from Atlas)

**Example:**
```
mongodb+srv://hrms_user:MySecurePass123@cluster0.abc123.mongodb.net/Data_base_hrms?retryWrites=true&w=majority
```

---

Good luck! Once you have the connection string, you're ready to deploy! 🚀

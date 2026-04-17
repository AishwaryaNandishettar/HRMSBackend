# 📦 Migrate Local MongoDB to MongoDB Atlas

Since you have data in your local MongoDB (as shown in your screenshot), you need to migrate it to MongoDB Atlas for cloud deployment.

---

## Option 1: Export and Import (Recommended)

### Step 1: Export from Local MongoDB

```bash
# Export all collections from your local database
mongodump --db Data_base_hrms --out ./mongodb_backup

# This creates a folder with all your data
```

### Step 2: Import to MongoDB Atlas

```bash
# Get your MongoDB Atlas connection string
# Example: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net

# Import to Atlas
mongorestore --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/Data_base_hrms" ./mongodb_backup/Data_base_hrms
```

**That's it!** Your data is now in the cloud.

---

## Option 2: Using MongoDB Compass (GUI Method)

### Step 1: Connect to Local MongoDB

1. Open MongoDB Compass
2. Connect to: `mongodb://localhost:27017`
3. Select database: `Data_base_hrms`

### Step 2: Export Each Collection

For each collection (admins, employees, attendance, etc.):

1. Click on the collection
2. Click **"Export Collection"**
3. Choose **JSON** format
4. Save the file

### Step 3: Connect to MongoDB Atlas

1. In MongoDB Compass, click **"New Connection"**
2. Paste your Atlas connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net
   ```
3. Click **"Connect"**

### Step 4: Import Each Collection

1. Select database: `Data_base_hrms` (create if doesn't exist)
2. For each collection:
   - Click **"Add Data"** → **"Import File"**
   - Select the JSON file you exported
   - Click **"Import"**

---

## Option 3: Using MongoDB Atlas Migration Tool

### Step 1: In MongoDB Atlas

1. Go to your cluster
2. Click **"..."** (three dots)
3. Click **"Migrate Data to this Cluster"**
4. Follow the wizard

### Step 2: Provide Source Details

- Host: `your-public-ip:27017`
- Database: `Data_base_hrms`

**Note:** Your local MongoDB must be accessible from the internet for this to work.

---

## 🔍 Verify Migration

After migration, check in MongoDB Compass or Atlas:

1. Connect to Atlas
2. Check database: `Data_base_hrms`
3. Verify collections exist:
   - ✅ admins
   - ✅ employees
   - ✅ attendance
   - ✅ departments
   - ✅ designations
   - ✅ chat_messages
   - ✅ chat_groups
   - ✅ etc.

4. Check document counts match your local database

---

## 📊 Your Collections (from screenshot)

Based on your MongoDB Compass screenshot, you have:

| Collection | Documents | Size |
|------------|-----------|------|
| admins | 0 | 12.29 KB |
| application_links | 4 | 36.86 KB |
| attendance | 20 | 96.86 KB |
| chat_groups | 1 | 20.48 KB |
| chat_messages | 35 | 36.86 KB |
| departments | 4 | 36.86 KB |
| designations | 4 | 32.77 KB |
| email_queue | 14 | 32.77 KB |
| employees | 42 | 36.86 KB |
| financial | 7 | 36.86 KB |
| group_messages | 1 | 20.48 KB |
| insurance_claims | 3 | 32.77 KB |
| jobs | 11 | 32.77 KB |

**Total:** ~450 KB of data (very small, easy to migrate!)

---

## 🚀 Quick Migration Command

If you have `mongodump` and `mongorestore` installed:

```bash
# 1. Export from local
mongodump --db Data_base_hrms --out ./backup

# 2. Import to Atlas (replace with your connection string)
mongorestore --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/Data_base_hrms" ./backup/Data_base_hrms

# Done! ✅
```

---

## ⚠️ Important Notes

### Before Migration:

1. **Backup your local data** (just in case)
   ```bash
   mongodump --db Data_base_hrms --out ./backup_$(date +%Y%m%d)
   ```

2. **Test with a small collection first** to make sure it works

3. **Verify connection string** is correct

### After Migration:

1. **Test your backend** with the new MongoDB Atlas URI
2. **Verify all data** is present
3. **Test login** and other features
4. **Keep local backup** for a few days

---

## 🔧 Troubleshooting

### Error: "mongodump: command not found"

**Solution:** Install MongoDB Database Tools:
- Windows: https://www.mongodb.com/try/download/database-tools
- Mac: `brew install mongodb-database-tools`
- Linux: `sudo apt-get install mongodb-database-tools`

### Error: "Authentication failed"

**Solution:** 
- Check username/password in Atlas connection string
- Make sure user has read/write permissions
- Verify database name is correct

### Error: "Connection timeout"

**Solution:**
- Check Network Access in Atlas allows your IP (or 0.0.0.0/0)
- Verify connection string is correct
- Check internet connection

---

## ✅ Migration Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with read/write permissions
- [ ] Network access configured (0.0.0.0/0)
- [ ] Local data backed up
- [ ] Data exported from local MongoDB
- [ ] Data imported to MongoDB Atlas
- [ ] Verified all collections exist
- [ ] Verified document counts match
- [ ] Tested backend connection to Atlas
- [ ] Tested login with Atlas data

---

## 💡 Pro Tips

1. **Use MongoDB Compass** for visual verification
2. **Export to JSON** for easy inspection
3. **Test with one collection** first
4. **Keep local backup** until everything works
5. **Document your Atlas credentials** securely

---

Once migration is complete, your backend can connect to MongoDB Atlas from anywhere (Render, Railway, or any cloud service)! 🎉

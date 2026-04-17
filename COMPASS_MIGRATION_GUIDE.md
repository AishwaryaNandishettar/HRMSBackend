# 📦 MongoDB Compass Migration Guide

## Step-by-Step: Export and Import Using MongoDB Compass

---

## Part 1: Export from Local MongoDB (10 minutes)

### Step 1: Connect to Local MongoDB

1. Open **MongoDB Compass**
2. In the connection string field, enter:
   ```
   mongodb://localhost:27017
   ```
3. Click **"Connect"**
4. You should see your databases

### Step 2: Select Your Database

1. Click on database: **`Data_base_hrms`**
2. You'll see all your collections:
   - admins
   - application_links
   - attendance
   - chat_groups
   - chat_messages
   - departments
   - designations
   - email_queue
   - employees
   - financial
   - group_messages
   - insurance_claims
   - jobs
   - (and more...)

### Step 3: Export Each Collection

**For EACH collection, do this:**

1. Click on the collection name (e.g., **employees**)
2. Click **"Export Collection"** button (top toolbar, looks like an arrow pointing out)
3. In the export dialog:
   - **Export Full Collection:** Select this option
   - **Select Export File Type:** Choose **JSON**
   - **Output:** Click "Select..." and choose a folder (e.g., `E:\mongodb_export\`)
   - **File name:** Keep the default (e.g., `employees.json`)
4. Click **"Export"**
5. Wait for "Export completed successfully"
6. Click **"Done"**

**Repeat for ALL collections!**

### Collections to Export:

- [ ] admins
- [ ] application_links
- [ ] attendance
- [ ] chat_groups
- [ ] chat_messages
- [ ] departments
- [ ] designations
- [ ] email_queue
- [ ] employees
- [ ] financial
- [ ] group_messages
- [ ] insurance_claims
- [ ] jobs
- [ ] (any other collections you see)

**Tip:** Create a folder `E:\mongodb_export\` to keep all exports organized.

---

## Part 2: Import to MongoDB Atlas (10 minutes)

### Step 4: Connect to MongoDB Atlas

1. In MongoDB Compass, click **"New Connection"** (top left)
2. Paste this connection string:
   ```
   mongodb+srv://hrmsadmin:im75Jf9jb1ntQev2@cluster0.aexpf8t.mongodb.net/Data_base_hrms
   ```
3. Click **"Connect"**
4. You should see your Atlas cluster!

### Step 5: Create Database (if needed)

1. If you don't see `Data_base_hrms` database:
   - Click **"Create Database"** (bottom left)
   - Database Name: `Data_base_hrms`
   - Collection Name: `employees` (we'll add more later)
   - Click **"Create Database"**

### Step 6: Import Each Collection

**For EACH collection you exported:**

1. Click on database: **`Data_base_hrms`**
2. If the collection doesn't exist:
   - Click **"Create Collection"** (bottom of collections list)
   - Collection Name: (same as local, e.g., `employees`)
   - Click **"Create Collection"**
3. Click on the collection name
4. Click **"Add Data"** button (top toolbar)
5. Select **"Import JSON or CSV file"**
6. In the import dialog:
   - Click **"Select File"**
   - Navigate to `E:\mongodb_export\`
   - Select the JSON file (e.g., `employees.json`)
   - Click **"Open"**
7. Click **"Import"**
8. Wait for "Import completed successfully"
9. You should see the data in the collection!

**Repeat for ALL collections!**

### Collections to Import:

- [ ] admins
- [ ] application_links
- [ ] attendance
- [ ] chat_groups
- [ ] chat_messages
- [ ] departments
- [ ] designations
- [ ] email_queue
- [ ] employees
- [ ] financial
- [ ] group_messages
- [ ] insurance_claims
- [ ] jobs
- [ ] (all other collections)

---

## Part 3: Verify Migration (2 minutes)

### Step 7: Check Data

1. In MongoDB Compass (connected to Atlas)
2. Click on database: **`Data_base_hrms`**
3. For each collection:
   - Click on the collection
   - Check the document count (should match local)
   - Browse a few documents to verify data looks correct

**Expected counts (from your local DB):**
- employees: ~42 documents
- attendance: ~20 documents
- departments: ~4 documents
- designations: ~4 documents
- etc.

---

## ✅ Migration Complete!

Once all collections are imported and verified, you're done!

**Next steps:**
1. Open `YOUR_EXACT_COMMANDS.txt`
2. Go to **Step 3: Push to GitHub**
3. Continue with backend deployment

---

## 🆘 Troubleshooting

### Can't Connect to Local MongoDB

**Error:** "Connection refused" or "Connection timeout"

**Solution:**
- Make sure MongoDB service is running
- Check if MongoDB is running on port 27017
- Try: `mongodb://127.0.0.1:27017` instead

### Can't Connect to Atlas

**Error:** "Authentication failed"

**Solution:**
- Double-check the connection string
- Make sure password is correct: `im75Jf9jb1ntQev2`
- Check Network Access in Atlas allows 0.0.0.0/0

### Export/Import Fails

**Error:** "Export failed" or "Import failed"

**Solution:**
- Make sure you have write permissions to the export folder
- Check if the JSON file is valid
- Try exporting/importing a smaller collection first to test

### Collection Already Exists

**When importing:**
- If collection exists, Compass will ADD documents to it
- If you want to replace, delete the collection first
- Then create it again and import

---

## 💡 Pro Tips

1. **Export all collections first** before starting imports
2. **Keep exports organized** in one folder
3. **Verify counts** after each import
4. **Take your time** - it's better to be thorough than fast
5. **Keep Compass open** to both connections for easy switching

---

## 📊 Progress Tracker

**Export Progress:**
- [ ] Connected to local MongoDB
- [ ] Exported all collections
- [ ] All files saved in export folder

**Import Progress:**
- [ ] Connected to MongoDB Atlas
- [ ] Created database (if needed)
- [ ] Imported all collections
- [ ] Verified data in Atlas

**Total Time:** ~20 minutes

---

**Start with Part 1 and work your way through!** 💪

#!/bin/bash

# ========================================
# MongoDB Migration Script
# This script migrates your local MongoDB data to Atlas
# ========================================

echo "🚀 Starting MongoDB Migration to Atlas..."
echo ""

# ========================================
# CONFIGURATION - FILL IN YOUR PASSWORD!
# ========================================

# Your MongoDB Atlas connection details
ATLAS_USERNAME="hrmsadmin"
ATLAS_PASSWORD="im75Jf9jb1ntQev2"  # ⚠️ REPLACE THIS WITH YOUR ACTUAL PASSWORD!
ATLAS_CLUSTER="cluster0.aexpf8t.mongodb.net"
DATABASE_NAME="Data_base_hrms"

# Build the connection string
ATLAS_URI="mongodb+srv://${ATLAS_USERNAME}:${ATLAS_PASSWORD}@${ATLAS_CLUSTER}/${DATABASE_NAME}?retryWrites=true&w=majority"

# Local MongoDB settings
LOCAL_URI="mongodb://localhost:27017"

# ========================================
# STEP 1: Check if mongodump is installed
# ========================================

echo "📋 Step 1: Checking if MongoDB tools are installed..."

if ! command -v mongodump &> /dev/null; then
    echo "❌ mongodump is not installed!"
    echo ""
    echo "Please install MongoDB Database Tools:"
    echo "  Windows: https://www.mongodb.com/try/download/database-tools"
    echo "  Mac: brew install mongodb-database-tools"
    echo "  Linux: sudo apt-get install mongodb-database-tools"
    echo ""
    exit 1
fi

echo "✅ MongoDB tools are installed"
echo ""

# ========================================
# STEP 2: Export from local MongoDB
# ========================================

echo "📦 Step 2: Exporting data from local MongoDB..."
echo "   Database: ${DATABASE_NAME}"
echo "   Location: ./mongodb_backup"
echo ""

# Create backup directory
mkdir -p mongodb_backup

# Export the database
mongodump --uri="${LOCAL_URI}" --db="${DATABASE_NAME}" --out=./mongodb_backup

if [ $? -eq 0 ]; then
    echo "✅ Export successful!"
    echo ""
else
    echo "❌ Export failed! Make sure your local MongoDB is running."
    exit 1
fi

# ========================================
# STEP 3: Show what was exported
# ========================================

echo "📊 Exported collections:"
ls -la "./mongodb_backup/${DATABASE_NAME}"
echo ""

# ========================================
# STEP 4: Import to MongoDB Atlas
# ========================================

echo "☁️  Step 3: Importing data to MongoDB Atlas..."
echo "   Cluster: ${ATLAS_CLUSTER}"
echo "   Database: ${DATABASE_NAME}"
echo ""

# Check if password was set
if [ "$ATLAS_PASSWORD" = "YOUR_PASSWORD_HERE" ]; then
    echo "❌ ERROR: You need to set your MongoDB Atlas password!"
    echo ""
    echo "Edit this file (migrate-to-atlas.sh) and replace:"
    echo "   ATLAS_PASSWORD=\"YOUR_PASSWORD_HERE\""
    echo "with:"
    echo "   ATLAS_PASSWORD=\"your_actual_password\""
    echo ""
    exit 1
fi

# Import to Atlas
mongorestore --uri="${ATLAS_URI}" "./mongodb_backup/${DATABASE_NAME}"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Import successful!"
    echo ""
else
    echo ""
    echo "❌ Import failed!"
    echo ""
    echo "Possible issues:"
    echo "  1. Wrong password"
    echo "  2. Network access not configured (need to allow 0.0.0.0/0)"
    echo "  3. Database user doesn't have write permissions"
    echo ""
    exit 1
fi

# ========================================
# STEP 5: Summary
# ========================================

echo "=========================================="
echo "✅ MIGRATION COMPLETE!"
echo "=========================================="
echo ""
echo "Your data has been migrated to MongoDB Atlas!"
echo ""
echo "Connection String (save this!):"
echo "${ATLAS_URI}"
echo ""
echo "Next steps:"
echo "  1. Test connection in MongoDB Compass"
echo "  2. Deploy backend to Render"
echo "  3. Use this connection string as MONGODB_URI environment variable"
echo ""
echo "=========================================="
